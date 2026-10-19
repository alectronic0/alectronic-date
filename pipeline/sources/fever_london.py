"""Fever London: every plan across the /en/london/<category> listing pages (activities bucket).

Category pages expose plan ids as a schema.org ItemList; plan details come from the same
serverapp-state parser the cinema bucket uses (sources/fever.py).
"""

import datetime
import re
from concurrent.futures import ThreadPoolExecutor

from sources import activity, common, fever

VERIFIES_URLS = True
NAME = "fever"
CITY = "https://feverup.com/en/london"
CATEGORY_LINK = re.compile(r'href="(/en/london/[a-z0-9-]+)"')
SKIP_CATEGORIES = ("gift-cards", "event-gift-cards")
WORKERS = 3


def plan_ids():
    categories = sorted({c for c in CATEGORY_LINK.findall(common.get_text(CITY)) if not c.endswith(SKIP_CATEGORIES)})
    with ThreadPoolExecutor(WORKERS) as pool:
        lists = pool.map(lambda path: fever.plan_ids(f"https://feverup.com{path}"), categories)
    return list(dict.fromkeys(i for ids in lists for i in ids))


def to_record(plan, today):
    if not plan.get("lastActiveSessionDate") and not plan.get("isTimeless"):
        return None
    last = plan.get("lastActiveSessionDate")
    if last and last[:10] < today.isoformat():
        return None
    place = plan.get("defaultPlace") or {}
    lat, lng = place.get("latitude"), place.get("longitude")
    if lat is not None and not activity.in_london(lat, lng):
        return None
    price = plan.get("priceInfo") or {}
    amount = price.get("amount")
    postcode = common.find_postcode(place.get("address", ""))
    return activity.record(
        NAME, "fv", plan["id"], plan.get("name"), f"https://feverup.com/m/{plan['id']}",
        category=activity.categorise(plan.get("name"), (plan.get("meta") or {}).get("description")),
        description=(plan.get("meta") or {}).get("description"),
        tags=["fever"],
        venue_name=place.get("name", ""),
        address=place.get("address", ""),
        postcode=postcode,
        area=postcode.split(" ")[0] if postcode else "London",
        price_raw=f"From {common.pounds(amount)}" if amount else "",
        is_free=amount == 0,
        image_url=plan.get("coverImage", ""),
        lat=lat, lng=lng, precision="exact",
        start_date=activity.iso(plan.get("firstActiveSessionDate")),
        end_date=activity.iso(last),
    )


def fetch():
    today = datetime.date.today()
    failures = []

    def detail(plan_id):
        try:
            return to_record(fever.plan_detail(plan_id), today)
        except Exception as err:  # sold-out or region-locked plans have no detail state
            failures.append(f"{plan_id}: {err}")
            return None

    ids = plan_ids()
    with ThreadPoolExecutor(WORKERS) as pool:
        records = [r for r in pool.map(detail, ids) if r]
    if len(failures) > 0.2 * max(len(ids), 1):
        raise RuntimeError(f"{len(failures)}/{len(ids)} Fever plans failed, e.g. {failures[:3]}")
    return records


def owns(record):
    return record.get("source") == NAME
