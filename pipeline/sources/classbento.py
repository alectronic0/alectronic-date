"""ClassBento classes in London + Herts (classes bucket -> workshops_geo).

The class sitemaps tag every class with a city, so only catchment cities are fetched.
Each page carries EducationEvent JSON-LD (price, rating, duration, area geo, sessions)
plus schema.org microdata with the venue postcode, which Postcodes.io turns into a pin.
"""

import datetime
import itertools
import json
import re
from concurrent.futures import ThreadPoolExecutor

import io_content
from sources import common

VERIFIES_URLS = True
NAME = "classbento"
CONFIG = json.loads((io_content.REPO / "pipeline" / "config" / "classes.json").read_text(encoding="utf-8"))
SITEMAP_INDEX = "https://classbento.co.uk/sitemap.xml"
URL_BLOCK = re.compile(r"<url>(.*?)</url>", re.S)
LOC = re.compile(r"<loc>([^<]+)</loc>")
CITY = re.compile(r"<image:geo_location>([^<]*)</image:geo_location>")
JSON_LD = re.compile(r"""<script type=["']application/ld\+json["'][^>]*>(.*?)</script>""", re.S)
MICRODATA = re.compile(r'itemprop="(streetAddress|addressLocality|postalCode)" content="([^"]*)"')
VENUE = re.compile(r'<br class="visible-xs">\s*<p style="font-weight:700">\s*([^<]+?)\s*</p>')
CATEGORY = re.compile(r'item_category: "([^"]*)"')
BRAND = re.compile(r'item_brand: "([^"]*)"')
DURATION = re.compile(r"PT(?:(\d+)H)?(?:(\d+)M)?")
DESCRIPTION_LIMIT = 700
TIMES_LIMIT = 20
TIMES_HORIZON_DAYS = 60
WORKERS = 3  # 6 triggered HTTP 429 on ~20% of pages
MAX_FAILURE_SHARE = 0.1
PROGRESS_EVERY = 250


def class_urls():
    cities = set(CONFIG["classbentoCities"])
    maps = [u for u in LOC.findall(common.get_text(SITEMAP_INDEX)) if "sitemap-classes-" in u]
    urls = []
    for sitemap in maps:
        for block in URL_BLOCK.findall(common.get_text(sitemap)):
            city = CITY.search(block)
            if city and city.group(1).removesuffix(", UK") in cities:
                urls.append(LOC.search(block).group(1))
    return urls


def json_ld(page):
    events, sessions = None, []
    for raw in JSON_LD.findall(page):
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            sessions += [d for d in data if d.get("@type") == "EducationEvent"]
        elif data.get("@type") == "EducationEvent" and events is None:
            events = data
    return events, sessions


def duration_label(iso):
    match = DURATION.fullmatch(iso or "")
    if not match or not any(match.groups()):
        return ""
    hours, minutes = int(match.group(1) or 0), int(match.group(2) or 0)
    parts = []
    if hours:
        parts.append(f"{hours} hour{'s' if hours != 1 else ''}")
    if minutes:
        parts.append(f"{minutes} min")
    return " ".join(parts)


def time_label(start, end):
    def clock(moment):
        return moment.strftime("%-I:%M%p").lower().replace(":00", "")
    return f"{start.strftime('%a %-d %b')}, {clock(start)}-{clock(end)}"


def session_times(sessions, today):
    horizon = today + datetime.timedelta(days=TIMES_HORIZON_DAYS)
    labels = []
    for session in sessions:
        try:
            start = datetime.datetime.fromisoformat(session["startDate"])
            end = datetime.datetime.fromisoformat(session["endDate"])
        except (KeyError, ValueError):
            continue
        if today <= start.date() <= horizon:
            labels.append(time_label(start, end))
    return list(dict.fromkeys(labels))[:TIMES_LIMIT]


def rating_label(event):
    rating = event.get("aggregateRating") or {}
    if not rating.get("ratingValue"):
        return ""
    return f"{float(rating['ratingValue']):.1f} ({rating.get('reviewCount', 0)})"


def parse(url, today):
    page = common.get_text(url)
    event, sessions = json_ld(page)
    category = CATEGORY.search(page)
    if not event or (category and "In-person" not in category.group(1)):
        return None
    mpn = re.match(r"\d+", event.get("mpn") or "")
    if not mpn:
        return None
    place = event.get("location") or {}
    geo = place.get("geo") or {}
    micro = dict(MICRODATA.findall(page))
    venue = VENUE.search(page)
    brand = BRAND.search(page)
    offers = event.get("offers") or {}
    if isinstance(offers, list):
        offers = offers[0] if offers else {}
    times = session_times(sessions, today)
    # A postcode is only the real venue when the page shows a venue block; travelling
    # teachers list a placeholder (often central London), so those stay approximate.
    postcode = micro.get("postalCode", "").strip().upper() if venue else ""
    return {
        "id": mpn.group(0),
        "title": common.text(event.get("name")),
        "company_teacher": common.text(brand.group(1)) if brand else "",
        "price": round(float(offers.get("price") or 0)),
        "url": url,
        "rating": rating_label(event),
        "activity_patterns": "Runs regularly" if times else "Private booking / on request",
        "location": common.text(micro.get("addressLocality") or place.get("name")),
        "description": common.text(event.get("description"))[:DESCRIPTION_LIMIT],
        "duration": duration_label(event.get("duration")),
        "exact_location": common.text(venue.group(1)) if venue else common.text(place.get("address")),
        "lat": geo.get("latitude"),
        "lng": geo.get("longitude"),
        "source": "ClassBento",
        "postcode": postcode,
        **({"times": times} if times else {}),
    }


def pin(records):
    """Upgrade area-level coordinates to postcode pins via Postcodes.io bulk lookup."""
    found = common.geocode_postcodes(r["postcode"] for r in records)
    for record in records:
        postcode = record.pop("postcode")
        if postcode in found:
            record["lat"], record["lng"] = found[postcode]
            record.update(exact_coords=True, location_precision="postcode")
        elif record["lat"] is not None:
            record.update(exact_coords=False, location_precision="neighborhood")
        else:
            # workshops.js still needs numbers; mobile records are never pinned on the map.
            record.update(lat=0.0, lng=0.0, exact_coords=False, location_precision="mobile")
    return records


def owns(record):
    return record.get("source") == "ClassBento"


def safe_parse(url, today, failures, counter, total):
    done = next(counter)
    if done % PROGRESS_EVERY == 0:
        print(f"classbento {done}/{total} pages", flush=True)
    try:
        return parse(url, today)
    except Exception as err:  # one odd page must not sink thousands of good ones
        failures.append(f"{url}: {err}")
        return None


def fetch():
    today = datetime.date.today()
    urls, failures, counter = class_urls(), [], itertools.count(1)
    with ThreadPoolExecutor(WORKERS) as pool:
        parsed = list(pool.map(lambda u: safe_parse(u, today, failures, counter, len(urls)), urls))
    if len(failures) > MAX_FAILURE_SHARE * len(urls):
        raise RuntimeError(f"{len(failures)}/{len(urls)} class pages failed, e.g. {failures[:3]}")
    for failure in failures[:20]:
        print(f"classbento skipped {failure}")
    return pin([r for r in parsed if r])
