"""Airbnb Experiences in London (classes bucket -> workshops_geo).

Discovery: the /things-to-do category landing pages server-render their carousels as
LandingPageExperienceItem objects (id, title, description, rating). Each experience page
then gives coordinates and a "From £N per guest" price. No browser needed.

Health: Airbnb answers 200 for any id and serves its generic homepage title when an
experience is gone. Owned listings that discovery didn't see are health-checked instead
of being struck, so a live listing is never dropped just for missing a carousel.
"""

import json
import re
from concurrent.futures import ThreadPoolExecutor

from sources import common

VERIFIES_URLS = True
NAME = "airbnb"
REGIONS = ("london-united-kingdom", "greater-london-england")
LANDING = "https://www.airbnb.co.uk/{region}/things-to-do"
CATEGORY_LINK = re.compile(r'"url":"(/(?:london-united-kingdom|greater-london-england)/things-to-do/[a-z-]+)"')
ITEM_MARKER = '"__typename":"LandingPageExperienceItem"'
TITLE = re.compile(r"<title>([^<]*)</title>")
COORDS = re.compile(r'"lat(?:itude)?":\s*(-?[0-9.]+)[^}]{0,200}?"(?:lng|longitude)":\s*(-?[0-9.]+)')
PRICE = re.compile(r"From £([0-9][0-9,.]*) per guest")
GONE_TITLE = "Airbnb: Holiday Rentals"
WORKERS = 3
_discovered = set()


def landing_items(page):
    items, start = [], 0
    while (index := page.find(ITEM_MARKER, start)) != -1:
        start = index + len(ITEM_MARKER)
        try:
            item, _ = json.JSONDecoder().raw_decode(page, page.rfind("{", 0, index))
        except json.JSONDecodeError:
            continue
        items.append(item)
    return items


def discover():
    pages = []
    for region in REGIONS:
        landing = common.get_text(LANDING.format(region=region))
        pages.append(landing)
        for path in sorted(set(CATEGORY_LINK.findall(landing))):
            pages.append(common.get_text(f"https://www.airbnb.co.uk{path}"))
    found = {}
    for page in pages:
        for item in landing_items(page):
            found.setdefault(item["id"], item)
    return found


def to_record(item):
    url = f"https://www.airbnb.co.uk/experiences/{item['id']}"
    page = common.get_text(url)
    title = TITLE.search(page)
    if title and title.group(1).startswith(GONE_TITLE):
        return None
    coords = COORDS.search(page)
    price = PRICE.search(page)
    lat, lng = (float(coords.group(1)), float(coords.group(2))) if coords else (None, None)
    pinned = lat is not None and common.within_range(lat, lng)
    rating = item.get("displayRating")
    return {
        "id": str(item["id"]),
        "title": common.text(item.get("title")),
        "company_teacher": "",
        "price": round(float(price.group(1).replace(",", ""))) if price else 0,
        "url": url,
        "rating": f"{rating:.1f} ({item.get('reviewCount', 0)})" if rating else "",
        "activity_patterns": "",
        "location": "Greater London",
        "description": common.text(item.get("descriptionText"))[:700],
        "duration": "",
        "exact_location": "",
        "lat": lat if pinned else 0.0,
        "lng": lng if pinned else 0.0,
        "source": "Airbnb",
        "exact_coords": pinned,
        "location_precision": "postcode" if pinned else "mobile",
    }


def fetch():
    items = discover()
    with ThreadPoolExecutor(WORKERS) as pool:
        records = [r for r in pool.map(to_record, items.values()) if r]
    _discovered.clear()
    _discovered.update(r["id"] for r in records)
    return records


def owns(record):
    return record.get("source") == "Airbnb"


def status(url):
    try:
        title = TITLE.search(common.get_text(url, retries=1))
    except OSError:
        return "unknown"
    if title and title.group(1).startswith(GONE_TITLE):
        return "listing removed from Airbnb"
    return None


def health(items, bucket):
    unseen = [r for r in items if owns(r) and r.get("id") not in _discovered]
    with ThreadPoolExecutor(WORKERS) as pool:
        results = pool.map(lambda r: status(r["url"]), unseen)
    return {bucket.key(r): result for r, result in zip(unseen, results) if result != "unknown"}
