"""Time Out London (activities bucket).

The London sitemap index lists ~150 child sitemaps, newest first, mostly news. Only
recently modified URLs in listing sections are fetched. Venue/event pages carry a
schema.org Review whose itemReviewed has geo/address/dates/price; "best of" lists are
Articles and become city-wide Curated Guides.
"""

import datetime
import json
import re
from concurrent.futures import ThreadPoolExecutor

from sources import activity, common

VERIFIES_URLS = True
NAME = "timeout"
INDEX = "https://www.timeout.com/london/sitemap.xml.gz"
SECTIONS = {
    "things-to-do": "Things To Do", "theatre": "Theatre & Shows", "comedy": "Comedy", "dance": "Theatre & Shows",
    "music": "Music & Gigs", "nightlife": "Bars & Nightlife", "bars-and-pubs": "Bars & Nightlife",
    "bars-pubs": "Bars & Nightlife", "restaurants": "Food & Drink", "food-drink": "Food & Drink",
    "art": "Art & Exhibitions", "museums": "Art & Exhibitions", "film": "Event / Experience",
    "attractions": "Attractions & Sightseeing",
}
LOOKBACK_DAYS = 365
MAX_SITEMAPS = 40
WORKERS = 3
URL_BLOCK = re.compile(r"<url>(.*?)</url>", re.S)
LOC = re.compile(r"<loc>([^<]+)</loc>")
LASTMOD = re.compile(r"<lastmod>([^<]+)</lastmod>")
JSON_LD = re.compile(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', re.S)


def section(url):
    parts = url.split("/")
    return parts[4] if len(parts) > 5 else ""


def recent_urls(since):
    sitemaps = LOC.findall(common.get_text(INDEX))[:MAX_SITEMAPS]
    urls = []
    for sitemap in sitemaps:
        fresh = 0
        for block in URL_BLOCK.findall(common.get_text(sitemap)):
            lastmod = LASTMOD.search(block)
            if not lastmod or lastmod.group(1)[:10] < since:
                continue
            fresh += 1
            url = LOC.search(block).group(1)
            if section(url) in SECTIONS:
                urls.append(url)
        if not fresh:
            break
    return list(dict.fromkeys(urls))


def structured(page):
    for raw in JSON_LD.findall(page):
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get("@type") in ("Review", "Article"):
            return data
    return None


def clean_title(name):
    return common.text(name).split(" | ")[0]


def to_record(url):
    data = structured(common.get_text(url))
    if not data:
        return None
    keywords = [k for k in data.get("keywords") or [] if isinstance(k, str)]
    default = SECTIONS[section(url)]
    slug = f"{section(url)}_{url.rstrip('/').rsplit('/', 1)[-1]}"
    if data["@type"] == "Article":
        return activity.record(NAME, "to", slug, data.get("headline"), url, category="Curated Guide",
                               description=data.get("description"), tags=keywords or None,
                               image_url=data.get("image") if isinstance(data.get("image"), str) else "")
    item = data.get("itemReviewed") or {}
    place = item.get("location") if isinstance(item.get("location"), dict) else item
    address = place.get("address") if isinstance(place.get("address"), dict) else {}
    geo = place.get("geo") or item.get("geo") or {}
    offers = item.get("offers") if isinstance(item.get("offers"), dict) else {}
    name = clean_title(item.get("name") or data.get("headline"))
    postcode = address.get("postalCode", "")
    return activity.record(
        NAME, "to", slug, name, url,
        category=activity.categorise(" ".join(keywords), default=default) if default in ("Things To Do", "Event / Experience") else default,
        description=data.get("reviewBody") or data.get("description"),
        tags=keywords or None,
        venue_name=clean_title(place.get("name", "")) if place is not item else "",
        address=", ".join(v for v in (address.get("streetAddress"), address.get("addressLocality")) if v),
        postcode=postcode,
        area=postcode.split(" ")[0] if postcode else "London",
        price_raw=offers.get("price") or item.get("priceRange") or "",
        is_free="More: Free" in keywords,
        image_url=item.get("image") if isinstance(item.get("image"), str) else "",
        lat=geo.get("latitude"), lng=geo.get("longitude"),
        precision="exact",
        start_date=activity.iso(item.get("startDate")),
        end_date=activity.iso(item.get("endDate")),
    ), postcode


def fetch():
    since = (datetime.date.today() - datetime.timedelta(days=LOOKBACK_DAYS)).isoformat()
    failures = []

    def safe(url):
        try:
            return to_record(url)
        except Exception as err:  # one odd page must not sink the feed
            failures.append(f"{url}: {err}")
            return None

    urls = recent_urls(since)
    with ThreadPoolExecutor(WORKERS) as pool:
        results = [r for r in pool.map(safe, urls) if r]
    if len(failures) > 0.1 * max(len(urls), 1):
        raise RuntimeError(f"{len(failures)}/{len(urls)} Time Out pages failed, e.g. {failures[:3]}")
    records, needs_pin = [], {}
    for result in results:
        record, postcode = result if isinstance(result, tuple) else (result, "")
        if record["location_precision"] == "citywide" and postcode:
            needs_pin[record["id"]] = postcode
        records.append(record)
    pins = common.geocode_postcodes(needs_pin.values())
    for record in records:
        pin = pins.get(needs_pin.get(record["id"], ""))
        if pin:
            record.update(lat=pin[0], lng=pin[1], location_precision="neighborhood")
    return records


def owns(record):
    return record.get("source") == NAME
