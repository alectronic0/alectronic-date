import datetime
import sys
import unittest
from pathlib import Path
from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sources import its_a_date

SAMPLE_CARD_HTML = """
<div class="col-lg-4 col-sm-6">
  <div class="event_itm">
    <div class="event_itm_img">
      <a href="https://itsadate.club/event/games-themed-speed-dating-66/">
        <img src="https://itsadate.club/wp-content/uploads/2024/09/Draughts.jpeg"/>
      </a>
    </div>
    <div class="event_meta">
      <div class="event_meta_itm"><span><img src="cal.svg"/></span><span>Mon 09 Nov</span></div>
      <div class="event_meta_itm"><span><img src="clock.svg"/></span><span>07:15 PM</span></div>
      <div class="event_meta_itm"><span><img src="age.svg"/></span><span>30-45 yrs</span></div>
    </div>
    <div class="event_itm_con">
      <h3 class="heading_type3">
        <a href="https://itsadate.club/event/games-themed-speed-dating-66/">Games Themed Speed Dating</a>
      </h3>
      <div class="event_itm_mt">
        <div class="event_itm_location">
          <span>Draughts, Arch 16 Leake St, London SE1 7NN</span>
        </div>
        <div class="event_itm_prc">
          <div class="event_itm_prc_in">£22</div>
        </div>
      </div>
      <p>Board games doubles speed dating in The Loft.</p>
      <div class="event_itm_btns">
        <div class="event_itm_btns_meta">
          <div class="event_itm_male available"><span>Available</span></div>
          <div class="event_itm_male available"><span>Available</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

SAMPLE_MANCHESTER_HTML = """
<div class="col-lg-4 col-sm-6">
  <div class="event_itm">
    <div class="event_itm_con">
      <h3 class="heading_type3">
        <a href="https://itsadate.club/event/speed-dating-in-manchester-26/">Speed Dating in Manchester</a>
      </h3>
      <div class="event_itm_mt">
        <div class="event_itm_location">
          <span>Be At One, 80 Deansgate, Manchester M3 2ER</span>
        </div>
      </div>
    </div>
  </div>
</div>
"""


class TestItsADate(unittest.TestCase):
    def test_expand_date(self):
        self.assertEqual(its_a_date.expand_date("Mon 09 Nov"), "Mon 09 November")
        self.assertEqual(its_a_date.expand_date("Fri 06 Jan"), "Fri 06 January")

    def test_parse_card(self):
        soup = BeautifulSoup(SAMPLE_CARD_HTML, "html.parser")
        card = soup.select_one(".event_itm")
        today = datetime.date(2026, 10, 26)
        coords = {"SE1 7NN": (51.5017, -0.1159)}
        record = its_a_date.parse_card(card, today, coords)

        self.assertIsNotNone(record)
        self.assertEqual(record["id"], "games-themed-speed-dating-66")
        self.assertEqual(record["source"], "itsadate")
        self.assertEqual(record["hostId"], "its-a-date")
        self.assertEqual(record["hostName"], "It's a Date Club")
        self.assertEqual(record["name"], "Games Themed Speed Dating (30-45 yrs)")
        self.assertEqual(record["startDate"], "2026-11-09")
        self.assertEqual(record["startTime"], "19:15")
        self.assertEqual(record["venue"], "Draughts")
        self.assertEqual(record["price"], "£22")
        self.assertEqual(record["ticketStatus"], "plenty")
        self.assertEqual(record["lat"], 51.5017)
        self.assertEqual(record["lng"], -0.1159)

    def test_exclude_manchester(self):
        soup = BeautifulSoup(SAMPLE_MANCHESTER_HTML, "html.parser")
        card = soup.select_one(".event_itm")
        today = datetime.date(2026, 10, 26)
        record = its_a_date.parse_card(card, today, {})
        self.assertIsNone(record)


if __name__ == "__main__":
    unittest.main()
