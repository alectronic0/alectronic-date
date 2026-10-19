"""DesignMyNight London: venues, events, best picks and articles (activities bucket).

api-content.designmynight.com/search/pages pages 20 at a time and stops at 10,000 results,
so each page `type` is walked separately. `features` is a list on articles but a
{key: {label}} map on venues/events (see london-events-discovery DMN gotchas).
"""

from concurrent.futures import ThreadPoolExecutor

from sources import activity, common

VERIFIES_URLS = False
NAME = "designmynight"
API = "https://api-content.designmynight.com/search/pages?type={kind}&page={page}"
KINDS = ("venue", "event", "bestPicks", "article")
WORKERS = 3


def features(item):
    raw = item.get("features")
    if not isinstance(raw, dict):
        return {}
    return {key: (value or {}).get("label", "") for key, value in raw.items() if isinstance(value, dict)}


def photo(item):
    photos = item.get("photos") or []
    sizes = (photos[0] or {}).get("sizes", {}) if photos else {}
    return (sizes.get("medium") or sizes.get("original") or {}).get("path", "")


def to_record(item):
    kind = item.get("type")
    labels = features(item)
    location = item.get("location") or {}
    venue = item.get("venue") or {}
    venue_kind = labels.get("type_of_venue") or labels.get("type_of_event") or ""
    if kind == "bestPicks" or kind == "article":
        category = "Curated Guide"
    else:
        category = activity.categorise(venue_kind, item.get("title"), default="Bars & Nightlife" if kind == "venue" else "Event / Experience")
    return activity.record(
        NAME, "dmn", item["id"], item.get("title"), item["path"],
        category=category,
        description=item.get("excerpt"),
        tags=[v for v in labels.values() if v] or None,
        venue_name=venue.get("title") or (item.get("title") if kind == "venue" else ""),
        area=labels.get("area") or "London",
        price_raw=labels.get("budget") or (item.get("ticket_price_range") or ""),
        image_url=photo(item),
        lat=location.get("lat"), lng=location.get("lon"),
        precision="exact",
    )


def kind_pages(kind):
    first = common.get_json(API.format(kind=kind, page=1))
    pages = first["meta"]["last_page"]
    with ThreadPoolExecutor(WORKERS) as pool:
        rest = pool.map(lambda n: common.get_json(API.format(kind=kind, page=n))["payload"], range(2, pages + 1))
    return [first["payload"], *rest]


def fetch():
    records = []
    for kind in KINDS:
        for payload in kind_pages(kind):
            records += [to_record(item) for item in payload if "/london/" in item.get("path", "")]
    return records


def owns(record):
    return record.get("source") == NAME
