"""Merge a fresh scrape into an existing list without ever trusting a single bad run.

Records with no `origin` are hand-curated ("manual"): their text is never rewritten,
they only collect `misses`/`flag` from health checks. Scraped records carry
`origin: "auto"` plus firstSeen/lastSeen and are refreshed from each scrape.
Anything with `misses >= MAX_MISSES` or a past `endDate` is dropped.
"""

from dataclasses import dataclass, field

MAX_MISSES = 2
TRACKING = ("origin", "firstSeen", "lastSeen", "misses", "flag")


def label(record):
    return record.get("name") or record.get("title") or record.get("id") or "?"


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


def _refresh_auto(old, new, today):
    merged = {**new, "origin": "auto", "firstSeen": old.get("firstSeen", today), "lastSeen": today}
    changed = {k: v for k, v in merged.items() if k not in TRACKING} != {k: v for k, v in old.items() if k not in TRACKING}
    return merged, changed


def merge(bucket, existing, scraped, today, scrape_ran=True, health=None):
    """health: {key: None (healthy) | "reason" (failed)} for records that were checked."""
    health = health or {}
    changes = Changes()
    seen = set()
    by_key = {bucket.key(r): dict(r) for r in existing}
    order = list(by_key)

    for record in scraped:
        key = bucket.key(record)
        if key in seen:
            continue
        seen.add(key)
        old = by_key.get(key)
        if old is None:
            by_key[key] = {**record, "origin": "auto", "firstSeen": today, "lastSeen": today}
            order.append(key)
            changes.added.append(label(record))
            continue
        if is_manual(old):
            continue
        by_key[key], changed = _refresh_auto(old, record, today)
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
        if record.get("endDate") and record["endDate"] < today:
            changes.expired.append(label(record))
            continue
        if record.get("misses", 0) >= MAX_MISSES:
            changes.removed.append(f"{label(record)} ({record.get('flag')})")
            continue
        kept.append(record)
    return kept, changes
