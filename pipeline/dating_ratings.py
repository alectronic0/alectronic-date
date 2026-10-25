"""js/dating-ratings.js: live UK App Store ratings for the apps in js/dating-services.js.

The services file is hand-curated (rating rule inputs, sources), so ratings live in their own
generated file instead of being merged into it. Every big dating app scores about 4.0-4.4,
so the pages show this as context only; it never feeds the trust rating.
"""

import json

import io_content
from sources import common

SERVICES_JS = io_content.REPO / "js" / "dating-services.js"
RATINGS_JS = io_content.REPO / "js" / "dating-ratings.js"
SERVICES_PREFIX = "window.DATING_SERVICES = "
RATINGS_PREFIX = "window.DATING_RATINGS = "
LOOKUP = "https://itunes.apple.com/lookup?country=gb&id={ids}"


def load_js(path, prefix):
    text = path.read_text(encoding="utf-8").strip()
    return json.loads(text[len(prefix):].rstrip(";"))


def app_ids():
    """{appStoreId: slug} for every app that has an App Store listing."""
    apps = load_js(SERVICES_JS, SERVICES_PREFIX)["apps"]
    return {str(a["appStoreId"]): a["slug"] for a in apps if a.get("appStoreId")}


def parse(payload, ids, today):
    ratings = {}
    for row in payload.get("results") or []:
        slug = ids.get(str(row.get("trackId")))
        if not slug or row.get("averageUserRating") is None:
            continue
        ratings[slug] = {"rating": round(row["averageUserRating"], 1), "count": row.get("userRatingCount", 0), "checked": today}
    return ratings


def write(today):
    """Rewrite the ratings file; return its path when the ratings changed, else None."""
    ids = app_ids()
    if not ids:
        return None
    fresh = parse(common.get_json(LOOKUP.format(ids=",".join(sorted(ids)))), ids, today)
    previous = load_js(RATINGS_JS, RATINGS_PREFIX) if RATINGS_JS.exists() else {}
    if {k: {**v, "checked": None} for k, v in fresh.items()} == {k: {**v, "checked": None} for k, v in previous.items()}:
        return None
    RATINGS_JS.write_text(f"{RATINGS_PREFIX}{json.dumps(fresh, indent=2, ensure_ascii=False, sort_keys=True)};\n", encoding="utf-8")
    return RATINGS_JS
