"""Source registry: bucket -> modules exposing `NAME` and `fetch() -> list[dict]`.

A module may also expose:
- `owns(record) -> bool`: the source is authoritative for these records, so hand-added
  ones are handed over to it (they age out like scraped records once it stops listing them).
- `health(items, bucket) -> {key: None | "reason"}` to strike records it has checked
  (used by spots to catch closed venues).
"""

from sources import adventure_cinema, eventbrite, fever

SOURCES = {
    "classes": [],
    "cinema": [fever, adventure_cinema],
    "nerd": [eventbrite],
    "spots": [],
}
