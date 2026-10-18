"""Adventure Cinema: open-air screenings at historic estates (WordPress, no public API).

Show pages list every upcoming date as a card; venue pages carry address + coordinates.
"""

import re

from sources import common

NAME = "adventure-cinema"
BASE = "https://adventurecinema.co.uk"
CARD = re.compile(
    r'<a href="(?P<url>https://adventurecinema\.co\.uk/event/[^"]+)"[^>]*>\s*'
    r'<h4[^>]*>(?P<venue>.*?)</h4>.*?<span class="ps-h ps-h-5">(?P<date>.*?)</span>'
    r'.*?<span class="psDb">(?P<gates>.*?)</span>',
    re.S,
)
LABEL = re.compile(r'class="psLabel[^"]*"[^>]*>(?:\s*<svg.*?</svg>)?\s*([^<]+?)\s*<svg', re.S)
VENUE_LINK = re.compile(r'href="(https://adventurecinema\.co\.uk/venues/[^"/]+/)"')
COORDS = re.compile(r"destination=(-?\d+\.\d+),(-?\d+\.\d+)")
ADDRESS = re.compile(r"Where is .*?</h3>.*?<p>(.*?)</p>", re.S)
TITLE = re.compile(r'"position":3,"name":"([^"]+)"')
BLURB = re.compile(r'</h1>\s*</div>\s*<div class="psMt-5[^"]*">(.*?)</div>', re.S)

STATIC = {
    "provider": NAME,
    "providerName": "Adventure Cinema",
    "category": "Castles & Historic Open Air",
    "format": "Open Air Screening",
    "logo": "../img/logos/adventure-cinema.png",
    "instagramUrl": "https://www.instagram.com/adventurecinema",
    "facebookUrl": "https://www.facebook.com/adventurecinemauk",
}


def sitemap(kind):
    xml = common.get_text(f"{BASE}/{kind}-sitemap.xml")
    return [u for u in re.findall(r"<loc>([^<]+)</loc>", xml) if u.rstrip("/") != f"{BASE}/{kind.replace('ing', '')}"]


def venue_details(url, cache):
    if url not in cache:
        page = common.get_text(url)
        coords = COORDS.search(page)
        address = ADDRESS.search(page)
        cache[url] = {
            "lat": float(coords.group(1)) if coords else None,
            "lng": float(coords.group(2)) if coords else None,
            "address": ", ".join(common.text(p) for p in re.split(r"<br\s*/?>", address.group(1))) if address else "",
        }
    return cache[url]


def show_events(show_url, venues):
    page = common.get_text(show_url)
    title = TITLE.search(page)
    if not title:
        return []
    show = common.text(title.group(1))
    blurb_match = BLURB.search(page)
    blurb = common.text(blurb_match.group(1)) if blurb_match else ""
    events, previous_end = [], 0
    for card in CARD.finditer(page):
        label = LABEL.search(page, previous_end, card.start())
        previous_end = card.end()
        event_page = common.get_text(card["url"])
        venue_link = VENUE_LINK.search(event_page)
        venue = venue_details(venue_link.group(1), venues) if venue_link else {}
        if venue.get("lat") is None or not common.within_range(venue["lat"], venue["lng"]):
            continue
        day = common.next_occurrence(common.text(card["date"]).split(", ", 1)[-1])
        venue_name = common.text(card["venue"])
        events.append({
            "id": f"adv-{common.slug(venue_name.split(',')[0])}-{common.slug(show)}-{day.strftime('%b%d').lower()}",
            "name": f"{show} at {venue_name.split(',')[0]}",
            **STATIC,
            "status": common.text(label.group(1)).title() if label else "Booking Open",
            **common.event_dates(day, common.text(card["gates"])),
            "venue": venue_name,
            "location": venue["address"] or venue_name,
            "mapUrl": common.map_url(venue["lat"], venue["lng"]),
            "description": blurb,
            "url": card["url"],
        })
    return events


def owns(record):
    return record.get("provider") == NAME


def fetch():
    venues = {}
    events = []
    for show_url in sitemap("showing"):
        events += show_events(show_url, venues)
    return events
