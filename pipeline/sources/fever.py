"""Fever (feverup.com) providers listed in config/fever_cinema.json.

Listing pages expose plan ids as a schema.org ItemList; each plan page embeds its full
detail in the Angular transfer state (`serverapp-state`) under PlanService.getPlanDetail.<id>.
"""

import datetime
import json
import re

import io_content
from sources import common

NAME = "fever"
CONFIG = io_content.REPO / "pipeline" / "config" / "fever_cinema.json"
PLAN_LINK = re.compile(r'"url":\s*"https://feverup\.com/m/(\d+)"')
STATE = re.compile(r'<script id="serverapp-state"[^>]*>(.*?)</script>', re.S)


def plan_ids(listing_url):
    return list(dict.fromkeys(PLAN_LINK.findall(common.get_text(listing_url))))


def plan_detail(plan_id):
    page = common.get_text(f"https://feverup.com/m/{plan_id}")
    state = json.loads(STATE.search(page).group(1))
    return state[f"PlanService.getPlanDetail.{plan_id}"]


def date_range(first, last):
    if first == last:
        return first.strftime("%-d %B %Y")
    if first.year == last.year:
        return f"{first.strftime('%-d %b')} to {last.strftime('%-d %b %Y')} (selected dates)"
    return f"{first.strftime('%-d %b %Y')} to {last.strftime('%-d %b %Y')} (selected dates)"


def to_record(plan, provider, today):
    if plan.get("isTimeless") or not plan.get("lastActiveSessionDate"):
        return None
    first = max(datetime.date.fromisoformat(plan["firstActiveSessionDate"][:10]), today)
    last = datetime.date.fromisoformat(plan["lastActiveSessionDate"][:10])
    place = plan.get("defaultPlace") or {}
    lat, lng = place.get("latitude"), place.get("longitude")
    if lat is None or not common.within_range(lat, lng):
        return None
    name = common.text(plan["name"])
    prefix = provider.get("stripPrefix", "")
    if prefix and name.lower().startswith(prefix.lower()):
        name = name[len(prefix):]
    price = plan.get("priceInfo") or {}
    label = common.text(plan.get("customLabel") or "")
    return {
        "id": f"fever-{plan['id']}",
        "name": name,
        **provider["record"],
        "status": label or ("Selling Fast" if plan.get("isUrgent") else "Booking Open"),
        "season": first.strftime("%B %Y"),
        "timing": date_range(first, last),
        "endDate": last.isoformat(),
        "dateBadge": first.strftime("%b %d %Y").upper(),
        **({"price": f"From £{price['amount']:g} / person"} if price.get("amount") else {}),
        "venue": common.text(place.get("name")),
        "location": common.text(place.get("address")),
        "mapUrl": common.map_url(lat, lng),
        "description": common.text((plan.get("meta") or {}).get("description")),
        "url": f"https://feverup.com/m/{plan['id']}",
    }


def owns(record):
    providers = {p["record"]["provider"] for p in json.loads(CONFIG.read_text(encoding="utf-8"))}
    return record.get("provider") in providers


def fetch():
    today = datetime.date.today()
    records = []
    for provider in json.loads(CONFIG.read_text(encoding="utf-8")):
        for plan_id in plan_ids(provider["listing"]):
            record = to_record(plan_detail(plan_id), provider, today)
            if record:
                records.append(record)
    return records
