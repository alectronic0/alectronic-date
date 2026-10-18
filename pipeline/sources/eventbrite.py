"""Eventbrite keyword search for conventions and fairs (nerd bucket).

Search pages embed results in window.__SERVER_DATA__ as `destination_event` objects.
Only the Convention / Festival or Fair formats are kept (other formats are mostly generic
parties and pub nights), and only if the listing mentions a nerd term from config/nerd.json
(keyword search alone also surfaces AA, church and dance "conventions").
"""

import datetime
import json
import re

import io_content
from sources import common

NAME = "eventbrite"
CONFIG = json.loads((io_content.REPO / "pipeline" / "config" / "nerd.json").read_text(encoding="utf-8"))
SEARCH = "https://www.eventbrite.co.uk/d/united-kingdom--london/{keyword}/"
NERD_TERMS = re.compile(r"\b(" + "|".join(map(re.escape, CONFIG["nerdTerms"])) + r")", re.I)


def server_events(page):
    start = page.index("window.__SERVER_DATA__")
    data, _ = json.JSONDecoder().raw_decode(page[page.index("=", start) + 1:].lstrip())
    found = []

    def walk(node):
        if isinstance(node, dict):
            if node.get("_type") == "destination_event":
                found.append(node)
                return
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)

    walk(data)
    return found


def formats(event):
    return {t.get("display_name") for t in event.get("tags", []) if t.get("prefix") == "EventbriteFormat"}


def is_nerdy(event):
    tags = " ".join(t.get("display_name", "") for t in event.get("tags", []))
    return bool(NERD_TERMS.search(f"{event.get('name', '')} {event.get('summary', '')} {tags}"))


def price(event):
    tickets = event.get("ticket_availability") or {}
    lowest = (tickets.get("minimum_ticket_price") or {}).get("display")
    if tickets.get("is_free"):
        return "Free"
    return f"From {lowest}" if lowest else None


def to_record(event):
    venue = event.get("primary_venue") or {}
    address = venue.get("address") or {}
    lat, lng = address.get("latitude"), address.get("longitude")
    if event.get("is_online_event") or event.get("is_cancelled") or lat is None:
        return None
    lat, lng = float(lat), float(lng)
    if not common.within_range(lat, lng):
        return None
    start = datetime.date.fromisoformat(event["start_date"])
    end = datetime.date.fromisoformat(event.get("end_date") or event["start_date"])
    dates = common.event_dates(start, event.get("start_time", ""))
    days = start.strftime("%A") if start == end else f"{start.strftime('%A')} to {end.strftime('%A')}"
    record = {
        "name": common.text(event["name"]),
        "host": NAME,
        "hostName": "Eventbrite",
        "url": event["url"].split("?")[0],
        "category": "Conventions & Expos",
        "status": "Tickets On Sale",
        **dates,
        "season": common.meteorological_season(start),
        "endDate": end.isoformat(),
        "month": start.strftime("%B %Y"),
        "approxMonth": start.strftime("%B"),
        "days": days,
        "location": common.text(address.get("localized_address_display")),
        "mapUrl": common.map_url(lat, lng),
        "description": common.text(event.get("summary")),
        "logo": "https://www.google.com/s2/favicons?domain=eventbrite.co.uk&sz=128",
    }
    cost = price(event)
    if cost:
        record["price"] = cost
    return record


def fetch():
    wanted = set(CONFIG["eventbriteFormats"])
    records, seen = [], set()
    for keyword in CONFIG["eventbriteKeywords"]:
        for event in server_events(common.get_text(SEARCH.format(keyword=keyword))):
            if event["id"] in seen or not formats(event) & wanted or not is_nerdy(event):
                continue
            seen.add(event["id"])
            record = to_record(event)
            if record:
                records.append(record)
    return records
