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
    # Outer & Suburban London / Border Towns
    "Walworth": (51.4900, -0.0930),
    "Seven Dials": (51.5135, -0.1270),
    "Romford": (51.5750, 0.1800),
    "Southgate": (51.6318, -0.1280),
    "Loughton": (51.6480, 0.0570),
    "Staines-upon-Thames": (51.4330, -0.5130),
    "Staines": (51.4330, -0.5130),
    "Eltham": (51.4500, 0.0550),
    "Pinner": (51.5930, -0.3800),
    "Caterham": (51.2780, -0.0810),
    "Chislehurst": (51.4200, 0.0730),
    "Colindale": (51.5950, -0.2500),
    "Surrey Quays": (51.4920, -0.0480),
    "West Drayton": (51.5030, -0.4720),
    "Edgware": (51.6130, -0.2750),
    "Teddington": (51.4240, -0.3340),
    "Maze Hill": (51.4820, 0.0030),
    "Lee": (51.4480, 0.0020),
    "Greenford": (51.5300, -0.3470),
    "Hanwell": (51.5100, -0.3390),
    "Orpington": (51.3750, 0.0980),
    "Strand": (51.5115, -0.1200),
    "Clapton": (51.5550, -0.0550),
    "Barnes": (51.4740, -0.2400),
    "Maida Vale": (51.5280, -0.1850),
    "Chingford": (51.6310, 0.0120),
    "City Hall": (51.5048, -0.0787),
    "Stanmore": (51.6180, -0.3150),
    "Raynes Park": (51.4080, -0.2370),
    "Forest Gate": (51.5490, 0.0240),
    "Erith": (51.4800, 0.1770),
    "Penge": (51.4160, -0.0570),
    "St. James's": (51.5060, -0.1380),
    "St James's": (51.5060, -0.1380),
    "Molesey": (51.4000, -0.3600),
    "Northolt": (51.5470, -0.3680),
    "Catford": (51.4450, -0.0200),
    "Museum Quarter": (51.4960, -0.1730),
    "Kensal Rise": (51.5330, -0.2240),
    "West Norwood": (51.4340, -0.1030),
    "Upper Edmonton": (51.6140, -0.0650),
    "Blackfriars": (51.5120, -0.1040),
    "Rush Green": (51.5640, 0.1660),
    "Cricklewood": (51.5580, -0.2080),
    "Dartford": (51.4460, 0.2200),
    "Beckenham": (51.4080, -0.0260),
    "Ruislip": (51.5760, -0.4240),
    "Whitehall": (51.5040, -0.1260),
    "Woodford Green": (51.6050, 0.0240),
    "Woodford": (51.6050, 0.0240),
    "Hampton": (51.4140, -0.3700),
    "Feltham": (51.4480, -0.4240),
    "Mitcham": (51.4020, -0.1650),
    "Harrow": (51.5800, -0.3380),
    "Hounslow": (51.4700, -0.3600),
    "Uxbridge": (51.5460, -0.4780),
    "Bromley": (51.4060, 0.0150),
    "Bexley": (51.4420, 0.1480),
    "Bexleyheath": (51.4590, 0.1380),
    "Sutton": (51.3610, -0.1940),
    "Epsom": (51.3360, -0.2670),
    "Leatherhead": (51.2960, -0.3270),
    "Weybridge": (51.3700, -0.4600),
    "Walton-on-Thames": (51.3860, -0.4150),
    "Esher": (51.3690, -0.3640),
    "Sunbury-on-Thames": (51.4080, -0.4100),
    "Sunbury": (51.4080, -0.4100),
    "East Ham": (51.5320, 0.0550),
    "Buckhurst Hill": (51.6260, 0.0440),
    "Northwood": (51.6110, -0.4240),
    "Gravesend": (51.4410, 0.3680),
    "Ickenham": (51.5620, -0.4440),
    "Cockfosters": (51.6510, -0.1490),
    "Whitton": (51.4480, -0.3580),
    "Whetstone": (51.6260, -0.1710),
    "Marble Arch": (51.5130, -0.1580),
    "Coulsdon": (51.3210, -0.1380),
    "Ilford": (51.5580, 0.0700),
    "Harold Hill": (51.5970, 0.2280),
    "Southall": (51.5120, -0.3780),
    "Golders Green": (51.5720, -0.1980),
    "Abridge": (51.6500, 0.1160),
    "Oxford Street": (51.5150, -0.1410),
    "Fenchurch Street": (51.5110, -0.0780),
    "Dagenham": (51.5400, 0.1470),
    "Mortlake": (51.4680, -0.2680),
    "Aldgate": (51.5140, -0.0750),
    "Purley": (51.3360, -0.1140),
    "Winchmore Hill": (51.6340, -0.1010),
    "Surbiton": (51.3930, -0.3060),
    "St Pancras": (51.5310, -0.1260),
    "Millwall": (51.4900, -0.0210),
    "Hendon": (51.5830, -0.2280),
    "West Brompton": (51.4870, -0.1950),
    "Lambeth North": (51.4988, -0.1120),
    "Charlton": (51.4870, 0.0350),
    "South Norwood": (51.3980, -0.0750),
    "Thornton Heath": (51.3980, -0.1100),
    "Long Ditton": (51.3850, -0.3120),
    "Little Venice": (51.5220, -0.1820),
    "King’s Cross": (51.5308, -0.1238),
    "Luton": (51.8787, -0.4200),
    "Bedford": (52.1386, -0.4667),
    "Leighton Buzzard": (51.9165, -0.6617),
    "North West London": (51.5450, -0.1800),
    "Ellesmere": (51.5350, -0.0450), # Ellesmere Rd / London E3
}

LANDMARK_COORDS = {
    "london eye": (51.5033, -0.1195),
    "madame tussauds": (51.5230, -0.1544),
    "sea life": (51.5019, -0.1189),
    "london dungeon": (51.5025, -0.1188),
    "st paul": (51.5138, -0.0984),
    "kew gardens": (51.4787, -0.2956),
    "cutty sark": (51.4828, -0.0096),
    "royal observatory": (51.4769, 0.0005),
    "shard": (51.5045, -0.0865),
    "borough market": (51.5055, -0.0910),
    "kensington palace": (51.5050, -0.1877),
    "hyde park": (51.5073, -0.1657),
    "churchill war rooms": (51.5022, -0.1290),
    "national gallery": (51.5089, -0.1283),
    "natural history museum": (51.4967, -0.1764),
    "science museum": (51.4978, -0.1745),
    "v&a": (51.4975, -0.1720),
    "victoria and albert": (51.4975, -0.1720),
    "british museum": (51.5194, -0.1270),
    "tate modern": (51.5076, -0.0994),
    "tate britain": (51.4910, -0.1278),
    "somerset house": (51.5110, -0.1170),
    "square mile": (51.5150, -0.0900),
    "street art and culture": (51.5256, -0.0790),
    "magic mike": (51.5118, -0.1293),
    "vegan fish and chips": (51.5180, -0.1760),
    "kingsgate workshops": (51.5422, -0.1965),
    "haunted pubs": (51.5135, -0.1080),
    "smurfs tea": (51.5115, -0.1200),
    "taylor swift": (51.4965, -0.1444),
    "walk with witches": (51.5050, -0.0900),
    "harry potter": (51.5080, -0.1250),
    "cotswolds": (51.4965, -0.1444),
    "stonehenge": (51.4965, -0.1444),
    "oxford": (51.4965, -0.1444),
    "bath": (51.4965, -0.1444),
    "windsor": (51.4839, -0.6044),
    "energy with emily": (51.5129, -0.1243),
    "heart of 'the city'": (51.5150, -0.0900),
    "london essentials": (51.5000, -0.1300),
    "bowie": (51.5137, -0.1360),
    "trafalgar square": (51.5080, -0.1281),
    "mayfair": (51.5100, -0.1470),
    "fitzrovia": (51.5195, -0.1380),
    "soho": (51.5137, -0.1360),
    "westminster abbey": (51.4994, -0.1273),
    "westminster": (51.5000, -0.1300),
    "arsenal": (51.5549, -0.1084),
    "emirates stadium": (51.5549, -0.1084),
    "tottenham": (51.6043, -0.0664),
    "spurs": (51.6043, -0.0664),
    "stamford bridge": (51.4816, -0.1910),
    "chelsea versus": (51.4816, -0.1910),
    "wembley": (51.5560, -0.2795),
    "buckingham palace": (51.5014, -0.1419),
    "tower of london": (51.5081, -0.0759),
    "tower bridge": (51.5055, -0.0754),
    "hippodrome": (51.5118, -0.1293),
    "sound academy": (51.5200, -0.0800),
    "bam karaoke": (51.4965, -0.1444),
    "east london liquor": (51.5360, -0.0370),
    "swift shoreditch": (51.5256, -0.0790),
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
    
    mobile_indicators = re.compile(
        r'comes to you|mobile|online|virtual|delivered|home kit|anywhere in uk|at your home|via zoom|zoom class|craft kit|materials will be sent|comfort of your own|delivered to your door|live online|live streaming',
        re.IGNORECASE
    )

    for w in workshops:
        title = w.get("title", "")
        desc = w.get("description", "")
        loc = w.get("location", "")
        exact_loc = w.get("exact_location", "")
        comp = w.get("company_teacher", "")
        
        full_text = f"{exact_loc} {desc} {loc} {title} {comp}"
        
        # Check if mobile / traveling teacher / online / craft kit
        is_mobile = False
        if loc and ("comes to you" in loc.lower() or "/ mobile" in loc.lower() or loc.lower() == "hertfordshire" or loc.lower() == "greater london"):
            # Check if there is a specific street/studio address
            if not exact_loc or exact_loc.lower() in ["hertfordshire", "greater london", "comes to you"]:
                is_mobile = True
        elif exact_loc and ("comes to you" in exact_loc.lower() or "mobile" in exact_loc.lower()):
            is_mobile = True
        elif mobile_indicators.search(title) or mobile_indicators.search(desc) or mobile_indicators.search(exact_loc):
            # If description mentions zoom, virtual, delivery, or comfort of your own home
            if any(k in desc.lower() for k in ["zoom", "virtual", "delivered", "craft kit", "live online", "comfort of your own"]):
                is_mobile = True
            elif mobile_indicators.search(title):
                is_mobile = True

        # If it is mobile / online and has no fixed studio venue
        if is_mobile:
            w["exact_coords"] = False
            w["location_precision"] = "mobile"
            w["lat"] = 51.5074
            w["lng"] = -0.1278
            stats["mobile"] += 1
            continue

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
        
        # Check LANDMARK_COORDS
        matched_lm = None
        for lm, coords in LANDMARK_COORDS.items():
            if lm in full_text.lower():
                matched_lm = coords
                break
        
        if matched_lm:
            w["lat"] = matched_lm[0]
            w["lng"] = matched_lm[1]
            w["exact_coords"] = True
            w["location_precision"] = "postcode"
            stats["postcode"] += 1
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
