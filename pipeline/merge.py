"""Merge a fresh scrape into an existing list without ever trusting a single bad run.

Records with no `origin` are hand-curated ("manual"): their text is never rewritten,
they only collect `misses`/`flag` from health checks. Scraped records carry
`origin: "auto"` plus firstSeen/lastSeen and are refreshed from each scrape.
Anything with `misses >= MAX_MISSES` or a past `endDate` is dropped.
"""

import datetime
import re
from dataclasses import dataclass, field

MAX_MISSES = 2
TRACKING = ("origin", "firstSeen", "lastSeen", "misses", "flag")
SAME_EVENT_DAYS = 3
SAME_EVENT_OVERLAP = 0.6
FILLER_WORDS = {"the", "a", "an", "and", "of", "at", "in", "on", "to", "for", "with", "presents",
                "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "weekend"}


def label(record):
    return record.get("name") or record.get("title") or record.get("id") or "?"


def name_tokens(record):
    words = re.findall(r"[a-z0-9]+", label(record).lower())
    return {w for w in words if w not in FILLER_WORDS}


def same_event(a, b):
    """Two listings of one dated event: e.g. 'LFCC 2027 - Saturday' vs the hand-added 'London Film & Comic Con (LFCC 2027)'."""
    if not a.get("endDate") or not b.get("endDate"):
        return False
    gap = abs(datetime.date.fromisoformat(a["endDate"]) - datetime.date.fromisoformat(b["endDate"]))
    if gap.days > SAME_EVENT_DAYS:
        return False
    ta, tb = name_tokens(a), name_tokens(b)
    return bool(ta and tb) and len(ta & tb) / max(len(ta), len(tb)) >= SAME_EVENT_OVERLAP


def is_manual(record):
    return record.get("origin") != "auto"


@dataclass
class Changes:
    added: list = field(default_factory=list)
    updated: list = field(default_factory=list)
    removed: list = field(default_factory=list)
    expired: list = field(default_factory=list)
    flagged: list = field(default_factory=list)

    def any(self):
        return any((self.added, self.updated, self.removed, self.expired))


def _strike(record, reason):
    record["misses"] = record.get("misses", 0) + 1
    record["flag"] = reason


def _clear_strikes(record):
    record.pop("misses", None)
    record.pop("flag", None)


def _refresh_auto(bucket, old, new, today):
    merged = {**new, "origin": "auto", "firstSeen": old.get("firstSeen", today), "lastSeen": today}
    if old.get("exact_coords") and not new.get("exact_coords"):
        merged.update({k: old[k] for k in bucket.pin_fields if k in old})
    changed = {k: v for k, v in merged.items() if k not in TRACKING} != {k: v for k, v in old.items() if k not in TRACKING}
    return merged, changed


def merge(bucket, existing, scraped, today, scrape_ran=True, health=None):
    """health: {key: None (healthy) | "reason" (failed)} for records that were checked."""
    health = health or {}
    changes = Changes()
    seen = set()
    by_key = {bucket.key(r): dict(r) for r in existing}
    order = list(by_key)
    # Scraped records age out on their own; near-duplicates only matter against hand-curated
    # entries and against siblings in this same scrape (e.g. Saturday/Sunday tickets).
    dedupe_pool = [r for r in by_key.values() if is_manual(r)]

    for record in scraped:
        key = bucket.key(record)
        if key in seen:
            continue
        seen.add(key)
        old = by_key.get(key)
        if old is None and bucket.dated and any(same_event(record, other) for other in dedupe_pool):
            continue
        if old is None:
            by_key[key] = {**record, "origin": "auto", "firstSeen": today, "lastSeen": today}
            dedupe_pool.append(by_key[key])
            order.append(key)
            changes.added.append(label(record))
            continue
        if is_manual(old):
            continue
        by_key[key], changed = _refresh_auto(bucket, old, record, today)
        if changed:
            changes.updated.append(label(record))

    for key in order:
        record = by_key[key]
        if key in health:
            reason = health[key]
            if reason is None:
                _clear_strikes(record)
            else:
                _strike(record, reason)
                changes.flagged.append(f"{label(record)}: {reason}")
            continue
        if is_manual(record) or key in seen or not scrape_ran:
            continue
        _strike(record, "not seen in latest scrape")

    kept = []
    for key in order:
        record = by_key[key]
        end = record.get(bucket.end_field)
        if end and end[:10] < today:
            changes.expired.append(label(record))
            continue
        if record.get("misses", 0) >= MAX_MISSES:
            changes.removed.append(f"{label(record)} ({record.get('flag')})")
            continue
        kept.append(record)
    return kept, changes
