"""It's a Date Club (itsadate.club): London activity-led speed dating & socials scraper."""

import datetime
import re
import urllib.request
from bs4 import BeautifulSoup

from sources import common, singles_common

NAME = "itsadate"
HOST_ID = "its-a-date"
HOST_NAME = "It's a Date Club"
EVENTS_URL = "https://itsadate.club/events/"
VERIFIES_URLS = True

MONTH_MAP = {
    "jan": "January", "feb": "February", "mar": "March",
    "apr": "April", "may": "May", "jun": "June",
    "jul": "July", "aug": "August", "sep": "September",
    "oct": "October", "nov": "November", "dec": "December"
}


def expand_date(date_str):
    expanded = date_str
    for k, v in MONTH_MAP.items():
        expanded = re.sub(rf"\b{k}\b", v, expanded, flags=re.I)
    return expanded


def parse_male_status(male_btn):
    if not male_btn:
        return "plenty"
    text = male_btn.get_text(strip=True).lower()
    if "sold out" in text:
        return "sold_out"
    if "limited" in text:
        return "limited"
    return "plenty"


def parse_card(card, today, coords):
    link = card.select_one(".event_itm_con h3 a")
    if not link:
        return None
    url = link.get("href")
    raw_name = common.text(link.get_text())

    meta_spans = [common.text(s.get_text()) for s in card.select(".event_meta_itm span") if not s.find("img")]
    date_str = meta_spans[0] if len(meta_spans) > 0 else ""
    time_str = meta_spans[1] if len(meta_spans) > 1 else ""
    age_str = meta_spans[2] if len(meta_spans) > 2 else ""

    loc = card.select_one(".event_itm_location span")
    location = common.text(loc.get_text()) if loc else ""

    # Exclude non-London events (e.g. Manchester)
    if "manchester" in raw_name.lower() or "manchester" in location.lower():
        return None

    # Parse date with expanded month name
    day = singles_common.text_date(expand_date(date_str), today)
    if not day or day < today:
        return None

    # Parse time
    start_time = singles_common.text_time(time_str)

    # Postcode / Geocoding
    postcode = common.find_postcode(location)
    lat, lng = coords.get(postcode) or singles_common.venue_coords(location)

    # Price
    prc = card.select_one(".event_itm_prc_in")
    price = common.text(prc.get_text()) if prc else None

    # Male ticket status for Alec
    male_btn = card.select_one(".event_itm_btns_meta .event_itm_male:first-child")
    ticket_status = parse_male_status(male_btn)

    # Description
    desc_p = card.select_one(".event_itm_con p")
    desc = common.text(desc_p.get_text()) if desc_p else ""
    if age_str:
        clean_age = re.sub(r"\s+", " ", age_str)
        name = f"{raw_name} ({clean_age})"
    else:
        name = raw_name

    venue = location.split(",")[0].strip() if location else ""

    # Generate stable ID from URL slug
    raw_id = url.rstrip("/").split("/")[-1]

    return singles_common.record(
        NAME, HOST_ID, HOST_NAME, raw_id, name, url, day.isoformat(),
        start_time=start_time, venue=venue, location=location,
        lat=lat, lng=lng, price=price, ticket_status=ticket_status,
        description=desc
    )


def fetch():
    today = datetime.date.today()
    req = urllib.request.Request(EVENTS_URL, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(urllib.request.urlopen(req).read(), "html.parser")
    cards = soup.select(".event_itm")
    locations = [c.select_one(".event_itm_location span") for c in cards]
    postcodes = [common.find_postcode(loc.get_text()) for loc in locations if loc]
    coords = common.geocode_postcodes([p for p in postcodes if p])

    records = []
    for c in cards:
        r = parse_card(c, today, coords)
        if r:
            records.append(r)
    return records


def owns(record):
    return record.get("source") == NAME
