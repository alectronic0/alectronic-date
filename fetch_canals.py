import urllib.request
import urllib.parse
import json

overpass_url = "https://overpass-api.de/api/interpreter"
overpass_query = """
[out:json][timeout:25];
area["name"="Greater London"]->.searchArea;
(
  way["waterway"="canal"](area.searchArea);
  way["waterway"="river"]["boat"="yes"](area.searchArea);
);
out geom;
"""

print("Fetching data from Overpass API...")
data = urllib.parse.urlencode({'data': overpass_query}).encode('utf-8')
req = urllib.request.Request(overpass_url, data=data, headers={"User-Agent": "AlectronicDate/1.0"})
try:
    response = urllib.request.urlopen(req)
    result = json.loads(response.read().decode('utf-8'))
    
    features = []
    for element in result['elements']:
        if element['type'] == 'way':
            coords = [[node['lon'], node['lat']] for node in element['geometry']]
            props = element.get('tags', {})
            # Only keep major ones or just keep them all. The trust manages most of them.
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coords
                },
                "properties": props
            })
            
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    with open('js/canals.geojson', 'w') as f:
        json.dump(geojson, f)
        
    print(f"Saved {len(features)} waterways to js/canals.geojson")
except Exception as e:
    print(f"Error: {e}")
