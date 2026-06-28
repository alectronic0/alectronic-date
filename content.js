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
        tagline: "Loveable nerd, looking for his player 2. No swiping required.",
        cta: "Come find out more ↓",
        images: [
            {src: "img/coverphoto/index.png", alt: "Alec Doran-Twyford"},
            {src: "img/alec/PXL_20251128_071312852.PORTRAIT.jpg", alt: "Alec smiling"},
            {src: "img/alec/PXL_20260514_052228361.PORTRAIT.jpg", alt: "Alec portrait"}
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
        photo: {src: "img/coverphoto/index.png", alt: "Alec Doran-Twyford"},
        facts: [
            {icon: "🚹", label: "Gender", value: "Male"},
            {icon: "❤️", label: "Orientation", value: "Straight"},
            {icon: "🗣️", label: "Pronouns", value: ["He / Him ", " They / Them"]},
            {icon: "🎂", label: "Age", value: "35 · 19 May (Taurus)"},
            {icon: "💼", label: "Profession", value: "Software Engineer"},
            {icon: "🎓", label: "Education", value: "BSc Computer Science"},
            {icon: "🌍", label: "Nationality", value: ["British", "New Zealander"]},
            {
                icon: "📍",
                label: "Living in",
                value: "Welwyn Garden City",
                href: "https://www.google.com/maps/place/Welwyn+Garden+City"
            },
            {icon: "📏", label: "Height", value: "~5'8\""},
            {icon: "🌱", label: "Politics", value: "Liberal / Left"},
        ]
    },
    contact: {
        tag: "💬 How to Get in Touch",
        heading: "Shoot Your Shot",
        lead: "I prefer not to share my phone number upfront — but reach me through any of these and you'll get a hold of me.",
        links: [
            {
                label: "Email",
                icon: "✉",
                href: "mailto:date.alec@alectronic.co.uk?subject=RE%3A%20Alec%20Dating%20Application",
                primary: true
            },
            {
                label: "Linktree",
                href: "https://linktr.ee/Alectronic",
            },
            {label: "Instagram", href: "https://www.instagram.com/alectronic0/"},
            {label: "LinkedIn", href: "https://www.linkedin.com/in/alectronic0/"},
            {label: "Telegram", href: "https://t.me/alectronic0"}
        ]
    },

    /* ── Faces marquee ── */
    faces: {
        tag: "📸 A Few Faces of Alec",
        heading: "Snapshots From the Life",
        lead: "Yes, I'm the one in most of them. Tap any photo to enlarge.",
        photos: [
            {src: "img/alec/headshot of alec.png", alt: "Alec"},
            {src: "img/alec/PXL_20251128_071312852.PORTRAIT.jpg", alt: "Alec"},
            {src: "img/alec/PXL_20260514_052228361.PORTRAIT.jpg", alt: "Alec"},
            {src: "img/alec/PXL_20260522_014927602.PORTRAIT.jpg", alt: "Alec"},
            {src: "img/alec/alec kimono torii gate japan.jpg", alt: "Alec in Japan"},
            {src: "img/alec/PXL_20240525_084631053.PORTRAIT.jpg", alt: "Alec"},
            {src: "img/alec/alec times square new york.png", alt: "Alec in New York"},
            {src: "img/alec/fire spining.jpg", alt: "Alec fire spinning"},
            {src: "img/alec/PXL_20251007_203516750.RAW-01.jpg", alt: "Alec"},
            {src: "img/alec/PXL_20260502_084552947.PORTRAIT.jpg", alt: "Alec"},
            {src: "img/alec/alec at pokemon kanto with pokemon plushies.jpg", alt: "Alec with Pokemon plushies"},
            {src: "img/alec/alec flower crown midsommar sweden.png", alt: "Alec at Midsommar"},
            {src: "img/alec/onsen.jpg", alt: "Alec at an onsen"},
            {src: "img/alec/alec big buddha phuket selfie.png", alt: "Alec in Phuket"},
            {src: "img/alec/alec dress as mad scienst for halloweeen.png", alt: "Alec dressed as a mad scientist"},
            {src: "img/alec/alec with his family dog monty.png", alt: "Alec with his dog Monty"},
            {src: "img/alec/alec eating out.png", alt: "Alec eating out"},
            {src: "img/alec/alec holding a pineapple.png", alt: "Alec holding a pineapple"},
            {src: "img/alec/alec swimming tropical river pool.png", alt: "Alec swimming"},
            {src: "img/moments/alec setting of on his backpacking advanture.png", alt: "Alec backpacking"},
            {src: "img/moments/alec feeding load of backpackers.png", alt: "Alec cooking for backpackers"},
            {src: "img/alec/alec in a garden.jpg", alt: "Alec in a garden"},
            {src: "img/alec/PXL_20260501_151845261.PORTRAIT.jpg", alt: "Alec"}
        ]
    },

    /* ── Mid-page sections (each = blocks[]) ── */
    sections: {

        moments: {
            tag: "🏆 Notable Moments",
            tagClass: "tag-gold",
            heading: "A Life Well Lived (So Far)",
            blocks: [
                {
                    type: "cardGrid",
                    cards: [
                        {
                            image: "img/moments/alec at graduation.png",
                            icon: "🎓",
                            title: "Got a 1st @ University",
                            caption: "BSc Computer Science, top marks."
                        },
                        {
                            image: "img/moments/google map showing the drunken walk home from london.png",
                            icon: "🚶",
                            title: "Walked home from London",
                            caption: "23.5km, drunk, on a dare to myself."
                        },
                        {
                            image: "img/moments/alec with david tenant.png",
                            icon: "⭐",
                            title: "Met David Tennant",
                            caption: "Yes, the Doctor. Very lovely in person."
                        },
                        {
                            image: "img/moments/alec setting of on his backpacking advanture.png",
                            icon: "🎒",
                            title: "Backpacked for 2 years",
                            caption: "Around the world, one hostel at a time."
                        },
                        {
                            image: "img/moments/alec in a bikini as a dare.png",
                            icon: "👙",
                            title: "Bikini on Valentine's Day",
                            caption: "A surf-camp dare I fully committed to."
                        },
                        {
                            image: "img/moments/alec sky diving.jpg",
                            icon: "🪂",
                            title: "Skydived",
                            caption: "Jumped out of a perfectly good plane."
                        },
                        {
                            image: "img/moments/alec feeding load of backpackers.png",
                            icon: "👨‍🍳",
                            title: "Cooked for 30 backpackers",
                            caption: "One big pot, one happy hostel."
                        },
                        {
                            image: "img/moments/trophie of most entuastic google city expert (now google local guides).png",
                            icon: "📍",
                            title: "Most Enthusiastic City Expert",
                            caption: "Google's award — now Local Guides."
                        },
                        {
                            image: "img/alec/alec completing a 10k run.png",
                            icon: "🏃",
                            title: "Ran a 10km",
                            caption: "Crossed the line, legs intact."
                        },
                        {
                            image: "img/moments/alec holding keys of his home.png",
                            icon: "🏠",
                            title: "Bought a house",
                            caption: "Keys in hand, properly grown up."
                        },
                        {
                            image: "img/alec/alec on top of mt katumba in bali.png",
                            icon: "🌋",
                            title: "Climbed a volcano",
                            caption: "Sunrise from the top of Mt Batur, Bali."
                        },
                        {
                            image: "img/alec/alec kimono torii gate japan.jpg",
                            icon: "🇯🇵",
                            title: "A month solo in Japan",
                            caption: "Temples, ramen and a lot of walking."
                        }
                    ]
                }
            ]
        },
        boyfriendMode: {
            tag: "❤️ Boyfriend mode in Action",
            tagClass: "tag-rose",
            heading: "What Dating Me Could Look Like",
            lead: "A peek at \"boyfriend mode\" — the little things I love doing for the person I'm with.",
            blocks: [
                {
                    type: "featureGrid",
                    features: [
                        {
                            image: "img/boyfriend-mode/a couple hugging.png",
                            alt: "A couple hugging",
                            icon: "🤗",
                            text: "Always supportive and caring — there through the good and bad times, with great hugs, forehead kisses and massages."
                        },
                        {
                            image: "img/boyfriend-mode/boyfirend driving his passanger princess.png",
                            alt: "Driving",
                            icon: "👑",
                            text: "Full passenger-princess treatment whenever we're on the road."
                        },
                        {
                            image: "img/boyfriend-mode/person writing a google doc about his girl friend.png",
                            alt: "Writing a doc",
                            icon: "📊",
                            text: "Keeping docs & spreadsheets of the things that matter to you and our plans."
                        },
                        {
                            image: "img/boyfriend-mode/cartoon of a person sharing tiktok memes.png",
                            alt: "Sharing memes",
                            icon: "😂",
                            text: "Pebbling you with hundreds of perfectly curated memes."
                        },
                        {
                            image: "img/boyfriend-mode/a google calander invite for cute date.png",
                            alt: "A calendar invite for a date",
                            icon: "📅",
                            text: "Organising cute dates (and yes, adding them to Google Calendar)."
                        },
                        {
                            image: "img/boyfriend-mode/person getting coffee from a shop.png",
                            alt: "Getting coffee",
                            icon: "☕",
                            text: "Always knowing your coffee order & keeping your favourite snack on hand."
                        },
                        {
                            image: "img/boyfriend-mode/person taking photo.png",
                            alt: "Taking a photo",
                            icon: "📸",
                            text: "Your personal photographer — making sure you always look great."
                        },
                        {
                            image: "img/boyfriend-mode/person suprising someone with flowers.png",
                            alt: "Surprise flowers",
                            icon: "💐",
                            text: "Random flowers and cute little gifts, just because."
                        }
                    ]
                }
            ]
        },
        lookingFor: {
            tag: "✨ What I'm Looking For",
            tagClass: "tag-gold",
            heading: "An Invitation, Not a Checklist",
            lead: "I have a full, happy life — I'm just hoping to share it. Here's the kind of \"us\" I'm dreaming about.",
            blocks: [
                {
                    type: "valueCols",
                    columns: [
                        {
                            title: "Enjoys Going on Adventures",
                            items: [
                                "Travelling & Exploring new cultures",
                                "Hunting down amazing food places",
                                "Trying out new actives & Experiences",
                                "Going for walks in nature",
                            ]
                        },
                        {
                            title: "Enjoys Cosy days at home",
                            items: [
                                "Cooking/baking",
                                "Playing Video games",
                                "Watching TV/Movies",
                                "Dancing in the kitchen",
                                "Doing fun activities at home",
                            ]
                        },
                        {
                            title: "Values",
                            items: [
                                "Clear and open communication",
                                "Pushing each other to be our best selves",
                                "Willingness to work through the hard times",
                                "Quality time and mutual affection",
                            ]
                        },
                        {
                            title: "One last thing...",
                            items: [
                                "Someone open to my interests...",
                                "and excited to share theirs"
                            ]
                        },
                    ]
                },
                {
                    type: "featureGrid",
                    features: [
                        {
                            image: "img/looking-for/couple cooking.png",
                            alt: "A couple cooking",
                            icon: "🍳",
                            text: "Cooking and baking together on a cosy evening."
                        },
                        {
                            image: "img/looking-for/couple playing video games.png",
                            alt: "A couple gaming",
                            icon: "🎮",
                            text: "Co-op games and friendly rivalry on the sofa."
                        },
                        {
                            image: "img/looking-for/couple going exploring nature.png",
                            alt: "A couple exploring nature",
                            icon: "🌿",
                            text: "Adventures, travel and finding amazing food places."
                        },
                        {
                            image: "img/looking-for/couple watching movie togehter.png",
                            alt: "A couple watching a movie",
                            icon: "🍿",
                            text: "Lazy days at home with a film and good company."
                        },
                        {
                            image: "img/looking-for/couple enjoying tea on the couch.png",
                            alt: "A couple enjoying tea",
                            icon: "🫖",
                            text: "Slow mornings, tea, and easy quiet time together."
                        },
                        {
                            image: "img/looking-for/couple at the gym working out.png",
                            alt: "A couple at the gym",
                            icon: "💪",
                            text: "Cheering each other on to be our best selves."
                        }
                    ]
                }
            ]
        },
        dates: {
            tag: "🗺️ Date Ideas",
            tagClass: "tag-purple",
            heading: "Choose Our First Adventure",
            lead: "Tell me your rough location and what you'd be up for trying — I'll sort out a time and a place.",
            blocks: [
                {
                    type: "dateCards",
                    cards: [
                        {
                            image: "img/dates/flower market.png",
                            alt: "A flower market",
                            title: "🍕 Foodie & Market",
                            pills: ["Pastry Adventure", "Flower Market", "Food Market"]
                        },
                        {
                            image: "img/dates/flower market.png",
                            alt: "Calm Adventure",
                            title: "Chill mode",
                            pills: ["Coffee & Walk", "Nature walk", "Bookstore Tour", "Canal Walk"]
                        },
                        {
                            image: "img/dates/couple on date aex throwing.png",
                            alt: "Axe throwing date",
                            title: "⚡ Active",
                            pills: ["Arcade", "Axe Throwing", "Mini Golf", "Virtual Clay Pigeon"]
                        },
                        {
                            image: "img/dates/museum gallery.png",
                            alt: "A museum gallery",
                            title: "🧠 Intellectual",
                            pills: ["Museum", "Art Gallery", "Aquarium / Zoo", "Planetarium", "Exhibition"]
                        },
                        {
                            image: "img/dates/couple date pottery class.png",
                            alt: "A pottery class date",
                            title: "🎨 Creative",
                            pills: ["Pottery", "Kintsugi", "Terrarium making", "Cooking Class", "Paining"]
                        },
                        {
                            image: "img/dates/couple playing video games.png",
                            alt: "Playing video games together",
                            title: "🎮 Video Game Session!",
                            pills: ["Peak", "It Takes Two", "Split Fiction", "Portal 2", "Chat of Discord"]
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
                    type: "valueCols",
                    columns: [
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
                                "I've done therapy couple times before and I am better or it!"
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
                        {src: "img/warning-label/blood pressure check medical.png", alt: "Blood pressure check"},
                        {src: "img/warning-label/blood glucose test diabetes.png", alt: "Blood glucose test"},
                        {src: "img/warning-label/therapy session illustration.png", alt: "Therapy session"},
                        {src: "img/warning-label/person with depression symptoms.png", alt: "Living with depression"},
                        {src: "img/warning-label/person happy with hearts.png", alt: "Feeling happy"},
                        {src: "img/warning-label/judge with gavel illustration.png", alt: "Self-aware"},
                        {src: "img/warning-label/person multitasking chaotic.png", alt: "Organised chaos"},
                        {src: "img/warning-label/person anxious worried.png", alt: "Feeling anxious"}
                    ]
                }
            ]
        },

        hobbies: {
            blocks: [
                {type: "heading", text: "🍜 Food"},
                {type: "tagRow", tags: ["Cooking", "Baking", "Eating out", "Tea"]},
                {type: "heading", text: "🎨 Creative"},
                {
                    type: "tagRow",
                    tags: ["DIY", "Lego", "Crochet / Knitting", "Photography", "Crafts", "Pottery", "Shibari"]
                },
                {type: "heading", text: "📺 Media"},
                {type: "tagRow", tags: ["Anime & Manga", "Marvel", "Fantasy & Sci-fi", "Comedy"]},
                {type: "heading", text: "🎮 Fun & Games"},
                {type: "tagRow", tags: ["Video Games", "Pool / Snooker", "Board Games", "D&D"]},
                {type: "heading", text: "📚 Educational"},
                {
                    type: "tagRow",
                    tags: ["Technology & Science", "History", "Mythology", "Etymology", "Random facts", "Maps", "Stargazing"]
                },
                {type: "heading", text: "🏃 Active"},
                {type: "tagRow", tags: ["Countryside walks", "Archery", "Cycling", "Fire Spinning"]},
                {type: "heading", text: "In Pictures"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/hobbies/alec ceramic pot made.png", alt: "A ceramic pot I made"},
                        {src: "img/hobbies/alec crochet snorlax.png", alt: "A crocheted Snorlax"},
                        {
                            src: "img/hobbies/alec desk with gameboy orchid lego.png",
                            alt: "My desk with Game Boy, orchid and Lego"
                        },
                        {src: "img/hobbies/lego imperial star destroyer built.png", alt: "A built Lego Star Destroyer"},
                        {src: "img/hobbies/knitting in progress.png", alt: "Knitting in progress"},
                        {src: "img/hobbies/homemade chocolate chip cookies.png", alt: "Homemade cookies"},
                        {src: "img/hobbies/t2 tea collection.png", alt: "My tea collection"},
                        {src: "img/hobbies/board game collection in bag.png", alt: "Board game collection"},
                        {src: "img/hobbies/d20 dice dnd.png", alt: "D&D dice"},
                        {src: "img/hobbies/archery target with arrows.png", alt: "Archery target"},
                        {src: "img/hobbies/mountain bike on path.png", alt: "Mountain biking"},
                        {src: "img/hobbies/autumn walk with dachshund dog.png", alt: "An autumn walk with a dog"},
                        {src: "img/hobbies/nes cartridge retro games.png", alt: "Retro NES games"},
                        {src: "img/hobbies/st pauls cathedral london.png", alt: "St Paul's Cathedral"},
                        {src: "img/hobbies/shibari rope bondage legs.png", alt: "Shibari rope work"},
                        {src: "img/hobbies/Landscape 005.jpg", alt: "A landscape photo I took"},
                        {src: "img/hobbies/20131222_205929.JPG", alt: "A hobby moment"},
                        {src: "img/hobbies/alec with fire spinning staff.png", alt: "Alec fire spinning"},
                        {src: "img/hobbies/IMG_20240528_173146_931.jpg", alt: "A hobby moment"},
                        {src: "img/hobbies/PXL_20231209_170333969_exported_1702148485759.jpg", alt: "A hobby moment"}
                    ]
                }
            ]
        },

        bucketList: {
            blocks: [
                {
                    type: "listCols",
                    columns: [
                        {
                            groups: [{
                                title: "✈️ Travel More",
                                items: ["Campervan", "Interrail", "City breaks", "Glamping & camping"]
                            }, {
                                title: "🎭 Experiences",
                                items: ["LARP / Ren faire / Fantasy ball", "A play at The Globe", "Rock climbing / bouldering", "A flower field (lavender / tulips)", "Learn first aid (mental & physical)", "Learn to ride a moped", "Dance & cooking classes", "The Lego House in Denmark", "More Michelin restaurants", "Volunteer work"]
                            }]
                        },
                        {
                            groups: [{
                                title: "🎨 Creative",
                                items: ["Glass blowing", "Blacksmithing / forge", "Terrarium making"]
                            }]
                        }
                    ]
                },
                {type: "heading", text: "In Pictures"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/bucket-list/camping under starry sky.png", alt: "Camping under the stars"},
                        {src: "img/bucket-list/couple on vespas italy.png", alt: "Vespas in Italy"},
                        {src: "img/bucket-list/lavender field provence.png", alt: "A lavender field"},
                        {src: "img/bucket-list/medieval renaissance fair.png", alt: "A renaissance fair"},
                        {src: "img/bucket-list/shakespeares globe theatre.png", alt: "Shakespeare's Globe"},
                        {src: "img/bucket-list/indoor climbing wall.png", alt: "An indoor climbing wall"},
                        {src: "img/bucket-list/cpr first aid training.png", alt: "First aid training"},
                        {src: "img/bucket-list/michelin star logo.png", alt: "Michelin star"},
                        {src: "img/bucket-list/blacksmith.png", alt: "Blacksmithing"},
                        {src: "img/bucket-list/image125.png", alt: "A bucket-list idea"}
                    ]
                }
            ]
        },

        places: {
            blocks: [
                {type: "heading", text: "✈️ Where I've Been"},
                {
                    type: "placeCards",
                    cards: [
                        {
                            country: "🇳🇿",
                            name: "New Zealand",
                            detail: "Hobbiton",
                            image: "img/places-been/alec hobbiton sign new zealand.png"
                        },
                        {
                            country: "🇦🇺",
                            name: "Australia",
                            detail: "Sydney & East Coast",
                            image: "img/places-been/sydney opera house at night.png"
                        },
                        {
                            country: "🇹🇭",
                            name: "Thailand",
                            detail: "Phuket",
                            image: "img/places-been/alec big buddha phuket selfie.png"
                        },
                        {
                            country: "🇩🇪",
                            name: "Germany",
                            detail: "Berlin & Munich",
                            image: "img/places-been/bavarian beer garden munich.png"
                        },
                        {
                            country: "🇨🇿",
                            name: "Czechia",
                            detail: "Prague",
                            image: "img/places-been/alec giant beer stein germany.png"
                        },
                        {
                            country: "🇳🇱",
                            name: "Netherlands",
                            detail: "Amsterdam",
                            image: "img/places-been/amsterdam canal street view.png"
                        },
                        {
                            country: "🇨🇾",
                            name: "Cyprus",
                            detail: "Aphrodite's Rock",
                            image: "img/places-been/aphrodites rock beach cyprus.png"
                        },
                        {
                            country: "🇸🇪",
                            name: "Sweden",
                            detail: "Midsommar",
                            image: "img/places-been/alec flower crown midsommar sweden.png"
                        },
                        {
                            country: "🇺🇦",
                            name: "Ukraine",
                            detail: "Pripyat",
                            image: "img/places-been/alec chernobyl ferris wheel pripyat.png"
                        },
                        {
                            country: "🇵🇱",
                            name: "Poland",
                            detail: "Warsaw & Krakow",
                            image: "img/places-been/warsaw aerial city view.png"
                        },
                        {
                            country: "🇵🇱",
                            name: "Warsaw",
                            detail: "Palace of Culture",
                            image: "img/places-been/palace of culture science warsaw.png"
                        },
                        {
                            country: "🎄",
                            name: "Christmas Markets",
                            detail: "Across Europe",
                            image: "img/places-been/christmas market night aerial view.png"
                        }
                    ]
                },
                {type: "heading", text: "Also Stamped My Passport In"},
                {
                    type: "tagRow",
                    tags: ["🇬🇷 Greece", "🇪🇸 Spain", "🇫🇷 France", "🇺🇸 USA · NYC", "🇲🇻 Maldives", "🇯🇵 Japan", "🇮🇩 Indonesia · Bali"]
                },
                {type: "heading", text: "🗺️ Where I Want to Go Next"},
                {
                    type: "placeCards",
                    cards: [
                        {
                            country: "🇮🇹",
                            name: "Italy",
                            detail: "Roman history & Italian food",
                            image: "img/places-want/colosseum rome italy.png"
                        },
                        {
                            country: "🇵🇪",
                            name: "Peru",
                            detail: "Machu Picchu",
                            image: "img/places-want/machu picchu peru ruins.png"
                        },
                        {
                            country: "🇲🇽",
                            name: "Mexico",
                            detail: "Day of the Dead",
                            image: "img/places-want/day of the dead mexico candles ofrenda.png"
                        },
                        {
                            country: "🇮🇳",
                            name: "India",
                            detail: "The many festivals",
                            image: "img/places-want/holi festival colour india.png"
                        },
                        {
                            country: "🇺🇸",
                            name: "USA",
                            detail: "Southern BBQ, Route 66, parks",
                            image: "img/places-want/texas bbq brisket ribs platter.png"
                        },
                        {
                            country: "🌌",
                            name: "Nordics",
                            detail: "Northern lights",
                            image: "img/places-want/northern lights aurora norway.png"
                        },
                        {
                            country: "🇬🇧",
                            name: "UK",
                            detail: "Seen surprisingly little of it",
                            image: "img/places-want/cotswolds village england.png"
                        },
                        {
                            country: "🥾",
                            name: "Patagonia",
                            detail: "Torres del Paine",
                            image: "img/places-want/patagonia hiking torres del paine.png"
                        },
                        {
                            country: "🏔️",
                            name: "Snowy place",
                            detail: "Snow & mountains",
                            image: "img/places-want/alpine ski chalet snow pool.png"
                        }
                    ]
                },
                {type: "heading", text: "Daydreaming Of…"},
                {
                    type: "placeCards",
                    cards: [
                        {
                            image: "img/places-want/italian nonna homemade pasta cooking.png",
                            alt: "Homemade pasta in Italy"
                        },
                        {image: "img/places-want/family feast communal dining table.png", alt: "A communal feast"},
                        {image: "img/places-want/poolside reading sunglasses book.png", alt: "Reading poolside"}
                    ]
                },
                {
                    type: "paragraph",
                    text: "…and honestly, the rest of the world too — there's so much food, history and culture I want to see it all."
                }
            ]
        },

        moviesTV: {
            blocks: [
                {
                    type: "paragraph",
                    text: "I'm fairly flexible with what I watch and genuinely keen to learn what you love. A few of my comfort-watches:"
                },
                {type: "link", href: "https://letterboxd.com/alectronic0/", label: "Check out my Letterboxd"},
                {type: "heading", text: "Genres I Love"},
                {
                    type: "tagRow",
                    tags: ["Comedy", "Action", "Adventure", "Drama", "Romance", "Sci-Fi", "Supernatural", "Fantasy", "Animation", "Anime", "Detective Procedurals", {
                        label: "Horror — not for me",
                        variant: "hate"
                    }]
                },
                {
                    type: "posterGrid",
                    posters: [
                        {title: "Spirited Away", image: "img/movies-tv/spirited away ghibli movie poster.png"},
                        {title: "Howl's Moving Castle", image: "img/movies-tv/howls moving castle ghibli poster.png"},
                        {
                            title: "Avatar: The Last Airbender",
                            image: "img/movies-tv/avatar the last airbender poster.png"
                        },
                        {
                            title: "Fullmetal Alchemist: Brotherhood",
                            image: "img/movies-tv/fullmetal alchemist brotherhood poster.png"
                        },
                        {title: "Frieren", image: "img/movies-tv/frieren beyond journeys end anime poster.png"},
                        {title: "Delicious in Dungeon", image: "img/movies-tv/delicious in dungeon anime poster.png"},
                        {title: "Food Wars", image: "img/movies-tv/food wars shokugeki no soma anime poster.png"},
                        {
                            title: "Into the Spider-Verse",
                            image: "img/movies-tv/spider-man into the spider-verse poster.png"
                        },
                        {
                            title: "Scott Pilgrim vs the World",
                            image: "img/movies-tv/scott pilgrim vs the world poster.png"
                        },
                        {title: "Iron Man", image: "img/movies-tv/iron man movie poster.png"},
                        {title: "Agents of S.H.I.E.L.D.", image: "img/movies-tv/marvel agents of shield poster.png"},
                        {title: "Kingsman", image: "img/movies-tv/kingsman the secret service poster.png"},
                        {title: "Hot Fuzz", image: "img/movies-tv/hot fuzz movie poster.png"},
                        {title: "Airplane!", image: "img/movies-tv/airplane comedy movie poster.png"},
                        {
                            title: "The Hitchhiker's Guide to the Galaxy",
                            image: "img/movies-tv/hitchhikers guide to the galaxy poster.png"
                        },
                        {title: "A Knight's Tale", image: "img/movies-tv/a knights tale movie poster.png"},
                        {title: "Mulan", image: "img/movies-tv/mulan disney movie poster.png"},
                        {title: "Chef", image: "img/movies-tv/chef movie poster.png"},
                        {title: "Hitch", image: "img/movies-tv/hitch movie poster.png"},
                        {title: "The Proposal", image: "img/movies-tv/the proposal movie poster.png"},
                        {title: "Miss Congeniality", image: "img/movies-tv/miss congeniality movie poster.png"},
                        {
                            title: "10 Things I Hate About You",
                            image: "img/movies-tv/10 things i hate about you poster.png"
                        },
                        {title: "Brooklyn Nine-Nine", image: "img/movies-tv/brooklyn nine-nine tv show poster.png"},
                        {title: "Community", image: "img/movies-tv/community tv show poster.png"},
                        {title: "Friends", image: "img/movies-tv/friends tv show cast poster.png"},
                        {title: "Suits", image: "img/movies-tv/suits tv show complete series.png"},
                        {title: "Bones", image: "img/movies-tv/bones tv show poster.png"},
                        {title: "Castle", image: "img/movies-tv/castle tv show poster.png"},
                        {title: "Charmed", image: "img/movies-tv/charmed tv show poster.png"},
                        {title: "Eureka", image: "img/movies-tv/eureka tv show poster.png"},
                        {title: "Fringe", image: "img/movies-tv/fringe tv show poster.png"},
                        {title: "Warehouse 13", image: "img/movies-tv/warehouse 13 tv show poster.png"},
                        {title: "Stargate", image: "img/movies-tv/stargate sg1 atlantis universe posters.png"},
                        {title: "Star Trek: Lower Decks", image: "img/movies-tv/star trek lower decks poster.png"},
                        {title: "The Expanse", image: "img/movies-tv/the expanse amazon prime poster.png"}
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
                    type: "tagRow",
                    tags: ["Metroidvania", "Platformer", "Puzzle", "Strategy / RTS", "Cosy", "Shooters", "City Builders", "Adventure"]
                },
                {
                    type: "posterGrid",
                    posters: [
                        {title: "Zelda: Ocarina of Time", image: "img/video-games/zelda ocarina of time cover.jpg"},
                        {title: "Hollow Knight", image: "img/video-games/hollow knight game cover.jpg"},
                        {title: "Hollow Knight: Silksong", image: "img/video-games/silksong.jpg"},
                        {title: "Celeste", image: "img/video-games/celete.jpg"},
                        {title: "Hades", image: "img/video-games/hades.jpg"},
                        {
                            title: "Ori and the Blind Forest",
                            image: "img/video-games/ori and the blind forest cover.jpg"
                        },
                        {title: "Tunic", image: "img/video-games/tunic game cover.jpg"},
                        {title: "Death's Door", image: "img/video-games/death door.jpg"},
                        {title: "Metroid Prime", image: "img/video-games/metroid prime cover.jpg"},
                        {title: "Octopath Traveler", image: "img/video-games/octopath traveler cover.jpg"},
                        {title: "Final Fantasy VI", image: "img/video-games/final fantasy vi cover.jpg"},
                        {title: "Cult of the Lamb", image: "img/video-games/cult of the lamb cover.jpg"},
                        {title: "Deep Rock Galactic", image: "img/video-games/deep rock galactic cover.jpg"},
                        {title: "Risk of Rain 2", image: "img/video-games/risk of rain 2 cover.jpg"},
                        {title: "Valheim", image: "img/video-games/valheim game cover.jpg"},
                        {title: "Frostpunk", image: "img/video-games/frostpunk game cover.jpg"},
                        {title: "Age of Mythology Retold", image: "img/video-games/age of mythology retold cover.jpg"},
                        {title: "It Takes Two", image: "img/video-games/it takes two game cover.jpg"},
                        {title: "Split Fiction", image: "img/video-games/split fiction game cover.jpg"},
                        {title: "Portal 2", image: "img/video-games/portal 2 cover.jpg"},
                        {title: "Peak", image: "img/video-games/Peak.jpg"},
                        {title: "Overwatch 2", image: "img/video-games/overwatch.jpg"},
                        {title: "Captain Toad", image: "img/video-games/captain toad treasure tracker cover.jpg"},
                        {title: "Super Mario Bros", image: "img/video-games/super mario bros nes box art.jpg"},
                        {title: "Pokemon Red", image: "img/video-games/pokemon red gameboy cover.jpg"},
                        {title: "Minecraft", image: "img/video-games/minecraft.jpg"},
                        {title: "Tetris", image: "img/video-games/tetris game logo.jpg"},
                        {title: "Call of Duty", image: "img/video-games/call of duty.jpg"},
                        {title: "Mina the Hollower", image: "img/video-games/Mina_the_Hollower_cover_art.jpg"}
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
                        {label: "Tonkatsu", variant: "love"}, {label: "Sushi", variant: "love"}, {
                            label: "Ramen",
                            variant: "love"
                        },
                        {label: "Bao Bun", variant: "love"}, {label: "Banh Mi", variant: "love"}, {
                            label: "Tacos",
                            variant: "love"
                        },
                        {label: "BBQ Ribs", variant: "love"}, {
                            label: "Full English",
                            variant: "love"
                        }, {label: "Sunday Roast", variant: "love"},
                        {label: "Matcha & Tea", variant: "love"}, {
                            label: "Pastries",
                            variant: "love"
                        }, {label: "Sour sweets", variant: "love"}
                    ]
                },
                {type: "heading", text: "In the bin"},
                {
                    type: "tagRow", tags: [
                        {label: "Onion", variant: "hate"}, {label: "Sweetcorn", variant: "hate"}
                    ]
                },
                {type: "heading", text: "Food I've eaten"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/food/tonkotsu ramen bowl.png", alt: "Tonkotsu ramen"},
                        {src: "img/food/bao buns fries tray.png", alt: "Bao buns"},
                        {src: "img/food/bahn mi.png", alt: "Banh mi"},
                        {src: "img/food/street tacos.png", alt: "Street tacos"},
                        {src: "img/food/japanese fried chicken moss plating.png", alt: "Japanese fried chicken"},
                        {src: "img/food/korean fried chicken wings.png", alt: "Korean fried chicken"},
                        {src: "img/food/seared tuna tataki sesame.png", alt: "Tuna tataki"},
                        {src: "img/food/beef tataki fine dining.png", alt: "Beef tataki"},
                        {src: "img/food/bacon cheeseburger brioche.png", alt: "Bacon cheeseburger"},
                        {src: "img/food/smash double cheeseburger.png", alt: "Smash burger"},
                        {src: "img/food/smash burger with fries.png", alt: "Smash burger with fries"},
                        {src: "img/food/full english breakfast cafe.png", alt: "Full English breakfast"},
                        {src: "img/food/duck wellington kale fine dining.png", alt: "Duck Wellington"},
                        {src: "img/food/scallop fine dining starter.png", alt: "Scallop starter"},
                        {src: "img/food/fine dining beef mango puree.png", alt: "Fine dining beef"},
                        {src: "img/food/tempura green beans romesco.png", alt: "Tempura green beans"},
                        {src: "img/food/matcha soft serve ice cream cone.png", alt: "Matcha soft serve"},
                        {src: "img/food/chocolate fondant ice cream dessert.png", alt: "Chocolate fondant"},
                        {src: "img/food/decorative croissants pastry box.png", alt: "Pastry box"},
                        {src: "img/food/taco desert.png", alt: "Taco dessert"},
                        {src: "img/food/meal prep chicken rice takeaway.png", alt: "Meal prep"},
                        {src: "img/food/cafe food.png", alt: "Cafe food"},
                        {src: "img/food/fancy meal.png", alt: "A fancy meal"}
                    ]
                },
                {type: "heading", text: "Food I've made"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/food/roast chicken sunday dinner.png", alt: "Sunday roast"},
                        {src: "img/food/cookies.png", alt: "Cookies"},
                        {src: "img/food/banoffeepie.png", alt: "Banoffee pie"},
                        {src: "img/food/Banna bread.png", alt: "Banna bread"},
                        {src: "img/food/bread.png", alt: "Sour dough"},
                        {src: "img/food/lamb curry.png", alt: "Lamb Curry"},
                        {src: "img/food/carbonara.png", alt: "Carbonara"},
                        {src: "", alt: "Butter Chicken"},
                    ]
                },
                {type: "heading", text: "Also on "},
                {
                    type: "tagRow",
                    tags: ["Butter Chicken", ]
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
                    type: "link",
                    href: "https://open.spotify.com/user/alec_game",
                    label: "Check out my Spotify"
                },
                {type: "heading", text: "Genres on Rotation"},
                {
                    type: "tagRow",
                    tags: ["Video Game Music", "Anime Music", "Metal", "Rock", "Rap", "Pop", "Lofi", "J-Pop", "J-Rock"]
                },
                {type: "heading", text: "Concerts & Live Music"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/music/zelda concert.png", alt: "A Zelda concert"},
                        {src: "img/music/london viedo game ocetra.png", alt: "A video game orchestra"},
                        {src: "img/music/sydney operahouse music concert.png", alt: "Concert at Sydney Opera House"},
                        {src: "img/music/future music festival 2013.png", alt: "Future Music Festival 2013"},
                        {src: "img/music/wirless festival 2009.png", alt: "Wireless Festival 2009"},
                        {src: "img/music/my friend sining.png", alt: "My friend singing"},
                        {src: "img/music/my friend singing more.png", alt: "My friend performing"}
                    ]
                },
            ]
        },

        books: {
            blocks: [
                {
                    type: "paragraph",
                    text: "I'm not a huge reader — currently working through the ACOTAR series — but if you love books I'll happily read your favourites. Roald Dahl is my favourite childhood author."
                },
                {type: "link", href: "https://goodreads.com/alectronic0", label: "Check out my Goodreads"},
                {type: "heading", text: "On My Shelf"},
                {
                    type: "posterGrid",
                    posters: [
                        {title: "Roald Dahl Collection", image: "img/books/illisration from roah dalh books.png"},
                        {title: "Eragon", image: "img/books/ergaon.jpg"},
                        {title: "Artemis Fowl", image: "img/books/artemis fowl book.jpg"},
                        {title: "Fullmetal Alchemist", image: "img/books/full metal alchmiest book.png"},
                        {title: "Spy x Family", image: "img/books/spyxfamily.jpg"},
                        {
                            title: "Computer Organization and Design",
                            image: "img/books/computer orgnisation and desing book.png"
                        },
                        {title: "Mythos by Stephen Fry", image: "img/books/mythos.png"},
                        {title: "Dessert Person", image: "img/books/dessert person.jpg"},
                        {
                            title: "The Subtle Art of Not Giving a F*ck",
                            image: "img/books/the subtle art of not giving a fuck.jpg"
                        },
                        {title: "A Court of Thorns and Roses", image: "img/books/a court of rose and thorn.jpg"}
                    ]
                },
                {type: "heading", text: "To Be Read"},
                {
                    type: "posterGrid",
                    posters: [
                        {title: "The Baby Dragon Cafe", image: "img/books/the baby dragon cafe.png"},
                        {title: "Legends & Lattes", image: "img/books/legend and lattes book.jpg"},
                        {
                            title: "Can't Spell Treason Without Tea",
                            image: "img/books/cant spell teason without tea.png"
                        },
                        {title: "Apprentice to the Villain", image: "img/books/apperentice to the villan.png"}
                    ]
                }
            ]
        },

        podcasts: {
            blocks: [
                {
                    type: "paragraph",
                    text: "On long car journeys I'll dip into a few of these — a mix of nerdy, thoughtful and dating-curious:"
                },
                {
                    type: "podcastCards",
                    cards: [
                        {
                            title: "Trash Taste",
                            description: "Anime, manga, and gaming culture",
                            logo: "img/podcasts/trashtaste.webp"
                        },
                        {
                            title: "Diary of a CEO",
                            description: "Business and personal development",
                            logo: "img/podcasts/the dirary of a ceo.webp"
                        },
                        {
                            title: "Lateral",
                            description: "Lateral thinking puzzles and problem solving",
                            logo: "img/podcasts/lateral.webp"
                        },
                        {
                            title: "Jillian on Love",
                            description: "Relationship and dating advice",
                            logo: "img/podcasts/jillian love.webp"
                        },
                        {
                            title: "Sweet & Sour",
                            description: "Asian perspectives on life and culture",
                            logo: "img/podcasts/sweet and sour podcast.webp"
                        },
                        {
                            title: "Critical Role",
                            description: "D&D actual play with voice actors",
                            logo: "img/podcasts/critial roll.webp"
                        },
                        {
                            title: "99% Invisible",
                            description: "Design, architecture, and hidden history",
                            logo: "img/podcasts/99 percent invisible.webp"
                        },
                        {
                            title: "History of Everything",
                            description: "Historical narratives and stories",
                            logo: "img/podcasts/history of everyhting.webp"
                        },
                        {
                            title: "Waveform",
                            description: "Tech and gadget news",
                            logo: "img/podcasts/waveform podcast.webp"
                        },
                        {
                            title: "Kit & Krysta",
                            description: "Nintendo theme podcast",
                            logo: "img/podcasts/kit and krysta podcast.webp"
                        },
                        {
                            title: "Luv Bites by Dr Tara",
                            description: "Love and relationships with Dr Tara Marshall",
                            logo: "img/podcasts/luv bites by dr tara.webp"
                        },
                        {
                            title: "The Sabrina Zohar Show",
                            description: "Conversations about relationships and self",
                            logo: "img/podcasts/sabrina zohar show.webp"
                        },
                        {
                            title: "TED Talks Daily",
                            description: "Short TED talks on various topics",
                            logo: "img/podcasts/ted talk daily.webp"
                        },
                        {
                            title: "The AIAS Game Maker's Notebook",
                            description: "Video game development and design",
                            logo: "img/podcasts/game makers notebook.webp"
                        },
                        {
                            title: "The Rest Is Science",
                            description: "Science communication and research",
                            logo: "img/podcasts/the rest is science.webp"
                        },
                        {
                            title: "TLDR News",
                            description: "Daily news summary and analysis",
                            logo: "img/podcasts/tldr news.webp"
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
                        {image: "img/sports/arsenal logo.png", label: "Arsenal"},
                        {image: "img/sports/england 3 loin logo.png", label: "England"},
                        {image: "img/sports/saracens logo.png", label: "Saracens"},
                        {image: "img/sports/all black rugby.png", label: "All Blacks"},
                        {image: "img/sports/mclaren logo.png", label: "McLaren F1"},
                    ]
                },
                {type: "heading", text: "Active I enjoy doing!"},
                {
                    type: "logoGrid",
                    tiles: [
                        {image: "img/sports/archery.png", label: "Archery"},
                        {image: "img/sports/rock climbing.png", label: "Bouldering"},
                        {image: "img/sports/basketball.png", label: "Basketball"},
                        {image: "img/sports/cycling.png", label: "Cycling"},
                        {image: "img/sports/bicep curl.png", label: "Gym"}
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
                    type: "listCols",
                    columns: [
                        {
                            groups: [{
                                title: "Policy & Support",
                                items: ["Simpler tax rules & closing loopholes", "Nationalising utilities & transport", "Human rights & LGBTQIA+ (incl. Trans rights)", "Disability & neurodivergent equality", "Race & gender equality, reproductive rights", "Solving climate change"]
                            }]
                        },
                        {
                            groups: [{
                                title: "Religion",
                                items: ["Raised Christian; I now choose not to hold a belief system and just try to be as good and kind as I can", "I respect others' beliefs and try to educate myself on them"]
                            }]
                        }
                    ]
                },
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/politics/human right sign.png", alt: "Human rights"},
                        {src: "img/politics/pride flag.png", alt: "Pride flag"},
                        {src: "img/politics/solar punk image.png", alt: "Solarpunk"},
                        {src: "img/politics/alan turing.png", alt: "Alan Turing"}
                    ]
                }
            ]
        },

        dislikes: {
            blocks: [
                {
                    type: "paragraph",
                    text: "I can handle these — I just won't go seeking them out. Mostly it adds up to a preference for calm, intimate settings."
                },
                {
                    type: "cardGrid",
                    cards: [
                        {
                            image: "img/dislikes/onions.png",
                            icon: "🧅",
                            title: "Onion & sweetcorn",
                            caption: "Getting better with onion, but won't be ordering it."
                        },
                        {
                            image: "img/dislikes/person covering ear from loud noises.png",
                            icon: "🔊",
                            title: "Loud noises",
                            caption: "Makes it hard to hear myself — noise-cancelling headphones to the rescue."
                        },
                        {
                            image: "img/dislikes/large crowd.png",
                            icon: "👥",
                            title: "Standing in crowds",
                            caption: "Moving through is fine; lingering in a packed place, less so."
                        },
                        {
                            image: "img/dislikes/people aruguing and yelling.png",
                            icon: "😤",
                            title: "Yelling",
                            caption: "A big trigger for me."
                        },
                        {
                            image: "img/dislikes/roller coaster.png",
                            icon: "🎢",
                            title: "Rollercoasters",
                            caption: "The anticipation sets off my anxiety (though I've enjoyed them once on)."
                        },
                        {
                            image: "☀️",
                            icon: "",
                            title: "Super hot weather",
                            caption: "Tbh who really like melting in the sun...doesn't mean I don't like topical holidays just let me chill in the shade"
                        }
                    ]
                }
            ]
        },

        goals: {
            blocks: [
                {
                    type: "paragraph",
                    text: "I've hit my main milestones — good job, a house, great friends. Still working on my health, and finding my life partner."
                },
                {
                    type: "listCols",
                    columns: [
                        {
                            groups: [{
                                title: "🏡 Dream Home",
                                items: ["Big house in the countryside (but near a train station)", "Big kitchen, games room, library & home office", "Living room with a proper cinema system", "Spare bedrooms for guests and children", "A garden for growing fruit & veg — ideally near a canal"]
                            }]
                        },
                        {
                            groups: [{
                                title: "👨‍👩‍👧‍👦 Family & Beyond",
                                items: ["1–3 kids (70–80% sure, with the right person)", "1–2 dogs (open to a cat, but need at least one dog)", "Marriage — no rush; sign the papers when we're sure, big wedding later", "Maybe: digital nomad life, or a few years in New Zealand"]
                            }]
                        }
                    ]
                },
                {type: "heading", text: "The Daydream, in Pictures"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/goals/kitchen.png", alt: "A dream kitchen"},
                        {src: "img/goals/kitchen 2.png", alt: "A dream kitchen"},
                        {src: "img/goals/living room home cinema.png", alt: "A home cinema"},
                        {src: "img/goals/reading nook.png", alt: "A reading nook"},
                        {src: "img/goals/courtyard.png", alt: "A courtyard"},
                        {src: "img/goals/garden planters.png", alt: "Garden planters"},
                        {src: "img/goals/canal walkway.png", alt: "A canal walkway"},
                        {src: "img/goals/couple gaming computer setup.png", alt: "A couple's gaming setup"},
                        {src: "img/goals/coding on a computer digital nomad.png", alt: "Digital nomad life"},
                        {src: "img/goals/family with children.png", alt: "A family with children"},
                        {src: "img/goals/wedding fantsy.png", alt: "A fantasy wedding"},
                        {src: "img/goals/dog 2.png", alt: "A dog"}
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
                        {src: "img/plants/sakura.png", alt: "Sakura"},
                        {src: "img/plants/tulips.png", alt: "Tulips"},
                        {src: "img/plants/lavanda.png", alt: "Lavender"},
                        {src: "img/plants/roses.png", alt: "Roses"},
                        {src: "img/plants/bluebeels.png", alt: "Bluebells"},
                        {src: "img/plants/Freesia .png", alt: "Freesia"},
                        {src: "img/plants/Plumeria.png", alt: "Plumeria"},
                        {src: "img/plants/lilyflower.png", alt: "Lily"},
                        {src: "img/plants/orchid.png", alt: "Orchid"},
                        {src: "img/plants/bonsai.png", alt: "Bonsai"},
                        {src: "img/plants/fern.png", alt: "Fern"},
                        {src: "img/plants/oak.png", alt: "Oak"},
                        {src: "img/plants/willow tree.png", alt: "Willow tree"}
                    ]
                },
                {type: "heading", text: "🐉 Favourite Animals & Creatures"},
                {
                    type: "photoGrid",
                    images: [
                        {src: "img/animals/barn owl.png", alt: "Barn owl"},
                        {src: "img/animals/red panada.png", alt: "Red panda"},
                        {src: "img/animals/tortise.png", alt: "Tortoise"},
                        {src: "img/animals/wolf.png", alt: "Wolf"},
                        {src: "img/animals/toothless the dragon.png", alt: "A dragon"},
                        {src: "img/animals/phoniex.png", alt: "A phoenix"},
                        {src: "img/animals/cerburs.png", alt: "Cerberus"},
                        {src: "img/animals/loch ness monster.png", alt: "The Loch Ness Monster"},
                        {src: "img/animals/Triceratops.png", alt: "Triceratops"},
                        {src: "img/animals/Ankylosaurus.png", alt: "Ankylosaurus"}
                    ]
                },
                {
                    type: "tagRow",
                    tags: ["🐕 Dogs", "🦉 Barn Owl", "🐼 Red Panda", "🐢 Tortoise", "🐺 Wolf", "🐉 Dragon", "🔥 Phoenix", "🐶 Cerberus"]
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
