"""Eventbrite singles nights (speed dating, mixers) for the labs/events.html guide.

Reuses the __SERVER_DATA__ parser from sources/eventbrite.py. Search results rarely carry
ticket availability, so each event page is read once for its sales status and organiser.
Organiser logos come from each organiser page's og:image (fetched once per organiser per run). The
img.evbuc.com URL is signed (`s=`), so its size parameters can't be changed.
Eventbrite never exposes per-event attendee counts, so these records carry no `attending`/`capacity`.
"""

import datetime
import html
import json
import re

import io_content
from sources import common, eventbrite

NAME = "eventbrite"
VERIFIES_URLS = True
CONFIG = json.loads((io_content.REPO / "pipeline" / "config" / "singles.json").read_text(encoding="utf-8"))
SEARCH = "https://www.eventbrite.co.uk/d/united-kingdom--london/{keyword}/"
ORGANISER = "https://www.eventbrite.co.uk/o/{id}"
OG_IMAGE = re.compile(r'og:image" content="(https://img\.evbuc\.com/[^"]+)"')
SINGLES_TERMS = re.compile("|".join(map(re.escape, CONFIG["singlesTerms"])), re.I)
EXCLUDE_TERMS = re.compile("|".join(map(re.escape, CONFIG["excludeTerms"])), re.I)
LIMITED_SIGNALS = {"fewTickets", "goingFast"}
CLOSED_SALES = {"sold_out", "sales_ended"}


def is_singles(event):
    text = f"{event.get('name', '')} {event.get('summary', '')}"
    if EXCLUDE_TERMS.search(event.get("name", "")):
        return False
    return bool(SINGLES_TERMS.search(text))


def page_details(page):
    sales = re.search(r'"salesStatus":"(\w+)"', page)
    availability = set(re.findall(r'"availability":"(\w+)"', page))
    organiser = re.search(r'"organizer":\{"@type":"Organization","name":"([^"]+)"', page)
    return (sales.group(1) if sales else ""), availability, (common.text(organiser.group(1)) if organiser else "Eventbrite")


def organiser_logo(page):
    match = OG_IMAGE.search(page)
    if not match:
        return None
    return html.unescape(match.group(1))


def logo_for(organiser_id, logos):
    if not organiser_id:
        return None
    if organiser_id not in logos:
        try:
            logos[organiser_id] = organiser_logo(common.get_text(ORGANISER.format(id=organiser_id)))
        except OSError:
            logos[organiser_id] = None
    return logos[organiser_id]


def ticket_status(event, sales, availability):
    if sales in CLOSED_SALES or "SoldOut" in availability:
        return "sold_out"
    signals = set((event.get("urgency_signals") or {}).get("messages") or [])
    if signals & LIMITED_SIGNALS or "LimitedAvailability" in availability:
        return "limited"
    if sales == "on_sale":
        return "plenty"
    return "unknown"


def to_record(event, logos):
    venue = event.get("primary_venue") or {}
    address = venue.get("address") or {}
    lat, lng = address.get("latitude"), address.get("longitude")
    if event.get("is_online_event") or event.get("is_cancelled") or lat is None:
        return None
    lat, lng = float(lat), float(lng)
    if not common.within_range(lat, lng):
        return None
    url = event["url"].split("?")[0]
    try:
        sales, availability, organiser = page_details(common.get_text(url))
    except OSError:
        return None
    start = datetime.date.fromisoformat(event["start_date"])
    end = datetime.date.fromisoformat(event.get("end_date") or event["start_date"])
    record = {
        "id": event["id"],
        "source": NAME,
        "name": common.text(event["name"]),
        "hostName": organiser,
        "url": url,
        "startDate": start.isoformat(),
        "startTime": event.get("start_time") or "",
        "endDate": end.isoformat(),
        "venue": common.text(venue.get("name")),
        "location": common.text(address.get("localized_address_display")),
        "lat": lat,
        "lng": lng,
        "mapUrl": common.map_url(lat, lng),
        "ticketStatus": ticket_status(event, sales, availability),
        "description": common.text(event.get("summary")),
    }
    cost = eventbrite.price(event)
    if cost:
        record["price"] = cost
    logo = logo_for(event.get("primary_organizer_id"), logos)
    if logo:
        record["hostLogo"] = logo
    return record


def fetch():
    records, seen, logos = [], set(), {}
    for keyword in CONFIG["eventbriteKeywords"]:
        for event in eventbrite.server_events(common.get_text(SEARCH.format(keyword=keyword))):
            if event["id"] in seen or not is_singles(event):
                continue
            seen.add(event["id"])
            record = to_record(event, logos)
            if record:
                records.append(record)
    return records


def owns(record):
    return record.get("source") == NAME
