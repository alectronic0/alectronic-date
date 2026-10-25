"""Be Dating Beautiful (bedatingbeautiful.com): Hertfordshire singles nights sold as WooCommerce products.

The public Store API gives name, price (minor units) and stock. Date, time and address live only in
the description's "Event Details" block ("📅 Wednesday 16th December, 7:30pm 📍 Ronnie's Bar, ...,
CV34 4EW"). Past events stay listed as out of stock and their dates carry no year, so only in-stock
products are kept: a sold-out future night drops off rather than resurfacing old events a year on.
"""

import datetime
import re

from sources import common, singles_common

NAME = "bedatingbeautiful"
HOST_ID = "be-dating-beautiful"
SHOP = "https://bedatingbeautiful.com"
PRODUCTS = f"{SHOP}/wp-json/wc/store/v1/products?per_page=100"
NEW_YEARS_EVE = re.compile(r"New Year.s Eve", re.I)
POSTCODE_END = r"([^📍]{0,120}?\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})\b"
PINNED = re.compile(rf"(?:📍|Address:)\s*{POSTCODE_END}")
AFTER_TIME = re.compile(rf"\d[ap]m\s*{POSTCODE_END}")


def details(description):
    _, marker, after = description.partition("Event Details")
    return after if marker else description


def event_date(text_value, today):
    day = singles_common.text_date(text_value, today)
    if day:
        return day
    if NEW_YEARS_EVE.search(text_value):
        return datetime.date(today.year, 12, 31)
    return None


def address(text_value, pattern):
    match = pattern.search(text_value)
    if not match:
        return ""
    return re.sub(r"\s+,", ",", match.group(1)).strip(" ,")


def price_label(prices):
    amount = int(prices.get("price") or 0) / 10 ** prices.get("currency_minor_unit", 2)
    return f"From {common.pounds(amount)}" if amount else None


def event_address(description):
    return address(description, PINNED) or address(details(description), AFTER_TIME)


def to_record(product, coords, today):
    description = common.text(product.get("description"))
    block = details(description)
    day = event_date(block, today)
    if not day or day < today:
        return None
    location = event_address(description)
    lat, lng = coords.get(common.find_postcode(location), (None, None))
    if lat is None or not common.within_range(lat, lng):
        return None
    spots = product.get("low_stock_remaining")
    return singles_common.record(
        NAME, HOST_ID, "Be Dating Beautiful", product["id"], product["name"], product["permalink"], day.isoformat(),
        start_time=singles_common.text_time(block), venue=location.split(",")[0], location=location,
        lat=lat, lng=lng, price=price_label(product.get("prices") or {}),
        ticket_status=singles_common.status_from_spots(spots) if spots is not None else "plenty",
        spots_left=spots, description=block,
    )


def fetch():
    today = datetime.date.today()
    products = [p for p in common.get_json(PRODUCTS) if p.get("is_in_stock")]
    postcodes = [common.find_postcode(event_address(common.text(p.get("description")))) for p in products]
    coords = common.geocode_postcodes(postcodes)
    return [r for r in (to_record(p, coords, today) for p in products) if r]


def owns(record):
    return record.get("source") == NAME
