"""Secret London (secretldn.com): last 12 months of English things-to-do, food & drink and
culture posts via the WordPress REST API (activities bucket).

Posts are articles, so most records are city-wide; a UK postcode in the body becomes a pin.
"""

import datetime
import json
import urllib.request

from sources import activity, common

VERIFIES_URLS = False
NAME = "secretlondon"
API = "https://secretldn.com/wp-json/wp/v2/posts"
CATEGORIES = {2: None, 3: "Food & Drink", 6: "Art & Exhibitions"}  # things-to-do, food-drink, culture
FIELDS = "id,link,title,excerpt,categories,content,yoast_head_json"
LOOKBACK_DAYS = 365


def pages(after):
    query = f"per_page=100&categories={','.join(map(str, CATEGORIES))}&after={after}T00:00:00&_fields={FIELDS}"
    page, total = 1, 1
    while page <= total:
        request = urllib.request.Request(f"{API}?{query}&page={page}", headers={"User-Agent": common.USER_AGENT})
        with urllib.request.urlopen(request, timeout=30) as response:
            total = int(response.headers.get("X-WP-TotalPages", "1"))
            yield json.loads(response.read().decode("utf-8"))
        page += 1


def category_for(post):
    title = common.text(post["title"]["rendered"])
    for category_id in post.get("categories", []):
        fixed = CATEGORIES.get(category_id)
        if fixed:
            return activity.categorise(title, default=fixed)
    return activity.categorise(title, default="Things To Do")


def fetch():
    after = (datetime.date.today() - datetime.timedelta(days=LOOKBACK_DAYS)).isoformat()
    posts = [post for batch in pages(after) for post in batch]
    postcodes = {post["id"]: common.find_postcode(common.text(post["content"]["rendered"])) for post in posts}
    pins = common.geocode_postcodes(postcodes.values())
    records = []
    for post in posts:
        yoast = post.get("yoast_head_json") or {}
        postcode = postcodes[post["id"]]
        lat, lng = pins.get(postcode, (None, None))
        records.append(activity.record(
            NAME, "sl", post["id"], post["title"]["rendered"], post["link"],
            category=category_for(post),
            description=yoast.get("og_description") or post["excerpt"]["rendered"],
            tags=["secret-london"],
            postcode=postcode,
            area=postcode.split(" ")[0] if postcode else "London",
            image_url=((yoast.get("og_image") or [{}])[0]).get("url", ""),
            lat=lat, lng=lng, precision="neighborhood",
        ))
    return records


def owns(record):
    return record.get("source") == NAME
