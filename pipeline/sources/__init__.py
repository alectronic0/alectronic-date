"""Source registry: bucket -> modules exposing `NAME` and `fetch() -> list[dict]`.

A module may also expose:
- `owns(record) -> bool`: the source is authoritative for these records, so hand-added
  ones are handed over to it (they age out like scraped records once it stops listing them).
- `VERIFIES_URLS = True`: every record's `url` was fetched successfully during fetch(),
  so the gate skips re-checking it.
- `health(items, bucket) -> {key: None | "reason"}` to strike records it has checked
  (used by spots to catch closed venues).

An empty list means the bucket is not refreshed. ClassBento, Eventbrite, Fever, DesignMyNight,
Time Out, Secret London and Fatsoma forbid automated collection in their terms (audit 2026-11-07),
so their modules are kept for reference but deliberately not registered.
"""

from sources import adventure_cinema

SOURCES = {
    "classes": [],
    "cinema": [adventure_cinema],
    "nerd": [],
    # Singles events now come from the events API; scraping them here would repopulate the saved list.
    "singles": [],
    "spots": [],
    "activities": [],
}
