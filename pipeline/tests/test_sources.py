import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sources import SOURCES  # noqa: E402


class SinglesSourcesTest(unittest.TestCase):
    def test_singles_bucket_is_empty_because_events_come_from_the_api(self):
        self.assertEqual(SOURCES["singles"], [])


if __name__ == "__main__":
    unittest.main()
