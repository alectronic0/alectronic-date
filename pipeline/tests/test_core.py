import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import gates  # noqa: E402
import io_content  # noqa: E402
from merge import merge  # noqa: E402
from schema import BUCKETS  # noqa: E402

TODAY = "2026-10-18"
CINEMA = BUCKETS["cinema"]


def event(name, **extra):
    return {"name": name, "url": f"https://example.com/{name}", "provider": "p", "endDate": "2026-12-01", **extra}


def always_ok(_url):
    return 200


class RoundTripTest(unittest.TestCase):
    def test_labs_content_is_byte_exact(self):
        labs = io_content.LabsContent()
        self.assertEqual(labs.render(), io_content.LABS_CONTENT.read_text(encoding="utf-8"))

    def test_geo_dump_matches_file(self):
        json_name, _, _ = io_content.GEO_DATASETS["workshops"]
        records = io_content.load_geo("workshops")
        self.assertEqual(io_content.dumps(records), (io_content.REPO / json_name).read_text(encoding="utf-8"))


class MergeTest(unittest.TestCase):
    def test_manual_text_is_never_overwritten(self):
        manual = event("film", description="hand written")
        scraped = event("film", description="scraped blurb")

        merged, changes = merge(CINEMA, [manual], [scraped], TODAY)

        self.assertEqual(merged, [manual])
        self.assertEqual(changes.updated, [])

    def test_new_record_is_tagged_auto(self):
        merged, changes = merge(CINEMA, [], [event("new")], TODAY)

        self.assertEqual(merged[0]["origin"], "auto")
        self.assertEqual(merged[0]["firstSeen"], TODAY)
        self.assertEqual(changes.added, ["new"])

    def test_auto_record_needs_two_misses_to_be_removed(self):
        auto = event("gone", origin="auto", firstSeen="2026-10-01", lastSeen="2026-10-01")

        once, _ = merge(CINEMA, [auto], [event("other")], TODAY)
        self.assertEqual(once[0]["misses"], 1)

        twice, changes = merge(CINEMA, once, [event("other")], TODAY)
        self.assertEqual([r["name"] for r in twice], ["other"])
        self.assertEqual(len(changes.removed), 1)

    def test_failed_scrape_strikes_nothing(self):
        auto = event("kept", origin="auto")

        merged, _ = merge(CINEMA, [auto], [], TODAY, scrape_ran=False)

        self.assertNotIn("misses", merged[0])

    def test_healthy_check_resets_strikes(self):
        manual = event("spot", misses=1, flag="404")

        merged, _ = merge(CINEMA, [manual], [], TODAY, health={CINEMA.key(manual): None})

        self.assertNotIn("misses", merged[0])

    def test_past_end_date_expires(self):
        merged, changes = merge(CINEMA, [event("old", endDate="2026-10-01")], [], TODAY)

        self.assertEqual(merged, [])
        self.assertEqual(changes.expired, ["old"])


class GatesTest(unittest.TestCase):
    def test_rejects_em_dash_in_scraped_copy(self):
        record = event("dash", origin="auto", description="great — film")

        errors = gates.check(CINEMA, [], [record], set(), status=always_ok)

        self.assertTrue(any("banned" in e for e in errors))

    def test_ignores_em_dash_in_manual_copy(self):
        record = event("dash", description="great — film")

        self.assertEqual(gates.check(CINEMA, [record], [record], set(), status=always_ok), [])

    def test_rejects_large_count_drop(self):
        before = [event(str(i)) for i in range(10)]

        errors = gates.check(CINEMA, before, before[:6], set(), status=always_ok)

        self.assertTrue(any("count dropped 40%" in e for e in errors))

    def test_rejects_dead_url_on_new_record(self):
        record = event("dead", origin="auto")

        errors = gates.check(CINEMA, [], [record], {CINEMA.key(record)}, status=lambda _u: 404)

        self.assertTrue(any("returned 404" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
