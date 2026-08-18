#!/usr/bin/env python3
"""
Scrape exact GPS coordinates and meeting locations from Airbnb experience pages.
Updates workshops_geo.json, workshops_geo.js, and workshops_geo.min.js.
"""

import json
import re
import urllib.request
import time
import os

JSON_PATH = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.json"
JS_PATH = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.js"
MIN_JS_PATH = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.min.js"

def main():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    unmapped = [w for w in data if (w.get("source") == "Airbnb" or "airbnb" in w.get("url", "")) and not w.get("exact_coords")]
    print(f"Total unmapped Airbnb experiences to scrape: {len(unmapped)}")

    updated_count = 0
    postcode_regex = re.compile(r"\b([A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2})\b")

    for i, w in enumerate(unmapped):
        url = w.get("url")
        wid = str(w.get("id"))
        title = w.get("title", "")

        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-GB,en;q=0.9"
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                html = resp.read().decode("utf-8", errors="ignore")

                # Extract coordinates
                coords_match = re.findall(r"""["\x27](?:lat|latitude)["\x27]\s*:\s*([0-9.-]+)[^}]*?["\x27](?:lng|longitude)["\x27]\s*:\s*([0-9.-]+)""", html)
                
                # Extract location string from meeting place div
                loc_divs = re.findall(r"""<div[^>]*class=["\x27][^"\x27]*dir-ltr[^"\x27]*["\x27][^>]*>([^<]*(?:Greater London|[A-Z]{1,2}[0-9]|London)[^<]*)</div>""", html)
                
                lat = None
                lng = None
                if coords_match:
                    for clat, clng in coords_match:
                        try:
                            flat = float(clat)
                            flng = float(clng)
                            if 51.2 <= flat <= 52.3 and -0.7 <= flng <= 0.4:
                                lat = flat
                                lng = flng
                                break
                        except:
                            pass

                if lat and lng:
                    w["lat"] = lat
                    w["lng"] = lng
                    w["exact_coords"] = True
                    w["location_precision"] = "postcode"

                    if loc_divs:
                        loc_clean = loc_divs[0].strip()
                        # Shorten if too long
                        if len(loc_clean) > 80:
                            loc_clean = loc_clean[:77] + "..."
                        w["exact_location"] = loc_clean
                        if "Greater London, " in loc_clean:
                            w["location"] = loc_clean.replace("Greater London, ", "").strip()
                        elif "," in loc_clean:
                            w["location"] = loc_clean.split(",")[0].strip()
                    
                    updated_count += 1
                    if updated_count % 10 == 0 or updated_count <= 5:
                        print(f"[{updated_count}/{len(unmapped)}] Updated: {title[:40]} -> [{lat:.4f}, {lng:.4f}] ({w.get('location')})")

        except Exception as e:
            print(f"[{i+1}] Error fetching {url}: {e}")

        # Rate limit politely
        time.sleep(0.2)

        # Save checkpoint every 50 items
        if updated_count > 0 and updated_count % 50 == 0:
            print(f"Saving checkpoint at {updated_count} items...")
            with open(JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nFinished scraping! Total Airbnb experiences updated: {updated_count}")

    # Final write to JSON and JS bundles
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write("window.WORKSHOPS_DATA = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n")

    with open(MIN_JS_PATH, "w", encoding="utf-8") as f:
        f.write("window.WORKSHOPS_DATA=" + json.dumps(data, separators=(',', ':'), ensure_ascii=False) + ";\n")

    print("All datasets successfully written and minified!")

if __name__ == "__main__":
    main()
