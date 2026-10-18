"""Markdown run report written to pipeline/reports/<date>.md."""

from pathlib import Path

REPORTS = Path(__file__).parent / "reports"
LIST_CAP = 25


def _section(title, names):
    if not names:
        return []
    lines = [f"**{title} ({len(names)})**"]
    lines += [f"- {n}" for n in names[:LIST_CAP]]
    if len(names) > LIST_CAP:
        lines.append(f"- ...and {len(names) - LIST_CAP} more")
    return lines + [""]


def render(today, results):
    lines = [f"# Labs refresh {today}", "", "| Bucket | Status | Before | After | +Added | -Removed | Expired | Flagged |", "|---|---|---|---|---|---|---|---|"]
    for r in results:
        c = r["changes"]
        lines.append(
            f"| {r['bucket']} | {r['status']} | {r['before']} | {r['after']} | "
            f"{len(c.added)} | {len(c.removed)} | {len(c.expired)} | {len(c.flagged)} |"
        )
    lines.append("")
    for r in results:
        c = r["changes"]
        lines += [f"## {r['bucket']}", ""]
        lines += _section("Source errors", r["source_errors"])
        lines += _section("Gate failures (bucket not written)", r["gate_errors"])
        lines += _section("Added", c.added)
        lines += _section("Updated", c.updated)
        lines += _section("Removed", c.removed)
        lines += _section("Expired", c.expired)
        lines += _section("Flagged", c.flagged)
    return "\n".join(lines).rstrip() + "\n"


def write(today, results):
    REPORTS.mkdir(exist_ok=True)
    path = REPORTS / f"{today}.md"
    path.write_text(render(today, results), encoding="utf-8")
    return path
