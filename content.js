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
   detailList, link, spotify, construction.
   ============================================================ */

const DOB = "1991-05-19";
const _dob = new Date(DOB);
const _today = new Date();
let _myAge = _today.getFullYear() - _dob.getFullYear();
if (_today.getMonth() < _dob.getMonth() || (_today.getMonth() === _dob.getMonth() && _today.getDate() < _dob.getDate())) {
    _myAge--;
}
const _minAge = Math.floor(_myAge / 2) + 7;
const _maxAge = _myAge + 1;

window.CONTENT = {
    meta: {
        domainFallback: 'https://date.alec.today/',
        defaultAlt: 'Alec Doran-Twyford',
        title: "Date Alec Today | Alec's Dating Application",
        tagline: "Loveable nerd, looking for his player 2",
        emoji: "🎮❤️🎮"
    },
    nav: {
        menuLabel: 'Menu', ctaText: '💘 Go on a date', links: [
            {label: 'Who I Am', href: '#about'},
            {label: 'Faces', href: '#faces'},
            {label: 'General Vibe', href: '#general-vibe'},
            {label: 'Boyfriend Mode', href: '#boyfriend-mode'},
            {label: 'Looking For', href: '#looking-for'},
            {label: 'Date Ideas', href: '#dates'},
            {label: 'Campaign 🎬', href: '#campaign'},
            {label: 'Contact', href: '#contact'},
            {label: 'Deep Dive ↓', href: '#deep-dive'}
        ]
    },
    hero: {
        emoji: "🎮❤️🎮",
        headline: "Alec's <span>Dating</span> Application",
        subheading: "A visual introduction to what having me as your boyfriend could look like.",
        taglineStart: "Looking for ",
        taglineSlots: [
            "my nerdy other half 🤓",
            "a gym buddy 🏋️‍♂️",
            "a travel companion ✈️",
            "a taste tester 🍕",
            "a D&D party member 🎲",
            "a board game rival ♟️",
            "a fellow adventurer 🧭",
            "the princess to my hero 👑",
            "a Player 2 🎮",
            "an anime binge buddy 📺",
            "a partner in crime 🕵️‍♂️",
            "my nerdy other half 🤓"
        ],
        taglineEnd: "",
        cta: "Come find out more ↓",
        scrollHint: 'start your adventure ↓',
        // First image is the LCP element — rendered eager + high priority (see main.js renderHero).
        images: [
            {src: "img/alec/alec-los-mochis-city.webp", alt: "Alec in Los Mochis", w: 900, h: 1200},
            {src: "img/alec/alec-pokemon-plushies-pokeball.webp", alt: "Alec Doran-Twyford", w: 900, h: 1200},
            {src: "img/alec/alec-portrait-garden-archway.webp", alt: "Alec portrait garden archway", w: 900, h: 1200}
        ]
    },
    profile: {
        tag: "📋 Who I Am",
        name: "Alec Doran-Twyford",
        tagline: "",
        evolvingNote: "🚧 Like me, this site is a work in progress — it continues to evolve and won't always be perfect. The odd bug, glitch, or typo might sneak through, but it's trying its best anyway. 💜",
        intro: [
            "Hi, I'm Alec! 👋 A few years ago, after focusing on my career and buying a house 🏠, I decided it was time to start dating. But let's face it: <strong style=\"color: var(--rose-light);\">dating apps suck</strong> 💔.",
            "I also noticed that some people I talked to seemed to lose sight of who they were in and out of a relationship, so to stay grounded, I wrote a list of the thing I liked and valued that list became the <a href=\"https://docs.google.com/presentation/d/18JFwBTN1VRsoGH6tOqM4yJ1veaQtP5MZ8SpdJPSWVTE/edit?usp=sharing\" target=\"_blank\" style=\"color: #80c0ff; text-decoration: underline;\">\"boyfriend application\"</a>, which eventually became this interactive webstie you are now reading.",
            "This site is a direct extension of me, quirks and nerdy info-dumps 🤓 included. I'm not perfect, but I put real effort into what matters (hopefully you! 😉). If you aren't overwhelmed by the absurdity of this site, you might be the kind of person I'm looking for: a <strong style=\"color: var(--rose-light);\">life partner</strong> 💖 to share in the fun bits, the challenging bits, and everything in between. If you're <strong style=\"color: var(--gold);\">nerdy</strong>, want a family, and enjoy both <strong style=\"color: #80c0ff;\">quiet days at home</strong> ☕ and <strong style=\"color: var(--mint);\">exciting adventures</strong> 🗺️, you might just be it.",
            "P.S. If I'm not your type, please share this with someone who is, or just send it to a friend for a 'WTF, look what this person made!' 😂",
            "P.P.S. There are a few easter eggs ✨ hidden around here, see if you can find them! 😉"
        ],
        photo: {src: "img/alec/alec-portrait-terracotta-wall.webp", alt: "Alec Doran-Twyford", w: 900, h: 1200},
        viewPhotosLabel: '⤢ View all photos',
        facts: [
            // Basics & Identity
            {icon: "🎂", label: "Age", dob: DOB, toast: "Yes, I know, I am an old millennial now! 👴"},
            {icon: "📏", label: "Height", value: "~5'8\"", toast: "My height might vary throughout the day! 📏"},
            {icon: "♂️", label: "Gender", value: "Gentleman", toast: "Chivalry isn't dead, just modernized! 🎩"},
            {
                icon: "🗣️",
                label: "Pronouns",
                value: [
                    "He / Him ",
                    " They / Them"
                ],
                toast: "I use they/them to support my non-binary friends and acknowledge your pronouns are what you want them to be! 🗣️"
            },
            {icon: "❤️", label: "Orientation", value: "Straight", toast: "Hoping to find the right woman to share life's adventures with 👩🏼‍🤝‍👨🏻"},

            // Origins & Location
            {
                icon: "📍", label: "Living in", value: "Welwyn Garden City", href: "https://www.google.com/maps/place/Welwyn+Garden+City",
                toast: "Welwyn Garden City — a lovely garden city in Hertfordshire! 🗺️"
            },
            {
                icon: "🪪", label: "Nationality", value: [
                    "British",
                    "New Zealander"
                ],
                toast: "UK, Australia and New Zealand... before Brexit I could go to Europe too 😒"
            },

            // Career & Education
            {icon: "💼", label: "Profession", value: "Software Engineer", toast: "I make computers do the thing! 💻"},
            {icon: "🎓", label: "Education", value: "BSc Computer Science", toast: "I know Computer Kung Fu... 🕶️💻"},

            // Relationships & Family
            {
                icon: "💞", label: "Looking for", value: [
                    "Long-term",
                    "monogamous"
                ],
                toast: "Here for the real deal — building a long-term life together 💖"
            },
            {
                icon: "👶", label: "Kids", value: [
                    "Want kids",
                    "none yet"
                ],
                toast: "Ready for future dad jokes and bedtime stories! 👨‍👩‍👧"
            },

            // Lifestyle & Beliefs
            {icon: "🏛️", label: "Politics", value: "Liberal / Left", toast: "Believer in empathy, equity, and progress 🌹"},
            {icon: "🙏", label: "Religion", value: "Atheist", toast: "Guided by science, curiosity, and good morals 🔬"},
            {icon: "🍷", label: "Drinking", value: "Social drinker", toast: "Cocktails, Guinness, a proper G&T, or a tequila shot... and I've recently realized spicy drinks are amazing! 🍸🔥"}
        ]
    },
    contact: {
        tag: "💬 How to Get in Touch",
        heading: "Shoot Your Shot",
        lead: "You've made it to the contact section, do you want to shoot your shot?\n\nI've worked to make this as easy as possible: pick your <span class=\"text-green\">adventure</span>, answer a few <span class=\"text-blue\">ice breakers</span>, set your rough <span class=\"text-red\">location</span>, and leave the rest to me!",
        emailTemplate: {subject: "RE: Alec Dating Application", body: "Hi Alec! I'm ready to shoot my shot.\n\nFor our first adventure, I'd love to do: …"},
        links: [
            {label: "Email", icon: "gmail", href: "mailto:date@alec.today?subject=RE%3A%20Alec%20Dating%20Application", primary: true},
            {label: "Instagram", href: "https://www.instagram.com/alectronic0/"},
            {label: "TikTok", href: "https://www.tiktok.com/@alectronic0/"},
            {label: "LinkedIn", href: "https://www.linkedin.com/in/alectronic0/"},
            {label: "WhatsApp", sublabel: "(coming soon)", icon: "whatsapp", href: "javascript:void(0)", disabled: true},
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
        count: 3,
        shuffleLabel: "Shuffle the deck",
        answerLabel: "Email me your responses",
        email: "date@alec.today",
        emailSubject: "My responses to Alec's questions 🎮❤️",
        emailIntro: "Hi Alec!\nHere are my responses to your questions:",
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
            "Are you more of a night owl or an early bird?",
            "What's something you're quietly proud of?",
            "What's still left on your bucket list?",
            "Beach holiday or city adventure?",
            "What's a film or book that genuinely changed how you see things?",
            "If money were no object, how would you spend your days?",
            "What's your go-to comfort food after a rough day?"
        ]
    },

    /* ── Site soundtrack ──
       Powers the floating 🎧 mini-player (bottom corner) so visitors can put
       on some cosy background music while they scroll. `embed` is Spotify's
       open.spotify.com/embed/… URL; height 152 = the compact player. */
    soundtrack: {
        label: "Site soundtrack",
        title: "🎧 Cosy gaming lofi — press play & scroll",
        embed: "https://open.spotify.com/embed/playlist/37i9dQZF1FwX0A5pnDZILw?utm_source=generator&theme=0",
        url: "https://open.spotify.com/playlist/37i9dQZF1FwX0A5pnDZILw",
        height: 152
    },

    /* ── Faces marquee ── */
    faces: {
        tag: "📸 A Few Faces of Alec",
        heading: "Snapshots of my Life",
        lead: "Yes, I'm the guy in most of them. Tap any photo to enlarge.",
        // w/h are the actual encoded pixel dimensions of each file, passed through
        // to the <img> width/height attributes so the browser can reserve the
        // right box before the image loads (avoids layout shift in the marquee).
        photos: [
            {src: "img/alec/alec-portrait-terracotta-wall.webp", alt: "Alec portrait terracotta wall", w: 900, h: 1200},
            {src: "img/alec/alec-pokemon-plushies-pokeball.webp", alt: "Alec pokemon plushies pokeball", w: 900, h: 1200},
            {src: "img/alec/alec-kimono-red-torii-gate.webp", alt: "Alec kimono red torii gate", w: 903, h: 1200},
            {src: "img/alec/alec-portrait-garden-archway.webp", alt: "Alec portrait garden archway", w: 903, h: 1200},
            {src: "img/alec/alec-japanese-onsen-curtain.webp", alt: "Alec japanese onsen curtain", w: 900, h: 1200},
            {src: "img/alec/alec-silly-face-japanese-onsen.webp", alt: "Alec silly face japanese onsen", w: 900, h: 1200},
            {src: "img/alec/alec-los-mochis-city.webp", alt: "Alec in Los Mochis", w: 900, h: 1200},
            {src: "img/alec/alec-pokemon-cyndaquil-statue.webp", alt: "Alec pokemon cyndaquil statue", w: 903, h: 1200},
            {src: "img/alec/alec-super-mario-bros-40th-statue.webp", alt: "Alec super mario bros 40th statue", w: 903, h: 1200},
            {src: "img/alec/alec-cherry-blossom-park.webp", alt: "Alec cherry blossom park", w: 900, h: 1200},
            {src: "img/alec/alec-napping-headphones-pikachu-shirt.webp", alt: "Alec napping headphones pikachu shirt", w: 1200, h: 1200},
            {src: "img/alec/alec-rope-knot-tying.webp", alt: "Alec rope knot tying", w: 900, h: 1200},
            {src: "img/alec/alec-coffee-times-square-new-york.webp", alt: "Alec coffee times square new york", w: 900, h: 1200},
            {src: "img/alec/alec-portrait-tropical-garden.webp", alt: "Alec portrait tropical garden", w: 900, h: 1200},
            {src: "img/alec/alec-mt-batur-sunrise-hike-bali.webp", alt: "Alec mt batur sunrise hike bali", w: 903, h: 1200},
            {src: "img/alec/alec-mt-batur-sunrise-silly-selfie-bali.webp", alt: "Alec mt batur sunrise silly selfie bali", w: 900, h: 1200},
            {src: "img/alec/alec-portrait-sunny-garden.webp", alt: "Alec portrait sunny garden", w: 900, h: 1200},
            {src: "img/alec/alec-mad-scientist-lab-coat-costume.webp", alt: "Alec mad scientist lab coat costume", w: 745, h: 744},
            {src: "img/alec/alec-holding-pineapple-supermarket.webp", alt: "Alec holding pineapple supermarket", w: 900, h: 1200},
            {src: "img/alec/alec-fire-staff-spinning-night.webp", alt: "Alec fire staff spinning night", w: 1080, h: 1080},
            {src: "img/alec/alec-exhausted-after-gym-workout.webp", alt: "Alec exhausted after gym workout", w: 1200, h: 900},
            {src: "img/alec/alec-sandwich-lunch-cafe.webp", alt: "Alec sandwich lunch cafe", w: 684, h: 911},

        ]
    },

    /* ── Deep-dive topics ──
       Order + header for each pop-up topic. `key` matches a sections[key]
       below AND becomes the modal's element id, so a URL like …#food opens
       that topic. Reorder this array to reorder the button grid — no HTML
       edits needed. `wip: true` adds a 🚧 badge to the button (pair it with
       a `construction` block in the section). */
    accordion: [
        {type: "heading", text: "Get to know me"},
        {key: "personality", emoji: "🧬", title: "Personality & Vibe", hint: "— what I'm like to be around", wip: true},
        {key: "weekInLife", emoji: "📅", title: "A day in the life of Alec", hint: "— my typical routines", wip: true},
        {key: "moments", emoji: "🏆", title: "Notable Moments", hint: "— milestones & adventures"},
        {key: "transparency", emoji: "🚩", title: "My Red Flags", hint: "— no one's perfect, at least I'm being honest"},
        {key: "politics", emoji: "🏛️", title: "Politics & Religion", hint: "— where I stand"},
        {key: "dislikes", emoji: "🙅", title: "Gentle Dislikes", hint: "— a preference for calm"},
        {key: "friends", emoji: "👥", title: "Friend Review", hint: "— what they say about me"},
        {key: "bucketList", emoji: "🎯", title: "Bucket List", hint: "— things I'd love to try"},
        {key: "goals", emoji: "🚀", title: "Future Goals", hint: "— where I'm headed"},
        {type: "heading", text: "Hobbies & Interests"},
        {key: "hobbies", emoji: "✨", title: "Hobbies & Interests", hint: "— things that light me up"},
        {key: "places", emoji: "✈️", title: "Places — Been & Want to Go", hint: "— stamps & wishlist"},
        {key: "food", emoji: "🍽️", title: "Food", hint: "— the way to my heart"},
        {key: "moviesTV", emoji: "🎬", title: "Movies & TV", hint: "— what I'm watching"},
        {key: "videoGames", emoji: "🎮", title: "Video Games", hint: "— player one, ready"},
        {key: "books", emoji: "📚", title: "Books", hint: "— on my shelf"},
        {key: "music", emoji: "🎵", title: "Music", hint: "— what's on my playlist"},
        {key: "podcasts", emoji: "🎙️", title: "Podcasts", hint: "— long-journey listening"},
        {key: "sports", emoji: "⚽", title: "Sports", hint: "— mostly a spectator"},
        {type: "heading", text: "DLC - Bonus content"},
        {key: "plantsAnimals", emoji: "🌺", title: "Plants & Creatures", hint: "— a few favourites"},
        {key: "gifs", emoji: "🎞️", title: "GIFs I Love", hint: "— my life in looping form"},
        {key: "couples", emoji: "💑", title: "Couple goals", hint: "— couple I aspire my future relationship to be like"},
    ],

    /* ── Mid-page sections (each = blocks[]) ── */
    sections: {
        // Rendered inside its deep-dive modal, so no tag/heading here —
        // the modal head already carries the 🏆 title.
        moments: {
            lead: "A life well lived (so far) — a few milestones, mishaps, and adventures. Tap any to enlarge.",
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
        },

        generalVibe: {
            tag: "✨ General Vibe",
            tagClass: "tag-blue",
            heading: "The General Vibe",
            lead: "A collage of things I enjoy or find interesting. My general vibe!",
            blocks: [
                {
                    type: "paragraph",
                    html: "<div class='evolving-note'>🚧 Hey! This infinite collage is a new feature and might still be a bit buggy.</div>"
                },
                {
                    type: "fadingCollage",
                    images: [
                        {src: "img/vibe/slide_img_0.webp", alt: "Vibe 0"},
                        {src: "img/vibe/slide_img_1.webp", alt: "Vibe 1"},
                        {src: "img/vibe/slide_img_2.webp", alt: "Vibe 2"},
                        {src: "img/vibe/slide_img_3.webp", alt: "Vibe 3"},
                        {src: "img/vibe/slide_img_4.webp", alt: "Vibe 4"},
                        {src: "img/vibe/slide_img_5.webp", alt: "Vibe 5"},
                        {src: "img/vibe/slide_img_6.webp", alt: "Vibe 6"},
                        {src: "img/vibe/slide_img_7.webp", alt: "Vibe 7"},
                        {src: "img/vibe/slide_img_8.webp", alt: "Vibe 8"},
                        {src: "img/vibe/slide_img_9.webp", alt: "Vibe 9"},
                        {src: "img/vibe/slide_img_10.webp", alt: "Vibe 10"},
                        {src: "img/vibe/slide_img_11.webp", alt: "Vibe 11"},
                        {src: "img/vibe/slide_img_12.webp", alt: "Vibe 12"},
                        {src: "img/vibe/slide_img_13.webp", alt: "Vibe 13"},
                        {src: "img/vibe/slide_img_14.webp", alt: "Vibe 14"},
                        {src: "img/vibe/slide_img_15.webp", alt: "Vibe 15"},
                        {src: "img/vibe/slide_img_16.webp", alt: "Vibe 16"},
                        {src: "img/vibe/slide_img_17.webp", alt: "Vibe 17"},
                        {src: "img/vibe/slide_img_18.webp", alt: "Vibe 18"},
                        {src: "img/vibe/slide_img_19.webp", alt: "Vibe 19"},
                        {src: "img/vibe/slide_img_20.webp", alt: "Vibe 20"},
                        {src: "img/vibe/slide_img_21.webp", alt: "Vibe 21"},
                        {src: "img/vibe/slide_img_22.webp", alt: "Vibe 22"},
                        {src: "img/vibe/slide_img_23.webp", alt: "Vibe 23"},
                        {src: "img/vibe/slide_img_24.webp", alt: "Vibe 24"},
                        {src: "img/vibe/slide_img_25.webp", alt: "Vibe 25"},
                        {src: "img/vibe/slide_img_26.webp", alt: "Vibe 26"},
                        {src: "img/vibe/slide_img_27.webp", alt: "Vibe 27"},
                        {src: "img/vibe/slide_img_28.webp", alt: "Vibe 28"},
                        {src: "img/vibe/slide_img_29.webp", alt: "Vibe 29"},
                        {src: "img/vibe/slide_img_30.webp", alt: "Vibe 30"},
                        {src: "img/vibe/slide_img_31.webp", alt: "Vibe 31"},
                        {src: "img/vibe/slide_img_32.webp", alt: "Vibe 32"},
                        {src: "img/vibe/slide_img_33.webp", alt: "Vibe 33"},
                        {src: "img/vibe/slide_img_34.webp", alt: "Vibe 34"},
                        {src: "img/vibe/slide_img_35.webp", alt: "Vibe 35"},
                        {src: "img/vibe/slide_img_36.webp", alt: "Vibe 36"},
                        {src: "img/vibe/slide_img_37.webp", alt: "Vibe 37"},
                        {src: "img/vibe/slide_img_38.webp", alt: "Vibe 38"},
                        {src: "img/vibe/slide_img_39.webp", alt: "Vibe 39"},
                        {src: "img/vibe/slide_img_40.webp", alt: "Vibe 40"},
                        {src: "img/vibe/slide_img_41.webp", alt: "Vibe 41"},
                        {src: "img/vibe/slide_img_42.webp", alt: "Vibe 42"},
                        {src: "img/vibe/slide_img_43.webp", alt: "Vibe 43"},
                        {src: "img/vibe/slide_img_44.webp", alt: "Vibe 44"},
                        {src: "img/vibe/slide_img_45.webp", alt: "Vibe 45"},
                        {src: "img/vibe/slide_img_46.webp", alt: "Vibe 46"},
                        {src: "img/vibe/slide_img_47.webp", alt: "Vibe 47"},
                        {src: "img/vibe/slide_img_48.webp", alt: "Vibe 48"},
                        {src: "img/vibe/slide_img_49.webp", alt: "Vibe 49"},
                        {src: "img/vibe/slide_img_50.webp", alt: "Vibe 50"},
                        {src: "img/vibe/slide_img_51.webp", alt: "Vibe 51"},
                        {src: "img/vibe/slide_img_52.webp", alt: "Vibe 52"},
                        {src: "img/vibe/slide_img_53.webp", alt: "Vibe 53"},
                        {src: "img/vibe/slide_img_54.webp", alt: "Vibe 54"},
                        {src: "img/vibe/slide_img_55.webp", alt: "Vibe 55"},
                        {src: "img/vibe/slide_img_56.webp", alt: "Vibe 56"},
                        {src: "img/vibe/slide_img_57.webp", alt: "Vibe 57"},
                        {src: "img/vibe/slide_img_58.webp", alt: "Vibe 58"},
                        {src: "img/vibe/slide_img_59.webp", alt: "Vibe 59"},
                        {src: "img/vibe/slide_img_60.webp", alt: "Vibe 60"},
                        {src: "img/vibe/slide_img_61.webp", alt: "Vibe 61"},
                        {src: "img/vibe/slide_img_62.webp", alt: "Vibe 62"},
                        {src: "img/vibe/slide_img_63.webp", alt: "Vibe 63"},
                        {src: "img/vibe/slide_img_64.webp", alt: "Vibe 64"},
                        {src: "img/vibe/slide_img_65.webp", alt: "Vibe 65"},
                        {src: "img/vibe/slide_img_66.webp", alt: "Vibe 66"},
                        {src: "img/vibe/slide_img_67.webp", alt: "Vibe 67"},
                        {src: "img/vibe/slide_img_68.webp", alt: "Vibe 68"},
                        {src: "img/vibe/slide_img_69.webp", alt: "Vibe 69"},
                        {src: "img/vibe/slide_img_70.webp", alt: "Vibe 70"},
                        {src: "img/vibe/slide_img_71.webp", alt: "Vibe 71"},
                        {src: "img/vibe/slide_img_72.webp", alt: "Vibe 72"},
                        {src: "img/vibe/slide_img_73.webp", alt: "Vibe 73"},
                        {src: "img/vibe/slide_img_74.webp", alt: "Vibe 74"},
                        {src: "img/vibe/slide_img_75.webp", alt: "Vibe 75"},
                        {src: "img/vibe/slide_img_76.webp", alt: "Vibe 76"},
                        {src: "img/vibe/slide_img_77.webp", alt: "Vibe 77"},
                        {src: "img/vibe/slide_img_78.webp", alt: "Vibe 78"},
                        {src: "img/vibe/slide_img_79.webp", alt: "Vibe 79"},
                        {src: "img/vibe/slide_img_80.webp", alt: "Vibe 80"},
                        {src: "img/vibe/slide_img_81.webp", alt: "Vibe 81"},
                        {src: "img/vibe/slide_img_82.webp", alt: "Vibe 82"},
                        {src: "img/vibe/slide_img_83.webp", alt: "Vibe 83"},
                        {src: "img/vibe/slide_img_84.webp", alt: "Vibe 84"},
                        {src: "img/vibe/slide_img_85.webp", alt: "Vibe 85"},
                        {src: "img/vibe/slide_img_86.webp", alt: "Vibe 86"},
                        {src: "img/vibe/slide_img_87.webp", alt: "Vibe 87"},
                        {src: "img/vibe/slide_img_88.webp", alt: "Vibe 88"},
                        {src: "img/vibe/slide_img_89.webp", alt: "Vibe 89"},
                        {src: "img/vibe/slide_img_90.webp", alt: "Vibe 90"},
                        {src: "img/vibe/slide_img_91.webp", alt: "Vibe 91"},
                        {src: "img/vibe/slide_img_92.webp", alt: "Vibe 92"},
                        {src: "img/vibe/slide_img_93.webp", alt: "Vibe 93"},
                        {src: "img/vibe/slide_img_94.webp", alt: "Vibe 94"},
                        {src: "img/vibe/slide_img_95.webp", alt: "Vibe 95"},
                        {src: "img/vibe/slide_img_96.webp", alt: "Vibe 96"},
                        {src: "img/vibe/slide_img_97.webp", alt: "Vibe 97"},
                        {src: "img/vibe/slide_img_98.webp", alt: "Vibe 98"},
                        {src: "img/vibe/slide_img_99.webp", alt: "Vibe 99"},
                        {src: "img/vibe/slide_img_100.webp", alt: "Vibe 100"},
                        {src: "img/vibe/slide_img_101.webp", alt: "Vibe 101"},
                        {src: "img/vibe/slide_img_102.webp", alt: "Vibe 102"},
                        {src: "img/vibe/slide_img_103.webp", alt: "Vibe 103"},
                        {src: "img/vibe/slide_img_104.webp", alt: "Vibe 104"},
                        {src: "img/vibe/slide_img_105.webp", alt: "Vibe 105"},
                        {src: "img/vibe/slide_img_106.webp", alt: "Vibe 106"},
                        {src: "img/vibe/slide_img_107.webp", alt: "Vibe 107"},
                        {src: "img/vibe/slide_img_108.webp", alt: "Vibe 108"},
                        {src: "img/vibe/slide_img_109.webp", alt: "Vibe 109"},
                        {src: "img/vibe/slide_img_110.webp", alt: "Vibe 110"},
                        {src: "img/vibe/slide_img_111.webp", alt: "Vibe 111"},
                        {src: "img/vibe/slide_img_112.webp", alt: "Vibe 112"},
                        {src: "img/vibe/slide_img_113.webp", alt: "Vibe 113"},
                        {src: "img/vibe/slide_img_114.webp", alt: "Vibe 114"},
                        {src: "img/vibe/slide_img_115.webp", alt: "Vibe 115"},
                        {src: "img/vibe/slide_img_116.webp", alt: "Vibe 116"},
                        {src: "img/vibe/slide_img_117.webp", alt: "Vibe 117"},
                        {src: "img/vibe/slide_img_118.webp", alt: "Vibe 118"},
                        {src: "img/vibe/slide_img_119.webp", alt: "Vibe 119"},
                        {src: "img/alec/alec-portrait-terracotta-wall.webp", alt: "Alec portrait terracotta wall"},
                        {src: "img/alec/alec-kimono-red-torii-gate.webp", alt: "Alec kimono red torii gate"},
                        {src: "img/alec/alec-napping-headphones-pikachu-shirt.webp", alt: "Alec napping headphones pikachu shirt"},
                        {src: "img/alec/alec-fire-staff-spinning-night.webp", alt: "Alec fire staff spinning night"}
                    ]
                }
            ]
        },

        boyfriendMode: {
            tag: "❤️ Boyfriend mode in Action",
            tagClass: "tag-rose",
            heading: "What Dating Me Could Look Like",
            lead: "A peek at \"boyfriend mode\" — the little things I love doing for the person I'm with. There is no 'bare minimum' with me, only princess treatment! 👑",
            blocks: [
                {
                    type: "featureGrid", features: [
                        {
                            src: "img/boyfriend-mode/couple-hugging.webp",
                            alt: "A couple hugging",
                            title: "🤗 Emotional Support Nerd",
                            text: "Always supportive and caring — there through the good and bad times, with great hugs, forehead kisses, and massages."
                        },
                        {
                            src: "img/boyfriend-mode/passenger-princess.webp",
                            alt: "Passenger Princess",
                            title: "👸 Passenger Princess",
                            text: "Full passenger-princess treatment whenever we're on the road."
                        },
                        {
                            src: "img/boyfriend-mode/person-taking-photo.webp",
                            alt: "Taking a photo",
                            title: "📸 Personal Photographer",
                            text: "Making sure you always look great."
                        },
                        {
                            src: "img/boyfriend-mode/writing-a-shared-doc.webp",
                            alt: "Writing a doc",
                            title: "📊 Freak in the Spreadsheets",
                            text: "Keeping shared docs & spreadsheets for the things that matter to you, and of course, our plans."
                        },
                        {
                            src: "img/boyfriend-mode/a-google-calendar-invite-for-cute-date.webp",
                            alt: "A calendar invite for a date",
                            title: "📅 Calendar Invites Included",
                            text: "Organising cute dates (and yes, adding them to Google Calendar)."
                        },
                        {
                            src: "img/boyfriend-mode/person-surprising-someone-with-flowers.webp",
                            alt: "Surprise flowers",
                            title: "🎁 Random Loot Drops",
                            text: "Random flowers and cute little gifts, just because."
                        }
                    ]
                },
                {
                    type: "paragraph",
                    html: `
                    <div style="text-align: center; margin-top: 32px;">
                        <button onclick="document.getElementById('bfExtrasModal').showModal()" class="share-btn primary" style="background: var(--surface-2); border: 1px solid var(--border); color: var(--text); font-weight: 600; padding: 12px 24px; border-radius: 8px; cursor: pointer; display: inline-block;">✨ And so much more...</button>
                    </div>
                    <dialog id="bfExtrasModal" class="deep-modal" style="border: 1px solid var(--border); border-radius: 12px; background: var(--surface); color: var(--text); padding: 0; max-width: 500px; width: 90%; margin: auto;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); background: var(--surface-2);">
                            <h3 style="margin: 0; font-size: 1.2rem;">✨ And so much more...</h3>
                            <button onclick="this.closest('dialog').close()" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text); padding: 0; line-height: 1;">&times;</button>
                        </div>
                        <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">☕</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Cached Coffee Order</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Always knowing your coffee order & keeping your favourite snack on hand</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">🐧</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Certified Meme Dealer</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Pebbling you with hundreds of perfectly curated memes</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">🧑‍🍳</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Personal Chef / Baker</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Fresh cookies and a meal fit for a queen at a moment's notice</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;"><img src="https://cdn.simpleicons.org/deliveroo/00CC99" style="width: 32px; height: 32px; display: block;" alt="Deliveroo"></div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Deliveroo on Speed Dial</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Deliveroo taken at the drop of a hat</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">🛍️</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Errands Helper</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Always happy to run errands to make your day easier</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">💻</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">24/7 Tech Support</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Your personal tech support for all devices</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">🗺️</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Spontaneous</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Always ready for spontaneous adventures or quiet nights in</div>
                                </div>
                            </div>
                            <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px;">
                                <div style="font-size: 2rem; line-height: 1;">🕷️</div>
                                <div>
                                    <div style="font-weight: 600; margin-bottom: 4px;">Designated Bug Relocator</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">Bravely capturing and releasing any 8-legged intruders so you don't have to (Certification from the prestigious 2yr Australian outback diploma 🦘)</div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="#contact" class="share-btn primary" style="text-decoration: none;">Heard enough? Skip the scroll and jump straight to my contact details ⏭️</a>
                    </div>
                    `
                }
            ]
        },
        lookingFor: {
            tag: "📋 Now Hiring: Player 2",
            tagClass: "tag-gold",
            heading: "Job Opening: Player 2 (Permanent Role)",
            lead: "No previous experience required. Just curiosity, good vibes, and a willingness to get stuck in.",
            blocks: [
                {
                    type: "heading",
                    text: "What The Role Involves"
                },
                {
                    type: "featureGrid", features: [
                        {
                            src: "img/looking-for/couple-going-exploring-nature.webp",
                            alt: "A couple exploring nature",
                            title: "⛰️💚 Adventurous Heart",
                            text: "New places, new food, new cultures — exploring the world one Google Maps pin at a time."
                        },
                        {
                            src: "img/looking-for/couple-watching-movie-together.webp",
                            alt: "A couple watching a movie",
                            title: "🛋️💜 Cosy Soul",
                            text: "A slow night in. A film on, blankets, snacks, and absolutely nowhere we need to be."
                        },
                        {
                            src: "img/looking-for/couple-playing-video-games.webp",
                            alt: "A couple gaming",
                            title: "🎮💛 Playful Spirit",
                            text: "Controller in hand — competitive or co-op. Board games, fantasy, anime, sci-fi… I'll happily dive into your world if you'll dive into mine."
                        },
                        {
                            src: "img/looking-for/couple-cooking.webp",
                            alt: "A couple cooking",
                            title: "🎨🧠 Creative Mind",
                            text: "Making a mess in the kitchen, dancing to the music — I always want to be trying something new, exciting, and fun."
                        },
                        {
                            src: "img/looking-for/couple-enjoying-tea-on-the-couch.webp",
                            alt: "A couple enjoying tea",
                            title: "🫂🩷 Safe Space",
                            text: "Each other's safe space — no conversation too difficult, no walls up, and the trust that you'll always be listened to and heard."
                        },
                        {
                            src: "img/looking-for/couple-at-the-gym-working-out.webp",
                            alt: "A couple at the gym",
                            title: "💪❤️ Ambitious Body",
                            text: "Cheering each other on to be our best selves and always being there when the going gets tough."
                        }
                    ]
                },
                {
                    type: "valueGrid", columns: [
                        {
                            cards: [
                                {
                                    title: "⚡ Suggested Previous Experience",
                                    text: "A plus, not a prerequisite — on-the-job experience is provided.",
                                    tags: [
                                        {label: "🍜 Foodie", hint: "Always down to explore street food markets or try new recipes! 🥟"},
                                        {label: "🤓 Nerd", hint: "Embracing all things nerdy — tech, sci-fi, and deep rabbit holes! 🤓"},
                                        {label: "🎮 Gamer girl", hint: "Cosy gamer or co-op partner — playing a game together will always be fun! 🎮☕"},
                                        {label: "📚 Fantasy book girly", hint: "Always happy to chat about epic fantasy worlds, magic systems, and lore! 📚"},
                                        {label: "🌿 Nature girl", hint: "Countryside walks, fresh forest air, and outdoor resets! 🌲"},
                                        {label: "🎒 Backpacker", hint: "Exploring new cities, stamps in the passport, and great memories! 🎒"},
                                        {label: "😈 Secret wild side", hint: "A mischievous, adventurous side saved just for the right person behind closed doors 😏🔥"}
                                    ]
                                },
                                {
                                    title: "🛑 Dealbreakers (Dating Preferences)",
                                    text: "Everyone has preferences, and to avoid disappointment, here are my bare minimum requirements. It's not you, it's me 😞 (Tap any chip to see why!)",
                                    tags: [
                                        {
                                            label: "🌍 No long distance (UK only)",
                                            hint: "If you're not living in the UK, you're not for me! I need someone local enough that we can spend quality time together and build a real connection."
                                        },
                                        {
                                            label: "🚭 No smokers",
                                            hint: "Got nothing personal against people who smoke, but to be completely honest, it's bad for your health and I strongly prefer a smoke-free environment."
                                        },
                                        {
                                            label: "👶 No kids",
                                            hint: "Nothing against single mothers at all, but I just don't feel I can handle stepping in to raise or manage another person's child right now."
                                        },
                                        {
                                            label: "👪 Wants kids",
                                            hint: "I am 80–90% sure I want to build a family! If that's not something you envision in your future, then we're likely not a long-term match."
                                        },
                                        {
                                            label: `🎂 ~${_minAge} to ~${_maxAge}`,
                                            hint: "I prefer dating someone near my age or a little younger, where we share similar life stages and long-term goals."
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            cards: [
                                {
                                    title: "💍 The Contract",
                                    items: [
                                        "💍 Permanent, monogamous role",
                                        "🤗 Salary paid in snacks and hugs",
                                        "✈️ Paid holidays (okay, we might need to split the bill)",
                                        "🎁 Bonuses paid out on birthdays, anniversaries, and special occasions",
                                        "🚗 Company car (passenger princess privileges included)",
                                        "🐾 Pet-friendly workspace",
                                        "☕ Unlimited tea allowance",
                                        "🛋️ Flexible working — sometimes the sofa, sometimes the summit of a mountain",
                                        {html: "❤️ …and so much more — see <a href=\"#boyfriend-mode\">Boyfriend Mode</a> 👆"}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "paragraph",
                    html: '<div style="text-align: center; margin-top: 32px;"><a href="#contact" class="share-btn primary" style="text-decoration: none;">Heard enough? Skip the scroll and jump straight to my contact details ⏭️</a></div>'
                }
            ]
        },
        dates: {
            tag: "🗺️ Date Ideas",
            tagClass: "tag-purple",
            heading: "Choose your own adventure",
            lead: "Tell me your rough location and what you'd be up for trying — I'll sort out a time and a place.",
            blocks: [
                {
                    type: "locationInput",
                    label: "What is your rough location?",
                    placeholder: "e.g. Postcode, town, or train station",
                    subtext: "No tracking — I only see your location when you send the email."
                },
                {
                    type: "dateCards", cards: [
                        {
                            src: "img/dates/couple-date-bookstore.webp",
                            alt: "Calm Adventure",
                            title: "Chill mode",
                            pills: [
                                "☕ Coffee & Walk",
                                "🌳 Nature walk",
                                "📚 Bookstore Tour",
                                "🦆 Canal Walk"
                            ]
                        },
                        {
                            src: "img/dates/flower-market.webp", alt: "A flower market", title: "🍕 Foodie & Market", pills: [
                                "🥐 Pastry Adventure",
                                "🌸 Flower Market",
                                "🌮 Food Market"
                            ]
                        },
                        {
                            src: "img/dates/couple-on-date-axe-throwing.webp",
                            alt: "Axe throwing date",
                            title: "⚡ Active",
                            pills: [
                                "🕹️ Arcade",
                                "🪓 Axe Throwing",
                                "⛳ Mini Golf",
                                "🔫 Virtual Clay Pigeon"
                            ]
                        },
                        {
                            src: "img/dates/couple-date-at-a-gallery.webp",
                            alt: "A museum gallery",
                            title: "🧠 Intellectual",
                            pills: [
                                "🏛️ Museum",
                                "🖼️ Art Gallery",
                                "🐠 Aquarium / Zoo",
                                "🪐 Planetarium",
                                "🎫 Exhibition"
                            ]
                        },
                        {
                            src: "img/dates/couple-date-pottery-class.webp",
                            alt: "A pottery class date",
                            title: "🎨 Creative",
                            pills: [
                                "🏺 Pottery",
                                "✨ Kintsugi",
                                "🌱 Terrarium making",
                                "🧑‍🍳 Cooking Class",
                                "🖌️ Painting"
                            ]
                        },
                        {
                            src: "img/dates/couple-playing-video-games.webp",
                            alt: "Playing video games together",
                            title: "🎮 Video Game Session!",
                            pills: [
                                "⛰️ Peak",
                                "👫 It Takes Two",
                                "📖 Split Fiction",
                                "🌀 Portal 2",
                                "💬 Chat of Discord"
                            ]
                        }
                    ]
                }
            ]
        },

        /* ───────── Deep dive (pop-up topics) ───────── */

        personality: {
            blocks: [
                {
                    type: "construction",
                    gif: "img/gifs/xUStFKHmuFPYk.gif",
                    text: "The rest — my personality type, love languages, and the general vibe I bring to a room — is still being written. Check back soon!"
                },
                {
                    type: "interestCards", cards: [
                        {icon: "🛡️", title: "Loyal"},
                        {icon: "⏰", title: "Punctual"},
                        {icon: "📅", title: "Organiser & planner"},
                        {icon: "⚖️", title: "Ambivert"},
                        {icon: "🤓", title: "Nerdy", subtitle: "(if you didn't realise already)"},
                        {icon: "🔥", title: "Passionate"},
                        {icon: "💯", title: "Bit all or nothing"},
                        {icon: "🦉", title: "Night owl"}
                    ]
                }
            ]
        },

        weekInLife: {
            blocks: [
                {
                    type: "construction",
                    gif: "img/gifs/xUStFKHmuFPYk.gif",
                    text: "This section is still a work in progress! More photos and details coming soon."
                },
                {
                    type: "paragraph",
                    html: "<strong>Most days</strong>: sleep, gym <span style=\"font-size: 0.85em; opacity: 0.8;\">(x2-3 week)</span>, work, repeat."
                },
                {
                    type: "featureGrid", features: [
                        {
                            icon: "😴",
                            title: "Sleep",
                            text: "Recharging the batteries.",
                            src: "img/alec/alec-sleep.jpeg",
                            alt: "Alec sleeping"
                        },
                        {
                            icon: "🏋️‍♂️",
                            title: "Gym",
                            text: "Staying active and healthy. Occasionally dying when \"boss\" aka my PT decides I need to increase the weight... meanie.",
                            src: "img/alec/alec-exhausted-after-gym-workout.webp",
                            alt: "Alec passed out from working out"
                        },
                        {
                            icon: "💻",
                            title: "Work",
                            text: "Doing the tippy-tappy and trying to break production... wait, I mean trying NOT to break production.",
                            src: "img/gifs/maNB0qAiRVAty.gif",
                            alt: "Cat typing rapidly"
                        }
                    ]
                },
                {
                    type: "paragraph",
                    html: "<strong>Once a week</strong>: I will play D&D and see friends."
                },
                {
                    type: "featureGrid", features: [
                        {
                            icon: "🐉",
                            title: "Play D&D",
                            text: "Rolling dice and going on imaginary adventures.",
                            src: "img/hobbies/d20-dice-dnd-blue.webp",
                            alt: "Blue d20 D&D dice"
                        },
                        {
                            icon: "🍻",
                            title: "See Friends",
                            text: "Hanging out and catching up.",
                            src: "img/alec/alec-seeing-friends.jpg",
                            alt: "Alec hanging out with friends"
                        }
                    ]
                },
                {
                    type: "paragraph",
                    html: "<strong>Once a month</strong>: going to the office to see the team."
                },
                {
                    type: "featureGrid", features: [
                        {
                            icon: "🚆",
                            title: "Office Trip",
                            text: "Heading into the city to see the team.",
                            src: "img/places-been/deliveroo-office.jpg",
                            alt: "Deliveroo office interior"
                        }
                    ]
                },
                {
                    type: "paragraph",
                    html: "<strong>Every half a year</strong>: go on a holiday (usually something cultural in the spring/May time, and a relaxing one during the autumn/winter period)."
                },
                {
                    type: "featureGrid", features: [
                        {
                            icon: "🌸",
                            title: "Spring Cultural Trip",
                            text: "Exploring new places, cultures, and history.",
                            src: "img/places-been/alec-kimono-torii-gate-japan.webp",
                            alt: "Alec in kimono at Torii gate in Japan"
                        },
                        {
                            icon: "🌴",
                            title: "Winter Relaxing Holiday",
                            text: "Recharging the batteries and unwinding.",
                            src: "img/places-been/alec-infinity-pool-maldives.webp",
                            alt: "Alec in infinity pool in Maldives"
                        }
                    ]
                }
            ]
        },

        transparency: {
            blocks: [
                {
                    type: "note",
                    variant: "growth-banner",
                    text: "💬 No one is perfect, at least I am being honest! None of this defines me — it's just the honest stuff I'm actively working on, and I'd rather you know me fully."
                },
                {
                    type: "detailCols",
                    columns: [
                        {
                            title: "💪 Physical Health — On the Up",
                            items: [
                                {
                                    icon: "🩺",
                                    title: "Health Management",
                                    description: "Actively managing high blood pressure & diabetes — steadily improving."
                                },
                                {
                                    icon: "🏋️‍♂️",
                                    title: "Personal Trainer & Fitness",
                                    description: "Working with a personal trainer since March 2025 and lost ~10kg so far!"
                                },
                                {
                                    icon: "🎯",
                                    title: "Weight Target Goal",
                                    description: "Heading steadily towards a healthy 70–80kg range."
                                }
                            ]
                        },
                        {
                            title: "🧠 Mind & Emotions — Self-Aware",
                            items: [
                                {
                                    icon: "🧩",
                                    title: "Neurotype & Mindset",
                                    description: "Dyslexia, depression, anxious attachment & (undiagnosed) AuDHD."
                                },
                                {
                                    icon: "💭",
                                    title: "Deep Feeler & Overthinker",
                                    description: "An overthinker and recovering people-pleaser who feels things deeply."
                                },
                                {
                                    icon: "🗣️",
                                    title: "Therapy Positive",
                                    description: "I've done therapy a couple of times before and I'm much stronger & better for it."
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "note",
                    variant: "growth-note",
                    title: "🪞 Reflection & Self-Awareness",
                    text: "✨ I know most of my triggers and have worked hard to process most of my history. Consistent, open and honest communication are things I value very much in a relationship.",
                    tags: [
                        {label: "🩹 Childhood Bullying", hint: "Overcame early hurdles, which made me a far more empathetic and resilient person."},
                        {label: "🍲 Relationship with Food", hint: "Always working on a balanced, healthy, and happy relationship with good food!"},
                        {label: "💼 Workaholic", hint: "I get deeply passionate about my projects, but learning to disconnect and enjoy life."},
                        {label: "🌱 Active Self-Growth", hint: "Always trying to be a better partner, friend, and human than I was yesterday."}
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
                                {src: "img/hobbies/lego-imperial-star-destroyer-built.webp", alt: "A Lego Imperial Star Destroyer I built"},
                                {src: "img/hobbies/shibari-rope-bondage-torso.webp", alt: "Shibari rope bondage art"}
                            ],
                            tags: [
                                {label: "🧶 Crochet & Yarn", hint: "Very proud of my little crocheted Snorlax amigurumi plushie! 🧶💤"},
                                {label: "🪢 Rope / Shibari", hint: "Exploring aesthetics, trust, and tension through rope art 🪢"},
                                {label: "🏺 Pottery", hint: "There's something magical about throwing clay on a wheel 🏺"},
                                {label: "🧱 Lego", hint: "Building Lego sets is my ultimate meditative zen state 🧱"},
                                {label: "🔨 DIY", hint: "Drilling a hole or assembling IKEA furniture? I'm your man! 🔨📦"},
                                {label: "✂️ Crafts", hint: "Always up for getting crafty 😏✂️"}
                            ]
                        },
                        {
                            icon: "📷", title: "Photography",
                            body: "Photography threads through nearly everything else I do — nature, food, landscapes, my shibari art, fire and LED staff after dark, the stars, and my friends. I shoot on a Google Pixel 10 Pro (edited in Snapseed) and fly a DJI drone; I've got a Polaroid I'm still figuring out, and I'm dreaming of a proper camera — or even a telescope rig for night shots.",
                            imageGroups: [
                                {
                                    title: "Night Photography 🌌",
                                    images: [
                                        {src: "img/hobbies/crescent-moon-black-sky.webp", alt: "Crescent moon black sky"},
                                        {src: "img/hobbies/full-moon-astrophotography.webp", alt: "Full moon astrophotography"},
                                        {src: "img/hobbies/full-moon-behind-branches.webp", alt: "Full moon behind branches"},
                                        {src: "img/hobbies/dark-alley-illuminated-street-light.webp", alt: "Dark alley illuminated by street light"},
                                        {src: "img/hobbies/illuminated-led-tree-night.webp", alt: "Illuminated led tree night"},
                                        {src: "img/hobbies/led-hula-hoop-fire-spinning-night.webp", alt: "LED hula hoop and fire spinning night (Long exposure shot)"},
                                        {src: "img/hobbies/led-staff-beach-long-exposure.webp", alt: "LED staff on the beach (Long exposure shot)"},
                                        {src: "img/hobbies/bokeh-city-lights-water-reflection.webp", alt: "Bokeh city lights water reflection"},
                                        {src: "img/hobbies/city-lights-night-river.webp", alt: "City lights night river"},
                                        {src: "img/hobbies/moonlight-through-winter-trees.webp", alt: "Moonlight through winter trees"},
                                        {src: "img/hobbies/starry-night-sky-1.webp", alt: "Starry night sky"},
                                        {src: "img/hobbies/starry-night-sky-2.webp", alt: "Starry night sky"},
                                        {src: "img/hobbies/starry-night-sky-trees.webp", alt: "Starry night sky trees"}
                                    ]
                                },
                                {
                                    title: "Nature 🌿",
                                    images: [
                                        {src: "img/hobbies/bumblebee-on-lavender-flowers.webp", alt: "Bumblebee on lavender flowers"},
                                        {src: "img/hobbies/grey-squirrel-behind-tree.webp", alt: "Grey squirrel behind tree"},
                                        {src: "img/hobbies/looking-up-through-green-leaves.webp", alt: "Looking up through green leaves"},
                                        {src: "img/hobbies/flower-macro.webp", alt: "Flower macro"}
                                    ]
                                },
                                {
                                    title: "Landscapes 🏞️",
                                    images: [
                                        {src: "img/hobbies/sunset-landscape-photography.webp", alt: "One of my 1st sunset photo on a very old camera phone"},
                                        {src: "img/hobbies/bali-street-market.webp", alt: "Bali street market"},
                                        {src: "img/hobbies/airplane-landing-shot.webp", alt: "Airplane landing shot"},
                                        {src: "img/hobbies/arched-concrete-bridge-monochrome.webp", alt: "Arched concrete bridge monochrome"},
                                        {src: "img/hobbies/cozy-market-lights-london.webp", alt: "Cozy market lights london"},
                                        {src: "img/hobbies/dogs-walking-autumn-forest-path.webp", alt: "Dogs walking autumn forest path"},
                                        {src: "img/hobbies/golden-sunset-hilly-landscape.webp", alt: "Golden sunset hilly landscape"},
                                        {src: "img/hobbies/green-country-dirt-path.webp", alt: "Green country dirt path"},
                                        {src: "img/hobbies/new-york-cityscape.webp", alt: "New York cityscape"},
                                        {src: "img/hobbies/misty-winter-forest-path.webp", alt: "Misty winter forest path"},
                                        {src: "img/hobbies/stone-window-sea-view-cyprus.webp", alt: "Stone window sea view (Cyprus)"},
                                        {src: "img/hobbies/sunburst-shining-through-forest.webp", alt: "Sunburst shining through forest"},
                                        {src: "img/hobbies/sunset-skyline-silhouette.webp", alt: "Sunset skyline silhouette"},
                                        {src: "img/hobbies/tranquil-lake-blue-sky.webp", alt: "Tranquil lake blue sky"},
                                        {src: "img/hobbies/vibrant-photo-effect.webp", alt: "Vibrant photo effect"},
                                        {src: "img/hobbies/arthurs-seat-edinburgh.webp", alt: "Arthur's Seat in Edinburgh"},
                                        {src: "img/hobbies/winter-forest-foggy-path.webp", alt: "Winter forest foggy path"}
                                    ]
                                },
                                {
                                    title: "Buildings & Architecture 🏛️",
                                    images: [
                                        {src: "img/hobbies/empire-state-building-night-blue.webp", alt: "Empire state building night blue"},
                                        {src: "img/hobbies/glass-skyscrapers-london-clouds.webp", alt: "Glass skyscrapers london clouds"},
                                        {src: "img/hobbies/greenwich-royal-naval-college.webp", alt: "Greenwich royal naval college"},
                                        {src: "img/hobbies/houses-of-parliament-big-ben.webp", alt: "Houses of parliament big ben"},
                                        {src: "img/hobbies/london-eye-black-white.webp", alt: "London eye black white"},
                                        {src: "img/hobbies/london-skyscraper-glass-night.webp", alt: "London skyscraper glass night"},
                                        {src: "img/hobbies/painted-hearts-mural-wall.webp", alt: "Painted hearts mural wall"},
                                        {src: "img/hobbies/radcliffe-camera-oxford.webp", alt: "Radcliffe camera oxford"},
                                        {src: "img/hobbies/welwyn-garden-city-viaduct.webp", alt: "Welwyn Garden City viaduct"},
                                        {src: "img/hobbies/st-pauls-cathedral-night-illuminated.webp", alt: "St pauls cathedral night illuminated"},
                                        {src: "img/hobbies/st-pauls-cobbled-street-london.webp", alt: "St pauls cobbled street london"},
                                        {src: "img/hobbies/tower-bridge-london-day.webp", alt: "Tower bridge london day"},
                                        {src: "img/hobbies/tower-bridge-river-thames-aerial.webp", alt: "Tower bridge river thames aerial"},
                                        {src: "img/hobbies/tower-bridge-sunset.webp", alt: "Tower bridge sunset"}
                                    ]
                                },
                                {
                                    title: "Drone Shots 🚁",
                                    images: [
                                        {src: "img/hobbies/drone-shot-1.webp", alt: "Aerial drone photography shot 1"},
                                        {src: "img/hobbies/drone-shot-2.webp", alt: "Aerial drone photography shot 2"},
                                        {src: "img/hobbies/drone-shot-4.webp", alt: "Aerial drone photography shot 4"},
                                        {src: "img/hobbies/drone-shot-5.webp", alt: "Aerial drone photography shot 5"},
                                        {src: "img/hobbies/drone-shot-6.webp", alt: "Aerial drone photography shot 6"},
                                        {src: "img/hobbies/aerial-green-fields-trees.webp", alt: "Aerial green fields trees"},
                                        {src: "img/hobbies/aerial-pond-autumn-trees.webp", alt: "Aerial pond autumn trees"},
                                        {src: "img/hobbies/aerial-snowy-winter-forest.webp", alt: "Aerial snowy winter forest"},
                                        {src: "img/hobbies/aerial-viaduct-green-fields.webp", alt: "Aerial viaduct green fields"},
                                        {src: "img/hobbies/aerial-winding-green-landscape.webp", alt: "Aerial winding green landscape"}
                                    ]
                                },
                                {
                                    title: "Pets 🐾",
                                    images: [
                                        {src: "img/hobbies/birthday-dog-blue-bandana.webp", alt: "Birthday dog blue bandana"},
                                        {src: "img/hobbies/black-white-dog-wooden-floor.webp", alt: "Black white dog wooden floor"},
                                        {src: "img/hobbies/cat-scratching-tunnel-peeking.webp", alt: "Cat scratching tunnel peeking"},
                                        {src: "img/hobbies/colorful-parrot-on-keys.webp", alt: "Colorful parrot on keys"},
                                        {src: "img/hobbies/dog-playing-in-snow.webp", alt: "Dog playing in snow"},
                                        {src: "img/hobbies/dog-portrait-looking-up.webp", alt: "Dog portrait looking up"},
                                        {src: "img/hobbies/dog-under-table.webp", alt: "Dog under table"},
                                        {src: "img/hobbies/rabbit.webp", alt: "Rabbit"},
                                        {src: "img/hobbies/shiba-inu-dog-leash.webp", alt: "Shiba inu dog leash"},
                                        {src: "img/hobbies/tabby-cat-sleeping-wooden-floor.webp", alt: "Tabby cat sleeping wooden floor"},
                                        {src: "img/hobbies/two-dogs-cuddling-close.webp", alt: "Two dogs cuddling close"},
                                        {src: "img/hobbies/owner-looking-at-puppy.webp", alt: "Owner looking at puppy"}
                                    ]
                                },
                                {
                                    title: "Close ups 🔍",
                                    images: [
                                        {src: "img/hobbies/biscuits-close-up.webp", alt: "Biscuits close up"},
                                        {src: "img/hobbies/decorated-purple-monster-cake.webp", alt: "Decorated purple monster cake"},
                                        {src: "img/hobbies/breakfast-tea.webp", alt: "Breakfast tea"},
                                        {src: "img/hobbies/cake-decorating-tools.webp", alt: "Cake decorating tools"},
                                        {src: "img/hobbies/chinese-lanterns-sydney.webp", alt: "Chinese lanterns in Sydney (with my little kangaroo & koala statue)"},
                                        {src: "img/hobbies/blue-metal-mailbox-fence.webp", alt: "Blue metal mailbox fence"}
                                    ]
                                }
                            ],
                            tags: [
                                {label: "🌿 Nature", hint: "Fresh air and green trees are my favorite reset button 🌲"},
                                {label: "🏞️ Landscapes", hint: "Always chasing scenic views and golden hour light 🌅"},
                                {label: "🍔 Food", hint: "Food photography makes everything taste twice as good! 📸🍔"},
                                {label: "🚁 Aerial", hint: "Viewing the world from 100 feet up with my DJI drone! 🚁"},
                                {label: "🌌 Night & Astro", hint: "Long exposures of stars and moonlight in the dark 🌌"},
                                {label: "👤 Portraits", hint: "Capturing genuine moments and natural smiles 📸"}
                            ]
                        },
                        {
                            icon: "🎮", title: "Fun & Games",
                            body: "My home-office battle station is ready to work hard and play hard, no matter the day — and I've still got a soft spot for the classics, with original NES carts and a Game Boy in rotation. Off-screen it's board game nights and D&D campaigns.",
                            images: [
                                {src: "img/hobbies/alec-gaming-setup-triple-monitors.webp", alt: "My triple-monitor gaming desk"},
                                {src: "img/hobbies/nes-cartridge-retro-games.webp", alt: "Retro NES cartridges"},
                                {src: "img/hobbies/board-game-collection-in-bag.webp", alt: "My board game collection"},
                                {src: "img/hobbies/d20-dice-dnd-blue.webp", alt: "Blue D20 D&D die"}
                            ],
                            tags: [
                                {label: "🎮 Video Games", hint: "Player one ready! From cosy games to epic co-op adventures 🎮"},
                                {label: "🎲 Board Games", hint: "Always down for a board game night with friends! 🎲"},
                                {label: "🐉 D&D", hint: "Natural 20 on initiating fun tabletop adventures! 🎲"},
                                {label: "🎱 Pool / Snooker", hint: "Always down for a relaxed frame at the pub 🎱"}
                            ]
                        },
                        {
                            icon: "🍜", title: "Food",
                            body: "I love experimenting in the kitchen to make something delicious from time to time — from fresh cookies out of the oven to gastronomy, fermentation (kimchi, kombucha, sourdough), and brewing/distilling — alongside a proper brew from an embarrassingly large tea collection.",
                            images: [
                                {src: "img/hobbies/homemade-chocolate-chip-cookies.webp", alt: "Homemade chocolate chip cookies"},
                                {src: "img/hobbies/t2-tea-collection.webp", alt: "My tea collection"},
                                {src: "img/food/dessert-ice-cream-meringue.webp", alt: "Dessert ice cream meringue"},
                                {src: "img/food/roast-chicken-sunday-dinner.webp", alt: "Roast chicken Sunday dinner"}
                            ],
                            tags: [
                                {label: "🍳 Cooking", hint: "Experimenting in the kitchen with fresh ingredients 🍳"},
                                {label: "🧁 Baking", hint: "Fresh cookies out of the oven are my superpower 🍪"},
                                {label: "🧪 Fermentation (Want to try)", hint: "Getting into sourdough, kombucha, kimchi, and fermentation 🧪"},
                                {label: "🍳 Gastronomy (Want to try)", hint: "Exploring modern gastronomy and culinary science 🍳"},
                                {label: "🍺 Brewing & Distilling (Want to try)", hint: "Crafting small-batch brews and spirits 🍺"},
                                {label: "🍽️ Eating out", hint: "Always hunting for the next best food spot 🍽️"},
                                {label: "🫖 Tea", hint: "An embarrassingly large tea collection for every mood 🫖"}
                            ]
                        },
                        {
                            icon: "🏃", title: "Active",
                            body: "Outdoorsy stuff that doesn't feel like a workout — long countryside walks (ideally with a dog), getting out on the bike, archery, and the showy one: spinning fire and LED staffs after dark.",
                            images: [
                                {src: "img/hobbies/autumn-walk-with-dachshund-dog.webp", alt: "An autumn countryside walk with a dachshund"},
                                {src: "img/hobbies/mountain-bike-on-path.webp", alt: "My mountain bike out on a path"},
                                {src: "img/hobbies/archery-target-with-arrows.webp", alt: "An archery target with my arrows"},
                                {src: "img/hobbies/alec-with-fire-spinning-staff.webp", alt: "Me spinning a fire staff"}
                            ],
                            tags: [
                                {label: "🥾 Countryside walks", hint: "Best paired with a dog and a cosy pub finish 🐶"},
                                {label: "🚴 Cycling", hint: "Getting out on two wheels for a scenic ride 🚴"},
                                {label: "🏹 Archery", hint: "Hitting the bullseye with bow and arrow 🏹"},
                                {label: "🔥 Fire & LED Staff", hint: "Spinning fire and glowing staffs after dark! 🔥"}
                            ]
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
                        },
                        {
                            src: "img/bucket-list/swordplay.webp", icon: "⚔️", title: "Swordplay & Fencing", caption: "Learning historical swordplay, fencing, or stage combat."
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
                            country: "🇵🇱", name: "Poland", detail: "Enjoying too much vodka... Never again...", src: "img/places-been/palace-of-culture-science-warsaw.webp"
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
                            detail: "Tea, food, anime, Nintendo, Pokémon, Pokémon, Pokémon...",
                            src: "img/places-been/alec-kimono-torii-gate-japan.webp"
                        }
                    ]
                },
                {type: "heading", text: "Also Stamped My Passport In"},
                {
                    type: "tagRow", tags: [
                        {label: "🇬🇷 Greece", hint: "Ancient ruins, crystal clear waters, and incredible food 🇬🇷"},
                        {label: "🇪🇸 Spain", hint: "Tapas, sunshine, and rich architecture 🇪🇸"},
                        {label: "🇫🇷 France", hint: "Fresh croissants, culture, and beautiful countrysides 🇫🇷"},
                        {label: "🇨🇾 Cyprus", hint: "Stunning coastal views and warm Mediterranean vibes 🇨🇾"}
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
                {type: "heading", text: "💭 Daydreaming Of…"},
                {
                    type: "placeCards", cards: [
                        {
                            src: "img/places-want/italian-nonna-homemade-pasta-cooking.webp", detail: "Homemade pasta in Italy by a Nonna"
                        },
                        {
                            src: "img/places-want/family-feast-communal-dining-table.webp",
                            detail: "Enjoying different cultures' food"
                        },
                        {src: "img/places-want/poolside-reading-sunglasses-book.webp", detail: "Relaxing poolside"},
                        {
                            src: "img/places-want/alpine-ski-chalet-snow-pool.webp",
                            detail: "Relaxing in a snowy place"
                        },
                    ]
                },
                {
                    type: "paragraph", text: "…and honestly, the rest of the world too — there's so much food, history, and culture, I want to see it all."
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
                        {label: "🎭 Comedy", hint: "Nothing beats a great laugh after a long day! 🎭"},
                        {label: "💥 Action", hint: "Thrilling stunts, high stakes, and fast pacing 💥"},
                        {label: "🗺️ Adventure", hint: "Epic journeys and discovering new worlds 🗺️"},
                        {label: "🎭 Drama", hint: "Deep storytelling and compelling character arcs 🎭"},
                        {label: "💖 Romance", hint: "Sucker for a good heartwarming love story 💖"},
                        {label: "🚀 Sci-Fi", hint: "Mind-bending concepts, space, and futuristic tech 🚀"},
                        {label: "🔮 Supernatural", hint: "Mysteries, magic, and unexplained occurrences 🔮"},
                        {label: "🐉 Fantasy", hint: "Swords, sorcery, and incredible world-building 🐉"},
                        {label: "🎨 Animation", hint: "Stunning artwork and creative animation styles 🎨"},
                        {label: "🌸 Anime", hint: "From Studio Ghibli classics to shonen hype 🌸"},
                        {label: "🔍 Detective Procedurals", hint: "Solving the case step-by-step alongside the team 🕵️‍♂️"},
                        {label: "🎃 Horror — not for me", variant: "hate", hint: "Jump scares and horror movies are definitely not my vibe 🙈"}
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
                        {title: "Doctor Who", src: "img/movies-tv/doctor-who-poster.webp"},
                        {title: "Good Omens", src: "img/movies-tv/good-omens-poster.webp"},
                        {title: "Love is War", src: "img/movies-tv/kaguya-sama-love-is-war-anime-poster.webp"},
                        {title: "Tonikawa", src: "img/movies-tv/tonikawa-over-the-moon-for-you-poster.webp"},
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
                        {label: "🗝️ Metroidvania", hint: "Exploring interconnected maps and unlocking new abilities! 🗝️"},
                        {label: "🏃 Platformer", hint: "Precise jumps, tight controls, and satisfying movement 🏃"},
                        {label: "🧩 Puzzle", hint: "Engaging brain-teasers and clever game mechanics 🧩"},
                        {label: "⚔️ Strategy / RTS", hint: "Base building, resource management, and big tactical moves ⚔️"},
                        {label: "☕ Cosy", hint: "Relaxing gameplay, warm vibes, and zero stress ☕"},
                        {label: "🎯 Shooters", hint: "Tactical co-op or casual multiplayer fun 🎯"},
                        {label: "🏙️ City Builders", hint: "Designing efficient, thriving digital cities from scratch 🏙️"},
                        {label: "🗺️ Adventure", hint: "Rich stories, immersive worlds, and grand quests 🗺️"}
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
                        {label: "🥩 Tonkatsu", variant: "love", hint: "Crispy panko-breaded pork cutlet is elite comfort food 🥩"},
                        {label: "🍣 Sushi", variant: "love", hint: "Fresh nigiri and rolls are always a top pick 🍣"},
                        {label: "🍜 Ramen", variant: "love", hint: "Rich, slow-cooked broth with springy noodles 🍜"},
                        {label: "🥟 Bao Bun", variant: "love", hint: "Soft, fluffy steamed buns packed with flavor 🥟"},
                        {label: "🥖 Banh Mi", variant: "love", hint: "Crispy baguette, pickled veggies, and savoury fillings 🥖"},
                        {label: "🌮 Tacos", variant: "love", hint: "Authentic Mexican tacos with fresh lime & salsa 🌮"},
                        {label: "🍖 BBQ Ribs", variant: "love", hint: "Tender, smoky, fall-off-the-bone ribs 🍖"},
                        {label: "🍳 Full English", variant: "love", hint: "The ultimate weekend breakfast treat 🍳"},
                        {label: "🥩 Sunday Roast", variant: "love", hint: "Proper roast potatoes, gravy, and Yorkshire puddings 🥩"},
                        {label: "🍵 Matcha & Tea", variant: "love", hint: "A warm cup of matcha or quality loose-leaf tea 🍵"},
                        {label: "🥐 Pastries", variant: "love", hint: "Flaky croissants and fresh bakery treats 🥐"},
                        {label: "🍬 Sour sweets", variant: "love", hint: "The sourer, the better! 🍬"}
                    ]
                },
                {type: "heading", text: "In the bin"},
                {
                    type: "tagRow", tags: [
                        {label: "🧅 Onion", variant: "hate", hint: "Raw onions are a firm no for me 🙅‍♂️"},
                        {label: "🌽 Sweetcorn", variant: "hate", hint: "Definite pass on sweetcorn in my meals 🌽"}
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
                        {src: "img/food/dessert-ice-cream-meringue.webp", alt: "Dessert ice cream meringue"},
                        {src: "img/food/gin-tonic-cocktail-restaurant.webp", alt: "Gin tonic cocktail restaurant"},
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
                {type: "heading", text: "My chef specialties (without images)"},
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
                    text: "My taste is very eclectic — mostly video game & anime music, but ranging through metal, rock, rap, pop, lofi, j-pop, and j-rock. I'm not big on loud, crowded venues, but I'd love to go to a festival like Glastonbury one day."
                },
                {
                    type: "link", href: "https://open.spotify.com/user/alec_game", label: "Check out my Spotify"
                },
                {type: "heading", text: "🎧 A Playlist I Curated for You"},
                {
                    type: "paragraph",
                    text: "A hand-picked mix of songs I love — press play and get a feel for my taste."
                },
                {
                    type: "spotify",
                    src: "https://open.spotify.com/embed/playlist/3pwfF9YhpDSOJiINeLCf6o?utm_source=generator",
                    height: 352,
                    title: "Alec's curated playlist"
                },
                {
                    type: "link", href: "https://open.spotify.com/playlist/3pwfF9YhpDSOJiINeLCf6o", label: "Open Playlist in Spotify"
                },
                {type: "heading", text: "Genres on Rotation"},
                {
                    type: "tagRow", tags: [
                        {label: "🎮 Video Game Music", hint: "Orchestral and 8-bit game soundtracks light up my focus 🎮"},
                        {label: "🌸 Anime Music", hint: "High-energy openings and emotional anime themes 🌸"},
                        {label: "🤘 Metal", hint: "Heavy riffs and driving beats for intense workouts or focus 🤘"},
                        {label: "🎸 Rock", hint: "Classic and alternative rock tunes 🎸"},
                        {label: "🎤 Rap", hint: "Clever wordplay, flow, and great rhythms 🎤"},
                        {label: "🎵 Pop", hint: "Catchy melodies that you can't help singing along to 🎵"},
                        {label: "🎧 Lofi", hint: "Chill lofi beats for coding and quiet evenings 🎧"},
                        {label: "🎌 J-Pop", hint: "Upbeat Japanese pop tracks 🎌"},
                        {label: "🎸 J-Rock", hint: "Dynamic guitar solos and energetic Japanese rock 🎸"}
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
                {type: "heading", text: "Some Albums, Artists & Singles I Love!"},
                {
                    type: "cardGrid",
                    cards: [
                        {
                            title: "Pop Culture",
                            caption: "Song by Madeon - Just describes my eclectic taste in music (okay, it's mostly pop in this)",
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
                            caption: "Composer of the Octopath series, the music is amazing",
                            src: "https://image-cdn-fa.spotifycdn.com/image/ab6761610000f1781ceaf3dd34211f6f527ac575",
                            href: "https://open.spotify.com/artist/0Ph31fnwwrbxz5d7mEE1Zv"
                        },
                        {
                            title: "Christopher Larkin",
                            caption: "Composer of the Hollow Knight series, the music is amazing",
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
                            title: "Komi Can't Communicate",
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
                            title: "Trash Taste", description: "Anime, manga, and gaming culture", logo: "img/podcasts/trashtaste.webp", url: "https://open.spotify.com/show/6i9SWtZPb30xVXWVHSKCqq"
                        },
                        {
                            title: "Diary of a CEO", description: "Business and personal development", logo: "img/podcasts/the-diary-of-a-ceo.webp", url: "https://open.spotify.com/show/7iQXmUT7XGuZSzAMjoNWlX"
                        },
                        {
                            title: "Lateral", description: "Lateral thinking puzzles and problem solving", logo: "img/podcasts/lateral.webp", url: "https://open.spotify.com/show/1TthQOE4Fx6gBPW8l48cfN"
                        },
                        {
                            title: "The Rest Is Science", description: "Science communication and research", logo: "img/podcasts/the-rest-is-science.webp", url: "https://open.spotify.com/show/5oLIbjbUqQmSMVSm0qNLge"
                        },
                        {
                            title: "Sweet & Sour", description: "", logo: "img/podcasts/sweet-and-sour-podcast.webp", url: "https://open.spotify.com/show/33Q9r2UhclhpPrBRgP8saO"
                        },
                        {
                            title: "Jillian on Love", description: "Relationship and dating advice", logo: "img/podcasts/jillian-on-love.webp", url: "https://open.spotify.com/show/2qy9p5oXD7keoBQQzk1e1z"
                        },
                        {
                            title: "Luv Bites by Dr Tara", description: "Love and relationships with Dr Tara Marshall", logo: "img/podcasts/luv-bites-by-dr-tara.webp", url: "https://open.spotify.com/show/2SZ60RxLOyQ900l4PgJAlT"
                        },
                        {
                            title: "The Sabrina Zohar Show", description: "Conversations about relationships and self", logo: "img/podcasts/sabrina-zohar-show.webp", url: "https://open.spotify.com/show/2Dsp24A82JkYRXytiA2qRt"
                        },
                        {
                            title: "Critical Role", description: "D&D actual play with voice actors", logo: "img/podcasts/critical-role.webp", url: "https://open.spotify.com/show/7e8zPFBpW0DtgyrrPnt0xT"
                        },
                        {
                            title: "99% Invisible", description: "Design, architecture, and hidden history", logo: "img/podcasts/99-percent-invisible.webp", url: "https://open.spotify.com/show/2VRS1IJCTn2Nlkg33ZVfkM"
                        },
                        {
                            title: "History of Everything", description: "Historical narratives and stories", logo: "img/podcasts/history-of-everything.webp", url: "https://open.spotify.com/show/6ALnjYlFQeEOmeRwYoRlIh"
                        },
                        {
                            title: "Waveform", description: "Tech and gadget news", logo: "img/podcasts/waveform-podcast.webp", url: "https://open.spotify.com/show/6o81QuW22s5m2nfcXWjucc"
                        },
                        {
                            title: "Kit & Krysta", description: "Nintendo theme podcast", logo: "img/podcasts/kit-and-krysta-podcast.webp", url: "https://open.spotify.com/show/1YZTXzWylFUwu2dZpNd2V8"
                        },
                        {
                            title: "The AIAS Game Maker's Notebook", description: "Video game development and design", logo: "img/podcasts/game-makers-notebook.webp", url: "https://open.spotify.com/show/2yB9jTRog4XGCKG5bpNZUA"
                        },
                        {
                            title: "TED Talks Daily", description: "Short TED talks on various topics", logo: "img/podcasts/ted-talk-daily.webp", url: "https://open.spotify.com/show/1VXcH8QHkjRcTCEd88U3ti"
                        },
                        {
                            title: "TLDR News", description: "Daily news summary and analysis", logo: "img/podcasts/tldr-news.webp", url: "https://open.spotify.com/show/033A6YUYAyFIopBfV78aE2"
                        }
                    ]
                }
            ]
        },

        sports: {
            blocks: [
                {
                    type: "paragraph",
                    text: "Not really a sporty person, but I keep fit with cycling, long walks, and the gym — and dabble in bouldering, archery, and basketball. I don't really watch sports, but I support a few teams (mostly thanks to friends & family)."
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
                            label: "Rock Climbing"
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
                                    title: "🏛️ Policies I Believe In",
                                    items: [
                                        "📜 Simpler tax rules & closing tax loopholes",
                                        "🚆 Nationalising utilities & public transport",
                                        "🏥 Universal healthcare access & protecting the NHS",
                                        "⚖️ Workers' rights & fair living wages",
                                        "🏠 Housing justice & right to shelter",
                                        "🌿 Climate action & green energy transition",
                                        "📚 Freedom of speech, civil liberties & open access to knowledge",
                                        "🚲 Walkable cities, cycling & active travel",
                                        "🌐 Open source software & digital privacy"
                                    ]
                                }
                            ]
                        },
                        {
                            groups: [
                                {
                                    title: "🙏 Religion & Beliefs",
                                    items: [
                                        "Raised Christian; I now choose not to hold a belief system and just try to be as good and kind as I can",
                                        "I respect others' beliefs and try to educate myself on them"
                                    ]
                                },
                                {
                                    title: "❤️ Charities & Organisations I Support (Tap to Donate / Learn More)",
                                    charities: [
                                        {label: "MSF", url: "https://www.msf.org.uk/"},
                                        {label: "Mind", url: "https://www.mind.org.uk/"},
                                        {label: "Amnesty Int.", url: "https://www.amnesty.org.uk/"},
                                        {label: "Trussell Trust", url: "https://www.trusselltrust.org/"},
                                        {label: "Red Cross", url: "https://www.redcross.org.uk/"},
                                        {label: "NHS Give Blood", url: "https://www.blood.co.uk/"}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {type: "heading", text: "🌍 Causes & Communities I Support"},
                {
                    type: "tagRow",
                    tags: [
                        {label: "🌿 Environmentalism", hint: "Protecting our planet and living sustainably 🌿"},
                        {label: "✊ Human Rights", hint: "Dignity, freedom, and equality for everyone everywhere ✊"},
                        {label: "🏳️‍🌈🏳️‍⚧️ LGBTQIA+ Ally", hint: "Standing proud with my LGBTQIA+ friends & community 🏳️‍🌈"},
                        {label: "♀️ Women's Rights", hint: "Supporting gender equality and women's empowerment ♀️"},
                        {label: "🧠 Neurodiversity", hint: "Celebrating different minds, perspectives, and thinking styles 🧠"},
                        {label: "♿ Disability Rights", hint: "Advocating for accessibility and inclusion for all ♿"},
                        {label: "💚 Mental Health", hint: "Prioritising well-being, empathy, and open conversations 💚"},
                        {label: "🍉 Free Palestine", hint: "Peace, justice, and human rights for Palestine 🍉"},
                        {label: "🇺🇦 Stand With Ukraine", hint: "Standing in solidarity with Ukraine 🇺🇦"},
                        {label: "✊🏿 Black Lives Matter", hint: "Racial justice, equality, and ending discrimination ✊🏿"},
                        {label: "🤝 Stop Asian Hate", hint: "Standing against Asian hate and solidarity with communities 🤝"},
                        {label: "🕊️ Refugee Sanctuary", hint: "Welcoming and protecting those seeking safety from danger 🕊️"},
                        {label: "🐾 Animal Welfare", hint: "Kindness and protection for animals big and small 🐾"}
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

        friends: {
            blocks: [
                {
                    type: "testimonialRows",
                    items: [
                        {
                            src: "img/alec/alec-mt-batur-sunrise-silly-selfie-bali.webp",
                            alt: "Matěj & Alec at Mt Batur",
                            icon: "📋",
                            title: "Trusted Team player",
                            text: "Alec is great at keeping up with friends and loved ones throughout life's ups and downs. Kind and caring throughout. Plus masterful at logistics, definitely trusted as the team planner!",
                            signature: "— Matěj, Friend of many years",
                            imagePosition: "left"
                        },
                        {
                            src: "img/friends/minty.jpg",
                            alt: "Minty",
                            icon: "💪",
                            title: "Your No. 1 person to turn to",
                            text: "Alec is a no. 1 person to turn to. I know he will always be there for whatever you need. He's helpful and reliable. Always calm and a problem solver. I love his gentle, caring side. He's a keeper.",
                            signature: '— Minty aka. "Final Boss", Personal Trainer & Friend',
                            imagePosition: "right"
                        },
                        {
                            src: "img/friends/agent-l.jpg",
                            alt: "Agent L & Alec",
                            icon: "🕵️‍♀️",
                            title: "Finding ways to make you smile",
                            text: "Alec is the type of friend that everyone needs. He will show up for you, really listen and always shows his love and care in the most empathetic of ways, while always looking for ways to make you genuinely smile.",
                            signature: '— Agent L, Friend (photo of her has been redacted to protect her identity on secret mission)',
                            imagePosition: "left"
                        },
                        {
                            icon: "🧸",
                            title: "A small thing they do for people",
                            text: "Bought me some pokemon plushies back from Japan because I told him my favourite pokemon and was having a hard time at work.",
                            signature: "— Colleague, Friend",
                            imagePosition: "right"
                        },
                        {
                            src: "img/friends/anastasiia.jpg",
                            alt: "Anastasiia",
                            icon: "😎",
                            title: "Someone you can count on",
                            text: "",
                            signature: "— Anastasiia, Bestie obvs",
                            imagePosition: "left"
                        }
                    ]
                },
                {
                    type: "calloutBanner",
                    emoji: "📢",
                    title: "FRIEND PUBLIC SERVICE ANNOUNCEMENT",
                    text: "If you're a friend of mine and you're not on this website yet… you're officially letting the team down! 😱 Drop me a message to get your beautiful face featured on the site! 💅✨"
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
                    type: "labeledPhotoGrid",
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
                    type: "labeledPhotoGrid",
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
        },

        // 🎞️ GIFs that sum up Alec's life — an ever-growing collection.
        // To add one: paste its direct .gif URL as a new {src, alt} entry.
        gifs: {
            blocks: [
                {
                    type: "paragraph",
                    text: "Some things words can't capture — my life, summed up in looping form. This collection will keep growing."
                },
                {
                    type: "gifGrid",
                    gifs: [
                        {
                            src: "img/gifs/143vPc6b08locw.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/SRx5tBBrTQOBi.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/xUStFKHmuFPYk.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/maNB0qAiRVAty.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/7Wcyq7KvKFNTO.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/odw9yfkRU2oAAAAC.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/kPbvjinMD_0AAAAd.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/VsLN4UlXS4oz6.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/yAYZnhvY3fflS.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/7eAvzJ0SBBzHy.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/UO5elnTqo4vSg.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/9PAIhJvcQ35hdZPUir.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/31lPv5L3aIvTi.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/VFByXZlDHAJBkEmee4.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/oFeUVZfiuim9G.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/E87jjnSCANThe.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/eoFJSruUWf7qq1zNHD.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/SmoCFhZCi1kzu.gif",
                            alt: "A GIF that describes my life"
                        },
                        {
                            src: "img/gifs/NTur7XlVDUdqM.gif",
                            alt: "A GIF that describes my life"
                        }
                    ]
                }
            ]
        },

        couples: {
            blocks: [
                {
                    type: "featureGrid", features: [
                        {
                            src: "https://media1.tenor.com/m/OLVsLLBhDr8AAAAC/brooklyn-nine-nine-amy-santiago.gif",
                            alt: "Jake & Amy (Brooklyn Nine-Nine)",
                            title: "Jake & Amy (Brooklyn Nine-Nine)",
                            html: "<em>\"I love you and I treasure you... and you bore me.\"</em> (Okay, maybe not the bore me part! 😉)<br><br>Competitive, silly, and deeply supportive. Dorks who push each other to grow while having endless fun together."
                        },
                        {
                            src: "https://media1.tenor.com/m/O1-UR5lORTgAAAAC/doctor-who-whovian.gif",
                            alt: "The Doctor & River Song (Doctor Who)",
                            title: "The Doctor & River Song (Doctor Who)",
                            html: "<em>\"When you love the Doctor, it's like loving the stars themselves. You don't expect a sunset to admire you back.\"</em><br><br>Cross-time adventures, unfailing loyalty, and a romance that spans space and time."
                        },
                        {
                            src: "https://media1.tenor.com/m/MPCQRMAcpHUAAAAC/ceceisthebest.gif",
                            alt: "Tom Holland and Zendaya",
                            title: "Tom Holland & Zendaya",
                            text: "The ultimate real-life couple goals. Beyond the chemistry, what makes them special is how they unabashedly celebrate each other's wins."
                        },
                        {
                            src: "https://media1.tenor.com/m/OGqyw4P1bgUAAAAd/fitzsimmons-fitzs.gif",
                            alt: "Fitzsimmons (Agents of S.H.I.E.L.D.)",
                            title: "Fitzsimmons (Agents of S.H.I.E.L.D.)",
                            html: "<em>\"You know, I realized something. The universe can't stop us. 'Cause we have crossed galaxies, we traveled through time, we survived the bottom of the Atlantic just so we could be together. Now, a love like that, that is stronger than any curse, and you and I, we are unstoppable together.\"</em>"
                        },
                        {
                            src: "https://media1.tenor.com/m/Ye9HTo8O6wcAAAAC/roy-mustang-and-riza-hawkeye-roy-mustang.gif",
                            alt: "Roy & Hawkeye (Fullmetal Alchemist)",
                            title: "Roy & Hawkeye (Fullmetal Alchemist)",
                            text: "Unshakable trust and quiet loyalty. Having each other's back through thick and thin, keeping each other grounded and accountable."
                        },
                        {
                            src: "https://media1.tenor.com/m/m2wUr4fJm_8AAAAC/hotfuzz-hot.gif",
                            alt: "Simon Pegg & Nick Frost",
                            title: "Simon Pegg & Nick Frost",
                            text: "Iconic friendship and partner-in-crime energy. Ride-or-die duo through alien invasions and village mysteries."
                        },
                        {
                            src: "https://media1.tenor.com/m/K-ssHUtHo0kAAAAC/kaguya-sama-love-is-war-kaguya-sama.gif",
                            alt: "Miyuki & Kaguya (Love is War)",
                            title: "Miyuki & Kaguya (Love is War)",
                            text: "Matching each other's wit and intellect while secretly caring for each other deeply."
                        },
                        {
                            src: "https://media1.tenor.com/m/6vTGcjFMzHcAAAAC/tsukasa-tsukasita.gif",
                            alt: "Nasa & Tsukasa (Tonikawa)",
                            title: "Nasa & Tsukasa (Tonikawa)",
                            text: "Wholesome, earnest love navigating life's everyday moments with devotion."
                        },
                        {
                            src: "https://media1.tenor.com/m/v0MKqyPA8BsAAAAC/doctorwho-mattsmith.gif",
                            alt: "Rory & Amy (Doctor Who)",
                            title: "Rory & Amy (Doctor Who)",
                            text: "The Centurion and his girl. Unconditional, unbreakable devotion across two millennia."
                        },
                        {
                            src: "https://media1.tenor.com/m/RmcPflelHv0AAAAC/aziraphale-crowley.gif",
                            alt: "Crowley & Aziraphale (Good Omens)",
                            title: "Crowley & Aziraphale (Good Omens)",
                            text: "Ineffable partners across millennia. Opposites who balance each other perfectly."
                        }
                    ]
                }
            ]
        },

        campaign: {
            tag: '🎬 "Date Me" Campaign',
            heading: 'Watch the dating adventure unfold on social media as I do the "Date Me" Campaign',
            lead: 'Follow along on TikTok and Instagram as I test out date ideas, share behind-the-scenes vlogs, and document the journey of finding my Player 2!',
            blocks: [
                {
                    type: "socialCampaign",
                    profiles: [
                        {
                            platform: "TikTok",
                            handle: "@alectronic0",
                            href: "https://www.tiktok.com/@alectronic0/",
                            icon: "🎵",
                            cta: "Follow on TikTok"
                        },
                        {
                            platform: "Instagram",
                            handle: "@alectronic0",
                            href: "https://www.instagram.com/alectronic0/",
                            icon: "📸",
                            cta: "Follow on Instagram"
                        }
                    ],
                    clips: [
                        {
                            title: "Launch Day: Dating Profile Live! 🎉",
                            caption: "Exciting news — my dating profile is now live! Check it out and let me know your feedback.",
                            href: "https://www.tiktok.com/@alectronic0/photo/7660644090798722326",
                            src: "img/campaign/clip-1.webp",
                            platform: "TikTok"
                        },
                        {
                            title: "Launch Day: Setup & TikTok Launch 🤔",
                            caption: "Still figuring out TikTok content! Set up a dating website to find my nerdy other half.",
                            href: "https://www.tiktok.com/@alectronic0/photo/7662876569240620310",
                            src: "img/campaign/clip-2.webp",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 0: Poster Distribution! 🗺️🗡️",
                            caption: "New side-quest unlocked: Poster Distribution! Time to head to local coffee shops and bookstores.",
                            href: "https://www.tiktok.com/@alectronic0/video/7663174049757007126",
                            src: "img/campaign/clip-3.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 1: Cozy Café Mission ☕🎮",
                            caption: "Manifesting a beautiful nerd to find my poster in a local cafe today. Real-world dating side-quest: Accepted.",
                            href: "https://www.tiktok.com/@alectronic0/video/7663554136201301270",
                            src: "img/campaign/clip-4.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 1: Side-Quest Day 1 🗺️🏃‍♂️",
                            caption: "Just got back from side-questing! Day 1 of the IRL \"Date me\" campaign is officially over.",
                            href: "https://www.tiktok.com/@alectronic0/video/7663621465404689686",
                            src: "img/campaign/clip-5.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 2: London Wandering 🎲❌",
                            caption: "RNG wasn't in my favor today. Wandered around London trying to get posters up, but it turns out not many spots do notice boards.",
                            href: "https://www.tiktok.com/@alectronic0/video/7664002673460530454",
                            src: "img/campaign/clip-6.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 3: St Albans Win 🗺️🏃‍♂️",
                            caption: "St Albans edition! Massive upgrade today. Secured baked goods and actually got a poster up at Chaos City Comics! Plus, Snorlax joined me.",
                            href: "https://www.tiktok.com/@alectronic0/video/7664279284034456854",
                            src: "img/campaign/clip-7.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 4: Gym & Bug Fixes 🏋️‍♂️💻",
                            caption: "Balance & Bug Fixes! Started at the gym with my PT, then back home to grind through coding bug fixes.",
                            href: "https://www.tiktok.com/@alectronic0/video/7664711249007086870",
                            src: "img/campaign/clip-8.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 5: Cooldown & Lego Crocs 🔋😴",
                            caption: "Taking a rest day. Social battery hit 0%, so no poster runs—just hanging out at home showcasing the ultimate quest gear: Lego Crocs.",
                            href: "https://www.tiktok.com/@alectronic0/video/7665071561157725472",
                            src: "img/campaign/clip-9.jpg",
                            platform: "TikTok"
                        },
                        {
                            title: "Day 6: Cookie Baking 🍪",
                            caption: "Leveled up my baking stats today! Spiced chocolate chunk cookies with pretzels and marshmallows—plus Pikachu ones too! 💛✨",
                            href: "https://www.tiktok.com/@alectronic0/video/7665458523991559446",
                            src: "img/campaign/clip-10.jpg",
                            platform: "TikTok"
                        }
                    ]
                }
            ]
        },
    },

    outro: {
        tag: "🎉 One Last Thing",
        heading: "Thanks for Getting This Far!",
        lead: "If you've liked what you've seen, please reach out — I'd love to hear from you and put together a fun first date.",
        links: [
            {label: "Shoot your shot! 💘", href: "#contact", primary: true}
        ]
    },
    deepDive: {tag: '🔬 The Deep Dive', title: 'Everything Else About Me', spoiler: {emoji: '⚠️', title: 'Spoiler Warning', body: "Beyond this point is the deep dive. If you'd rather discover all this in person, feel free to stop here and just say hi! Otherwise, tap any topic below to open the full story."}, lockedBanner: {emoji: '🔒', title: 'Top Secret Content (Do Not Open) 🙅', tagline: 'do you dare? 😉😈🌶️🔥'}},
    cheekyGag: {title: 'Top Secret Content (Do Not Open) 🙅', teaseText: "😳 Seriously?! Do you really think I'd have that just lying around on my dating site…", unlockButton: '🔓🔑 Access secret content 😏', punchlineTitle: "You're Cheeky — I Like That!", punchlineBody: "You're cheeky 😉 I like that! If you really do want some fun though, go on — shoot your shot!"},
    footer: {note: 'Alec Doran-Twyford · Welwyn Garden City · he/him/they/them', credit: 'Powered by <a href="https://github.com/alectronic0/alectronic-date" target="_blank" rel="noopener noreferrer">Alec + GitHub Pages</a>', emoji: '🎮❤️🎮'},
    easterEgg: {
        toastTitle: '1-UP!', toastBody: "It's a secret to everybody.", toastSub: '🍄 +30 lives · you found the cheat code 🎮', emojis: [
            '❤️',
            '🍄',
            '⭐',
            '🎮'
        ]
    }
};
