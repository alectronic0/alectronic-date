"""Checks that must pass before a bucket is written. Any failure blocks that bucket only.

Copy rules apply to scraped (`origin: auto`) records; hand-curated text is Alec's call.
"""

import json
import urllib.error
import urllib.request
from pathlib import Path

RULES = json.loads((Path(__file__).parent / "config" / "rules.json").read_text(encoding="utf-8"))
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def url_status(url, timeout=8):
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


def check(bucket, before, after, added_keys, status=url_status):
    errors = []
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
        if bucket.key(record) not in added_keys:
            continue
        code = status(record["url"])
        if code not in RULES["okStatus"]:
            errors.append(f"{name}: url {record['url']} returned {code}")
    return errors
