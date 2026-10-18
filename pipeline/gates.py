"""Checks that must pass before a bucket is written. Any failure blocks that bucket only.

Copy rules apply to scraped (`origin: auto`) records; hand-curated text is Alec's call.
"""

import ipaddress
import json
import socket
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit

RULES = json.loads((Path(__file__).parent / "config" / "rules.json").read_text(encoding="utf-8"))
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def is_public_http(url):
    parts = urlsplit(url or "")
    if parts.scheme not in ("http", "https") or not parts.hostname:
        return False
    try:
        addresses = {info[4][0] for info in socket.getaddrinfo(parts.hostname, None)}
    except OSError:
        return False
    return all(ipaddress.ip_address(a.split("%")[0]).is_global for a in addresses)


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
        is_link = key == "url" or key.endswith("Url")
        if is_link and value and not str(value).startswith(("https://", "http://")):
            hits.append(f"{key} is not http(s)")
    return hits


def check(bucket, before, after, added_keys, status=url_status):
    errors = []
    old_urls = {bucket.key(r): r.get("url") for r in before}
    if before:
        drop = 1 - len(after) / len(before)
        if drop > RULES["maxCountDrop"]:
            errors.append(f"count dropped {drop:.0%} ({len(before)} -> {len(after)})")

    for record in after:
        if record.get("origin") != "auto":
            continue
        name = record.get("name") or record.get("title")
        for problem in bucket.errors(record):
            errors.append(f"{name}: {problem}")
        for word in banned_hits(record):
            errors.append(f"{name}: banned text {word!r}")
        for problem in unsafe_hits(record):
            errors.append(f"{name}: {problem}")
        key = bucket.key(record)
        if key not in added_keys and old_urls.get(key) == record.get("url"):
            continue
        code = status(record["url"])
        if code not in RULES["okStatus"]:
            errors.append(f"{name}: url {record['url']} returned {code}")
    return errors
