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


def quarantine(*args, **kwargs):
    return gates.quarantine(*args, public=lambda u: u.startswith(("https://", "http://")), **kwargs)


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

    def test_skips_near_duplicate_of_existing_event(self):
        manual = event("London Film & Comic Con (LFCC 2027)", endDate="2027-08-15")
        scraped = [event("London Film & Comic Con 2027 - Saturday", endDate="2027-08-14"),
                   event("London Film & Comic Con 2027 - Sunday", endDate="2027-08-15")]

        merged, changes = merge(CINEMA, [manual], scraped, TODAY)

        self.assertEqual(merged, [manual])
        self.assertEqual(changes.added, [])

    def test_keeps_same_name_on_different_dates(self):
        spring = event("Animangapop London Spring", endDate="2027-03-07")

        merged, _ = merge(CINEMA, [spring], [event("Animangapop London Summer", endDate="2027-08-01")], TODAY)

        self.assertEqual(len(merged), 2)

    def test_same_venue_different_films_are_distinct(self):
        scraped = [event("Scream at Wollaton Hall", endDate="2026-10-23"),
                   event("Hocus Pocus Spooktacular at Wollaton Hall", endDate="2026-10-24")]

        merged, _ = merge(CINEMA, [], scraped, TODAY)

        self.assertEqual(len(merged), 2)

    def test_scraped_record_never_blocks_its_replacement(self):
        stale = event("Hocus Pocus 5-Course Feast", endDate="2026-10-30", origin="auto")

        merged, changes = merge(CINEMA, [stale], [event("Hocus Pocus 1993", endDate="2026-11-01")], TODAY)

        self.assertEqual(changes.added, ["Hocus Pocus 1993"])

    def test_past_end_date_expires(self):
        merged, changes = merge(CINEMA, [event("old", endDate="2026-10-01")], [], TODAY)

        self.assertEqual(merged, [])
        self.assertEqual(changes.expired, ["old"])


    def test_refresh_never_downgrades_an_exact_pin(self):
        classes = BUCKETS["classes"]
        old = {"id": "1", "title": "Pottery", "url": "https://x/1", "origin": "auto", "lat": 51.47, "lng": -0.12,
               "exact_coords": True, "location_precision": "postcode", "exact_location": "132 Wandsworth Rd"}
        new = {"id": "1", "title": "Pottery!", "url": "https://x/1", "lat": 51.48, "lng": -0.13,
               "exact_coords": False, "location_precision": "neighborhood", "exact_location": "Nine Elms"}

        merged, _ = merge(classes, [old], [new], TODAY)

        self.assertEqual(merged[0]["title"], "Pottery!")
        self.assertEqual((merged[0]["lat"], merged[0]["exact_location"]), (51.47, "132 Wandsworth Rd"))


class GatesTest(unittest.TestCase):
    def test_bad_new_record_is_dropped_not_the_bucket(self):
        good, bad = event("good", origin="auto"), event("bad", origin="auto", description="<script>")

        kept, held = quarantine(CINEMA, [], [good, bad], set(), status=always_ok)

        self.assertEqual(kept, [good])
        self.assertEqual(len(held), 1)

    def test_bad_refresh_reverts_to_previous_version(self):
        old = event("film", origin="auto", description="fine")
        new = {**old, "description": "<b>bold</b>"}

        kept, _ = quarantine(CINEMA, [old], [new], set(), status=always_ok)

        self.assertEqual(kept, [old])

    def test_rejects_em_dash_in_scraped_copy(self):
        record = event("dash", origin="auto", description="great — film")

        _, errors = quarantine(CINEMA, [], [record], set(), status=always_ok)

        self.assertTrue(any("banned" in e for e in errors))

    def test_unchanged_record_is_not_held(self):
        old = event("dash", origin="auto", description="great — film")
        unseen = {**old, "misses": 1}

        kept, held = quarantine(CINEMA, [old], [unseen], set(), status=always_ok)

        self.assertEqual((kept, held), ([unseen], []))

    def test_ignores_em_dash_in_manual_copy(self):
        record = event("dash", description="great — film")

        self.assertEqual(quarantine(CINEMA, [record], [record], set(), status=always_ok)[1], [])

    def test_rejects_large_count_drop(self):
        before = [event(str(i)) for i in range(10)]

        errors = gates.check(CINEMA, before, before[:6])

        self.assertTrue(any("count dropped 40%" in e for e in errors))

    def test_rejects_dead_url_on_new_record(self):
        record = event("dead", origin="auto")

        _, errors = quarantine(CINEMA, [], [record], {CINEMA.key(record)}, status=lambda _u: 404)

        self.assertTrue(any("returned 404" in e for e in errors))

    def test_rejects_markup_in_scraped_copy(self):
        record = event("xss", origin="auto", description="<img src=x onerror=alert(1)>")

        _, errors = quarantine(CINEMA, [], [record], set(), status=always_ok)

        self.assertTrue(any("markup or quote" in e for e in errors))

    def test_rejects_attribute_breakout(self):
        record = event('x" onmouseover="alert(1)', origin="auto")

        _, errors = quarantine(CINEMA, [], [record], set(), status=always_ok)

        self.assertTrue(any("markup or quote" in e for e in errors))

    def test_allows_apostrophes(self):
        record = event("Tim Burton's Film", origin="auto")

        self.assertEqual(quarantine(CINEMA, [], [record], set(), status=always_ok)[1], [])

    def test_rejects_non_http_link(self):
        record = event("js", origin="auto", mapUrl="javascript:alert(1)")

        _, errors = quarantine(CINEMA, [], [record], set(), status=always_ok)

        self.assertTrue(any("mapUrl is not http(s)" in e for e in errors))

    def test_rechecks_url_when_it_changes(self):
        old = event("moved", origin="auto")
        new = {**old, "url": "https://example.com/elsewhere"}

        _, errors = quarantine(CINEMA, [old], [new], set(), status=lambda _u: 404)

        self.assertTrue(any("returned 404" in e for e in errors))

    def test_skips_urls_the_source_already_fetched(self):
        record = event("fetched", origin="auto")
        key = CINEMA.key(record)

        _, errors = quarantine(CINEMA, [], [record], {key}, status=lambda _u: 404, verified={key})

        self.assertEqual(errors, [])

    def test_verified_record_still_needs_a_public_url(self):
        record = event("internal", origin="auto", url="http://169.254.169.254/latest/")
        key = CINEMA.key(record)

        kept, held = gates.quarantine(CINEMA, [], [record], {key}, status=always_ok, verified={key})

        self.assertEqual(kept, [])
        self.assertTrue(any("not a public" in h for h in held))

    def test_fetch_refuses_private_hosts(self):
        from sources import common

        with self.assertRaises(ValueError):
            common.get_text("http://127.0.0.1:8765/")

    def test_connection_to_private_peer_is_refused_even_if_dns_check_passed(self):
        import http.server
        import threading
        from unittest import mock

        from sources import common

        server = http.server.HTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            with mock.patch.object(gates, "is_public_http", return_value=True):
                with self.assertRaises(OSError):
                    common.get_text(f"http://127.0.0.1:{server.server_port}/", retries=0)
        finally:
            server.shutdown()

    def test_never_fetches_private_hosts(self):
        self.assertIsNone(gates.url_status("http://127.0.0.1:8765/"))
        self.assertIsNone(gates.url_status("http://169.254.169.254/latest/meta-data/"))
        self.assertIsNone(gates.url_status("file:///etc/passwd"))


class SinglesTicketStatusTest(unittest.TestCase):
    def setUp(self):
        from sources import eventbrite_singles as singles
        self.singles = singles

    def test_statuses(self):
        cases = {
            "sold out sales": ({}, "sold_out", set(), "sold_out"),
            "sales ended": ({}, "sales_ended", {"InStock"}, "sold_out"),
            "sold out offer": ({}, "on_sale", {"SoldOut"}, "sold_out"),
            "few tickets signal": ({"urgency_signals": {"messages": ["fewTickets"]}}, "on_sale", {"InStock"}, "limited"),
            "limited offer": ({}, "on_sale", {"LimitedAvailability"}, "limited"),
            "on sale": ({}, "on_sale", {"InStock"}, "plenty"),
            "not yet on sale": ({}, "not_yet_on_sale", {"InStock"}, "unknown"),
        }
        for name, (event, sales, availability, want) in cases.items():
            with self.subTest(name):
                self.assertEqual(self.singles.ticket_status(event, sales, availability), want)

    def test_page_details_reads_organiser_and_sales(self):
        page = '"organizer":{"@type":"Organization","name":"True Dating","url":"x"} "availability":"InStock" "salesStatus":{"salesStatus":"on_sale"}'
        self.assertEqual(self.singles.page_details(page), ("on_sale", {"InStock"}, "True Dating"))

    def test_page_details_falls_back_when_organiser_is_null(self):
        page = '"organizer":{"@type":"Organization","name":null,"url":"x"}'
        self.assertEqual(self.singles.page_details(page), ("", set(), "Eventbrite"))

    def test_organiser_logo_keeps_signed_url(self):
        page = '<meta property="og:image" content="https://img.evbuc.com/x%2Foriginal?w=2000&amp;auto=format&amp;s=abc" />'
        self.assertEqual(self.singles.organiser_logo(page), "https://img.evbuc.com/x%2Foriginal?w=2000&auto=format&s=abc")
        self.assertIsNone(self.singles.organiser_logo("<html></html>"))

    def test_excludes_networking(self):
        self.assertFalse(self.singles.is_singles({"name": "Property Speed Networking Event in London"}))
        self.assertTrue(self.singles.is_singles({"name": "Speed Dating in The City | Ages 50 to 65"}))



class SinglesHostParsingTest(unittest.TestCase):
    def setUp(self):
        from sources import art_dating_club, fig, haystack, singles_common
        self.adc, self.fig, self.haystack, self.common = art_dating_club, fig, haystack, singles_common

    def test_text_date_and_time(self):
        import datetime
        today = datetime.date(2026, 10, 25)
        cases = {
            "explicit year": ("Tuesday 27 October 2026 From 7:30pm", datetime.date(2026, 10, 27), "19:30"),
            "ordinal no year": ("Wednesday, 28th October 7:30pm", datetime.date(2026, 10, 28), "19:30"),
            "rolls into next year": ("Friday 9th January 8pm", datetime.date(2027, 1, 9), "20:00"),
            "noon": ("Sunday 1st November 12pm", datetime.date(2026, 11, 1), "12:00"),
            "range borrows pm": ("Monday 26th October, 6:30-8:30pm", datetime.date(2026, 10, 26), "18:30"),
            "range both pm": ("Friday 20th November, 7:30pm – 10:30pm", datetime.date(2026, 11, 20), "19:30"),
        }
        for name, (text, want_day, want_time) in cases.items():
            with self.subTest(name):
                self.assertEqual(self.common.text_date(text, today), want_day)
                self.assertEqual(self.common.text_time(text), want_time)

    def test_status_from_spots(self):
        cases = {
            "unknown": (None, None, "unknown"),
            "none left": (0, 100, "sold_out"),
            "under a fifth": (15, 100, "limited"),
            "plenty": (60, 100, "plenty"),
            "few left no capacity": (3, None, "limited"),
            "many left no capacity": (44, None, "plenty"),
        }
        for name, (spots, capacity, want) in cases.items():
            with self.subTest(name):
                self.assertEqual(self.common.status_from_spots(spots, capacity), want)

    def test_adc_venue_text(self):
        cases = {
            "postcode then weekday": ("📍 John the Unicorn, Peckham, SE15 4TL Tuesday 27 October 2026 From 7:30pm", "John the Unicorn, Peckham, SE15 4TL"),
            "clock emoji separator": ("📍 Tower Bridge Collective 🕢 Wednesday, 28th October 7:30pm", "Tower Bridge Collective"),
            "no pin": ("Gift card", ""),
        }
        for name, (text, want) in cases.items():
            with self.subTest(name):
                self.assertEqual(self.adc.venue_text(text), want)

    def test_fig_sold_out_title(self):
        page = "<title>Sold out – The Dinner Date • Supper Club – Sir Devonshire Square Hotel</title> Fri 6 Nov 2026 7:00 PM - 10:30 PM"
        record = self.fig.to_record("1", page)
        self.assertEqual((record["name"], record["venue"], record["ticketStatus"], record["startTime"]),
                         ("The Dinner Date • Supper Club", "Sir Devonshire Square Hotel", "sold_out", "19:00"))
        self.assertIsNotNone(record.get("lat"))

    def test_haystack_spaces_left(self):
        def option(amount, status="available", **extra):
            return {"type": "ticket-options", "attributes": {"amount-available": amount, "on-sale-status": status, "visible": True, **extra}}
        cases = {
            "sums on-sale options": ([option(9), option(9)], 18),
            "ignores addons": ([option(9), option(50, addon=True)], 9),
            "all off sale": ([option(0, "sold-out")], 0),
            "no options": ([], None),
        }
        for name, (included, want) in cases.items():
            with self.subTest(name):
                self.assertEqual(self.haystack.spaces_left(included), want)

    def test_bdb_event_details(self):
        import datetime
        from sources import be_dating_beautiful as bdb
        today = datetime.date(2026, 10, 25)
        cases = {
            "pin after time": ("Fun night. Event Details 📅 Wednesday 16th December, 7:30pm till late 📍 Ronnie’s Bar, 4–6 Jury Street, Warwick, CV34 4EW Who Is It For?",
                               datetime.date(2026, 12, 16), "19:30", "Ronnie’s Bar, 4–6 Jury Street, Warwick, CV34 4EW"),
            "no pin": ("Event Details Wednesday 23rd December, 7:30pm The Anchor, 84 Cambridge Road , Walsworth , Hitchin, SG4 0JH Tickets",
                       datetime.date(2026, 12, 23), "19:30", "The Anchor, 84 Cambridge Road, Walsworth, Hitchin, SG4 0JH"),
            "new year's eve": ("Event Details 🎆 New Year’s Eve 📍 Boom Battle Bar Stevenage, Kings Way, Stevenage, SG1 2UA 🕗 Start times from 8pm",
                               datetime.date(2026, 12, 31), "20:00", "Boom Battle Bar Stevenage, Kings Way, Stevenage, SG1 2UA"),
            "address before details": ("Venue Address: Campion School , Sydenham Drive, Leamington Spa, CV31 1QH Event Details Campion School 📅 Monday 26th October, 6:30-8:30pm Limited to 24 places, long blurb about the UK and fitness and friends and more and more words until a code like AB1 2CD",
                              datetime.date(2026, 10, 26), "18:30", "Campion School, Sydenham Drive, Leamington Spa, CV31 1QH"),
        }
        for name, (text, want_day, want_time, want_address) in cases.items():
            with self.subTest(name):
                block = bdb.details(text)
                self.assertEqual(bdb.event_date(block, today), want_day)
                self.assertEqual(self.common.text_time(block), want_time)
                self.assertEqual(bdb.event_address(text), want_address)

if __name__ == "__main__":
    unittest.main()
