"""Thursday (thursday.com): London singles nights from the public experiences API.

The list endpoint is filtered by city; the detail endpoint adds venue, coordinates and price.
Thursday publishes `capacity` and `bookingsSold`, so these are the guide's real attendee counts.
"""

import datetime

from sources import common, singles_common

NAME = "thursday"
HOST_ID = "thursday"
LOGO = "../img/logos/thursday.jpg"  # not a spotlight host, so the logo rides on each record
API = "https://api.thursday.com"
PAGE = 200


def london_id():
    cities = common.get_json(f"{API}/thursday-cities/list")["data"]
    return next(c["id"] for c in cities if c["slug"] == "london")


def upcoming(city_id, today):
    rows, offset = [], 0
    while True:
        page = common.get_json(f"{API}/experiences?thursdayCityId={city_id}&limit={PAGE}&offset={offset}")
        rows += page["data"]
        offset += PAGE
        if offset >= page["total"]:
            break
    return [r for r in rows if r.get("status") == "published" and r["startDateTime"][:10] >= today]


def to_record(detail):
    start_date, start_time = singles_common.local_start(detail["startDateTime"])
    end_date = singles_common.local_start(detail["endDateTime"])[0] if detail.get("endDateTime") else start_date
    secret = detail.get("isVenueSecret")
    lat = None if secret else detail.get("venueLatitude")
    lng = None if secret else detail.get("venueLongitude")
    capacity, sold = detail.get("capacity"), detail.get("bookingsSold")
    spots = detail.get("spotsLeft")
    status = "sold_out" if detail.get("lifecycleStatus") == "sold_out" else singles_common.status_from_spots(spots, capacity)
    price = detail.get("fromPriceAllIn")
    built = singles_common.record(
        NAME, HOST_ID, "Thursday", detail["id"], detail["title"],
        f"https://www.thursday.com/events/london/{detail['slug']}", start_date,
        start_time=start_time, end_date=end_date,
        venue="Secret venue" if secret else detail.get("venueName", ""),
        location="" if secret else detail.get("venueAddress", ""),
        lat=lat, lng=lng,
        price=f"From {common.pounds(price)}" if price else None,
        ticket_status=status, attending=sold, capacity=capacity, spots_left=spots,
        description=detail.get("description"),
    )
    built["hostLogo"] = LOGO
    return built


def fetch():
    today = datetime.date.today().isoformat()
    records = []
    for row in upcoming(london_id(), today):
        detail = common.get_json(f"{API}/experiences/by-slug/{row['slug']}")
        records.append(to_record(detail.get("data", detail)))
    return records


def owns(record):
    return record.get("source") == NAME
