"""Fig Dating (figdating.com): supper clubs sold on Ticket Tailor.

Event pages carry date, time and venue name but no address, so coordinates come from
config/singles.json `venues`. A sold-out event's <title> starts "Sold out –" (common.text turns the dash into " - ").
"""

import datetime
import re

from sources import common, singles_common

NAME = "fig"
HOST_ID = "fig"
BOX_OFFICE = "https://www.tickettailor.com/events/fig"
EVENT_LINK = re.compile(r"/events/fig/(\d+)")
WHEN = re.compile(r"\b\w{3} (\d{1,2} \w{3} \d{4}) (\d{1,2}:\d{2} [AP]M)")


def to_record(event_id, page):
    title = common.text((re.search(r"<title>(.*?)</title>", page, re.S) or [None, ""])[1])
    when = WHEN.search(common.text(page))
    if not when:
        return None
    start = datetime.datetime.strptime(f"{when.group(1)} {when.group(2)}", "%d %b %Y %I:%M %p")
    parts = [p.strip() for p in title.split(" - ")]
    sold_out = parts[0].lower() == "sold out"
    if sold_out:
        parts = parts[1:]
    venue = parts.pop() if len(parts) > 1 else ""
    name = " - ".join(parts)
    lat, lng = singles_common.venue_coords(venue)
    return singles_common.record(
        NAME, HOST_ID, "Fig", event_id, name, f"{BOX_OFFICE}/{event_id}", start.date().isoformat(),
        start_time=start.strftime("%H:%M"), venue=venue, lat=lat, lng=lng,
        ticket_status="sold_out" if sold_out else "unknown",
    )


def fetch():
    records = []
    for event_id in sorted(set(EVENT_LINK.findall(common.get_text(BOX_OFFICE).replace("&#x2F;", "/")))):
        record = to_record(event_id, common.get_text(f"{BOX_OFFICE}/{event_id}"))
        if record:
            records.append(record)
    return records


def owns(record):
    return record.get("source") == NAME
