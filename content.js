/* ============================================================
   Alec's Dating Application — single source of truth
   ------------------------------------------------------------
   This file is the "powerhouse": every piece of page content
   lives here as data. main.js reads window.CONTENT and renders
   the page from it.

   Loaded via <script src="content.js"></script> (NOT fetch) so it
   works when opening index.html directly (file://) as well as when
   hosted over http(s). fetch() of a local .json file is blocked by
   the browser under file:// — this wrapper sidesteps that.

   ── How sections render ──
   Most sections are an array of typed "blocks". Each block has a
   `type` that maps to a renderer in main.js. To add or duplicate a
   section, copy a block and change its data — no HTML/JS edits.

   Block types: paragraph, heading, note, tagRow, photoGrid,
   posterGrid, cardGrid, featureGrid, valueCols, listCols,
   personaCards, loveLangs, daydreamCards, podcastCards, logoGrid,
   detailList, link.

   ── Auto-computed facts ──
   A `profile.facts` entry can carry `dob` (YYYY-MM-DD) instead of `value` —
   main.js computes age from it at render time, so it's never stale.
   ============================================================ */

window.CONTENT = {
    meta: {
        title: "Alec's Dating Application",
        tagline: "Loveable nerd, looking for his player 2",
        emoji: "🎮❤️🎮"
    },
    hero: {
        emoji: "🎮❤️🎮",
        headline: "Alec's <span>Dating</span> Application",
        subheading: "A visual introduction to what having me as your boyfriend could look like.",
        tagline: "Looking for my nerdy other half — the Player 2 to my Player 1. No swiping required... ok there's a bit of scrolling.",
        cta: "Come find out more ↓",
        // First image is the LCP element — rendered eager + high priority (see main.js renderHero).
        images: [
            {src: "img/alec/alec-pokemon-plushies-pokeball.webp", alt: "Alec Doran-Twyford", w: 900, h: 1200},
            {
                src: "img/alec/alec-silly-face-japanese-onsen.webp",
                alt: "Alec smiling",
                w: 900, h: 1200
            },
            {src: "img/alec/alec-portrait-garden-archway.webp", alt: "Alec portrait", w: 903, h: 1200}
        ]
    },
    profile: {
        tag: "📋 Who I Am",
        name: "Alec Doran-Twyford",
        tagline: "Loveable nerd · Software Engineer · Welwyn Garden City",
        intro: [
            "Hi, I'm Alec! This little site started as a slide deck I made for myself — a reminder of who I am and what I love. I then realised it could be a fun way to skip some of the small talk and give you a real sense of me from the start.",
            "So here's the honest (and slightly chaotic) introduction: the facts, the photos, and the bits that make me, me. If you like what you see, my contact details are just a little further down."
        ],
        photo: {src: "img/alec/alec-portrait-terracotta-wall.webp", alt: "Alec Doran-Twyford", w: 900, h: 1200},
        facts: [
            {icon: "🚹", label: "Gender", value: "Male"},
            {icon: "❤️", label: "Orientation", value: "Straight"},
            {
                icon: "🗣️",
                label: "Pronouns",
                value: [
                    "He / Him ",
                    " They / Them"
                ]
            },
            {icon: "🎂", label: "Age", value: null, dob: "1991-05-19"},
            {icon: "💼", label: "Profession", value: "Software Engineer"},
            {
                icon: "🎓",
                label: "Education",
                value: "BSc Computer Science"
            },
            {
                icon: "🌍", label: "Nationality", value: [
                    "British",
                    "New Zealander"
                ]
            },
            {
                icon: "📍", label: "Living in", value: "Welwyn Garden City", href: "https://www.google.com/maps/place/Welwyn+Garden+City"
            },
            {icon: "📏", label: "Height", value: "~5'8\""},
            {icon: "🌱", label: "Politics", value: "Liberal / Left"},
            {icon: "🚭", label: "Smoking", value: "Non-smoker (dealbreaker if you smoke)"},
            {icon: "🍷", label: "Drinking", value: "Social drinker"},
            {icon: "👶", label: "Kids", value: "None currently"},
        ]
    }, contact: {
        tag: "💬 How to Get in Touch",
        heading: "Shoot Your Shot",
        lead: "I prefer not to share my phone number upfront — but reach me through any of these and you'll get a hold of me.",
        note: "⚔️ It's dangerous to go alone! Take this:",
        links: [
            {
                label: "Email", icon: "gmail", href: "mailto:date.alec@alectronic.co.uk?subject=RE%3A%20Alec%20Dating%20Application", primary: true
            },
            {
                label: "Linktree", href: "https://linktr.ee/Alectronic",
            },
            {label: "Instagram", href: "https://www.instagram.com/alectronic0/"},
            {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/alectronic0/"
            },
            {label: "Telegram", href: "https://t.me/alectronic0"}
        ]
    },

    /* ── Share ──
       Pass-it-on block shown under the contact card. Each option names a
       `type` that main.js (buildShareUrl) turns into a share link for the
       current page; `copy` and `native` are handled specially. `text` is the
       message prefilled where a service supports it. */
    share: {
        tag: "🍄 Not Your Vibe?",
        heading: "Maybe My Princess Is in Another Castle 🏰",
        lead: "No hard feelings if I'm not the one for you — but maybe you know someone who is. Send this their way:",
        text: "Check out Alec's dating application 🎮❤️",
        options: [
            {label: "Email", icon: "gmail", type: "email"},
            {label: "WhatsApp", icon: "whatsapp", type: "whatsapp"},
            {label: "Facebook", icon: "facebook", type: "facebook"},
            {label: "LinkedIn", icon: "linkedin", type: "linkedin"},
            {label: "Telegram", icon: "telegram", type: "telegram"},
            {label: "Reddit", icon: "reddit", type: "reddit"},
            {label: "Copy link", icon: "link", type: "copy"}
        ]
    },

    /* ── Prompt cards (ice-breaker questions) ──
       A deck of questions Alec loves to ask. main.js (renderPrompts) draws
       `count` of them at random on each page load and re-rolls when the
       shuffle button is tapped. The "answer" button builds a mailto to
       `email` with the questions currently on screen pre-filled in the body,
       so a match can reply straight away. Add to `questions` to grow the deck —
       no code changes needed. */
    prompts: {
        intro: "Not sure how to break the ice? Here are a few things I'd love you to answer — pick the ones that spark something and bring them my way. 🃏",
        count: 3,
        shuffleLabel: "Shuffle the deck",
        answerLabel: "Email me your answers",
        email: "date.alec@alectronic.co.uk",
        emailSubject: "My answers to Alec's questions 🎮❤️",
        emailIntro: "Hi Alec! Here are my answers to a few of your questions:",
        questions: [
            "What are your top three favourite countries — and what made them special?",
            "If you had to pick a favourite god or goddess, who would it be and why?",
            "What's your favourite food or cuisine?",
            "Favourite TV show or video game right now?",
            "What did you want to be when you grew up?",
            "What do you do for work — and do you genuinely enjoy it?",
            "Where's the next place you'd love to travel to?",
            "What's a hobby or interest you could talk about for hours?",
            "Tea or coffee — and how do you take it?",
            "What's the best meal you've ever had?",
            "Cats, dogs, or something more exotic?",
            "What does your perfect lazy Sunday look like?",
            "What's a song or artist you always come back to?",
            "Are you more of a night owl or an early bird?",
            "What's something you're quietly proud of?",
            "What's still left on your bucket list?",
            "Beach holiday or city adventure?",
            "What's a film or book that genuinely changed how you see things?",
            "If money were no object, how would you spend your days?",
            "What's your go-to comfort food after a rough day?"
        ]
    },

    /* ── Faces marquee ── */
    faces: {
        tag: "📸 A Few Faces of Alec",
        heading: "Snapshots of my Life",
        lead: "Yes, I'm the one in most of them. Tap any photo to enlarge.",
        // w/h are the actual encoded pixel dimensions of each file, passed through
        // to the <img> width/height attributes so the browser can reserve the
        // right box before the image loads (avoids layout shift in the marquee).
        photos: [
            {src: "img/alec/alec-portrait-terracotta-wall.webp", w: 900, h: 1200},
            {src: "img/alec/alec-pokemon-plushies-pokeball.webp", w: 900, h: 1200},
            {src: "img/alec/alec-kimono-red-torii-gate.webp", w: 903, h: 1200},
            {src: "img/alec/alec-portrait-garden-archway.webp", w: 903, h: 1200},
            {src: "img/alec/alec-japanese-onsen-curtain.webp", w: 900, h: 1200},
            {src: "img/alec/alec-silly-face-japanese-onsen.webp", w: 900, h: 1200},
            {src: "img/alec/alec-pokemon-cyndaquil-statue.webp", w: 903, h: 1200},
            {src: "img/alec/alec-super-mario-bros-40th-statue.webp", w: 903, h: 1200},
            {src: "img/alec/alec-cherry-blossom-park.webp", w: 900, h: 1200},
            {src: "img/alec/alec-napping-headphones-pikachu-shirt.webp", w: 1200, h: 1200},
            {src: "img/alec/alec-rope-knot-tying.webp", w: 900, h: 1200},
            {src: "img/alec/alec-coffee-times-square-new-york.webp", w: 900, h: 1200},
            {src: "img/alec/alec-portrait-tropical-garden.webp", w: 900, h: 1200},
            {src: "img/alec/alec-mt-batur-sunrise-hike-bali.webp", w: 903, h: 1200},
            {src: "img/alec/alec-mt-batur-sunrise-silly-selfie-bali.webp", w: 900, h: 1200},
            {src: "img/alec/alec-portrait-sunny-garden.webp", w: 900, h: 1200},
            {src: "img/alec/alec-mad-scientist-lab-coat-costume.webp", w: 745, h: 744},
            {src: "img/alec/alec-holding-pineapple-supermarket.webp", w: 900, h: 1200},
            {src: "img/alec/alec-fire-staff-spinning-night.webp", w: 1080, h: 1080},
            {src: "img/alec/alec-exhausted-after-gym-workout.webp", w: 1200, h: 900},
            {src: "img/alec/alec-sandwich-lunch-cafe.webp", w: 684, h: 911},
            {src: "img/alec/alec-times-square-street-selfie.webp", w: 683, h: 911},
            {src: "img/alec/alec-rope-knot-tying-closeup.webp", w: 683, h: 911},
        ]
    },

    /* ── Deep-dive accordion ──
       Order + header for each collapsible card. `key` matches a
       sections[key] below AND becomes the card's element id, so a URL
       like …#food opens that card. Reorder this array to reorder the
       accordion — no HTML edits needed. */
    accordion: [
        {key: "transparency", emoji: "🌱", title: "Radical Transparency", hint: "— areas of active growth"},
        {
            key: "hobbies",
            emoji: "✨",
            title: "Hobbies & Interests",
            hint: "— things that light me up"
        },
        {key: "bucketList", emoji: "🎯", title: "Bucket List", hint: "— things I'd love to try"},
        {
            key: "places",
            emoji: "✈️",
            title: "Places — Been & Want to Go",
            hint: "— stamps & wishlist"
        },
        {key: "moviesTV", emoji: "🎬", title: "Movies & TV", hint: "— what I'm watching"},
        {
            key: "videoGames",
            emoji: "🎮",
            title: "Video Games",
            hint: "— player one, ready"
        },
        {key: "food", emoji: "🍽️", title: "Food", hint: "— the way to my heart"},
        {
            key: "music",
            emoji: "🎵",
            title: "Music",
            hint: "— what's on my playlist"
        },
        {key: "books", emoji: "📚", title: "Books", hint: "— on my shelf"},
        {
            key: "podcasts",
            emoji: "🎙️",
            title: "Podcasts",
            hint: "— long-journey listening"
        },
        {key: "sports", emoji: "⚽", title: "Sports", hint: "— mostly a spectator"},
        {
            key: "politics",
            emoji: "🏛️",
            title: "Politics & Religion",
            hint: "— where I stand"
        },
        {key: "dislikes", emoji: "🙅", title: "Gentle Dislikes", hint: "— a preference for calm"},
        {
            key: "goals",
            emoji: "🚀",
            title: "Future Goals",
            hint: "— where I'm headed"
        },
        {key: "plantsAnimals", emoji: "🌺", title: "Bonus: Plants & Creatures", hint: "— a few favourites"}
    ],

    /* ── Mid-page sections (each = blocks[]) ── */
    sections: {

        characterSheet: {
            tag: "🧾 Character Sheet",
            blocks: [
                {
                    type: "personaCards",
                    cards: [
                        {
                            icon: "🧠",
                            title: "INTJ-T",
                            desc: "The Architect — strategic, introspective, a little turbulent. Tested Apr 2025."
                        },
                        {
                            icon: "♉",
                            title: "Taurus",
                            desc: "Stubborn, loyal, and yes — I do like my comforts."
                        },
                        {
                            icon: "🎲",
                            title: "Chaotic Good",
                            desc: "Mostly plans everything. Occasionally throws the plan out for a good story."
                        }
                    ]
                },
                {
                    type: "loveLangs",
                    langs: [
                        {tier: "1st", label: "Physical Touch"},
                        {tier: "2nd", label: "Quality Time"},
                        {tier: "3rd", label: "Acts of Service"},
                        {tier: "3rd", label: "Gift Giving"},
                        {tier: "4th", label: "Words of Affirmation"}
                    ]
                }
            ]
        },

        moments: {
            tag: "🏆 Notable Moments",
            tagClass: "tag-gold",
            heading: "A Life Well Lived (So Far)",
            lead: "A few of the milestones, mishaps and adventures so far — tap any to enlarge.",
            blocks: [
                {
                    type: "cardGrid", cards: [
                        {
                            src: "img/moments/alec-at-graduation.webp", icon: "🎓", title: "Got a 1st @ University", caption: "BSc Computer Science, top marks."
                        },
                        {
                            src: "img/moments/google-map-showing-the-drunken-walk-home-from-london.webp",
                            icon: "🚶",
                            title: "Walked home from London",
                            caption: "23.5km, drunk, on a dare to myself."
                        },
                        {
                            src: "img/moments/alec-with-david-tennant.webp", icon: "⭐", title: "Met David Tennant", caption: "Yes, the Doctor. Very lovely in person."
                        },
                        {
                            src: "img/moments/alec-setting-off-on-his-backpacking-adventure.webp",
                            icon: "🎒",
                            title: "Backpacked for 2 years",
                            caption: "Around the world, one hostel at a time."
                        },
                        {
                            src: "img/moments/alec-in-a-bikini-as-a-dare.webp", icon: "👙", title: "Bikini on Valentine's Day", caption: "A surf-camp dare I fully committed to."
                        },
                        {
                            src: "img/moments/alec-sky-diving.webp", icon: "🪂", title: "Skydived", caption: "Jumped out of a perfectly good plane."
                        },
                        {
                            src: "img/moments/alec-feeding-load-of-backpackers.webp", icon: "👨‍🍳", title: "Cooked for 30 backpackers", caption: "One big pot, one happy hostel."
                        },
                        {
                            src: "img/moments/trophy-of-most-enthusiastic-google-city-expert-now-google-local-guides.webp",
                            icon: "📍",
                            title: "Most Enthusiastic City Expert",
                            caption: "Google's award — now Local Guides."
                        },
                        {
                            src: "img/moments/alec-completing-a-10k-run.webp", icon: "🏃", title: "Ran a 10km", caption: "Crossed the line, legs intact."
                        },
                        {
                            src: "img/moments/alec-holding-keys-of-his-home.webp", icon: "🏠", title: "Bought a house", caption: "Keys in hand, properly grown up."
                        },
                        {
                            src: "img/moments/alec-mt-batur-sunrise-bali.webp", icon: "🌋", title: "Climbed a volcano", caption: "Sunrise from the top of Mt Batur, Bali."
                        },
                        {
                            src: "img/moments/alec-kimono-torii-gate-japan.webp", icon: "🇯🇵", title: "A month solo in Japan", caption: "Temples, ramen and a lot of walking."
                        }
                    ]
                }
            ]
        }, boyfriendMode: {
            tag: "❤️ Boyfriend mode in Action",
            tagClass: "tag-rose",
            heading: "What Dating Me Could Look Like",
            lead: "A peek at \"boyfriend mode\" — the little things I love doing for the person I'm with.",
            blocks: [
                {
                    type: "featureGrid", features: [
                        {
                            src: "img/boyfriend-mode/couple-hugging.webp",
                            alt: "A couple hugging",
                            icon: "🤗",
                            text: "Always supportive and caring — there through the good and bad times, with great hugs, forehead kisses and massages."
                        },
                        {
                            src: "img/boyfriend-mode/person-taking-photo.webp",
                            alt: "Taking a photo",
                            icon: "📸",
                            text: "Your personal photographer — making sure you always look great."
                        },
                        {
                            src: "img/boyfriend-mode/person-getting-coffee-from-a-shop.webp",
                            alt: "Getting coffee",
                            icon: "☕",
                            text: "Always knowing your coffee order & keeping your favourite snack on hand."
                        },
                        {
                            src: "img/boyfriend-mode/a-google-calendar-invite-for-cute-date.webp",
                            alt: "A calendar invite for a date",
                            icon: "📅",
                            text: "Organising cute dates (and yes, adding them to Google Calendar)."
                        },
                        {
                            src: "img/boyfriend-mode/person-surprising-someone-with-flowers.webp",
                            alt: "Surprise flowers",
                            icon: "💐",
                            text: "Random flowers and cute little gifts, just because."
                        },
                        {
                            src: "img/boyfriend-mode/passenger-princess.webp",
                            alt: "Passenger Princess",
                            icon: "👑",
                            text: "Full passenger-princess treatment whenever we're on the road."
                        },
                        {
                            src: "img/boyfriend-mode/writing-a-shared-doc.webp",
                            alt: "Writing a doc",
                            icon: "📊",
                            text: "Keeping docs & spreadsheets of the things that matter to you and our plans."
                        },
                        {
                            src: "img/boyfriend-mode/sharing-memes.webp",
                            alt: "Sharing memes",
                            icon: "😂",
                            text: "Pebbling you with hundreds of perfectly curated memes."
                        }
                    ]
                }
            ]
        }, lookingFor: {
            tag: "✨ What I'm Looking For",
            tagClass: "tag-gold",
            heading: "An Invitation, Not a Checklist",
            lead: "I have a full, happy life, and I'm just hoping to share it. Here's the kind of \"us\" I'm dreaming about.",
            blocks: [
                {
                    type: "note",
                    variant: "growth-note",
                    text: "To be upfront: I'm looking for something serious and long-term. Monogamy is my first principle — but more than anything, I'm looking for someone I can be genuinely committed to and build a life with. A couple of practical things: I'm not looking for long-distance, and smoking is a dealbreaker for me. Your religion (or lack of one) genuinely isn't the issue for me — but food is a big part of my life, so it'd be tough if that meant we couldn't easily eat out together or if it created real friction over how we'd raise kids one day. I'd also want a partner whose politics broadly line up with mine (Liberal Left)."
                },
                {
                    type: "paragraph",
                    html: "Two things matter most to me. <strong>First,</strong> someone who's just as up for an adventure as they are for a quiet day at home. <strong>Second,</strong> someone happy to share the stuff I love (gaming and nerd culture, mostly) and to pull me into their own quirky world too. Everything below is a bit of what I picture us getting up to together."
                },
                {
                    type: "featureGrid", features: [
                        {
                            src: "img/looking-for/couple-going-exploring-nature.webp",
                            alt: "A couple exploring nature",
                            icon: "🌿",
                            text: "New places, new food, and taking the long way round just to see what's there."
                        },
                        {
                            src: "img/looking-for/couple-watching-movie-together.webp",
                            alt: "A couple watching a movie",
                            icon: "🍿",
                            text: "Or a slow one in. A film on, the sofa, and nowhere we need to be."
                        },
                        {
                            src: "img/looking-for/couple-playing-video-games.webp",
                            alt: "A couple gaming",
                            icon: "🎮",
                            text: "Controllers out, both of us a little too competitive to call it a night."
                        },
                        {
                            src: "img/looking-for/couple-cooking.webp",
                            alt: "A couple cooking",
                            icon: "🍳",
                            text: "Flour everywhere, music on, and dinner taking twice as long because we keep getting distracted."
                        },
                        {
                            src: "img/looking-for/couple-enjoying-tea-on-the-couch.webp",
                            alt: "A couple enjoying tea",
                            icon: "🫖",
                            text: "The easy kind of talk, where nothing's off limits and there are no walls up."
                        },
                        {
                            src: "img/looking-for/couple-at-the-gym-working-out.webp",
                            alt: "A couple at the gym",
                            icon: "💪",
                            text: "Cheering each other on to be our best selves, and there for each other through the harder days too."
                        }
                    ]
                }
            ]
        }, dates: {
            tag: "🗺️ Date Ideas",
            tagClass: "tag-purple",
            heading: "Choose Our First Adventure",
            lead: "Tell me your rough location and what you'd be up for trying — I'll sort out a time and a place.",
            blocks: [
                {
                    type: "dateCards", cards: [
                        {
                            src: "img/dates/flower-market.webp", alt: "A flower market", title: "🍕 Foodie & Market", pills: [
                                "Pastry Adventure",
                                "Flower Market",
                                "Food Market"
                            ]
                        },
                        {
                            src: "img/dates/couple-date-bookstore.webp",
                            alt: "Calm Adventure",
                            title: "Chill mode",
                            pills: [
                                "Coffee & Walk",
                                "Nature walk",
                                "Bookstore Tour",
                                "Canal Walk"
                            ]
                        },
                        {
                            src: "img/dates/couple-on-date-axe-throwing.webp",
                            alt: "Axe throwing date",
                            title: "⚡ Active",
                            pills: [
                                "Arcade",
                                "Axe Throwing",
                                "Mini Golf",
                                "Virtual Clay Pigeon"
                            ]
                        },
                        {
                            src: "img/dates/couple-date-at-a-gallery.webp",
                            alt: "A museum gallery",
                            title: "🧠 Intellectual",
                            pills: [
                                "Museum",
                                "Art Gallery",
                                "Aquarium / Zoo",
                                "Planetarium",
                                "Exhibition"
                            ]
                        },
                        {
                            src: "img/dates/couple-date-pottery-class.webp",
                            alt: "A pottery class date",
                            title: "🎨 Creative",
                            pills: [
                                "Pottery",
                                "Kintsugi",
                                "Terrarium making",
                                "Cooking Class",
                                "Painting"
                            ]
                        },
                        {
                            src: "img/dates/couple-playing-video-games.webp",
                            alt: "Playing video games together",
                            title: "🎮 Video Game Session!",
                            pills: [
                                "Peak",
                                "It Takes Two",
                                "Split Fiction",
                                "Portal 2",
                                "Chat of Discord"
                            ]
                        }
                    ]
                }
            ]
        },

        /* ───────── Deep dive (accordion) ───────── */

        transparency: {
            blocks: [
                {
                    type: "note",
                    variant: "growth-banner",
                    text: "I think it's important to be upfront and self-aware. None of this defines me — it's just the honest stuff I'm actively working on, and I'd rather you know me fully."
                },
                {
                    type: "valueCols", columns: [
                        {
                            title: "Physical Health — On the Up",
                            items: [
                                "Since March 2025 I've worked with a personal trainer and lost ~10kg",
                                "Goal: reach a healthy 70–80kg",
                                "Managing high blood pressure & diabetes — and steadily improving"
                            ]
                        },
                        {
                            title: "Mind & Emotions — Self-Aware",
                            items: [
                                "Dyslexia, depression, anxious attachment & (undiagnosed) AuDHD",
                                "An overthinker and a recovering people-pleaser who feels things deeply",
                                "I've done therapy a couple of times before and I'm better for it!"
                            ]
                        }
                    ]
                },
                {
                    type: "note",
                    variant: "growth-note",
                    text: "I know my triggers and have worked hard to process most of my history. Consistent, open and honest communication is what keeps me steady — and it's the thing I value most in a relationship."
                },
                {
                    type: "photoGrid",
                    images: [
                        {
                            src: "img/warning-label/blood-pressure-check-medical.webp",
                            alt: "Blood pressure check"
                        },
                        {src: "img/warning-label/blood-glucose-test-diabetes.webp", alt: "Blood glucose test"},
                        {
                            src: "img/warning-label/judge-with-gavel-illustration.webp",
                            alt: "Self-aware"
                        },
                        {src: "img/warning-label/person-happy-with-hearts.webp", alt: "Feeling happy"},
                        {
                            src: "img/warning-label/person-multitasking-chaotic.webp",
                            alt: "Organised chaos"
                        },
                        {src: "img/warning-label/person-anxious-worried.webp", alt: "Feeling anxious"},
                        {
                            src: "img/warning-label/therapy-session-illustration.webp",
                            alt: "Therapy session"
                        },
                        {src: "img/warning-label/person-with-depression-symptoms.webp", alt: "Living with depression"},
                    ]
                }
            ]
        },

        hobbies: {
            blocks: [
                {
                    type: "paragraph",
                    text: "A bit of everything, honestly — making things, learning things, and getting outdoors. Here's what I actually spend my free time on, and why."
                },
                {
                    type: "interestCards", cards: [
                        {
                            icon: "🎨", title: "Making things",
                            body: "I'm always itching to build something with my hands — I've crocheted a Snorlax, thrown my own pottery, and I'm forever dabbling with different yarns and rope (shibari included). Lego and general DIY scratch the same itch.",
                            images: [
                                {src: "img/hobbies/alec-crochet-snorlax.webp", alt: "A Snorlax I crocheted"},
                                {src: "img/hobbies/alec-ceramic-pot-made.webp", alt: "A ceramic pot I threw"},
                                {src: "img/hobbies/knitting-in-progress.webp", alt: "A knitting project in progress"},
                                {src: "img/hobbies/lego-imperial-star-destroyer-built.webp", alt: "A Lego Imperial Star Destroyer I built"}
                            ],
                            tags: ["Crochet & Yarn", "Rope / Shibari", "Pottery", "Lego", "DIY", "Crafts"]
                        },
                        {
                            icon: "📷", title: "Photography",
                            body: "Photography threads through nearly everything else I do — nature, food, landscapes, my shibari art, fire and LED poi after dark, the stars, and my friends. I shoot on a Google Pixel 10 Pro (edited in Snapseed) and fly a DJI drone; I've got a Polaroid I'm still figuring out, and I'm dreaming of a proper camera — or even a telescope rig for night shots.",
                            images: [
                                {src: "img/hobbies/sunset-landscape-photography.webp", alt: "A landscape photo I took"},
                                {src: "img/hobbies/st-pauls-cathedral-london.webp", alt: "St Paul's Cathedral, London"}
                            ],
                            tags: ["Nature", "Landscapes", "Food", "Aerial", "Night & Astro", "Portraits"]
                        },
                        {
                            icon: "🎮", title: "Fun & Games",
                            body: "My home-office battle station is ready to work hard and play hard, no matter the day — and I've still got a soft spot for the classics, with original NES carts and a Game Boy in rotation. Off-screen it's board game nights and D&D campaigns.",
                            images: [
                                {src: "img/hobbies/alec-gaming-setup-triple-monitors.webp", alt: "My triple-monitor gaming desk"},
                                {src: "img/hobbies/nes-cartridge-retro-games.webp", alt: "Retro NES cartridges"},
                                {src: "img/hobbies/board-game-collection-in-bag.webp", alt: "My board game collection"},
                                {src: "img/hobbies/d20-dice-dnd.webp", alt: "D&D dice"}
                            ],
                            tags: ["Video Games", "Board Games", "D&D", "Pool / Snooker"]
                        },
                        {
                            icon: "🍜", title: "Food",
                            body: "I love experimenting in the kitchen to make something delicious from time to time — fresh cookies out the oven, a proper brew from an embarrassingly large tea collection — and I'm always on the adventure for my next best meal.",
                            images: [
                                {src: "img/hobbies/homemade-chocolate-chip-cookies.webp", alt: "Homemade chocolate chip cookies"},
                                {src: "img/hobbies/t2-tea-collection.webp", alt: "My tea collection"}
                            ],
                            tags: ["Cooking", "Baking", "Eating out", "Tea"]
                        },
                        {
                            icon: "🏃", title: "Active",
                            body: "Outdoorsy stuff that doesn't feel like a workout — long countryside walks (ideally with a dog), getting out on the bike, archery, and the showy one: spinning fire and LED staffs after dark.",
                            images: [
                                {src: "img/hobbies/autumn-walk-with-dachshund-dog.webp", alt: "An autumn countryside walk with a dachshund"},
                                {src: "img/hobbies/mountain-bike-on-path.webp", alt: "My mountain bike out on a path"},
                                {src: "img/hobbies/archery-target-with-arrows.webp", alt: "An archery target with my arrows"},
                                {src: "img/hobbies/alec-with-fire-spinning-staff.webp", alt: "Me spinning a fire staff"},
                                {src: "img/hobbies/alec-led-poi-spinning-light-trails.webp", alt: "LED staff light trails at night"}
                            ],
                            tags: ["Countryside walks", "Cycling", "Archery", "Fire & LED Staff"]
                        },
                        {
                            icon: "📚", title: "Curious & Learning",
                            body: "I love learning something new for no reason at all, and I'll happily derail a conversation to share whatever rabbit hole I've fallen down lately.",
                            details: [
                                {icon: "🔬", label: "Technology & Science", note: "how things actually work under the hood"},
                                {icon: "🏛️", label: "History", note: "ancient civilisations and odd turning points"},
                                {icon: "🐉", label: "Mythology", note: "the gods, monsters and stories behind it all"},
                                {icon: "🔤", label: "Etymology", note: "where words secretly come from"},
                                {icon: "🗺️", label: "Maps & Geography", note: "borders, places and the why behind them"},
                                {icon: "🌌", label: "Stargazing", note: "a clear night and something to point at"},
                                {icon: "🤯", label: "Random facts", note: "the kind nobody asked for"}
                            ]
                        }
                    ]
                }
            ]
        },

        bucketList: {
            blocks: [
                {
                    type: "cardGrid", cards: [
                        {
                            src: "img/bucket-list/camping-under-starry-sky.webp", icon: "⛺", title: "Glamping & Camping", caption: "Cosy nights out under the stars."
                        },
                        {
                            src: "img/bucket-list/medieval-renaissance-fair.webp", icon: "🎭", title: "LARP & Ren Faire", caption: "Dressing up and living the fantasy for a day."
                        },
                        {
                            src: "img/bucket-list/masquerade-ball-costume.webp", icon: "👑", title: "A Fantasy Ball", caption: "A masquerade in full costume."
                        },
                        {
                            src: "img/bucket-list/shakespeares-globe-theatre.webp",
                            icon: "🎬",
                            title: "A Play at The Globe",
                            caption: "Shakespeare the way it was meant to be seen."
                        },
                        {
                            src: "img/bucket-list/indoor-climbing-wall.webp", icon: "🧗", title: "Rock Climbing / Bouldering", caption: "Up the wall, one hold at a time."
                        },
                        {
                            src: "img/bucket-list/lavender-field-provence.webp", icon: "🌷", title: "A Flower Field", caption: "Lavender or tulips in full bloom."
                        },
                        {
                            src: "img/bucket-list/cpr-first-aid-training.webp", icon: "🩹", title: "Learn First Aid", caption: "Mental & physical — handy things to know."
                        },
                        {
                            src: "img/bucket-list/couple-on-vespas-italy.webp", icon: "🛵", title: "Learn to Ride a Moped", caption: "Vespa dreams, ideally in Italy."
                        },
                        {
                            src: "img/bucket-list/michelin-star-logo.webp", icon: "⭐", title: "More Michelin Restaurants", caption: "Chasing down those little stars."
                        },
                        {
                            src: "img/bucket-list/blacksmith.webp", icon: "🔨", title: "Blacksmithing / Forge", caption: "Hammering raw metal into something."
                        },
                        {
                            src: "img/bucket-list/campervan-road-trip-travel.webp",
                            icon: "✈️",
                            title: "Travel More",
                            caption: "Campervan road trips, Interrailing across Europe and spontaneous city breaks."
                        },
                        {
                            src: "img/bucket-list/dance-class.webp", icon: "💃", title: "Dance Classes", caption: "Learning to move."
                        },
                        {
                            src: "img/bucket-list/cooking-class.webp", icon: "🍳", title: "Cooking Classes", caption: "to cook something new."
                        },
                        {
                            src: "img/bucket-list/volunteer.webp", icon: "🤝", title: "Volunteer Work", caption: "Giving some time back to a good cause."
                        },
                        {
                            src: "img/bucket-list/glass-blowing.webp", icon: "🔥", title: "Glass Blowing", caption: "Shaping molten glass into something pretty."
                        },
                        {
                            src: "img/bucket-list/terrarium.webp", icon: "🌿", title: "Terrarium Making", caption: "A tiny living world under glass."
                        }
                    ]
                }
            ]
        },

        places: {
            blocks: [
                {type: "heading", text: "✈️ Where I've Been"},
                {
                    type: "placeCards", cards: [
                        {
                            country: "🇦🇺", name: "Australia", detail: "Sydney & East Coast", src: "img/places-been/sydney-opera-house-at-night.webp"
                        },
                        {
                            country: "🇳🇿", name: "New Zealand", detail: "Hobbiton", src: "img/places-been/alec-hobbiton-sign-new-zealand.webp"
                        },
                        {
                            country: "🇩🇪", name: "Germany", detail: "Berlin & Munich", src: "img/places-been/bavarian-beer-garden-munich.webp"
                        },
                        {
                            country: "🇵🇱", name: "Poland", detail: "Enjoying too much vodka...Never again...", src: "img/places-been/palace-of-culture-science-warsaw.webp"
                        },
                        {
                            country: "🇳🇱", name: "Netherlands", detail: "Amsterdam", src: "img/places-been/amsterdam-canal-street-view.webp"
                        },
                        {
                            country: "🇸🇪", name: "Sweden", detail: "Celebrating Midsummer", src: "img/places-been/alec-at-midsummer.webp"
                        },
                        {
                            country: "🇹🇭", name: "Thailand", detail: "Phuket", src: "img/places-been/alec-big-buddha-phuket-selfie.webp"
                        },
                        {
                            country: "🇺🇦", name: "Ukraine", detail: "Kyiv, Chernobyl, Odesa", src: "img/places-been/alec-chernobyl-ferris-wheel-pripyat.webp"
                        },
                        {
                            country: "🇨🇿", name: "Czechia", detail: "Prague", src: "img/places-been/prague.webp"
                        },
                        {
                            country: "🇮🇩", name: "Indonesia", detail: "Bali", src: "img/places-been/alec-mt-batur-arms-out-sunrise-bali.webp"
                        },
                        {
                            country: "🇺🇸", name: "USA · NYC", detail: "Concrete jungle where dreams are made of", src: "img/places-been/alec-times-square-new-york.webp"
                        },
                        {
                            country: "🇲🇻", name: "Maldives", detail: "", src: "img/places-been/alec-infinity-pool-maldives.webp"
                        },
                        {
                            country: "🇯🇵",
                            name: "Japan",
                            detail: "Tea, Food, Anime, Nintendo, Pokemon, Pokemon, Pokemon...",
                            src: "img/places-been/alec-kimono-torii-gate-japan.webp"
                        }
                    ]
                },
                {type: "heading", text: "Also Stamped My Passport In"},
                {
                    type: "tagRow", tags: [
                        "🇬🇷 Greece",
                        "🇪🇸 Spain",
                        "🇫🇷 France",
                        "🇨🇾 Cyprus"
                    ]
                },
                {type: "heading", text: "🗺️ Where I Want to Go Next"},
                {
                    type: "placeCards", cards: [
                        {
                            country: "🇮🇹", name: "Italy", detail: "Roman history & Italian food", src: "img/places-want/colosseum-rome-italy.webp"
                        },
                        {
                            country: "🇵🇪", name: "Peru", detail: "Machu Picchu", src: "img/places-want/machu-picchu-peru-ruins.webp"
                        },
                        {
                            country: "🇲🇽", name: "Mexico", detail: "Day of the Dead", src: "img/places-want/day-of-the-dead-mexico-candles-ofrenda.webp"
                        },
                        {
                            country: "🇮🇳", name: "India", detail: "The many festivals", src: "img/places-want/holi-festival-colour-india.webp"
                        },
                        {
                            country: "🇺🇸", name: "USA", detail: "Southern BBQ, Route 66, parks", src: "img/places-want/texas-bbq-brisket-ribs-platter.webp"
                        },
                        {
                            country: "🌌", name: "Nordics", detail: "Northern lights", src: "img/places-want/northern-lights-aurora-norway.webp"
                        },

                        {
                            country: "🇩🇰", name: "Denmark", detail: "The LEGO House in Billund", src: "img/places-want/lego-house.webp"
                        },
                        {
                            country: "🇬🇧", name: "UK", detail: "Seen surprisingly little of it", src: "img/places-want/cotswolds-village-england.webp"
                        },
                    ]
                },
                {type: "heading", text: "Daydreaming Of…"},
                {
                    type: "placeCards", cards: [
                        {
                            src: "img/places-want/italian-nonna-homemade-pasta-cooking.webp", detail: "Homemade pasta in Italy by a Nonna"
                        },
                        {
                            src: "img/places-want/family-feast-communal-dining-table.webp",
                            detail: "Enjoy Cultures food"
                        },
                        {src: "img/places-want/poolside-reading-sunglasses-book.webp", detail: "Relaxing poolside"},
                        {
                            src: "img/places-want/alpine-ski-chalet-snow-pool.webp",
                            detail: "Relaxing in a Snowy place"
                        },
                    ]
                },
                {
                    type: "paragraph", text: "…and honestly, the rest of the world too — there's so much food, history and culture I want to see it all."
                }
            ]
        },

        moviesTV: {
            blocks: [
                {
                    type: "paragraph", text: "I'm fairly flexible with what I watch and genuinely keen to learn what you love. A few of my comfort-watches:"
                },
                {type: "link", href: "https://letterboxd.com/alectronic0/", label: "Check out my Letterboxd"},
                {type: "heading", text: "Genres I Love"},
                {
                    type: "tagRow",
                    tags: [
                        "Comedy",
                        "Action",
                        "Adventure",
                        "Drama",
                        "Romance",
                        "Sci-Fi",
                        "Supernatural",
                        "Fantasy",
                        "Animation",
                        "Anime",
                        "Detective Procedurals",
                        {
                            label: "Horror — not for me", variant: "hate"
                        }
                    ]
                },
                {
                    type: "posterGrid",
                    posters: [
                        {title: "Spirited Away", src: "img/movies-tv/spirited-away-ghibli-movie-poster.webp"},
                        {
                            title: "Howl's Moving Castle",
                            src: "img/movies-tv/howls-moving-castle-ghibli-poster.webp"
                        },
                        {
                            title: "Avatar: The Last Airbender", src: "img/movies-tv/avatar-the-last-airbender-poster.webp"
                        },
                        {
                            title: "Fullmetal Alchemist: Brotherhood", src: "img/movies-tv/fullmetal-alchemist-brotherhood-poster.webp"
                        },
                        {title: "Frieren", src: "img/movies-tv/frieren-beyond-journeys-end-anime-poster.webp"},
                        {
                            title: "Delicious in Dungeon",
                            src: "img/movies-tv/delicious-in-dungeon-anime-poster.webp"
                        },
                        {title: "Food Wars", src: "img/movies-tv/food-wars-shokugeki-no-soma-anime-poster.webp"},
                        {
                            title: "Into the Spider-Verse", src: "img/movies-tv/spider-man-into-the-spider-verse-poster.webp"
                        },
                        {
                            title: "Scott Pilgrim vs the World", src: "img/movies-tv/scott-pilgrim-vs-the-world-poster.webp"
                        },
                        {title: "Iron Man", src: "img/movies-tv/iron-man-movie-poster.webp"},
                        {
                            title: "Agents of S.H.I.E.L.D.",
                            src: "img/movies-tv/marvel-agents-of-shield-poster.webp"
                        },
                        {title: "Kingsman", src: "img/movies-tv/kingsman-the-secret-service-poster.webp"},
                        {title: "Hot Fuzz", src: "img/movies-tv/hot-fuzz-movie-poster.webp"},
                        {title: "Airplane!", src: "img/movies-tv/airplane-comedy-movie-poster.webp"},
                        {title: "The Hitchhiker's Guide to the Galaxy", src: "img/movies-tv/hitchhikers-guide-to-the-galaxy-poster.webp"},
                        {title: "A Knight's Tale", src: "img/movies-tv/a-knights-tale-movie-poster.webp"},
                        {title: "Mulan", src: "img/movies-tv/mulan-disney-movie-poster.webp"},
                        {title: "Chef", src: "img/movies-tv/chef-movie-poster.webp"},
                        {title: "Hitch", src: "img/movies-tv/hitch-movie-poster.webp"},
                        {title: "The Proposal", src: "img/movies-tv/the-proposal-movie-poster.webp"},
                        {title: "Miss Congeniality", src: "img/movies-tv/miss-congeniality-movie-poster.webp"},
                        {title: "10 Things I Hate About You", src: "img/movies-tv/10-things-i-hate-about-you-poster.webp"},
                        {title: "Brooklyn Nine-Nine", src: "img/movies-tv/brooklyn-nine-nine-tv-show-poster.webp"},
                        {title: "Community", src: "img/movies-tv/community-tv-show-poster.webp"},
                        {title: "Friends", src: "img/movies-tv/friends-tv-show-cast-poster.webp"},
                        {title: "Suits", src: "img/movies-tv/suits-tv-show-complete-series.webp"},
                        {title: "Bones", src: "img/movies-tv/bones-tv-show-poster.webp"},
                        {title: "Castle", src: "img/movies-tv/castle-tv-show-poster.webp"},
                        {title: "Charmed", src: "img/movies-tv/charmed-tv-show-poster.webp"},
                        {title: "Eureka", src: "img/movies-tv/eureka-tv-show-poster.webp"},
                        {title: "Fringe", src: "img/movies-tv/fringe-tv-show-poster.webp"},
                        {title: "Warehouse 13", src: "img/movies-tv/warehouse-13-tv-show-poster.webp"},
                        {title: "Stargate", src: "img/movies-tv/stargate-sg1-atlantis-universe-posters.webp"},
                        {title: "Star Trek: Lower Decks", src: "img/movies-tv/star-trek-lower-decks-poster.webp"},
                        {title: "The Expanse", src: "img/movies-tv/the-expanse-amazon-prime-poster.webp"}
                    ]
                }
            ]
        },

        videoGames: {
            blocks: [
                {
                    type: "paragraph",
                    text: "Games are a big part of my life and I'd love someone to share it with. My favourite series is The Legend of Zelda; I play on PC & Nintendo, love the music, and geek out over game dev, glitches and speedruns."
                },
                {type: "link", href: "https://steamcommunity.com/id/alectronic0", label: "Check out my Steam"},
                {type: "heading", text: "Genres I Gravitate To"},
                {
                    type: "tagRow", tags: [
                        "Metroidvania",
                        "Platformer",
                        "Puzzle",
                        "Strategy / RTS",
                        "Cosy",
                        "Shooters",
                        "City Builders",
                        "Adventure"
                    ]
                },
                {
                    type: "posterGrid",
                    posters: [
                        {title: "Zelda: Ocarina of Time", src: "img/video-games/zelda-ocarina-of-time-cover.webp"},
                        {
                            title: "Hollow Knight",
                            src: "img/video-games/hollow-knight-game-cover.webp"
                        },
                        {title: "Hollow Knight: Silksong", src: "img/video-games/silksong.webp"},
                        {title: "Celeste", src: "img/video-games/celeste.webp"},
                        {
                            title: "Hades",
                            src: "img/video-games/hades.webp"
                        },
                        {
                            title: "Ori and the Blind Forest", src: "img/video-games/ori-and-the-blind-forest-cover.webp"
                        },
                        {title: "Tunic", src: "img/video-games/tunic-game-cover.webp"},
                        {
                            title: "Death's Door",
                            src: "img/video-games/deaths-door.webp"
                        },
                        {title: "Metroid Prime", src: "img/video-games/metroid-prime-cover.webp"},
                        {
                            title: "Octopath Traveler",
                            src: "img/video-games/octopath-traveler-cover.webp"
                        },
                        {title: "Final Fantasy VI", src: "img/video-games/final-fantasy-vi-cover.webp"},
                        {
                            title: "Cult of the Lamb",
                            src: "img/video-games/cult-of-the-lamb-cover.webp"
                        },
                        {title: "Deep Rock Galactic", src: "img/video-games/deep-rock-galactic-cover.webp"},
                        {
                            title: "Risk of Rain 2",
                            src: "img/video-games/risk-of-rain-2-cover.webp"
                        },
                        {title: "Valheim", src: "img/video-games/valheim-game-cover.webp"},
                        {
                            title: "Frostpunk",
                            src: "img/video-games/frostpunk-game-cover.webp"
                        },
                        {title: "Age of Mythology Retold", src: "img/video-games/age-of-mythology-retold-cover.webp"},
                        {
                            title: "It Takes Two",
                            src: "img/video-games/it-takes-two-game-cover.webp"
                        },
                        {title: "Split Fiction", src: "img/video-games/split-fiction-game-cover.webp"},
                        {
                            title: "Portal 2",
                            src: "img/video-games/portal-2-cover.webp"
                        },
                        {title: "Peak", src: "img/video-games/peak.webp"},
                        {title: "Overwatch 2", src: "img/video-games/overwatch.webp"},
                        {
                            title: "Captain Toad",
                            src: "img/video-games/captain-toad-treasure-tracker-cover.webp"
                        },
                        {title: "Super Mario Bros", src: "img/video-games/super-mario-bros-nes-box-art.webp"},
                        {
                            title: "Pokemon Red",
                            src: "img/video-games/pokemon-red-gameboy-cover.webp"
                        },
                        {title: "Minecraft", src: "img/video-games/minecraft.webp"},
                        {title: "Tetris", src: "img/video-games/tetris-game-logo.webp"},
                        {
                            title: "Call of Duty",
                            src: "img/video-games/call-of-duty.webp"
                        },
                        {title: "Mina the Hollower", src: "img/video-games/mina-the-hollower-cover-art.webp"}
                    ]
                },
            ]
        },

        food: {
            blocks: [
                {
                    type: "paragraph",
                    text: "I'm always chasing the best food in London and around the world — favourites are Asian (mostly Japanese) & Mexican, from street food to Michelin stars."
                },
                {type: "heading", text: "Top of the Menu"},
                {
                    type: "tagRow", tags: [
                        {label: "Tonkatsu", variant: "love"},
                        {label: "Sushi", variant: "love"},
                        {
                            label: "Ramen", variant: "love"
                        },
                        {label: "Bao Bun", variant: "love"},
                        {label: "Banh Mi", variant: "love"},
                        {
                            label: "Tacos", variant: "love"
                        },
                        {label: "BBQ Ribs", variant: "love"},
                        {
                            label: "Full English", variant: "love"
                        },
                        {label: "Sunday Roast", variant: "love"},
                        {label: "Matcha & Tea", variant: "love"},
                        {
                            label: "Pastries", variant: "love"
                        },
                        {label: "Sour sweets", variant: "love"}
                    ]
                },
                {type: "heading", text: "In the bin"},
                {
                    type: "tagRow", tags: [
                        {label: "Onion", variant: "hate"},
                        {label: "Sweetcorn", variant: "hate"}
                    ]
                },
                {type: "heading", text: "Food I've eaten"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/food/tonkotsu-ramen-bowl.webp", alt: "Tonkotsu ramen"},
                        {
                            src: "img/food/bao-buns-fries-tray.webp",
                            alt: "Bao buns"
                        },
                        {src: "img/food/banh-mi.webp", alt: "Banh mi"},
                        {
                            src: "img/food/street-tacos.webp",
                            alt: "Street tacos"
                        },
                        {src: "img/food/japanese-fried-chicken-moss-plating.webp", alt: "Japanese fried chicken"},
                        {
                            src: "img/food/korean-fried-chicken-wings.webp",
                            alt: "Korean fried chicken"
                        },
                        {src: "img/food/seared-tuna-tataki-sesame.webp", alt: "Tuna tataki"},
                        {
                            src: "img/food/beef-tataki-fine-dining.webp",
                            alt: "Beef tataki"
                        },
                        {src: "img/food/bacon-cheeseburger-brioche.webp", alt: "Bacon cheeseburger"},
                        {
                            src: "img/food/smash-double-cheeseburger.webp",
                            alt: "Smash burger"
                        },
                        {src: "img/food/smash-burger-with-fries.webp", alt: "Smash burger with fries"},
                        {
                            src: "img/food/full-english-breakfast-cafe.webp",
                            alt: "Full English breakfast"
                        },
                        {src: "img/food/duck-wellington-kale-fine-dining.webp", alt: "Duck Wellington"},
                        {
                            src: "img/food/scallop-fine-dining-starter.webp",
                            alt: "Scallop starter"
                        },
                        {src: "img/food/fine-dining-beef-mango-puree.webp", alt: "Fine dining beef"},
                        {
                            src: "img/food/tempura-green-beans-romesco.webp",
                            alt: "Tempura green beans"
                        },
                        {src: "img/food/matcha-soft-serve-ice-cream-cone.webp", alt: "Matcha soft serve"},
                        {
                            src: "img/food/chocolate-fondant-ice-cream-dessert.webp",
                            alt: "Chocolate fondant"
                        },
                        {src: "img/food/decorative-croissants-pastry-box.webp", alt: "Pastry box"},
                        {
                            src: "img/food/taco-dessert.webp",
                            alt: "Taco dessert"
                        },
                        {src: "img/food/meal-prep-chicken-rice-takeaway.webp", alt: "Meal prep"},
                        {
                            src: "img/food/cafe-food.webp",
                            alt: "Cafe food"
                        },
                        {src: "img/food/fancy-meal.webp", alt: "A fancy meal"}
                    ]
                },
                {type: "heading", text: "Food I've made"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/food/roast-chicken-sunday-dinner.webp", alt: "Sunday roast"},
                        {
                            src: "img/food/cookies.webp",
                            alt: "Cookies"
                        },
                        {src: "img/food/banoffee-pie.webp", alt: "Banoffee pie"},
                        {src: "img/food/banana-bread.webp", alt: "Banana bread"},
                        {
                            src: "img/food/bread.webp",
                            alt: "Sour dough"
                        },
                        {src: "img/food/lamb-curry.webp", alt: "Lamb Curry"},
                        {src: "img/food/carbonara.webp", alt: "Carbonara"},
                    ]
                },
                {type: "heading", text: "My chef specialties (without Images)"},
                {
                    type: "tagRow", tags: [
                        "Butter Chicken Curry",
                        "Lasagne",
                        "Mac & Cheese",
                        "Chilli con Carne",
                        "Karaage",
                        "Fajitas",
                    ]
                },
            ]
        },

        music: {
            blocks: [
                {
                    type: "paragraph",
                    text: "My taste is very eclectic — mostly video game & anime music, but ranging through metal, rock, rap, pop, lofi, j-pop and j-rock. I'm not big on loud, crowded venues, but I'd love to do a festival like Glastonbury one day."
                },
                {
                    type: "link", href: "https://open.spotify.com/user/alec_game", label: "Check out my Spotify"
                },
                {type: "heading", text: "Genres on Rotation"},
                {
                    type: "tagRow", tags: [
                        "Video Game Music",
                        "Anime Music",
                        "Metal",
                        "Rock",
                        "Rap",
                        "Pop",
                        "Lofi",
                        "J-Pop",
                        "J-Rock"
                    ]
                },
                {type: "heading", text: "Concerts & Live Music"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/music/sydney-operahouse-music-concert.webp", alt: "Concert at Sydney Opera House"},
                        {
                            src: "img/music/zelda-concert.webp",
                            alt: "A Zelda concert"
                        },
                        {src: "img/music/london-video-game-orchestra.webp", alt: "A video game orchestra"},
                        {
                            src: "img/music/friend-singing-on-stage.webp",
                            alt: "My friend performing"
                        },
                        {src: "img/music/wireless-festival-2009.webp", alt: "Wireless Festival 2009"},
                        {
                            src: "img/music/future-music-festival-2013.webp",
                            alt: "Future Music Festival 2013"
                        },
                    ]
                },
                {type: "heading", text: "Some Albums, Artist, Single I love!"},
                {
                    type: "cardGrid",
                    cards: [
                        {
                            title: "Pop Culture",
                            caption: "Song by Madeon - Just describe my eclectic taste in music (ok it mostly pop in this)",
                            src: "img/music/love/pop-culture.webp",
                            href: "https://www.youtube.com/watch?v=lTx3G6h2xyA"
                        },
                        {
                            title: "The Legend of Zelda Orchestra Concert",
                            caption: "Zelda music is so good!",
                            src: "img/music/love/zelda.webp",
                            href: "https://www.youtube.com/watch?v=xuXHrHRZzLk&list=RDxuXHrHRZzLk"
                        },
                        {
                            title: "Edge of the Earth",
                            caption: "Song by Golána - (a friend of mine who I literally have gone to the other side of the planet to see!)",
                            src: "https://i.scdn.co/image/ab67616d00001e02945c0852cf8e19cdfcd4269c",
                            href: "https://open.spotify.com/track/0gtvsUH1PQY1BMNzIgzhGL?si=16666bf439d749dc"
                        },
                        {
                            title: "The Decisive Battle (Boss track of Final Fantasy VI)",
                            caption: "Song by Nobuo Uematsu - I think this was the song that made me love video game music!",
                            src: "https://i.scdn.co/image/e5ac7ec5636e8c29e376eba45256c756b2879bf7",
                            href: "https://open.spotify.com/track/459meHLoi2qIoAAamGCc0x"
                        },
                        {
                            title: "Yasunori Nishiki",
                            caption: "Compose of the Octopath series the music is amazing",
                            src: "https://image-cdn-fa.spotifycdn.com/image/ab6761610000f1781ceaf3dd34211f6f527ac575",
                            href: "https://open.spotify.com/artist/0Ph31fnwwrbxz5d7mEE1Zv"
                        },
                        {
                            title: "Christopher Larkin",
                            caption: "Compose of the Hollow knight series the music is amazing",
                            src: "https://image-cdn-fa.spotifycdn.com/image/ab6761610000f17822c3ebc48fc86c3bfdc47dfe",
                            href: "https://open.spotify.com/artist/13kMpt8IdcHcdxPLcJrgU2"
                        },
                    ]
                },
            ]
        },

        books: {
            blocks: [
                {
                    type: "paragraph", text: "I'm not a huge reader — but if you love books I'll happily read your favourites. Roald Dahl is my favourite childhood author."
                },
                {type: "link", href: "https://goodreads.com/alectronic0", label: "Check out my Goodreads"},
                {type: "heading", text: "On My Shelf"},
                {
                    type: "posterGrid",
                    posters: [
                        {title: "Roald Dahl Collection", src: "img/books/illustration-from-roald-dahl-books.webp"},
                        {title: "Eragon", src: "img/books/eragon.webp"},
                        {title: "Artemis Fowl", src: "img/books/artemis-fowl-book.webp"},
                        {title: "Fullmetal Alchemist", src: "img/books/fullmetal-alchemist-book.webp"},
                        {title: "Spy x Family", src: "img/books/spy-x-family.webp"},
                        {title: "Computer Organization and Design", src: "img/books/computer-organisation-and-design-book.webp"},
                        {title: "Mythos by Stephen Fry", src: "img/books/mythos.webp"},
                        {title: "Dessert Person", src: "img/books/dessert-person.webp"},
                        {
                            title: "The Subtle Art of Not Giving a F*ck", src: "img/books/the-subtle-art-of-not-giving-a-fuck.webp"
                        },
                        {
                            title: "The Legend of Zelda Hyrule Historia", src: "img/books/the-legend-of-zelda-hyrule-historia.webp"
                        },
                        {
                            title: "The Legend of Zelda Art & Artifacts", src: "img/books/the-legend-of-zelda-art-artifacts.webp"
                        },

                        {title: "A Court of Thorns and Roses", src: "img/books/a-court-of-thorns-and-roses.webp"}
                    ]
                },
                {type: "heading", text: "To Be Read"},
                {
                    type: "posterGrid",
                    posters: [
                        {title: "The Baby Dragon Cafe", src: "img/books/the-baby-dragon-cafe.webp"},
                        {
                            title: "Legends & Lattes",
                            src: "img/books/legends-and-lattes-book.webp"
                        },
                        {
                            title: "Can't Spell Treason Without Tea", src: "img/books/cant-spell-treason-without-tea.webp"
                        },
                        {title: "Apprentice to the Villain", src: "img/books/apprentice-to-the-villain.webp"},
                        {
                            title: "Komi cant communicate",
                            src: "img/books/komi-cant-communicate.webp"
                        },
                        {title: "Frieren", src: "img/books/frieren.webp"}
                    ]
                }
            ]
        },

        podcasts: {
            blocks: [
                {
                    type: "paragraph", text: "On long car journeys I'll dip into a few of these — a mix of nerdy, thoughtful and dating-curious:"
                },
                {
                    type: "podcastCards", cards: [
                        {
                            title: "Trash Taste", description: "Anime, manga, and gaming culture", logo: "img/podcasts/trashtaste.webp"
                        },
                        {
                            title: "Diary of a CEO", description: "Business and personal development", logo: "img/podcasts/the-diary-of-a-ceo.webp"
                        },
                        {
                            title: "Lateral", description: "Lateral thinking puzzles and problem solving", logo: "img/podcasts/lateral.webp"
                        },
                        {
                            title: "The Rest Is Science", description: "Science communication and research", logo: "img/podcasts/the-rest-is-science.webp"
                        },
                        {
                            title: "Sweet & Sour", description: "", logo: "img/podcasts/sweet-and-sour-podcast.webp"
                        },
                        {
                            title: "Jillian on Love", description: "Relationship and dating advice", logo: "img/podcasts/jillian-on-love.webp"
                        },
                        {
                            title: "Luv Bites by Dr Tara", description: "Love and relationships with Dr Tara Marshall", logo: "img/podcasts/luv-bites-by-dr-tara.webp"
                        },
                        {
                            title: "The Sabrina Zohar Show", description: "Conversations about relationships and self", logo: "img/podcasts/sabrina-zohar-show.webp"
                        },
                        {
                            title: "Critical Role", description: "D&D actual play with voice actors", logo: "img/podcasts/critical-role.webp"
                        },
                        {
                            title: "99% Invisible", description: "Design, architecture, and hidden history", logo: "img/podcasts/99-percent-invisible.webp"
                        },
                        {
                            title: "History of Everything", description: "Historical narratives and stories", logo: "img/podcasts/history-of-everything.webp"
                        },
                        {
                            title: "Waveform", description: "Tech and gadget news", logo: "img/podcasts/waveform-podcast.webp"
                        },
                        {
                            title: "Kit & Krysta", description: "Nintendo theme podcast", logo: "img/podcasts/kit-and-krysta-podcast.webp"
                        },
                        {
                            title: "The AIAS Game Maker's Notebook", description: "Video game development and design", logo: "img/podcasts/game-makers-notebook.webp"
                        },
                        {
                            title: "TED Talks Daily", description: "Short TED talks on various topics", logo: "img/podcasts/ted-talk-daily.webp"
                        },
                        {
                            title: "TLDR News", description: "Daily news summary and analysis", logo: "img/podcasts/tldr-news.webp"
                        }
                    ]
                }
            ]
        },

        sports: {
            blocks: [
                {
                    type: "paragraph",
                    text: "Not really a sporty person, but I keep fit with cycling, long walks and the gym — and dabble in bouldering, archery and basketball. I don't really watch sport, but I support a few teams (mostly thanks to friends & family)."
                },
                {type: "heading", text: "Teams I support"},
                {
                    type: "logoGrid",
                    tiles: [
                        {src: "img/sports/mclaren-logo.webp", label: "McLaren F1"},
                        {
                            src: "img/sports/all-blacks-rugby.webp",
                            label: "All Blacks"
                        },
                        {src: "img/sports/england-three-lions-logo.webp", label: "England"},
                        {
                            src: "img/sports/arsenal-logo.webp",
                            label: "Arsenal"
                        },
                        {src: "img/sports/saracens-logo.webp", label: "Saracens"},
                    ]
                },
                {type: "heading", text: "Activities I enjoy doing!"},
                {
                    type: "logoGrid",
                    tiles: [
                        {src: "img/sports/archery.webp", label: "Archery"},
                        {
                            src: "img/sports/rock-climbing.webp",
                            label: "Bouldering"
                        },
                        {src: "img/sports/basketball.webp", label: "Basketball"},
                        {src: "img/sports/cycling.webp", label: "Cycling"},
                        {
                            src: "img/sports/bicep-curl.webp",
                            label: "Gym"
                        }
                    ]
                },

            ]
        },

        politics: {
            blocks: [
                {
                    type: "paragraph",
                    html: "I'm Liberal Left (Green Party at present). My main thing is supporting the poorest so we can all be more equal. My general philosophy: <strong style=\"color:var(--text);\">\"Try not to be a dick!\"</strong>"
                },
                {
                    type: "listCols", columns: [
                        {
                            groups: [
                                {
                                    title: "Policy & Support",
                                    items: [
                                        "Simpler tax rules & closing loopholes",
                                        "Nationalising utilities & transport",
                                        "Human rights & LGBTQIA+ (incl. Trans rights)",
                                        "Disability & neurodivergent equality",
                                        "Race & gender equality, reproductive rights",
                                        "Solving climate change"
                                    ]
                                }
                            ]
                        },
                        {
                            groups: [
                                {
                                    title: "Religion",
                                    items: [
                                        "Raised Christian; I now choose not to hold a belief system and just try to be as good and kind as I can",
                                        "I respect others' beliefs and try to educate myself on them"
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/politics/human-rights-sign.webp", alt: "Human rights"},
                        {
                            src: "img/politics/pride-flag.webp",
                            alt: "Pride flag"
                        },
                        {src: "img/politics/solarpunk-farmhouse-airships-illustration.webp", alt: "Solarpunk"},
                        {src: "img/politics/alan-turing.webp", alt: "Alan Turing"}
                    ]
                }
            ]
        },

        dislikes: {
            blocks: [
                {
                    type: "paragraph", text: "I can handle these — I just won't go seeking them out. Mostly it adds up to a preference for calm, intimate settings."
                },
                {
                    type: "cardGrid", cards: [
                        {
                            src: "img/dislikes/onions.webp", icon: "🧅", title: "Onion & sweetcorn", caption: "Getting better with onion, but won't be ordering it."
                        },
                        {
                            src: "img/dislikes/person-covering-ear-from-loud-noises.webp",
                            icon: "🔊",
                            title: "Loud noises",
                            caption: "Makes it hard to hear myself — noise-cancelling headphones to the rescue."
                        },
                        {
                            src: "img/dislikes/large-crowd.webp", icon: "👥", title: "Standing in crowds", caption: "Moving through is fine; lingering in a packed place, less so."
                        },
                        {
                            src: "img/dislikes/people-arguing-and-yelling.webp", icon: "😤", title: "Yelling", caption: "A big trigger for me."
                        },
                        {
                            src: "img/dislikes/roller-coaster.webp",
                            icon: "🎢",
                            title: "Rollercoasters",
                            caption: "The anticipation sets off my anxiety (though I've enjoyed them once on)."
                        },
                        {
                            src: "img/dislikes/hot-sunny-weather.webp",
                            icon: "☀️",
                            title: "Super hot weather",
                            caption: "Tbh, who really likes melting in the sun? Doesn't mean I don't like tropical holidays — just let me chill in the shade."
                        }
                    ]
                }
            ]
        },

        goals: {
            blocks: [
                {
                    type: "paragraph", text: "I've hit my main milestones — good job, a house, great friends. Still working on my health, and finding my life partner."
                },
                {
                    type: "listCols", columns: [
                        {
                            groups: [
                                {
                                    title: "🏡 Dream Home",
                                    items: [
                                        "Big house in the countryside",
                                        "near a train station and canal",
                                        "Big kitchen, games room, library & home office",
                                        "Living room with a proper cinema system",
                                        "Several spare bedrooms for guests and children",
                                        "A garden for growing fruit & veg"
                                    ]
                                }
                            ]
                        },
                        {
                            groups: [
                                {
                                    title: "👨‍👩‍👧‍👦 Family & Beyond",
                                    items: [
                                        "1–3 kids (70–80% sure, with the right person)",
                                        "1–2 dogs (open to a cat, but need at least one dog)",
                                        "No pets currently — solo life means a dog wouldn't get the attention it deserves right now, but it's high on the list for when that changes",
                                        "Marriage — no rush; sign the papers when we're sure, big wedding later",
                                        "Maybe: digital nomad life, or a few years in New Zealand"
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {type: "heading", text: "The Daydream, in Pictures"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/goals/open-plan-oak-kitchen-diner.webp", alt: "A dream kitchen"},
                        {
                            src: "img/goals/glass-roof-rustic-kitchen.webp",
                            alt: "A dream kitchen"
                        },
                        {src: "img/goals/living-room-home-cinema.webp", alt: "A home cinema"},
                        {
                            src: "img/goals/reading-nook.webp",
                            alt: "A reading nook"
                        },
                        {src: "img/goals/courtyard.webp", alt: "A courtyard"},
                        {
                            src: "img/goals/garden-planters.webp",
                            alt: "Garden planters"
                        },
                        {src: "img/goals/canal-walkway.webp", alt: "A canal walkway"},
                        {
                            src: "img/goals/couple-gaming-computer-setup.webp",
                            alt: "A couple's gaming setup"
                        },
                        {src: "img/goals/coding-on-a-computer-digital-nomad.webp", alt: "Digital nomad life"},
                        {
                            src: "img/goals/family-with-children.webp",
                            alt: "A family with children"
                        },
                        {src: "img/goals/wedding-fantasy.webp", alt: "A fantasy wedding"},
                        {src: "img/goals/dog.webp", alt: "A dog"}
                    ]
                }
            ]
        },

        plantsAnimals: {
            blocks: [
                {type: "heading", text: "🌸 Plants & Flowers I Find Pretty"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/plants/sakura.webp", alt: "Sakura"},
                        {src: "img/plants/tulips.webp", alt: "Tulips"},
                        {
                            src: "img/plants/lavender.webp",
                            alt: "Lavender"
                        },
                        {src: "img/plants/roses.webp", alt: "Roses"},
                        {src: "img/plants/bluebells.webp", alt: "Bluebells"},
                        {
                            src: "img/plants/freesia.webp",
                            alt: "Freesia"
                        },
                        {src: "img/plants/plumeria.webp", alt: "Plumeria"},
                        {src: "img/plants/lilyflower.webp", alt: "Lily"},
                        {
                            src: "img/plants/orchid.webp",
                            alt: "Orchid"
                        },
                        {src: "img/plants/bonsai.webp", alt: "Bonsai"},
                        {src: "img/plants/fern.webp", alt: "Fern"},
                        {
                            src: "img/plants/oak.webp",
                            alt: "Oak"
                        },
                        {src: "img/plants/willow-tree.webp", alt: "Willow tree"}
                    ]
                },
                {type: "heading", text: "🐉 Favourite Animals & Creatures"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/animals/barn-owl.webp", alt: "Barn owl"},
                        {src: "img/animals/red-panda.webp", alt: "Red panda"},
                        {
                            src: "img/animals/tortoise.webp",
                            alt: "Tortoise"
                        },
                        {src: "img/animals/wolf.webp", alt: "Wolf"},
                        {src: "img/animals/toothless-the-dragon.webp", alt: "A dragon"},
                        {
                            src: "img/animals/phoenix.webp",
                            alt: "A phoenix"
                        },
                        {src: "img/animals/cerberus.webp", alt: "Cerberus"},
                        {
                            src: "img/animals/loch-ness-monster.webp",
                            alt: "The Loch Ness Monster"
                        },
                        {src: "img/animals/triceratops.webp", alt: "Triceratops"},
                        {src: "img/animals/ankylosaurus.webp", alt: "Ankylosaurus"}
                    ]
                }
            ]
        }
    },


    // Renders with the same component as `contact` — just a different title and
    // text. With no `links` of its own it reuses contact.links (single source).
    outro: {
        tag: "🎉 One Last Thing",
        heading: "Thanks for Getting This Far!",
        lead: "If you've liked what you've seen, please reach out — I'd love to hear from you and put together a fun first date."
    }
};
