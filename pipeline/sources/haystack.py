"""Haystack Dating (haystack-dating.com): London events, ticketed on Fatsoma.

The London page links each event page, which embeds its fatsoma.com/e/<vanity> link. The Fatsoma
API then gives venue coordinates and per-ticket-type `amount-available` (spaces left, not sold).
"""

import re

from sources import activity, common, singles_common

NAME = "haystack"
HOST_ID = "haystack"
LISTING = "https://www.haystack-dating.com/london/"
EVENT_LINK = re.compile(r"https://www\.haystack-dating\.com/event/[a-z0-9-]+/")
VANITY = re.compile(r"fatsoma\.com/e/([a-z0-9]+)/")
API = "https://api.fatsoma.com/v1/events?filter%5Bvanity-name%5D={vanity}&include=location,ticket-options"


def spaces_left(included):
    options = [i["attributes"] for i in included if i["type"] == "ticket-options"]
    sellable = [o for o in options if o.get("visible") and not o.get("addon") and not o.get("rep-only")]
    on_sale = [o for o in sellable if o.get("on-sale-status") == "available"]
    if sellable and not on_sale:
        return 0
    return sum(o.get("amount-available") or 0 for o in on_sale) if on_sale else None


def to_record(payload, url):
    event = payload["data"][0]
    attrs = event["attributes"]
    included = payload.get("included", [])
    location = next((i["attributes"] for i in included if i["type"] == "locations"), {})
    lat, lng = location.get("latitude"), location.get("longitude")
    if lat is None or not activity.in_london(lat, lng):
        return None
    start_date, start_time = singles_common.local_start(attrs["starts-at"])
    spots = spaces_left(included)
    low = attrs.get("price-min-with-fees") or attrs.get("price-min")
    return singles_common.record(
        NAME, HOST_ID, "Haystack Dating", event["id"], attrs["name"], url, start_date,
        start_time=start_time, end_date=activity.iso(attrs.get("ends-at")),
        venue=location.get("name", ""), location=location.get("address", ""),
        lat=lat, lng=lng,
        price=f"From {common.pounds(low / 100)}" if low else None,
        ticket_status=singles_common.status_from_spots(spots), spots_left=spots,
        description=attrs.get("description"),
    )


def fetch():
    records = []
    for url in sorted(set(EVENT_LINK.findall(common.get_text(LISTING)))):
        vanity = VANITY.search(common.get_text(url))
        if not vanity:
            continue
        record = to_record(common.get_json(API.format(vanity=vanity.group(1))), url)
        if record:
            records.append(record)
    return records


def owns(record):
    return record.get("source") == NAME
