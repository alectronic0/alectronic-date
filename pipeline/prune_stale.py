"""Drop finished events and flag stale hand-curated ideas. No network, no scraping.

    python3 pipeline/prune_stale.py            # prune nerd/cinema events past their endDate, report old date ideas
    python3 pipeline/prune_stale.py --dry-run  # report only

Date ideas have no end date, so they are never deleted here: any whose `costChecked` is
missing or older than STALE_DAYS is listed for a manual re-check.
"""

import argparse
import datetime
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from io_content import LabsContent  # noqa: E402

STALE_DAYS = 365
DATED_SECTIONS = ("nerdGatherings", "cinemaEvents")


def is_finished(item, today):
    end = item.get("endDate")
    if not end:
        return False
    return end < today


def is_stale(item, today):
    checked = item.get("costChecked")
    if not checked:
        return True
    age = datetime.date.fromisoformat(today) - datetime.date.fromisoformat(checked)
    return age.days > STALE_DAYS


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    today = datetime.date.today().isoformat()

    content = LabsContent()
    for section in DATED_SECTIONS:
        items = content.items(section)
        kept = [i for i in items if not is_finished(i, today)]
        print(f"{section}: {len(items) - len(kept)} finished, {len(kept)} kept")
        content.set_items(section, kept)

    stale = [i["name"] for i in content.items("dateIdeas") if is_stale(i, today)]
    print(f"dateIdeas: {len(stale)} without a recent costChecked")

    if args.dry_run:
        return
    content.save()


if __name__ == "__main__":
    main()
