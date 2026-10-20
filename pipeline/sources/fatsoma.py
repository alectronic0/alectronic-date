"""Fatsoma: every active UK event, kept when the venue is in London (activities bucket).

The JSON:API has no working location filter, so every active event is walked and venues come
from the `included` locations (with coordinates and postcode). Deep pages 500 past ~10k
results, so the walk restarts from the last start time seen once a window hits that cap.
"""

import datetime
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

from sources import activity, common

VERIFIES_URLS = False
NAME = "fatsoma"
API = ("https://api.fatsoma.com/v1/events?filter%5Bstatus%5D=active&filter%5Bhealth%5D=null,active,postponed"
       "&include=location,categories&page%5Bsize%5D=52&sort=starts-at&page%5Bnumber%5D={page}")
SINCE = "&filter%5Bstarts-at%5D%5Bgte%5D={since}"
MAX_PAGE = 190
WORKERS = 3


def related_id(event, name):
    data = (event.get("relationships", {}).get(name) or {}).get("data")
    if isinstance(data, list):
        return [d["id"] for d in data]
    return data["id"] if data else None


def page_records(payload, today):
    included = {(i["type"], i["id"]): i["attributes"] for i in payload.get("included", [])}
    records = []
    for event in payload.get("data", []):
        attrs = event["attributes"]
        location = included.get(("locations", related_id(event, "location") or ""), {})
        lat, lng = location.get("latitude"), location.get("longitude")
        if lat is None or not activity.in_london(lat, lng):
            continue
        end = activity.iso(attrs.get("ends-at"))
        if attrs.get("expired") or (end and end < today):
            continue
        categories = [included.get(("categories", c), {}).get("name", "") for c in related_id(event, "categories") or []]
        low, high = attrs.get("price-min") or 0, attrs.get("price-max") or 0
        price = "Free" if not high else (f"{common.pounds(low / 100)} - {common.pounds(high / 100)}" if low != high else common.pounds(high / 100))
        postcode = location.get("postal-code") or ""
        records.append(activity.record(
            NAME, "fs", event["id"], attrs.get("name"),
            f"https://www.fatsoma.com/e/{attrs['vanity-name']}/{attrs.get('seo-name') or ''}".rstrip("/"),
            category=activity.categorise(attrs.get("name"), " ".join(categories), default="Bars & Nightlife"),
            description=attrs.get("description"),
            tags=[c for c in categories if c] or None,
            venue_name=location.get("name", ""),
            address=location.get("address", ""),
            postcode=postcode,
            area=location.get("city") or "London",
            price_raw=price,
            is_free=not high,
            image_url=attrs.get("asset-url") or "",
            lat=lat, lng=lng, precision="exact",
            start_date=activity.iso(attrs.get("starts-at")),
            end_date=end,
        ))
    return records


def window(since):
    url = API + (SINCE.format(since=urllib.parse.quote(since)) if since else "")
    first = common.get_json(url.format(page=1))
    total = first["meta"]["total-pages"]
    last = min(total, MAX_PAGE)
    with ThreadPoolExecutor(WORKERS) as pool:
        rest = list(pool.map(lambda n: common.get_json(url.format(page=n)), range(2, last + 1)))
    return [first, *rest], last < total


def payloads():
    since = None
    while True:
        batch, more = window(since)
        yield from batch
        if not more:
            return
        cursor = batch[-1]["data"][-1]["attributes"]["starts-at"]
        if cursor == since:
            raise RuntimeError(f"fatsoma: over {MAX_PAGE} pages start at {since}")
        since = cursor


def fetch():
    today = datetime.date.today().isoformat()
    records = {}
    for payload in payloads():
        for record in page_records(payload, today):
            records.setdefault(record["id"], record)
    return list(records.values())


def owns(record):
    return record.get("source") == NAME
