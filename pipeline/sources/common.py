"""Shared helpers for sources: polite HTTP, HTML text, distance from home, event dates."""

import datetime
import functools
import html
import http.client
import json
import math
import re
import time
import urllib.error
import urllib.request

import gates
import io_content

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
RULES = json.loads((io_content.REPO / "pipeline" / "config" / "rules.json").read_text(encoding="utf-8"))
REQUEST_GAP_SECONDS = 0.5


class PublicOnlyRedirects(urllib.request.HTTPRedirectHandler):
    """Scraped pages choose what gets fetched next, so every hop must stay on the public web."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not gates.is_public_http(newurl):
            raise urllib.error.URLError(f"refusing redirect to non-public {newurl}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


OPENER = urllib.request.build_opener(PublicOnlyRedirects)
RETRYABLE_STATUS = {429, 500, 502, 503, 504}
MAX_BACKOFF_SECONDS = 60


def backoff_seconds(err, attempt):
    retry_after = getattr(err, "headers", None) and err.headers.get("Retry-After")
    if retry_after and retry_after.isdigit():
        return min(int(retry_after), MAX_BACKOFF_SECONDS)
    return min(5 * 2 ** attempt, MAX_BACKOFF_SECONDS)


def get_text(url, timeout=20, retries=3):
    """GET with polite pacing; backs off on rate limits, 5xx and truncated reads.
    Only public http(s) hosts are fetched, including every redirect hop."""
    if not gates.is_public_http(url):
        raise ValueError(f"refusing to fetch non-public {url}")
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "en-GB"})
    for attempt in range(retries + 1):
        try:
            with OPENER.open(request, timeout=timeout) as response:
                time.sleep(REQUEST_GAP_SECONDS)
                return response.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as err:
            if err.code not in RETRYABLE_STATUS or attempt == retries:
                raise
            time.sleep(backoff_seconds(err, attempt))
        except (OSError, http.client.HTTPException) as err:
            if attempt == retries:
                raise OSError(f"{url}: {err}") from err
            time.sleep(backoff_seconds(err, attempt))


def get_json(url, **kwargs):
    return json.loads(get_text(url, **kwargs))


def post_json(url, payload, timeout=30):
    if not gates.is_public_http(url):
        raise ValueError(f"refusing to fetch non-public {url}")
    request = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), method="POST",
                                     headers={"User-Agent": USER_AGENT, "Content-Type": "application/json"})
    with OPENER.open(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def text(fragment):
    """Strip tags and collapse whitespace. Output never contains < > " or `: labs pages
    interpolate it raw into markup and double-quoted attributes (see gates.unsafe_hits).
    Em/en dashes become " - " (the site's no-em-dash copy rule)."""
    visible = re.sub(r"<(script|style)\b.*?</\1>", " ", fragment or "", flags=re.S | re.I)
    plain = html.unescape(re.sub(r"<[^>]+>", " ", visible))
    safe = plain.replace("<", "").replace(">", "").replace('"', "'").replace("`", "'")
    safe = safe.replace("\u2014", " - ").replace("\u2013", " - ")
    return re.sub(r"\s+", " ", safe).strip()


def slug(value):
    return re.sub(r"[^a-z0-9]+", "-", (value or "").lower()).strip("-")


@functools.lru_cache(maxsize=1)
def home():
    point = io_content.LabsContent().data["dateIdeas"]["transit"]["home"]
    return point["lat"], point["lng"]


def miles_between(a, b):
    lat1, lng1, lat2, lng2 = map(math.radians, (*a, *b))
    h = math.sin((lat2 - lat1) / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin((lng2 - lng1) / 2) ** 2
    return 3958.8 * 2 * math.asin(math.sqrt(h))


def within_range(lat, lng):
    return miles_between(home(), (lat, lng)) <= RULES["maxMilesFromHome"]


def next_occurrence(month_day, today=None):
    """'October 24' has no year on most listings: take the next one, allowing a week of lag."""
    today = today or datetime.date.today()
    for year in (today.year, today.year + 1):
        day = datetime.datetime.strptime(f"{month_day} {year}", "%B %d %Y").date()
        if day >= today - datetime.timedelta(days=7):
            return day
    return day


def event_dates(day, time_label=""):
    weekday = day.strftime("%A")
    timing = f"{weekday}, {day.day} {day.strftime('%B %Y')}"
    return {
        "season": day.strftime("%B %Y"),
        "timing": f"{timing} ({time_label})" if time_label else timing,
        "endDate": day.isoformat(),
        "dateBadge": day.strftime("%b %d %Y").upper(),
    }


def map_url(lat, lng):
    return f"https://maps.google.com/?q={lat},{lng}"


def meteorological_season(day):
    """Matches nerd-gatherings.html groups: "Autumn '26", "Winter '26 / '27"."""
    yy = day.strftime("%y")
    if day.month in (12, 1, 2):
        start = day.year if day.month == 12 else day.year - 1
        return f"Winter '{start % 100:02d} / '{(start + 1) % 100:02d}"
    name = {3: "Spring", 4: "Spring", 5: "Spring", 6: "Summer", 7: "Summer", 8: "Summer"}.get(day.month, "Autumn")
    return f"{name} '{yy}"


UK_POSTCODE = re.compile(r"\b([A-Z]{1,2}\d[A-Z\d]?) ?(\d[A-Z]{2})\b")


def find_postcode(text_value):
    match = UK_POSTCODE.search(text_value or "")
    return f"{match.group(1)} {match.group(2)}" if match else ""


def geocode_postcodes(postcodes):
    """{postcode: (lat, lng)} via Postcodes.io bulk lookup (100 per request)."""
    wanted = sorted({p.strip().upper() for p in postcodes if p})
    found = {}
    for start in range(0, len(wanted), 100):
        response = post_json("https://api.postcodes.io/postcodes", {"postcodes": wanted[start:start + 100]})
        for row in response.get("result") or []:
            if row.get("result"):
                found[row["query"].upper()] = (row["result"]["latitude"], row["result"]["longitude"])
    return found


def pounds(amount):
    return f"£{amount:.0f}" if float(amount).is_integer() else f"£{amount:.2f}"
