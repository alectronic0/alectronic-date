"""Art Dating Club (artdatingclub.com): events sold as Big Cartel products.

products.json gives name, price and per-option sold_out flags. Date, time and venue live only
in the free-text description ("📍 John the Unicorn, Peckham, SE15 4TL Tuesday 27 October 2026
From 7:30pm"), so products without a parseable date (merch, gift cards) are skipped.
"""

import datetime
import re

from sources import common, singles_common

NAME = "artdatingclub"
HOST_ID = "art-dating-club"
SHOP = "https://www.artdatingclub.com"
PIN = re.compile(r"📍\s*([^🕢\n]+)")


def venue_text(description):
    match = PIN.search(description)
    if not match:
        return ""
    venue = singles_common.DAY_MONTH.split(match.group(1))[0]
    return re.sub(r"\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day,?\s*$", "", venue.strip(), flags=re.I).strip(" ,")


def sold_out(product):
    options = product.get("options") or []
    return product.get("status") == "sold-out" or (options and all(o.get("sold_out") for o in options))


def to_record(product, coords, today):
    description = common.text(product.get("description"))
    day = singles_common.text_date(description, today)
    if not day or day < today:
        return None
    venue = venue_text(description)
    postcode = common.find_postcode(venue)
    lat, lng = coords.get(postcode) or singles_common.venue_coords(venue)
    price = product.get("default_price") or product.get("price")
    return singles_common.record(
        NAME, HOST_ID, "Art Dating Club", product["id"], product["name"], f"{SHOP}{product['url']}", day.isoformat(),
        start_time=singles_common.text_time(description), venue=venue.split(",")[0], location=venue,
        lat=lat, lng=lng, price=f"From {common.pounds(price)}" if price else None,
        ticket_status="sold_out" if sold_out(product) else "plenty",
        description=description,
    )


def fetch():
    today = datetime.date.today()
    products = [p for p in common.get_json(f"{SHOP}/products.json") if p.get("status") != "inactive"]
    postcodes = [common.find_postcode(venue_text(common.text(p.get("description")))) for p in products]
    coords = common.geocode_postcodes(postcodes)
    return [r for r in (to_record(p, coords, today) for p in products) if r]


def owns(record):
    return record.get("source") == NAME
