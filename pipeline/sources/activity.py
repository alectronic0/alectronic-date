"""Shared record shape for the activities bucket (london_activities_geo / london-activities.html).

Categories stay inside the vocabulary js/london_activities.js has emoji + colours for.
"""

import datetime
import re

from sources import common

CENTRAL_LONDON = (51.5072, -0.1276)
CATEGORY_RULES = (
    ("Comedy", r"comedy|stand-?up|improv|comedian"),
    ("Theatre & Shows", r"theatre|musical|cabaret|burlesque|drag show|drag queen|magic|circus|ballet|opera|dance"),
    ("Music & Gigs", r"gig|concert|candlelight|live music|dj\b|festival|jazz|orchestra|club night|rave|music"),
    ("Art & Exhibitions", r"exhibition|gallery|museum|art\b|arts\b|immersive|photograph|design"),
    ("Food & Drink", r"restaurant|brunch|dining|food|supper|tasting|chef|bakery|cafe|market|afternoon tea"),
    ("Bars & Nightlife", r"bar\b|bars\b|pub\b|cocktail|nightlife|nightclub|club\b|speakeasy|wine|beer|karaoke|boat party"),
    ("Parks & Outdoors", r"park\b|garden|outdoor|walk\b|walking|river|cruise|kayak|nature"),
    ("Attractions & Sightseeing", r"attraction|landmark|tour\b|tours\b|sightseeing|day trip|palace|castle"),
)


def categorise(*texts, default="Event / Experience"):
    """First text that matches a rule wins, so pass the title before longer descriptions."""
    for text_value in texts:
        for category, pattern in CATEGORY_RULES:
            if text_value and re.search(pattern, text_value.lower()):
                return category
    return default


def https(url):
    if url and url.startswith("//"):
        return f"https:{url}"
    return url or ""


def record(source, prefix, raw_id, title, url, *, category, description="", tags=None, venue_name="",
           address="", postcode="", area="London", price_raw="", is_free=False, image_url="",
           lat=None, lng=None, precision=None, start_date=None, end_date=None):
    if lat is None or lng is None:
        lat, lng = CENTRAL_LONDON
        precision = "citywide"
    built = {
        "id": f"{prefix}_{raw_id}",
        "source": source,
        "title": common.text(title),
        "description": common.text(description)[:400],
        "category": category,
        "tags": [common.text(t) for t in tags if t] if tags else None,
        "venue_name": common.text(venue_name),
        "address": common.text(address),
        "postcode": common.text(postcode).upper(),
        "area": common.text(area) or "London",
        "price_raw": common.text(price_raw),
        "is_free": bool(is_free),
        "image_url": https(image_url),
        "url": url,
        "lat": float(lat),
        "lng": float(lng),
        "location_precision": precision or "exact",
    }
    if start_date:
        built["start_date"] = start_date
    if end_date:
        built["end_date"] = end_date
    return built


def in_london(lat, lng, miles=25):
    """'Everything in London' for city-wide feeds: within 25 miles of Charing Cross."""
    return common.miles_between(CENTRAL_LONDON, (lat, lng)) <= miles


def iso(moment):
    try:
        return datetime.datetime.fromisoformat(moment.replace("Z", "+00:00")).date().isoformat()
    except (AttributeError, ValueError):
        return None
