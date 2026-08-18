#!/usr/bin/env python3
"""
Re-geocode workshops dataset with precision tracking and exact postcodes.
Uses postcodes.io for exact UK postcodes and a verified London/Herts neighborhood dictionary.
"""

import json
import re
import urllib.request
import urllib.parse
import time
import os

NEIGHBORHOOD_COORDS = {
    # Central London
    "Waterloo": (51.5031, -0.1132),
    "Bankside": (51.5055, -0.0980),
    "Southwark": (51.5020, -0.0950),
    "Borough": (51.5011, -0.0943),
    "London Bridge": (51.5052, -0.0864),
    "Covent Garden": (51.5129, -0.1243),
    "Soho": (51.5137, -0.1360),
    "Fitzrovia": (51.5195, -0.1380),
    "Bloomsbury": (51.5228, -0.1244),
    "Holborn": (51.5174, -0.1200),
    "Marylebone": (51.5190, -0.1540),
    "Mayfair": (51.5100, -0.1470),
    "Aldwych": (51.5126, -0.1173),
    "Trafalgar Square": (51.5080, -0.1281),
    "Charing Cross": (51.5080, -0.1250),
    "Westminster": (51.5000, -0.1300),
    "Victoria": (51.4965, -0.1444),
    "Pimlico": (51.4893, -0.1335),
    "City of London": (51.5150, -0.0900),
    "Bank": (51.5133, -0.0886),
    "Moorgate": (51.5186, -0.0886),
    "Liverpool Street": (51.5178, -0.0823),
    "Tower Gateway": (51.5105, -0.0745),
    "Tower Hill": (51.5098, -0.0765),
    "Clerkenwell": (51.5240, -0.1060),
    "Farringdon": (51.5203, -0.1053),
    "Barbican": (51.5204, -0.0979),
    "Hatton Garden": (51.5190, -0.1080),
    "King's Cross": (51.5308, -0.1238),
    "Kings Cross": (51.5308, -0.1238),
    "Euston": (51.5282, -0.1337),

    # East London
    "Shoreditch": (51.5256, -0.0790),
    "Old Street": (51.5256, -0.0875),
    "Hoxton": (51.5316, -0.0762),
    "Haggerston": (51.5387, -0.0766),
    "Dalston": (51.5462, -0.0755),
    "Spitalfields": (51.5190, -0.0750),
    "Brick Lane": (51.5210, -0.0710),
    "Whitechapel": (51.5194, -0.0612),
    "Bethnal Green": (51.5273, -0.0555),
    "Hackney": (51.5450, -0.0550),
    "Hackney Central": (51.5467, -0.0556),
    "Hackney Wick": (51.5434, -0.0252),
    "Homerton": (51.5468, -0.0394),
    "London Fields": (51.5400, -0.0580),
    "Victoria Park": (51.5360, -0.0370),
    "Bow": (51.5280, -0.0250),
    "Mile End": (51.5253, -0.0337),
    "Stepney": (51.5190, -0.0470),
    "Stratford": (51.5416, -0.0033),
    "Walthamstow": (51.5830, -0.0198),
    "Leyton": (51.5600, -0.0150),
    "Leytonstone": (51.5680, 0.0100),
    "Canary Wharf": (51.5054, -0.0209),
    "Isle of Dogs": (51.4950, -0.0150),
    "Limehouse": (51.5130, -0.0390),
    "Wapping": (51.5043, -0.0559),
    "Shadwell": (51.5117, -0.0566),
    "Poplar": (51.5120, -0.0170),
    "Canning Town": (51.5140, 0.0080),
    "Royal Docks": (51.5070, 0.0250),
    "Barking": (51.5396, 0.0813),

    # North London
    "Islington": (51.5362, -0.1030),
    "Angel": (51.5322, -0.1058),
    "Highbury": (51.5500, -0.0980),
    "Canonbury": (51.5486, -0.0922),
    "Stoke Newington": (51.5610, -0.0740),
    "Finsbury Park": (51.5642, -0.1065),
    "Holloway": (51.5526, -0.1132),
    "Archway": (51.5653, -0.1353),
    "Highgate": (51.5710, -0.1470),
    "Tufnell Park": (51.5567, -0.1380),
    "Kentish Town": (51.5503, -0.1404),
    "Camden": (51.5392, -0.1426),
    "Camden Town": (51.5392, -0.1426),
    "Primrose Hill": (51.5390, -0.1600),
    "Hampstead": (51.5553, -0.1656),
    "Belsize Park": (51.5480, -0.1640),
    "Swiss Cottage": (51.5430, -0.1740),
    "West Hampstead": (51.5478, -0.1912),
    "Kilburn": (51.5370, -0.1980),
    "Muswell Hill": (51.5900, -0.1430),
    "Crouch End": (51.5790, -0.1240),
    "Wood Green": (51.5975, -0.1096),
    "Tottenham": (51.5880, -0.0700),
    "Seven Sisters": (51.5822, -0.0749),
    "Harringay": (51.5768, -0.1044),
    "East Barnet": (51.6440, -0.1600),
    "Barnet": (51.6505, -0.1940),
    "Finchley": (51.6012, -0.1927),
    "Enfield": (51.6520, -0.0810),

    # South London
    "Elephant & Castle": (51.4943, -0.1001),
    "Kennington": (51.4884, -0.1053),
    "Vauxhall": (51.4861, -0.1233),
    "Nine Elms": (51.4800, -0.1280),
    "Battersea": (51.4700, -0.1600),
    "Clapham": (51.4618, -0.1384),
    "Clapham Common": (51.4618, -0.1384),
    "Clapham Junction": (51.4652, -0.1708),
    "Brixton": (51.4627, -0.1145),
    "Stockwell": (51.4723, -0.1228),
    "Oval": (51.4819, -0.1126),
    "Camberwell": (51.4730, -0.0920),
    "Peckham": (51.4735, -0.0573),
    "Bermondsey": (51.4980, -0.0630),
    "Rotherhithe": (51.5007, -0.0521),
    "Canada Water": (51.4982, -0.0498),
    "Deptford": (51.4780, -0.0270),
    "Greenwich": (51.4770, 0.0000),
    "North Greenwich": (51.5000, 0.0050),
    "Blackheath": (51.4670, 0.0080),
    "Lewisham": (51.4620, -0.0100),
    "Brockley": (51.4645, -0.0371),
    "New Cross": (51.4770, -0.0326),
    "Dulwich": (51.4450, -0.0850),
    "East Dulwich": (51.4580, -0.0750),
    "Herne Hill": (51.4530, -0.1010),
    "Forest Hill": (51.4393, -0.0528),
    "Crystal Palace": (51.4182, -0.0724),
    "Streatham": (51.4270, -0.1290),
    "Tooting": (51.4275, -0.1685),
    "Balham": (51.4431, -0.1525),
    "Wandsworth": (51.4570, -0.1910),
    "Earlsfield": (51.4420, -0.1860),
    "Putney": (51.4610, -0.2160),
    "Wimbledon": (51.4210, -0.2060),
    "Woolwich": (51.4897, 0.0662),
    "Abbey Wood": (51.4880, 0.1210),
    "Croydon": (51.3789, -0.0984),
    "South Croydon": (51.3600, -0.0920),
    "Worcester Park": (51.3780, -0.2440),
    "Kingston upon Thames": (51.4100, -0.3000),
    "Thames Ditton": (51.3930, -0.3340),

    # West London
    "Chelsea": (51.4870, -0.1680),
    "Kensington": (51.5009, -0.1918),
    "South Kensington": (51.4941, -0.1738),
    "Earl's Court": (51.4907, -0.1937),
    "Fulham": (51.4790, -0.2000),
    "Hammersmith": (51.4936, -0.2251),
    "Shepherd's Bush": (51.5054, -0.2265),
    "Shepherd’s Bush": (51.5054, -0.2265),
    "White City": (51.5120, -0.2250),
    "Notting Hill": (51.5090, -0.1963),
    "Ladbroke Grove": (51.5172, -0.2107),
    "Chiswick": (51.4920, -0.2550),
    "Acton": (51.5087, -0.2634),
    "North Acton": (51.5235, -0.2597),
    "Ealing": (51.5130, -0.3050),
    "Brentford": (51.4860, -0.3080),
    "Richmond": (51.4632, -0.3013),
    "Twickenham": (51.4460, -0.3350),
    "Harlesden": (51.5360, -0.2480),
    "Willesden": (51.5450, -0.2360),
    "Wembley": (51.5520, -0.2970),
    "Wembley Central": (51.5390, -0.2996),

    # Hertfordshire & Surrounding
    "Welwyn Garden City": (51.8005, -0.2052),
    "Welwyn": (51.8005, -0.2052),
    "Hertfordshire": (51.7800, -0.2400),
    "Hatfield": (51.7644, -0.2185),
    "St Albans": (51.7527, -0.3394),
    "Harpenden": (51.8150, -0.3540),
    "Hertford": (51.7960, -0.0780),
    "Watford": (51.6560, -0.3900),
    "Stevenage": (51.9018, -0.2066),
    "Hitchin": (51.9535, -0.2644),
    "Letchworth": (51.9803, -0.2291),
    "Elstree": (51.6500, -0.2980),
    "Borehamwood": (51.6580, -0.2750),
    "Radlett": (51.6840, -0.3180),
    "Bushey": (51.6440, -0.3600),
    "Abbots Langley": (51.7060, -0.4180),
    "Hemel Hempstead": (51.7530, -0.4720),
    "Bovingdon": (51.7220, -0.5360),
    "Berkhamsted": (51.7610, -0.5620),
    "Mill Hill": (51.6150, -0.2250),
    "Potters Bar": (51.6960, -0.1830),
    "Ware": (51.8100, -0.0300),
    "Broxbourne": (51.7500, -0.0200),
    "Hoddesdon": (51.7600, -0.0100),
    "Bishop's Stortford": (51.8700, 0.1600),
    "Luton": (51.8787, -0.4200),
    "Leighton Buzzard": (51.9165, -0.6617),
    "Bedford": (52.1386, -0.4667),
}

def clean_postcode(pc):
    return re.sub(r'\s+', '', pc).upper()

def bulk_lookup_postcodes(postcodes_list):
    """Bulk lookup UK postcodes using postcodes.io"""
    results = {}
    cleaned = list(set(clean_postcode(p) for p in postcodes_list if p))
    chunks = [cleaned[i:i + 100] for i in range(0, len(cleaned), 100)]
    
    for chunk in chunks:
        req = urllib.request.Request(
            "https://api.postcodes.io/postcodes",
            data=json.dumps({"postcodes": chunk}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if data.get("status") == 200:
                    for item in data.get("result", []):
                        query_pc = item.get("query")
                        res = item.get("result")
                        if res and "latitude" in res and "longitude" in res:
                            results[query_pc] = (res["latitude"], res["longitude"])
        except Exception as e:
            print(f"Error querying postcodes chunk: {e}")
        time.sleep(0.1)
    return results

def main():
    json_path = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.json"
    js_path = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.js"
    min_js_path = "/home/alectronic/go/github.com/alectronic0/alectronic-date/workshops_geo.min.js"

    with open(json_path, "r", encoding="utf-8") as f:
        workshops = json.load(f)

    print(f"Loaded {len(workshops)} workshops.")

    postcode_regex = re.compile(r'\b([A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2})\b', re.IGNORECASE)
    
    # 1. Collect all candidate postcodes from exact_location, location, description
    candidate_postcodes = set()
    for w in workshops:
        for fld in [w.get("exact_location", ""), w.get("description", ""), w.get("location", "")]:
            if fld:
                m = postcode_regex.search(fld)
                if m:
                    candidate_postcodes.add(clean_postcode(m.group(1)))

    print(f"Found {len(candidate_postcodes)} candidate postcodes. Querying postcodes.io...")
    postcode_map = bulk_lookup_postcodes(list(candidate_postcodes))
    print(f"Successfully resolved {len(postcode_map)} exact postcodes.")

    # 2. Re-geocode each workshop with high accuracy
    stats = {"postcode": 0, "neighborhood": 0, "mobile": 0, "approximate": 0}
    
    mobile_indicators = re.compile(r'comes to you|mobile|online|virtual|delivered|home kit|anywhere in uk|at your home', re.IGNORECASE)

    for w in workshops:
        title = w.get("title", "")
        desc = w.get("description", "")
        loc = w.get("location", "")
        exact_loc = w.get("exact_location", "")
        comp = w.get("company_teacher", "")
        
        full_text = f"{exact_loc} {desc} {loc} {title} {comp}"
        
        # Check if mobile / traveling teacher
        is_mobile = False
        if loc and ("comes to you" in loc.lower() or "/ mobile" in loc.lower()):
            is_mobile = True
        elif exact_loc and ("comes to you" in exact_loc.lower() or "mobile" in exact_loc.lower()):
            is_mobile = True
        elif mobile_indicators.search(title) or mobile_indicators.search(exact_loc):
            is_mobile = True

        # Check for exact postcode match
        resolved_coords = None
        
        # Check exact_location first for postcode
        if exact_loc:
            m = postcode_regex.search(exact_loc)
            if m and clean_postcode(m.group(1)) in postcode_map:
                resolved_coords = postcode_map[clean_postcode(m.group(1))]
                w["lat"] = resolved_coords[0]
                w["lng"] = resolved_coords[1]
                w["exact_coords"] = True
                w["location_precision"] = "postcode"
                stats["postcode"] += 1
                continue

        # Check description for postcode if not mobile
        if not is_mobile and desc:
            m = postcode_regex.search(desc)
            if m and clean_postcode(m.group(1)) in postcode_map:
                resolved_coords = postcode_map[clean_postcode(m.group(1))]
                w["lat"] = resolved_coords[0]
                w["lng"] = resolved_coords[1]
                w["exact_coords"] = True
                w["location_precision"] = "postcode"
                stats["postcode"] += 1
                continue

        # If it is mobile and has no fixed studio venue
        if is_mobile:
            w["exact_coords"] = False
            w["location_precision"] = "mobile"
            # Set default fallback coords
            w["lat"] = 51.5074
            w["lng"] = -0.1278
            stats["mobile"] += 1
            continue

        # If already has non-default coordinates from scraper with valid precision
        if w.get("lat") and w.get("lng"):
            if not (abs(w["lat"] - 51.5074) < 0.001 and abs(w["lng"] - (-0.1278)) < 0.001):
                if 51.2 <= w["lat"] <= 52.3 and -0.7 <= w["lng"] <= 0.4:
                    w["exact_coords"] = True
                    w["location_precision"] = "postcode"
                    stats["postcode"] += 1
                    continue

        # Check neighborhood dictionary
        matched_nh = None
        # Clean loc string
        cleaned_loc = re.sub(r'\s*/\s*Mobile', '', loc).strip()
        cleaned_loc = re.sub(r'\s*,\s*(?:East of England|South East|East Midlands|London|Greater London|UK|England)', '', cleaned_loc).strip()
        cleaned_loc = re.sub(r'^Central\s+', '', cleaned_loc).strip() # e.g. "Central Watford" -> "Watford"
        cleaned_loc = re.sub(r'\s+Garden$', ' Garden City', cleaned_loc).strip() # "Central Welwyn Garden" -> "Welwyn Garden City"
        cleaned_loc = re.sub(r'\s*&.*$', '', cleaned_loc).strip() # e.g. "Elephant & Castle & City Hall" -> "Elephant & Castle"
        
        if cleaned_loc in NEIGHBORHOOD_COORDS:
            matched_nh = cleaned_loc
        elif loc in NEIGHBORHOOD_COORDS:
            matched_nh = loc
        else:
            # Check if any neighborhood name is in loc or exact_loc
            for nh in NEIGHBORHOOD_COORDS:
                if re.search(r'\b' + re.escape(nh) + r'\b', loc, re.IGNORECASE) or re.search(r'\b' + re.escape(nh) + r'\b', exact_loc, re.IGNORECASE):
                    matched_nh = nh
                    break

        if matched_nh:
            lat, lng = NEIGHBORHOOD_COORDS[matched_nh]
            w["lat"] = lat
            w["lng"] = lng
            w["exact_coords"] = False
            w["location_precision"] = "neighborhood"
            stats["neighborhood"] += 1
            continue

        # Check description / title for landmark / area mentions
        found_in_text = None
        for nh in NEIGHBORHOOD_COORDS:
            if re.search(r'\b' + re.escape(nh) + r'\b', full_text, re.IGNORECASE):
                found_in_text = nh
                break
        
        if found_in_text:
            lat, lng = NEIGHBORHOOD_COORDS[found_in_text]
            w["lat"] = lat
            w["lng"] = lng
            w["exact_coords"] = False
            w["location_precision"] = "neighborhood"
            stats["neighborhood"] += 1
            continue

        # Fallback to approximate / Greater London
        w["lat"] = 51.5074
        w["lng"] = -0.1278
        w["exact_coords"] = False
        w["location_precision"] = "approximate"
        stats["approximate"] += 1

    print("Re-geocoding summary:", stats)

    # Verify outlier count
    outliers = [w for w in workshops if w.get("lat") and (w["lat"] < 51.2 or w["lat"] > 52.3 or w["lng"] < -0.6 or w["lng"] > 0.4)]
    print(f"Total outliers outside London/Herts bounding box: {len(outliers)}")

    # Write output files
    print("Writing workshops_geo.json...")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(workshops, f, indent=2, ensure_ascii=False)

    print("Writing workshops_geo.js...")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.WORKSHOPS_DATA = " + json.dumps(workshops, indent=2, ensure_ascii=False) + ";\n")

    print("Writing workshops_geo.min.js...")
    with open(min_js_path, "w", encoding="utf-8") as f:
        f.write("window.WORKSHOPS_DATA=" + json.dumps(workshops, separators=(',', ':'), ensure_ascii=False) + ";\n")

    print("All files successfully updated!")

if __name__ == "__main__":
    main()
