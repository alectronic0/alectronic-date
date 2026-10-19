"""Eventbrite London: every listing on the /all-events/ search pages (activities bucket).

Reuses the __SERVER_DATA__ parser from sources/eventbrite.py (the nerd-bucket feed).
"""

from concurrent.futures import ThreadPoolExecutor

from sources import activity, common, eventbrite

VERIFIES_URLS = False
NAME = "eventbrite"
SEARCH = "https://www.eventbrite.co.uk/d/united-kingdom--london/all-events/?page={page}"
MAX_PAGES = 49  # Eventbrite stops paginating here
WORKERS = 3


def to_record(event):
    venue = event.get("primary_venue") or {}
    address = venue.get("address") or {}
    lat, lng = address.get("latitude"), address.get("longitude")
    if event.get("is_online_event") or event.get("is_cancelled") or lat is None:
        return None
    lat, lng = float(lat), float(lng)
    if not activity.in_london(lat, lng):
        return None
    tags = [t.get("display_name", "") for t in event.get("tags", []) if t.get("prefix") in ("EventbriteCategory", "EventbriteFormat")]
    postcode = address.get("postal_code") or common.find_postcode(address.get("localized_address_display", ""))
    return activity.record(
        NAME, "eb", event["id"], event.get("name"), event["url"].split("?")[0],
        category=activity.categorise(event.get("name"), " ".join(tags)),
        description=event.get("summary"),
        tags=tags or None,
        venue_name=venue.get("name", ""),
        address=address.get("localized_address_display", ""),
        postcode=postcode,
        area=address.get("city") or "London",
        price_raw=eventbrite.price(event) or "",
        is_free=eventbrite.price(event) == "Free",
        image_url=(event.get("image") or {}).get("url", ""),
        lat=lat, lng=lng, precision="exact",
        start_date=event.get("start_date"),
        end_date=event.get("end_date") or event.get("start_date"),
    )


def fetch():
    with ThreadPoolExecutor(WORKERS) as pool:
        pages = pool.map(lambda n: eventbrite.server_events(common.get_text(SEARCH.format(page=n))), range(1, MAX_PAGES + 1))
    seen, records = set(), []
    for events in pages:
        for event in events:
            if event["id"] in seen:
                continue
            seen.add(event["id"])
            record = to_record(event)
            if record:
                records.append(record)
    return records


def owns(record):
    return record.get("source") == NAME
