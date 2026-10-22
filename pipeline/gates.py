"""Checks before a bucket is written. Record-level failures hold back just that record;
bucket-level failures (count drop) block the bucket's write.

Copy rules apply to scraped (`origin: auto`) records; hand-curated text is Alec's call.
"""

import functools
import ipaddress
import json
import socket
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit

from merge import TRACKING

RULES = json.loads((Path(__file__).parent / "config" / "rules.json").read_text(encoding="utf-8"))
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


@functools.lru_cache(maxsize=4096)
def host_is_public(hostname):
    try:
        addresses = {info[4][0] for info in socket.getaddrinfo(hostname, None)}
    except OSError:
        return False
    return bool(addresses) and all(ipaddress.ip_address(a.split("%")[0]).is_global for a in addresses)


def is_public_http(url):
    parts = urlsplit(url or "")
    if parts.scheme not in ("http", "https") or not parts.hostname:
        return False
    return host_is_public(parts.hostname)


def url_status(url, timeout=8):
    if not is_public_http(url):
        return None
    opener = urllib.request.build_opener(NoRedirect)
    request = urllib.request.Request(url, method="GET", headers={"User-Agent": USER_AGENT})
    try:
        with opener.open(request, timeout=timeout) as response:
            return response.status
    except urllib.error.HTTPError as err:
        return err.code
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None


def banned_hits(record):
    text = json.dumps(record, ensure_ascii=False).lower()
    return [word for word in RULES["bannedSubstrings"] if word.lower() in text]


def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for v in value.values():
            yield from strings(v)
    elif isinstance(value, list):
        for v in value:
            yield from strings(v)


def unsafe_hits(record):
    """Labs pages interpolate fields raw into innerHTML and double-quoted attributes, so
    scraped text must not carry tag or attribute-breakout characters. Apostrophes are
    safe there (no single-quoted attribute takes data) and common in names."""
    hits = []
    if any(ch in text for text in strings(record) for ch in '<>"`'):
        hits.append("contains markup or quote characters")
    for key, value in record.items():
        is_link = key == "url" or key.endswith(("Url", "_url"))
        if is_link and value and not str(value).startswith(("https://", "http://")):
            hits.append(f"{key} is not http(s)")
    return hits


def record_problems(bucket, record, check_url, status, public=is_public_http):
    problems = list(bucket.errors(record))
    if record.get("url") and not public(record["url"]):
        problems.append(f"url {record['url']} is not a public http(s) address")
    problems += [f"banned text {word!r}" for word in banned_hits(record)]
    problems += unsafe_hits(record)
    if check_url and not problems:
        code = status(record["url"])
        if code not in RULES["okStatus"]:
            problems.append(f"url {record['url']} returned {code}")
    return problems


def content(record):
    return {k: v for k, v in record.items() if k not in TRACKING}


def quarantine(bucket, before, after, added_keys, status=url_status, verified=frozenset(), public=is_public_http):
    """Hold back scraped records that fail a check: new ones are dropped, refreshed ones
    revert to their previous version. Returns (records to publish, held-back reasons)."""
    previous = {bucket.key(r): r for r in before}
    kept, held = [], []
    for record in after:
        if record.get("origin") != "auto":
            kept.append(record)
            continue
        key = bucket.key(record)
        # Unseen records keep their old content; reverting them would be a no-op.
        if content(previous.get(key, {})) == content(record):
            kept.append(record)
            continue
        url_changed = previous.get(key, {}).get("url") != record.get("url")
        check_url = key not in verified and (key in added_keys or url_changed)
        problems = record_problems(bucket, record, check_url, status, public)
        if not problems:
            kept.append(record)
            continue
        held.append(f"{record.get('name') or record.get('title')}: {'; '.join(problems)}")
        if key in previous:
            kept.append(previous[key])
    return kept, held


def check(bucket, before, after):
    """Bucket-level gate: blocks the whole write."""
    if not before:
        return []
    drop = 1 - len(after) / len(before)
    if drop > RULES["maxCountDrop"]:
        return [f"count dropped {drop:.0%} ({len(before)} -> {len(after)})"]
    return []
