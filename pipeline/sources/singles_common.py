"""Shared record shape for the singles guide (labs/events.html) host feeds."""

import datetime
import json
import re
from zoneinfo import ZoneInfo

import io_content
from sources import common

CONFIG = json.loads((io_content.REPO / "pipeline" / "config" / "singles.json").read_text(encoding="utf-8"))
LONDON = ZoneInfo("Europe/London")
LIMITED_SHARE = 0.2
LIMITED_SPOTS = 10
MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December"
DAY_MONTH = re.compile(rf"\b(\d{{1,2}})(?:st|nd|rd|th)?\s+({MONTHS})(?:\s+(\d{{4}}))?", re.I)
CLOCK = re.compile(r"\b(\d{1,2})(?::(\d{2}))?\s*([ap]m)\b", re.I)
# "6:30-8:30pm": the start borrows the end's am/pm
CLOCK_RANGE = re.compile(r"\b(\d{1,2})(?::(\d{2}))?\s*[-–]\s*\d{1,2}(?::\d{2})?\s*([ap]m)\b", re.I)


def local_start(moment):
    """ISO UTC timestamp -> (YYYY-MM-DD, HH:MM) in London time."""
    when = datetime.datetime.fromisoformat(moment.replace("Z", "+00:00")).astimezone(LONDON)
    return when.date().isoformat(), when.strftime("%H:%M")


def text_date(value, today=None):
    match = DAY_MONTH.search(value or "")
    if not match:
        return None
    day, month, year = match.groups()
    if year:
        return datetime.datetime.strptime(f"{day} {month} {year}", "%d %B %Y").date()
    return common.next_occurrence(f"{month.title()} {int(day)}", today)


def text_time(value):
    matches = [m for m in (CLOCK.search(value or ""), CLOCK_RANGE.search(value or "")) if m]
    if not matches:
        return ""
    match = min(matches, key=lambda m: m.start())
    hour, minute, half = int(match.group(1)), int(match.group(2) or 0), match.group(3).lower()
    hour = hour % 12 + (12 if half == "pm" else 0)
    return f"{hour:02d}:{minute:02d}"


def venue_coords(name):
    """Hosts that publish no address: look the venue up in config/singles.json."""
    lowered = (name or "").lower()
    for venue, point in CONFIG["venues"].items():
        if venue.lower() in lowered:
            return point
    return None, None


def status_from_spots(spots_left, capacity=None):
    if spots_left is None:
        return "unknown"
    if spots_left <= 0:
        return "sold_out"
    if capacity and spots_left / capacity <= LIMITED_SHARE:
        return "limited"
    if not capacity and spots_left <= LIMITED_SPOTS:
        return "limited"
    return "plenty"


def record(source, host_id, host_name, raw_id, name, url, start_date, *, start_time="", end_date=None, venue="",
           location="", lat=None, lng=None, price=None, ticket_status="unknown", attending=None, capacity=None,
           spots_left=None, description=""):
    built = {
        "id": str(raw_id),
        "source": source,
        "hostId": host_id,
        "name": common.text(name),
        "hostName": host_name,
        "url": url,
        "startDate": start_date,
        "startTime": start_time,
        "endDate": end_date or start_date,
        "venue": common.text(venue),
        "location": common.text(location),
        "ticketStatus": ticket_status,
        "description": common.text(description)[:400],
    }
    if lat is not None and lng is not None:
        built.update(lat=float(lat), lng=float(lng), mapUrl=common.map_url(lat, lng))
    optional = {"price": price, "attending": attending, "capacity": capacity, "spotsLeft": spots_left}
    built.update({k: v for k, v in optional.items() if v is not None})
    return built
