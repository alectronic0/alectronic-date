"""Source registry: bucket -> modules exposing `NAME` and `fetch() -> list[dict]`.

A module may also expose:
- `owns(record) -> bool`: the source is authoritative for these records, so hand-added
  ones are handed over to it (they age out like scraped records once it stops listing them).
- `VERIFIES_URLS = True`: every record's `url` was fetched successfully during fetch(),
  so the gate skips re-checking it.
- `health(items, bucket) -> {key: None | "reason"}` to strike records it has checked
  (used by spots to catch closed venues).
"""

from sources import (
    adventure_cinema, airbnb, art_dating_club, classbento, designmynight, eventbrite, eventbrite_london,
    fatsoma, fever, fever_london, fig, haystack, its_a_date, secretlondon, sparked_connection, timeout,
)

SOURCES = {
    "classes": [classbento, airbnb],
    "cinema": [fever, adventure_cinema],
    "nerd": [eventbrite],
    # Eventbrite, Thursday and Be Dating Beautiful are not cleared for scraping (terms ban it, or permission is pending).
    # Their modules stay on disk but must not return to this list until that is resolved.
    "singles": [haystack, fig, art_dating_club, its_a_date, sparked_connection],
    "spots": [],
    "activities": [designmynight, timeout, secretlondon, fever_london, fatsoma, eventbrite_london],
}
