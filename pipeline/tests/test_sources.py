import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sources import SOURCES  # noqa: E402


class SinglesSourcesTest(unittest.TestCase):
    def names(self):
        return {source.NAME for source in SOURCES["singles"]}

    def test_sources_without_scraping_clearance_are_excluded(self):
        for name in ("thursday", "eventbrite", "bedatingbeautiful"):
            with self.subTest(source=name):
                self.assertNotIn(name, self.names())

    def test_cleared_sources_are_kept(self):
        expected = {"haystack", "fig", "artdatingclub", "itsadate", "sparkedconnection"}
        self.assertEqual(self.names(), expected)


if __name__ == "__main__":
    unittest.main()
