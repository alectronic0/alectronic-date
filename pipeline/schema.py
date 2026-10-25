"""Per-bucket record contract: where it lives, how it is keyed, what it must contain."""

import re
from dataclasses import dataclass, field
from urllib.parse import urlsplit


def normalise(text):
    return re.sub(r"[^a-z0-9]+", " ", (text or "").lower()).strip()


def url_key(url):
    parts = urlsplit(url or "")
    return f"{parts.netloc.lower().removeprefix('www.')}{parts.path.rstrip('/')}"


@dataclass(frozen=True)
class Bucket:
    name: str
    target: str  # "labs:<section>" or "geo:<dataset>"
    required: tuple
    key_fields: tuple
    dated: bool = False
    undated_ok: tuple = field(default_factory=tuple)  # (field, value-substring) pairs exempt from endDate
    pin_fields: tuple = field(default_factory=tuple)  # kept from the old record when it has exact_coords and the new one doesn't
    end_field: str = "endDate"  # records past this ISO date expire
    key_by_url: bool = False  # ids changed format between scrapers; URLs did not

    def key(self, record):
        if self.key_by_url and record.get("url"):
            return f"url:{url_key(record['url'])}"
        if record.get("id"):
            scope = f"{record['source']}:" if record.get("source") else ""
            return f"id:{scope}{record['id']}"
        if record.get("url") and "url" in self.key_fields:
            return f"url:{url_key(record['url'])}"
        return "name:" + "|".join(normalise(str(record.get(f, ""))) for f in self.key_fields)

    def is_undated_ok(self, record):
        for fld, needle in self.undated_ok:
            if needle.lower() in str(record.get(fld, "")).lower():
                return True
        return False

    def errors(self, record):
        problems = [f"missing {f}" for f in self.required if record.get(f) in (None, "")]
        if self.dated and not record.get(self.end_field) and not self.is_undated_ok(record):
            problems.append("missing endDate")
        return problems


BUCKETS = {
    "classes": Bucket(
        "classes", "geo:workshops", ("id", "title", "url"), ("url",),
        pin_fields=("exact_location", "lat", "lng", "exact_coords", "location_precision"),
    ),
    "cinema": Bucket("cinema", "labs:cinemaEvents", ("name", "url", "provider"), ("name", "provider"), dated=True),
    "nerd": Bucket(
        "nerd", "labs:nerdGatherings", ("name", "url", "host"), ("name", "host"),
        dated=True, undated_ok=(("approxMonth", "weekly"), ("season", "ongoing")),
    ),
    "activities": Bucket(
        "activities", "geo:activities", ("id", "title", "url", "source"), ("url",),
        end_field="end_date", key_by_url=True,
    ),
    "singles": Bucket(
        "singles", "labs:singlesGuide", ("name", "url", "hostName", "startDate"), ("name", "startDate"), dated=True,
    ),
    "spots": Bucket("spots", "labs:dateIdeas", ("name", "url", "category"), ("name", "location")),
}
