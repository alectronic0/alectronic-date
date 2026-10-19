"""Byte-exact read/write of the labs datasets.

labs-content.js is `<header>Object.assign(window.CONTENT, <json>);<footer>` and the
*_geo files are plain JSON plus a `window.X = <json>;` mirror, all dumped with
json.dumps(indent=2, ensure_ascii=False).
"""

import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LABS_CONTENT = REPO / "js" / "labs-content.js"
LABS_PREFIX = "Object.assign(window.CONTENT, "

GEO_DATASETS = {
    "workshops": ("workshops_geo.json", "workshops_geo.js", "WORKSHOPS_DATA"),
    "activities": ("london_activities_geo.json", "london_activities_geo.js", "LONDON_ACTIVITIES_DATA"),
}
GEO_HEADERS = {"activities": "// High-Precision London Activities Dataset\n"}


def dumps(obj):
    return json.dumps(obj, indent=2, ensure_ascii=False)


class LabsContent:
    def __init__(self, path=LABS_CONTENT):
        self.path = Path(path)
        text = self.path.read_text(encoding="utf-8")
        start = text.index(LABS_PREFIX) + len(LABS_PREFIX)
        self.data, end = json.JSONDecoder().raw_decode(text, start)
        self._head = text[:start]
        self._tail = text[end:]

    def render(self):
        return self._head + dumps(self.data) + self._tail

    def save(self):
        self.path.write_text(self.render(), encoding="utf-8")

    def items(self, section):
        return self.data[section]["items"]

    def set_items(self, section, items):
        self.data[section]["items"] = items


def load_geo(name):
    json_name, _, _ = GEO_DATASETS[name]
    return json.loads((REPO / json_name).read_text(encoding="utf-8"))


def save_geo(name, records):
    json_name, js_name, var = GEO_DATASETS[name]
    body = dumps(records)
    (REPO / json_name).write_text(body, encoding="utf-8")
    header = GEO_HEADERS.get(name, "")
    (REPO / js_name).write_text(f"{header}window.{var} = {body};\n", encoding="utf-8")
