#!/usr/bin/env python3
"""
Scrape Welwyn Garden City & Hertfordshire workshops and merge them into workshops_geo dataset.
"""

import json
import re
import urllib.request
import time
import os

JSON_PATH = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.json"
JS_PATH = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.js"
MIN_JS_PATH = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.min.js"

SEARCH_URLS = [
    "https://classbento.co.uk/workshops-welwyn-garden-city",
    "https://classbento.co.uk/workshops-hertfordshire",
    "https://classbento.co.uk/workshops-st-albans",
    "https://classbento.co.uk/search?location=Welwyn+Garden+City",
    "https://classbento.co.uk/search?location=Welwyn",
    "https://classbento.co.uk/search?location=Hatfield",
    "https://classbento.co.uk/search?location=St+Albans",
    "https://classbento.co.uk/search?location=Hertford",
    "https://classbento.co.uk/search?location=Harpenden",
    "https://classbento.co.uk/search?location=Stevenage",
    "https://classbento.co.uk/search?location=Hitchin",
    "https://classbento.co.uk/search?location=Watford",
    "https://classbento.co.uk/search?location=Hemel+Hempstead",
    "https://classbento.co.uk/search?location=Berkhamsted",
    "https://classbento.co.uk/search?location=Hertfordshire",
    "https://classbento.co.uk/search?location=AL8",
    "https://classbento.co.uk/search?location=AL1",
    "https://classbento.co.uk/search?q=welwyn",
    "https://classbento.co.uk/search?q=hertfordshire",
    "https://classbento.co.uk/search?q=st+albans",
    "https://classbento.co.uk/search?q=hatfield"
]

def fetch_candidates():
    candidates = set()
    for url in SEARCH_URLS:
        print(f"Crawling {url}...")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                links = re.findall(r"""href=["\x27](https://classbento\.co\.uk/[a-z0-9-]+|/[a-z0-9-]+)["\x27]""", html)
                for l in links:
                    if l.startswith("https://classbento.co.uk"):
                        l = l.replace("https://classbento.co.uk", "")
                    if not any(l.startswith(p) for p in ["/workshops-", "/search", "/blog", "/craft-classes", "/things-to-do", "/gift-", "/birthday-", "/hen-do-", "/team-building-", "/contact", "/about", "/terms", "/privacy", "/login", "/cart", "/checkout", "/help", "/faq", "/account", "/teacher-"]):
                        if len(l.split("-")) >= 3:
                            candidates.add(l)
        except Exception as e:
            print(f"Error crawling {url}: {e}")
        time.sleep(0.2)
    return list(candidates)

def parse_classbento(url_path):
    url = f"https://classbento.co.uk{url_path}" if url_path.startswith("/") else url_path
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return None

    json_lds = re.findall(r"""<script type=["\x27]application/ld\+json["\x27][^>]*>(.*?)</script>""", html, re.DOTALL)
    event_data = None
    for jld in json_lds:
        try:
            d = json.loads(jld)
            if d.get("@type") in ["EducationEvent", "Course", "Event", "Product"]:
                event_data = d
                break
        except:
            pass

    if not event_data:
        return None

    title = event_data.get("name", "")
    desc = event_data.get("description", "")
    offers = event_data.get("offers", {})
    price_val = offers.get("price", "0") if isinstance(offers, dict) else "0"
    try:
        price = int(float(price_val))
    except:
        price = 0

    loc_obj = event_data.get("location", {})
    address = ""
    lat = None
    lng = None
    if isinstance(loc_obj, dict):
        address = loc_obj.get("address", "")
        geo = loc_obj.get("geo", {})
        if isinstance(geo, dict):
            lat = geo.get("latitude")
            lng = geo.get("longitude")

    id_match = re.search(r"""["\x27]item_id["\x27]\s*:\s*["\x27]?(\d+)["\x27]?""", html)
    w_id = id_match.group(1) if id_match else str(abs(hash(url)) % 1000000)

    teacher_match = re.search(r"""class=["\x27][^"\x27]*teacher-name[^"\x27]*["\x27][^>]*>(.*?)<""", html, re.IGNORECASE)
    teacher = teacher_match.group(1).strip() if teacher_match else "Independent Host"

    # Verify bounding box (London + Hertfordshire + surrounding)
    if lat and lng:
        if not (51.2 <= lat <= 52.3 and -0.7 <= lng <= 0.4):
            # Not in our target geographic region
            return None

    return {
        "id": str(w_id),
        "title": title,
        "company_teacher": teacher,
        "price": price,
        "url": url,
        "rating": "4.9 (host)",
        "activity_patterns": "Runs regularly",
        "location": address or "Hertfordshire",
        "exact_location": address or "",
        "description": desc,
        "duration": "2 hours",
        "lat": lat or 51.8005,
        "lng": lng or -0.2052,
        "source": "ClassBento",
        "exact_coords": bool(lat and lng),
        "location_precision": "postcode" if (lat and lng) else "neighborhood"
    }

def main():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        existing = json.load(f)

    existing_urls = set(w.get("url", "") for w in existing)
    existing_ids = set(w.get("id", "") for w in existing)

    print(f"Starting with {len(existing)} existing workshops.")

    candidate_links = fetch_candidates()
    print(f"Found {len(candidate_links)} candidate links.")

    new_workshops = []
    for i, path in enumerate(candidate_links):
        full_url = f"https://classbento.co.uk{path}"
        if full_url in existing_urls:
            continue
        
        item = parse_classbento(path)
        if item and item["title"] and item["id"] not in existing_ids:
            new_workshops.append(item)
            existing_urls.add(item["url"])
            existing_ids.add(item["id"])
            print(f"[{len(new_workshops)}] Added: {item['title']} ({item['location']}) - £{item['price']}")
        
        if i % 20 == 0:
            time.sleep(0.5)

    print(f"\nScrape complete! Successfully added {len(new_workshops)} new workshops.")

    all_workshops = existing + new_workshops

    print(f"Total workshops now: {len(all_workshops)}")

    # Write files
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(all_workshops, f, indent=2, ensure_ascii=False)

    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write("window.WORKSHOPS_DATA = " + json.dumps(all_workshops, indent=2, ensure_ascii=False) + ";\n")

    with open(MIN_JS_PATH, "w", encoding="utf-8") as f:
        f.write("window.WORKSHOPS_DATA=" + json.dumps(all_workshops, separators=(',', ':'), ensure_ascii=False) + ";\n")

    print("Successfully wrote updated JSON and JS datasets.")

if __name__ == "__main__":
    main()
