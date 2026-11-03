"""Sparked Connection (sparkedconnection.com): curated singles parties, mixers, and events."""

import datetime
import re
import urllib.request
from bs4 import BeautifulSoup

from sources import common, singles_common

NAME = "sparkedconnection"
HOST_ID = "sparked-connection"
HOST_NAME = "Sparked Connection"
BASE_URL = "https://sparkedconnection.com"
SITEMAP_URL = f"{BASE_URL}/sitemap.xml"
FATSOMA_BRAND = "https://www.fatsoma.com/p/sparked-connection"
VERIFIES_URLS = True

POSTCODE_RE = re.compile(r"\b([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})\b")
PRICE_RE = re.compile(r"£(\d+)")


def parse_page(url, today, coords):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        html = urllib.request.urlopen(req, timeout=8).read().decode("utf-8", errors="ignore")
    except Exception:
        return None

    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string.strip() if soup.title else ""
    text = soup.get_text(separator=" ")

    day = singles_common.text_date(text, today)
    if not day or day < today:
        return None

    time_str = singles_common.text_time(text)

    postcode_match = POSTCODE_RE.search(text)
    postcode = postcode_match.group(1) if postcode_match else ""

    venue = "Soho / Central London"
    location = venue
    if "Arts Theatre Club" in text:
        venue = "The Arts Theatre Club"
        location = "50 Frith Street, Soho, London W1D 4SQ"
        postcode = "W1D 4SQ"

    lat, lng = coords.get(postcode) or singles_common.venue_coords(venue)

    price_match = PRICE_RE.search(text)
    price = f"From £{price_match.group(1)}" if price_match else None

    ticket_status = "plenty"
    if "sold out" in text.lower():
        ticket_status = "sold_out"

    slug = url.rstrip("/").split("/")[-1]
    name = title.split("|")[0].strip() or "Singles Event"

    return singles_common.record(
        NAME,
        HOST_ID,
        HOST_NAME,
        f"sc-{slug}",
        name,
        url,
        day.isoformat(),
        start_time=time_str,
        venue=venue,
        location=location,
        lat=lat,
        lng=lng,
        price=price,
        ticket_status=ticket_status,
        description=f"Curated singles event hosted by Sparked Connection: {name}",
    )


def fetch():
    today = datetime.date.today()
    urls_to_check = set()

    # 1. Parse sitemap for event landing pages (exclude static policy pages)
    try:
        req = urllib.request.Request(SITEMAP_URL, headers={"User-Agent": "Mozilla/5.0"})
        sitemap_xml = urllib.request.urlopen(req, timeout=5).read().decode("utf-8", errors="ignore")
        for loc in re.findall(r"<loc>([^<]+)</loc>", sitemap_xml):
            if any(skip in loc for skip in ["privacy", "terms", "refund", "accessibility", "plans", "form", "articles."]):
                continue
            if loc.rstrip("/") != BASE_URL:
                urls_to_check.add(loc)
    except Exception:
        pass

    # 2. Check Fatsoma brand page for active event links
    try:
        req = urllib.request.Request(FATSOMA_BRAND, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        fatsoma_html = urllib.request.urlopen(req, timeout=6).read().decode("utf-8", errors="ignore")
        for match in re.findall(r'href="(/e/[^"]+)"', fatsoma_html):
            urls_to_check.add(f"https://www.fatsoma.com{match}")
    except Exception:
        pass

    coords = common.geocode_postcodes(["W1D 4SQ"])
    records = []
    for url in urls_to_check:
        rec = parse_page(url, today, coords)
        if rec:
            records.append(rec)

    return records


def owns(record):
    return record.get("source") == NAME
