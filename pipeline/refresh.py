#!/usr/bin/env python3
"""Scan every labs source, merge, gate, write, smoke-test, commit and push.

    python3 pipeline/refresh.py                     # all buckets, publishes
    python3 pipeline/refresh.py --only cinema,nerd
    python3 pipeline/refresh.py --dry-run           # report only, no writes
    python3 pipeline/refresh.py --no-push           # write + commit, no push
    python3 pipeline/refresh.py --no-commit         # write + smoke test only
"""

import argparse
import contextlib
import datetime
import json
import os
import socket
import subprocess
import sys
import time
import traceback
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import dating_ratings  # noqa: E402
import gates  # noqa: E402
import io_content  # noqa: E402
import report  # noqa: E402
import sync  # noqa: E402
from merge import Changes, merge  # noqa: E402
from schema import BUCKETS  # noqa: E402
from sources import SOURCES  # noqa: E402

REPO = io_content.REPO
SMOKE_PORT = 8765


def git(*args, check=True):
    return subprocess.run(["git", *args], cwd=REPO, check=check, capture_output=True, text=True).stdout


def target_files(bucket):
    kind, name = bucket.target.split(":")
    if kind == "labs":
        return [io_content.LABS_CONTENT.relative_to(REPO).as_posix()]
    json_name, js_name, _ = io_content.GEO_DATASETS[name]
    return [json_name, js_name]


class Store:
    """Loads each target once so several buckets can share labs-content.js."""

    def __init__(self):
        self.labs = None
        self.dirty = set()

    def load(self, bucket):
        kind, name = bucket.target.split(":")
        if kind == "geo":
            return io_content.load_geo(name)
        self.labs = self.labs or io_content.LabsContent()
        return self.labs.items(name)

    def put(self, bucket, items):
        kind, name = bucket.target.split(":")
        if kind == "geo":
            io_content.save_geo(name, items)
        else:
            self.labs.set_items(name, items)
            self.dirty.add("labs")

    def flush(self):
        if "labs" in self.dirty:
            self.labs.save()


def hand_over(existing, module):
    """Hand-added records a working source is authoritative for become scraped records."""
    if not hasattr(module, "owns"):
        return
    for record in existing:
        if record.get("origin") != "auto" and module.owns(record):
            record["origin"] = "auto"


def collect(bucket, existing):
    scraped, health, errors, verified = [], {}, [], set()
    for module in SOURCES[bucket.name]:
        try:
            records = module.fetch()
            scraped += records
            if getattr(module, "VERIFIES_URLS", False):
                verified |= {bucket.key(r) for r in records}
            hand_over(existing, module)
            if hasattr(module, "health"):
                health.update(module.health(existing, bucket))
        except Exception as err:  # one broken source must not sink the bucket
            errors.append(f"{module.NAME}: {err}")
            traceback.print_exc()
    return scraped, health, errors, verified


def run_bucket(bucket, store, today, write):
    existing = [dict(r) for r in store.load(bucket)]
    result = {"bucket": bucket.name, "before": len(existing), "after": len(existing), "changes": Changes(),
              "source_errors": [], "gate_errors": [], "held_back": [], "status": "no sources"}
    if not SOURCES[bucket.name]:
        return result

    scraped, health, result["source_errors"], verified = collect(bucket, existing)
    scrape_ran = bool(scraped) and not result["source_errors"]
    merged, changes = merge(bucket, existing, scraped, today, scrape_ran=scrape_ran, health=health)
    result.update(changes=changes, after=len(merged))

    added_keys = {bucket.key(r) for r in merged if r.get("firstSeen") == today and r.get("origin") == "auto"}
    live_before = [r for r in existing if not r.get(bucket.end_field) or r[bucket.end_field][:10] >= today]
    merged, result["held_back"] = gates.quarantine(bucket, live_before, merged, added_keys, verified=verified)
    result["after"] = len(merged)
    result["gate_errors"] = gates.check(bucket, live_before, merged)
    if result["gate_errors"]:
        result["status"] = "blocked"
        return result
    if merged == store.load(bucket):
        result["status"] = "no change"
        return result
    if write:
        store.put(bucket, merged)
    result["status"] = "written" if write else "dry-run"
    return result


def wait_for_port(port, attempts=50):
    for _ in range(attempts):
        with contextlib.suppress(OSError), socket.create_connection(("127.0.0.1", port), timeout=0.2):
            return
        time.sleep(0.1)
    raise RuntimeError(f"static server never opened port {port}")


@contextlib.contextmanager
def static_server():
    server = subprocess.Popen([sys.executable, "-m", "http.server", "--bind", "127.0.0.1", str(SMOKE_PORT)], cwd=REPO,
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        wait_for_port(SMOKE_PORT)
        yield f"http://127.0.0.1:{SMOKE_PORT}/"
    finally:
        server.terminate()


def smoke(base):
    env = {**os.environ, "CHROME_PATH": os.environ.get("CHROME_PATH", "/usr/bin/google-chrome-stable")}
    out = subprocess.run(["node", "scripts/check_pages.js", base], cwd=REPO, env=env,
                         capture_output=True, text=True, check=True).stdout
    return {r["path"]: r for r in map(json.loads, out.splitlines())}


def smoke_regressions(baseline, after):
    problems = []
    for path, now in after.items():
        was = baseline.get(path, {})
        new_errors = set(now["errors"]) - set(was.get("errors", []))
        if new_errors:
            problems.append(f"{path or '/'}: new console errors {sorted(new_errors)[:3]}")
        new_failed = set(now["failed"]) - set(was.get("failed", []))
        if new_failed:
            problems.append(f"{path or '/'}: new failed requests {sorted(new_failed)[:3]}")
        if was.get("counts", {}).get("cards", 0) > 0 and now["counts"]["cards"] == 0:
            problems.append(f"{path or '/'}: cards dropped to 0")
    return problems


def publish(files, buckets, today, push):
    git("add", *files)
    if not git("diff", "--cached", "--name-only").strip():
        return "nothing staged"
    git("commit", "-m", f"chore(labs): refresh {','.join(buckets)} {today}")
    if not push:
        return "committed (not pushed)"
    git("push")
    return "pushed"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--only", default=",".join(BUCKETS), help="comma list of buckets")
    parser.add_argument("--dry-run", action="store_true", help="report only, write nothing")
    parser.add_argument("--no-push", action="store_true", help="commit but do not push")
    parser.add_argument("--no-commit", action="store_true", help="write and smoke-test, leave changes uncommitted")
    parser.add_argument("--no-smoke", action="store_true", help="skip the headless page check")
    parser.add_argument("--allow-dirty", action="store_true", help="allow running when target files have uncommitted edits")
    args = parser.parse_args()

    today = datetime.date.today().isoformat()
    selected = [BUCKETS[name] for name in args.only.split(",")]
    files = sorted({f for b in selected for f in target_files(b)} | {dating_ratings.RATINGS_JS.relative_to(REPO).as_posix()})
    write = not args.dry_run

    dirty = git("status", "--porcelain", "--", *files).strip()
    if write and dirty and not args.allow_dirty:
        sys.exit(f"Refusing to run: target files have uncommitted changes:\n{dirty}")

    smoke_enabled = write and not args.no_smoke
    baseline = None
    if smoke_enabled:
        with static_server() as base:
            baseline = smoke(base)

    store = Store()
    results = [run_bucket(b, store, today, write) for b in selected]
    store.flush()

    written = [r["bucket"] for r in results if r["status"] == "written"]
    ratings_path = dating_ratings.write(today) if write else None
    if ratings_path:
        files.append(ratings_path.relative_to(REPO).as_posix())
        written.append("dating")
    outcome = "dry run" if args.dry_run else "nothing to publish"
    if written and smoke_enabled:
        with static_server() as base:
            problems = smoke_regressions(baseline, smoke(base))
        if problems:
            git("checkout", "--", *files)
            for r in results:
                if r["status"] == "written":
                    r["status"] = "reverted"
                    r["gate_errors"] += problems
            written, outcome = [], "smoke test failed, reverted"

    path = report.write(today, results)
    if written:
        files.append(sync.write().relative_to(REPO).as_posix())
    if written and args.no_commit:
        outcome = "written, not committed"
    elif written:
        outcome = publish(files + [path.relative_to(REPO).as_posix()], written, today, push=not args.no_push)

    print(path.read_text(encoding="utf-8"))
    print(f"Outcome: {outcome}. Report: {path}")


if __name__ == "__main__":
    main()
