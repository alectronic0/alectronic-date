"""Source registry: bucket -> modules exposing `NAME` and `fetch() -> list[dict]`.

A module may also expose `health(items, bucket) -> {key: None | "reason"}` to strike
records it has checked (used by spots to catch closed venues).
"""

SOURCES = {
    "classes": [],
    "cinema": [],
    "nerd": [],
    "spots": [],
}
