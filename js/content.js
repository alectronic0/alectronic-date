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
const _maxAge = _myAge;

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
      {label: '📋 Who I Am', href: '#about'},
      {label: '📸 Faces', href: '#faces'},
      {label: '✨ General Vibe', href: '#general-vibe'},
      {label: '❤️ Boyfriend Mode', href: '#boyfriend-mode'},
      {label: '📋 Looking For', href: '#looking-for'},
      {label: '🗺️ Date Ideas', href: '#dates'},
      {label: '🎬 Campaign', href: '#campaign'},
      {label: '💬 Contact', href: '#contact'},
      {label: '🔬 Deep Dive ↓', href: '#deep-dive'}
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
      "an emergency contact 🚨",
      "a midnight snack raid partner 🌙",
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

  quest: {
    crossroads: {
      heading: "💘 Ready to Shoot Your Shot?",
      lead: "You've made it this far! Do you want to shoot your shot?<br>I've worked to make this as easy as possible: Tell me your <span class='text-purple'>name</span>, set your rough <span class=\"text-red\">location</span>, pick your <span class=\"text-green\">adventure</span>, answer a few <span class=\"text-blue\">ice breakers</span>, and <span class=\"text-gold\">leave the rest to me!</span>",
      shootIcon: "💘",
      shootLabel: "Shoot Your Shot",
      shootSub: "Start the quest — let's go on a date!",
      shareLabel: "Share with a Friend",
      shareSub: "Know someone who'd be a better match?"
    },
    steps: [
      {
        key: "name",
        title: "👋 What is your name, adventurer?",
        sub: "So you're looking to go on an adventure with Alec! Before we set off, what should I call you?",
        gaugeLabel: "Intro",
        colour: "#a855f7"
      },
      {
        key: "location",
        title: "📍 Where Do You Hail From?",
        sub: "Every great quest needs a starting point. Drop your rough location so I can plan the journey.",
        gaugeLabel: "Location",
        colour: "#ef4444"
      },
      {
        key: "adventure",
        title: "🗺️ Pick Your Adventure",
        sub: "What kind of adventure would you like to go on? Pick as many as you like!",
        gaugeLabel: "Adventure",
        colour: "#22c55e"
      },
      {
        key: "icebreaker",
        title: "🧊 Lets break the ice",
        sub: "Nearly there! Answer a few ice breakers, hold the ones you like, shuffle the rest.",
        gaugeLabel: "Icebreakers",
        colour: "#3b82f6"
      },
      {
        key: "victory",
        title: "💌 Seal & Send",
        sub: "This is the message you will send:",
        gaugeLabel: "Seal & Send",
        colour: "#f59e0b"
      }
    ],
    titlePills: [
      {emoji: "👑", label: "Princess", position: "prefix"},
      {emoji: "⚔️", label: "Fair Maiden", position: "prefix"},
      {emoji: "🦊", label: "Lady", position: "prefix"},
      {emoji: "🧙‍♀️", label: "Sorceress", position: "suffix", connector: "the"},
      {emoji: "🐉", label: "Dragon Slayer", position: "suffix", connector: "the"},
      {emoji: "🗡️", label: "Bad Ass Main Character", position: "suffix"},
      {emoji: "🏰", label: "First of Her Name", position: "suffix"},
      {emoji: "👸", label: "Queen of the Realm", position: "suffix"},
      {emoji: "🔥", label: "Chaos Gremlin", position: "suffix", connector: "the"},
      {emoji: "🧹", label: "Witch", position: "suffix", connector: "the"}
    ],
    complete: {
      title: "✨ Quest Complete!",
      sub: "This is the message you will send:",
      emailLabel: "Send as Email",
      copyLabel: "Copy responses",
      altText: "Message me on other apps:",
      editReminder: "💡 Want to change something? Click any section on the progress bar above to go back and edit."
    }
  },
  contact: {
    tag: "💬 How to Get in Touch",
    tagClass: "tag-blue",
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
    count: 2,
    answerLabel: "Email me your responses",
    email: "date@alec.today",
    emailSubject: "My responses to Alec's questions 🎮❤️",
    emailIntro: "Hi Alec!\nHere are my responses to your questions:",
    questions: [
      "What are your top three favourite countries — and what made them special?",
      "If you had to pick a favourite god or goddess, who would it be and why?",
      "What's your favourite food or cuisine?",
      "What's your favourite Pokemon?",
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
  deepDive: {tag: '🔬 The Deep Dive', tagClass: 'tag-silver', title: 'Everything Else About Me', spoiler: {emoji: '⚠️', title: 'Spoiler Warning', body: "Beyond this point is the deep dive. If you'd rather discover all this in person, feel free to stop here and just say hi! Otherwise, tap any topic below to open the full story."}, lockedBanner: {emoji: '🔒', title: 'Top Secret Content (Do Not Open) 🙅', tagline: 'do you dare? 😉😈'}},
  accordion: [
    {type: "heading", text: "Get to know me"},
    {key: "personality", emoji: "🧬", title: "Personality & Vibe", hint: "what I'm like to be around"},
    {key: "dislikes", emoji: "🙅", title: "Gentle Dislikes", hint: "a preference for calm"},
    {key: "friends", emoji: "👥", title: "Friend Review", hint: "what they say about me"},
    {key: "weekInLife", emoji: "📅", title: "A day in the life of Alec", hint: "my typical routines"},
    {key: "timeline", emoji: "⏳", title: "My Timeline", hint: "the story so far"},
    {key: "moments", emoji: "🏆", title: "Notable Moments", hint: "milestones & adventures"},
    {key: "transparency", emoji: "🚩", title: "My Red Flags", hint: "no one's perfect, at least I'm being honest"},
    {key: "politics", emoji: "🏛️", title: "Politics & Religion", hint: "where I stand"},
    {key: "bucketList", emoji: "🪣", title: "Bucket List", hint: "things I'd love to try"},
    {key: "goals", emoji: "🚀", title: "Future Goals", hint: "where I'm headed"},
    {type: "heading", text: "Hobbies & Interests"},
    {key: "hobbies", emoji: "✨", title: "Hobbies & Interests", hint: "things that light me up"},
    {key: "places", emoji: "✈️", title: "Places (Been & Want to Go)", hint: "stamps & wishlist"},
    {key: "food", emoji: "🍽️", title: "Food", hint: "the way to my heart"},
    {key: "moviesTV", emoji: "🎬", title: "Movies & TV", hint: "what I'm watching"},
    {key: "videoGames", emoji: "🎮", title: "Video Games", hint: "player one, ready"},
    {key: "books", emoji: "📚", title: "Books", hint: "on my shelf"},
    {key: "music", emoji: "🎵", title: "Music", hint: "what's on my playlist"},
    {key: "podcasts", emoji: "🎙️", title: "Podcasts", hint: "long-journey listening"},
    {key: "sports", emoji: "⚽", title: "Sports", hint: "mostly a spectator"},
    {type: "heading", text: "DLC - Bonus content"},
    {key: "plantsAnimals", emoji: "🌺", title: "Plants & Creatures", hint: "a few favourites"},
    {key: "gifs", emoji: "🎞️", title: "GIFs I Love", hint: "my life in looping form"},
    {key: "couples", emoji: "💑", title: "Couple goals", hint: "couples I aspire my future relationship to be like"},
    {key: "underConstruction", emoji: "🚧", title: "Under construction", hint: "check back soon", wip: true},
  ],
  cheekyGag: {emoji: '😳', title: 'Seriously?!', teaseText: "Did you really think I'd just leave the highly sensitive material lying around for anyone to click?", unlockButton: '🔓🔑 Let me see anyway 😏', punchlineTitle: "You're Cheeky — I Like That!", punchlineBody: "Wow, you actually clicked it. I respect the curiosity 😉. If you really want to get to know me, you know what to do..."},

  /* ── Mid-page sections (each = blocks[]) ── */
  sections: {
    generalVibe: {
      tag: "✨ General Vibe",
      tagClass: "tag-green",
      heading: "The General Vibe",
      lead: "A collage of things I enjoy or find interesting. My general vibe!",
      blocks: [
        {
          type: "pills",
          pills: [
            {icon: "🤓", label: "Nerd", value: "Nerd", toast: "The meaning of life is 42🤖, live long and prosper🖖, May the force be with you ✨🚀"},
            {icon: "🎮", label: "Gamer", value: "Gamer", toast: "After a long day, relaxing with a video game by myself or with friends is how I decompress 🎮👾✨"},
            {icon: "📸", label: "Photographer", value: "Photographer", toast: "Snap! Snap! 📸 Be it a candid smile or a beautiful landscape, I want to capture the moment to share 🌄✨"},
            {icon: "😋", label: "Foodie", value: "Foodie", toast: "Om nom nom nom! 🤤 Nom nom nom nom! Eating, cooking, baking—I love enjoying all aspects of food! 🍕🍰🥖"},
            {icon: "💚", label: "Eco-Friendly", value: "Eco-Friendly", toast: "Trying to do my part for the world! 🌿 I'm not always perfect, but I do my best to care 🌍♻️"},
            {icon: "🧝", label: "Fantasy", value: "Fantasy", toast: "Getting lost in the Shire or going on a noble quest in D&D—fantasy allows me to escape 🗡️🛡️✨"},
            {icon: "🚀", label: "Sci-Fi", value: "Sci-Fi", toast: "Seeing a possible future or boldly going where no one has gone before! 🌌🛸⭐"},
            {icon: "🇯🇵", label: "Anime / Manga Lover", value: "Anime / Manga Lover", toast: "Be it fantasy, sci-fi, Isekai, or slice of life, I love a bit of anime ⛩️🍜✨"},
            {icon: "💪", label: "Gym Goer", value: "Gym Goer", toast: "I go to the gym to get stronger—and so I can enjoy more food! 🏋️‍♂️🥐🍕"},
            {icon: "🪛", label: "Tinker", value: "Tinker", toast: "I like building things, fixing things, and learning how things work 🛠️⚙️💡"},
            {icon: "👨‍💻", label: "Coder", value: "Coder", toast: "Tippy-tapping on the keyboard for work and sometimes a side project (like this website) 💻⚡⌨️"},
            {icon: "🏳️‍🌈🏳️‍⚧️", label: "LGBTQA+ Ally", value: "LGBTQA+ Ally", toast: "Just let people be who they want to be and love who they want to love ❤️✨🌈"},
            {icon: "☕", label: "Tea Drinker", value: "Tea Drinker", toast: "Fuelled almost entirely by a proper cup of tea throughout the day 🫖☕✨"},
            {icon: "🚴", label: "Cyclist", value: "Cyclist", toast: "Love getting out on two wheels for a fresh air break and a good ride 🚲💨🌲"},
            {icon: "🎲", label: "TTRPG / Board Games", value: "TTRPG / Board Games", toast: "Whether rolling d20s in D&D or learning a new board game, count me in 🎲♟️🃏"},
            {icon: "🛠️", label: "Always Learning", value: "Always Learning", toast: "Forever picking up a new hobby, experiment, or side project to dive into 📚🔬🎯"},
            {icon: "✈️", label: "Traveler", value: "Traveler", toast: "Love exploring new places, experiencing different cultures, and collecting memories around the world 🗺️🛫🌍"},
            {icon: "🧶", label: "Crafter", value: "Crafter", toast: "Making, painting, or crafting things by hand—there's nothing better than bringing ideas to life 🎨✂️🖌️"}
          ],
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
            {src: "img/vibe/slide_img_120.webp", alt: "Vibe 120"},
            {src: "img/vibe/slide_img_121.webp", alt: "Vibe 121"},
            {src: "img/vibe/slide_img_122.webp", alt: "Vibe 122"},
            {src: "img/vibe/slide_img_123.webp", alt: "Vibe 123"},
            {src: "img/vibe/slide_img_124.webp", alt: "Vibe 124"},
            {src: "img/vibe/slide_img_125.webp", alt: "Vibe 125"},
            {src: "img/vibe/slide_img_126.webp", alt: "Vibe 126"},
            {src: "img/vibe/slide_img_127.webp", alt: "Vibe 127"},
            {src: "img/vibe/slide_img_128.webp", alt: "Vibe 128"},
            {src: "img/vibe/slide_img_129.webp", alt: "Vibe 129"},
            {src: "img/vibe/slide_img_130.webp", alt: "Vibe 130"},
            {src: "img/vibe/slide_img_131.webp", alt: "Vibe 131"},
            {src: "img/vibe/slide_img_132.webp", alt: "Vibe 132"},
            {src: "img/vibe/slide_img_133.webp", alt: "Vibe 133"},
            {src: "img/vibe/slide_img_134.webp", alt: "Vibe 134"},
            {src: "img/vibe/slide_img_135.webp", alt: "Vibe 135"},
            {src: "img/vibe/slide_img_136.webp", alt: "Vibe 136"},
            {src: "img/vibe/slide_img_137.webp", alt: "Vibe 137"},
            {src: "img/vibe/slide_img_138.webp", alt: "Vibe 138"},
            {src: "img/vibe/slide_img_139.webp", alt: "Vibe 139"},
            {src: "img/vibe/slide_img_140.webp", alt: "Vibe 140"},
            {src: "img/vibe/slide_img_141.webp", alt: "Vibe 141"},
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
              title: "👸 Passenger Princess as Standard",
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
                    <dialog id="bfExtrasModal" class="deep-modal">
                        <div class="deep-modal-inner">
                            <div class="deep-modal-head">
                                <h3 class="deep-modal-title">✨ And so much more...</h3>
                                <span class="deep-link" role="button" tabindex="0" data-anchor="bfExtrasModal" title="Copy link to this section">🔗</span>
                                <button class="deep-modal-close" aria-label="Close modal" onclick="this.closest('dialog').close()">&times;</button>
                            </div>
                            <div class="deep-modal-body">
                                <div class="interest-cards">
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🫂</span><span class="interest-card-title">Expert Hugger</span></div>
                                <p class="interest-card-body">Always ready to wrap you up in a big, comforting hug exactly when you need it most</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">☕</span><span class="interest-card-title">Pre-Loaded Coffee Order</span></div>
                                <p class="interest-card-body">Never having to repeat your coffee order, plus a constant supply of your favourite snacks</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🪛</span><span class="interest-card-title">Certified IKEA Flatpack Builder</span></div>
                                <p class="interest-card-body">Never worry about missing screws or confusing instruction manuals again</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🐧</span><span class="interest-card-title">Certified Meme Dealer</span></div>
                                <p class="interest-card-body">Pebbling you with hundreds of perfectly curated memes</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">📖</span><span class="interest-card-title">Book Boyfriend Roleplayer</span></div>
                                <p class="interest-card-body">BookTok girls will know exactly what this means 😉 <em>(Willing to supply 'who did this to you?' energy on demand)</em></p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🧑‍🍳</span><span class="interest-card-title">Personal Chef / Baker</span></div>
                                <p class="interest-card-body">Fresh cookies and a meal fit for a queen at a moment's notice</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🛠️</span><span class="interest-card-title">Handler of the "Blue Jobs"</span></div>
                                <p class="interest-card-body">From taking out the bins to heavy lifting and DIY—I've got all the gross and heavy stuff covered</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon"><img src="https://cdn.simpleicons.org/deliveroo/00CC99" style="width: 24px; height: 24px; display: block;" alt="Deliveroo"></span><span class="interest-card-title">Deliveroo on Speed Dial</span></div>
                                <p class="interest-card-body">When cooking isn't the vibe, your favourite takeout is just a tap away</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">💻</span><span class="interest-card-title">24/7 Tech Support</span></div>
                                <p class="interest-card-body">Your personal tech support for all devices* <em>(Printer excluded)</em></p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🛍️</span><span class="interest-card-title">Errands Helper</span></div>
                                <p class="interest-card-body">Always happy to run errands to make your day easier</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🕷️</span><span class="interest-card-title">Designated Bug Relocator</span></div>
                                <p class="interest-card-body">Bravely capturing and releasing any 8-legged intruders so you don't have to <em>(Fully accredited via the Australian Outback 🦘)</em></p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🍷</span><span class="interest-card-title">Guaranteed to age like fine wine</span></div>
                                <p class="interest-card-body">If my dad is any indicator, I will age like fine wine <em>(or your money back)</em></p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">📱</span><span class="interest-card-title">Daily Check-Ins</span></div>
                                <p class="interest-card-body">Good morning and good night texts as standard—waking up and falling asleep with a sweet message 🌅🌙</p>
                            </div>
                            <div class="interest-card">
                                <div class="interest-card-head"><span class="interest-card-icon">🚨</span><span class="interest-card-title">Priority Emergency Contact</span></div>
                                <p class="interest-card-body">24/7 designated emergency contact status—always in your corner whenever you need someone 📞❤️</p>
                            </div>
                                </div>
                                <div style="margin-top: 24px; text-align: center; font-size: 0.85rem; color: var(--muted-2);">
                                    <p style="margin: 0;"><em>*Batteries not included (except for the phone charger battery pack he always carries around with him)</em></p>
                                    <div style="margin-top: 16px; background: var(--surface-3); padding: 20px; border-radius: 12px; border: 1px dashed var(--accent);">
                                        <h4 style="margin: 0 0 8px; font-size: 1.1rem; color: var(--text);">💍 Upgrade to Husband Mode™</h4>
                                        <p style="margin: 0 0 16px; font-size: 0.95rem; color: var(--muted);">Currently in closed beta. Subject to a successful trial period.</p>
                                        <button onclick="this.closest('dialog').close(); setTimeout(() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'}), 100);" class="share-btn primary" style="padding: 10px 20px; font-size: 0.95rem; display: inline-block; cursor: pointer; border: none; font-weight: 600;">Take for a test drive 🚗💨</button>
                                    </div>
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
      tag: "📋 Now Hiring: Player 2 (Permanent Role)",
      tagClass: "tag-gold",
      heading: "What I'm Looking For in My Player 2 for Life!",
      lead: "No previous experience required. Just curiosity, good vibes, and a willingness to get stuck in — below are just a few things my perfect partner might have!",
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
                      label: "🍕 Must be an omnivore",
                      hint: "🍖 Omnnomnomnivore 🥩 — I love food sooooo much! Sharing meal times, exploring new cuisines, and eating together is a huge part of how I connect, so I hope you enjoy all foods too! 🍕"
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
                    "🚨 24/7 Priority Emergency Contact privileges",
                    {html: "<span>✨ …and so much more — check out the <a href=\"#bfExtrasModal\" style=\"white-space: nowrap;\">Boyfriend Mode Extras 👆</a></span>"}
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
          type: "dateCards", cards: [
            {
              src: "img/dates/couple-date-bookstore.webp",
              alt: "Calm Adventure",
              title: "Chill mode",
              pills: [
                "☕ Coffee walk",
                "🌳 Nature walk",
                "🦆 Canal walk"
              ]
            },
            {
              src: "img/dates/couple-date-at-a-gallery.webp",
              alt: "A museum gallery",
              title: "🧠 Intellectual",
              pills: [
                "🏛️ Museum",
                "🖼️ Art Gallery",
                "🐠 Aquarium",
                "🦁 Zoo",
                "🪐 Planetarium"
              ]
            },
            {
              src: "img/dates/couple-playing-video-games.webp",
              alt: "Playing video games together",
              title: "🎮 Video Game Session!",
              pills: [
                "💬 Chat of Discord",
                "⛰️ Peak",
                "👫 It Takes Two",
                "📖 Split Fiction",
                "🌀 Portal 2",
              ]
            },
            {
              src: "img/dates/flower-market.webp", alt: "A flower market", title: "🍕 Foodie / Market", pills: [
                "🥐 Pastry Adventure",
                "🌸 Flower Market",
                "🌮 Food Market",
                "📚 Bookstore Tour",
              ]
            },
            {
              src: "img/dates/couple-on-date-axe-throwing.webp",
              alt: "Axe throwing date",
              title: "⚡ Active",
              pills: [
                "🕹️ Arcade",
                "🪓 Axe Throwing",
                "🎳 Bowling",
                "⛳ Mini Golf",
                "🔫 Virtual Clay Pigeon",
                "🎯 Flight Club"
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

          ]
        }
      ]
    },

    /* ───────── Deep dive (pop-up topics) ───────── */
    // Get to know me
    personality: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "Honestly who I am is always changing, but I feel like this is kinda my core self based on repeated actions in my life."
        },
        {
          type: "interestCards", cards: [
            {icon: "🐕", title: "Golden Retriever Energy", body: "Enthusiastic, deeply loyal, eager to please, and just happy to be included. I thrive on affection and bring a boundless, supportive energy to the people I care about."},
            {icon: "🛡️", title: "Protective", body: "My namesake, Alec, literally means 'Protector of Mankind'. I naturally fall into the 'guy in the chair' or support character role. I'm always looking out for the people around me, making sure everyone is okay, and fiercely protecting those who treat me with respect."},
            {icon: "⏰", title: "Punctual", body: "99.999% of the time, I'm right on time (or more accurately, 30 minutes early). If I think I'm going to be even 2 minutes late, you'll be getting a text with my exact GPS coordinates."},
            {icon: "📅", title: "Organiser & Planner", body: "Google Calendar out, Google Spreadsheets ready, Google Maps up, everything is meticulously planned out."},
            {icon: "🗺️", title: "Spontaneous", body: "Despite the planning, I can occasionally just say 'f*ck it, let's go' for short-term plans. (Though you probably won't catch me jumping on a plane unless the logistics are already handled)."},
            {icon: "⚖️", title: "Ambivert", body: "Sometimes I want to be out seeing people, and other times I just want to be wrapped up in a blanket on the couch, eating snacks and playing video games. It really just depends on the mood, the people, and the place."},
            {icon: "🤓", title: "Nerdy", subtitle: "(if you didn't realise already)", body: "Video games, anime, science, history, sci-fi, fantasy... you name it, I've probably played it or dabbled in it at least once. It's taken a while to fully embrace, but it's who I am, and I like me!"},
            {icon: "🔥", title: "Passionate", body: "Best believe a deep fire lives inside me, whether it's for the people I care about, a show I love, or an activity. I'm a massive Google and Nintendo fanboy, and if we disagree on a political viewpoint, I will defend my side with PASSION."},
            {icon: "💯", title: "Bit all or nothing", body: "I can be quite extreme. I'll either be the quietest person in the room or the loudest; I'll care deeply or not at all; I can be incredibly loved by people or totally detested. I'm a bit of a walking hypocrite sometimes."},
            {icon: "🦉", title: "Night owl", body: "I definitely do my best work at night (no, I'm not Batman). I only wake up early if I can't get back to sleep, or if I absolutely have to, and you better believe I'll need a morning matcha or coffee to get me going."}
          ]
        },
        {type: "heading", text: "Putting Myself in a Box"},
        {
          type: "paragraph",
          html: "<p style='color: var(--muted); font-size: 0.95rem; margin-top: -12px;'><em>Disclaimer: I know these concepts get banded about a lot, and there aren't always good things to be said about the people who invented them... but sometimes it's just nice to put yourself in a box!</em></p>"
        },
        {
          type: "interestCards", cards: [
            {icon: "♉", title: "Taurus", body: "The textbook definition is usually stubborn, materialistic, food-loving, and calm-natured... right up until they're a bull in a china shop. Honestly, I do resonate with that."},
            {icon: "🧠", title: "INFJ-T", body: "Introverted, Intuitive, Feeling, and Judging (with Turbulence). Known as the 'Advocate' personality, meaning I tend to approach life with deep thoughtfulness and imagination. I am driven by my core values and care deeply about helping others, but the 'Turbulent' side means I can be a bit of a perfectionist and hard on myself."},
            {icon: "🫂", title: "Physical Touch & Quality Time", subtitle: "(Primary)", body: "These are by far my main love languages. I just want to be close to the people I care about."},
            {icon: "🤲", title: "Acts of Service", body: "It feels weird asking for help sometimes, but I deeply appreciate it when people step in."},
            {icon: "💬", title: "Words of Affirmation", body: "Sometimes I'm not entirely sure how to take a compliment, but it still feels really nice."},
            {icon: "🎁", title: "Gift Giving", body: "Receiving gifts can be a bit awkward, mainly because I can be very particular about things."}
          ]
        }
      ]
    },
    dislikes: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "I can handle these — I just won't go seeking them out. Mostly it adds up to a preference for calm, intimate settings."
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
          type: "note", variant: "section-intro", text: "Yes, I do have friends, some nearby, some scattered. When we actually catch up it's usually an adventure, great food, and even better banter. A few of them were kind enough to leave a reference... no actual threats or bribes were made in the collection of these reviews. Honestly they could have been a bit meaner."
        },
        {
          type: "testimonialRows",
          items: [
            {
              src: "img/alec/alec-mt-batur-sunrise-silly-selfie-bali.webp",
              alt: "Matěj & Alec at Mt Batur",
              icon: "🧭",
              title: "Trusted Team player",
              text: "Alec is great at keeping up with friends and loved ones throughout life's ups and downs. Kind and caring throughout. Plus masterful at logistics, definitely trusted as the team planner!",
              signature: "— Matěj, Broski (1 half of the reason I have to travel 🇹🇭 🇺🇦 🇨🇿 🇮🇩)",
              imagePosition: "left"
            },
            {
              src: "img/friends/minty.webp",
              alt: "Minty",
              icon: "💪",
              title: "Your No. 1 person to turn to",
              text: "Alec is a no. 1 person to turn to. I know he will always be there for whatever you need. He's helpful and reliable. Always calm and a problem solver. I love his gentle, caring side. He's a keeper.",
              signature: '— Minty aka. "Final Boss", Personal Trainer & Friend',
              socialLink: "https://raminta.coach/",
              imagePosition: "right"
            },
            {
              src: "img/friends/agent-l.webp",
              alt: "Agent L & Alec",
              icon: "🕵️‍♀️",
              title: "Finding ways to make you smile",
              text: "Alec is the type of friend that everyone needs. He will show up for you, really listen and always shows his love and care in the most empathetic of ways, while always looking for ways to make you genuinely smile.",
              signature: '— Agent L, Friend (photo of her has been redacted to protect her identity on secret mission)',
              imagePosition: "left"
            },
            {
              src: "img/friends/pokemon-plushies.webp",
              alt: "Lilligant and Mew Pokémon plushies",
              icon: "🧸",
              title: "A small thing they do for people",
              text: "Bought me some pokemon plushies back from Japan because I told him my favourite pokemon and was having a hard time at work.",
              signature: "— Colleague and friend from work (Bribed with plushies)",
              imagePosition: "right"
            },
            {
              src: "img/friends/anastasiia.webp",
              alt: "Anastasiia",
              icon: "😎",
              title: "Someone you can count on",
              text: "",
              signature: "— Anastasiia, Bestie obvs (the other half of the reason I have to travel 🇹🇭 🇺🇦 🇨🇿 🇮🇩)",
              socialLink: "https://open.spotify.com/artist/3zTK2QTxmJqOw4umAQzCgN",
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
    weekInLife: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "Honestly maybe getting into TMI, but this is a general day-by-day, week-by-week of my life. It could do with a bit of a shake up!"
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
              src: "img/alec/alec-sleep.webp",
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
              src: "img/alec/alec-seeing-friends.webp",
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
              src: "img/places-been/deliveroo-office.webp",
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
    timeline: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "Seeing as I've already lived 35+ years of my life by myself, here's a quick timeline to catch you up on the big turning points since turning 18."
        },
        {
          type: "timeline",
          events: [
            {
              year: "Late 1900s~",
              title: "The Formative Years",
              description: "School, college, and university. Navigated a bit of bullying and a lot of repressed emotional trauma, but made it out alive with a Computer Science degree (with a 1st!).",
              icon: "🎒",
              companies: [
                {name: "Waitrose", logo: "img/company-logos/waitrose.webp"}
              ],
              travel: ["🇬🇷 Zante & Malia"]
            },
            {
              year: "2013 - 2014",
              title: "Backpacking & Discovery",
              description: "Backpacking across Australia, a bit of New Zealand, and interrailing. A huge period of growth and adventure.",
              icon: "🦘",
              companies: [
                {name: "IVSTEL", logo: "img/company-logos/ivestel.webp"}
              ],
              travel: [
                "🇦🇺 Sydney & Cairns",
                "🇳🇿 New Zealand",
                "🇪🇺 Interrailing (Germany & Poland)"
              ]
            },
            {
              year: "2015 - 2016",
              title: "The Dark Ages",
              description: "Readjusting to normal life and trying to start my career. A confusing but necessary transition phase.",
              icon: "🌧️",
              companies: [
                {name: "Waitrose", logo: "img/company-logos/waitrose.webp"},
                {name: "GLEAT", logo: "img/company-logos/gleat.webp"},
                {name: "Sky", logo: "img/company-logos/sky.webp"}
              ],
              travel: ["🇪🇸 Barcelona"]
            },
            {
              year: "2016 - 2018",
              title: "Early Career Hustle",
              description: "The classic early career grind: overworked, underpaid, and battling heavy imposter syndrome.",
              icon: "💼",
              companies: [
                {name: "Solirius Consulting", logo: "img/company-logos/solirius.webp"}
              ],
              travel: [
                "🇳🇱 Amsterdam",
                "🇸🇪 Stockholm",
                "🇹🇭 Phuket"
              ]
            },
            {
              year: "2018 - 2021",
              title: "The Rightmove & Covid-19",
              description: "Joined Rightmove and navigated the weirdness of the pandemic years like everyone else.",
              icon: "🏠",
              companies: [
                {name: "Rightmove", logo: "img/company-logos/rightmove.webp"}
              ],
              travel: [
                "🇺🇦 Kyiv",
                "🇳🇱 Amsterdam",
                "🇨🇿 Prague"
              ]
            },
            {
              year: "2021 - 2023",
              title: "The Route to Independence",
              description: "A huge era of change: moving to Deliveroo, getting promoted, buying a house, and venturing into the dating world (which brought its own flavor of dating depression).",
              icon: "🔑",
              companies: [
                {name: "Deliveroo", logo: "img/company-logos/deliveroo.webp"}
              ],
              travel: [
                "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Edinburgh & Glasgow"
              ]
            },
            {
              year: "2024 - 2025",
              title: "First Relationship",
              description: "Experienced my first serious relationship. A time of immense learning and emotional investment.",
              icon: "❤️",
              companies: [
                {name: "Deliveroo", logo: "img/company-logos/deliveroo.webp"}
              ],
              travel: [
                "🇮🇩 Bali",
                "🇫🇷 Lille"
              ]
            },
            {
              year: "2025 - 2026",
              title: "Building Back Stronger",
              description: "Starting again post-breakup. Hit the gym hard with a PT and faced the depression head-on.",
              icon: "💪",
              companies: [
                {name: "Deliveroo", logo: "img/company-logos/deliveroo.webp"},
                {name: "DoorDash", logo: "img/company-logos/doordash.webp"}
              ],
              travel: [
                "🇺🇸 New York",
                "🇲🇻 Maldives"
              ]
            },
            {
              year: "NOW",
              title: "The Present",
              description: "Ready for whatever comes next.",
              icon: "✨",
              companies: [
                {name: "Deliveroo", logo: "img/company-logos/deliveroo.webp"},
                {name: "DoorDash", logo: "img/company-logos/doordash.webp"}
              ],
              travel: [
                "🇯🇵 Japan",
                "🇨🇦 Toronto",
                "🇩🇪 Berlin",
                "❓ ????"
              ]
            }
          ]
        }
      ]
    },
    moments: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "A life well lived (so far), a few milestones, mishaps, and adventures. Tap any to enlarge."
        },
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
    politics: {
      blocks: [
        {
          type: "note",
          variant: "section-intro",
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
                    {label: "NHS Give Blood", url: "https://www.blood.co.uk/"},
                    {label: "Fight for the Future", url: "https://www.fightforthefuture.org/"}
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
            {label: "🌐 Digital Rights & Open Internet", hint: "Defending digital privacy, free expression, and an open internet for everyone 🌐"},
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
    bucketList: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "A running list of things I want to do, experience, or just throw myself into. Explore, experience, do it, that's the philosophy. And it's always better with a +1 on the adventure..."
        },
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
    goals: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "I've hit my main milestones — good job, a house, great friends. Still working on my health, and finding my life partner."
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

    // Hobbies & Interests
    hobbies: {
      blocks: [
        {
          type: "note",
          variant: "section-intro",
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
    places: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "I love to travel, though I'll be honest, soloing the world takes a lot out of me. Here's where I've been and where I'm still desperate to go. Spoiler: the answer to 'where do you want to go?' is basically everywhere."
        },
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
            {
              country: "🇷🇺",
              name: "Russia",
              detail: "I know, I know... but beyond Moscow, it is the largest country on Earth with endless, unexplored nature to discover.",
              src: "img/places-want/russia-siberian-nature.webp"
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
          type: "note", variant: "section-intro", text: "And honestly, the rest of the world too: there's so much food, history, and culture, I want to see it all!"
        }
      ]
    },
    food: {
      blocks: [
        {
          type: "note",
          variant: "section-intro",
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
    moviesTV: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "I'm fairly flexible with what I watch and genuinely keen to learn what you love. A few of my comfort-watches:"
        },
        {type: "link", href: "https://letterboxd.com/alectronic0/", label: "Letterboxd"},
        {type: "link", href: "https://www.imdb.com/user/p.km2yhybuiebyk5t7jb2rc3hzdy/", label: "IMDb"},
        {type: "link", href: "https://myanimelist.net/profile/Alectronic0", label: "MyAnimeList"},
        {type: "link", href: "https://www.rottentomatoes.com/profiles/user/alectronic0", label: "Rotten Tomatoes"},
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
            {label: "🔍 Detective Procedurals", hint: "Solving the case step-by-step alongside the team 🕵️‍♂️"}
          ]
        },
        {type: "heading", text: "🚫 Genres I Detest"},
        {
          type: "tagRow",
          tags: [
            {label: "🎃 Horror", variant: "hate", hint: "Jump scares and horror movies are definitely not my vibe 🙈"}
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
          type: "note",
          variant: "section-intro",
          text: "Games are a big part of my life and I'd love someone to share it with. My favourite series is The Legend of Zelda; I play on PC & Nintendo, love the music, and geek out over game dev, glitches and speedruns."
        },
        {type: "link", href: "https://steamcommunity.com/id/alectronic0", label: "Steam"},
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
    books: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "I'm not a huge reader — but if you love books I'll happily read your favourites. Roald Dahl is my favourite childhood author."
        },
        {type: "link", href: "https://goodreads.com/alectronic0", label: "Goodreads"},
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
    music: {
      blocks: [
        {
          type: "note",
          variant: "section-intro",
          html: "My music taste is... Eclectic!<br><br>I was brought up on a wild mix of UK radio (XFM, Magic, Heart, Capital, Radio 1, and Classic FM), so my tastes span 80s, 90s, 2000s and beyond across pop, rock, and rap. I also used to play blues and jazz on the piano and saxophone!<br><br>Right now it's mostly video game & anime music, ranging through metal, rock, rap, pop, lofi, j-pop, and j-rock. I mostly listen to video game soundtracks: either super chill background music for focusing or hype boss fight themes for an energy boost.<br><br>I'm not big on loud, crowded venues, but I'd love to go to a festival like Glastonbury one day (go live in a tent and experience it all, though I'll probably hate it by the end...). But play me something you love and I can easily get excited about it!"
        },
        {
          type: "link", href: "https://open.spotify.com/user/alec_game", label: "Spotify"
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
    podcasts: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "On long car journeys I'll dip into a few of these — a mix of nerdy, thoughtful and dating-curious:"
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
              title: "Sweet & Sour", description: "Pop culture, anime, and life chats with nerdy ladies", logo: "img/podcasts/sweet-and-sour-podcast.webp", url: "https://open.spotify.com/show/33Q9r2UhclhpPrBRgP8saO"
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
          type: "note",
          variant: "section-intro",
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

    // DLC - Bonus content
    plantsAnimals: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "Okay, this one's a bit random, but here are some plants, animals, and creatures I just think are... neat. No further justification required."
        },
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
    gifs: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "I genuinely don't know why I have a GIF section, but some things words just can't capture. It's my life summed up in looping form, and honestly? I love it (and this collection will keep growing!)."
        },
        {
          type: "gifGrid",
          gifs: [
            {
              src: "img/gifs/E87jjnSCANThe.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/9PAIhJvcQ35hdZPUir.gif",
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
              src: "img/gifs/yAYZnhvY3fflS.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/NTur7XlVDUdqM.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/VFByXZlDHAJBkEmee4.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/xUStFKHmuFPYk.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/SmoCFhZCi1kzu.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/7eAvzJ0SBBzHy.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/eoFJSruUWf7qq1zNHD.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/SRx5tBBrTQOBi.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/143vPc6b08locw.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/31lPv5L3aIvTi.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/UO5elnTqo4vSg.gif",
              alt: "A GIF that describes my life"
            },
            {
              src: "img/gifs/oFeUVZfiuim9G.gif",
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
              src: "img/gifs/VsLN4UlXS4oz6.gif",
              alt: "A GIF that describes my life"
            }
          ]
        }
      ]
    },
    couples: {
      blocks: [
        {
          type: "note", variant: "section-intro", text: "Hopeless romantic right here. These are the on-screen couples and relationships where I see it and think 'yep, I want exactly that'. The loyalty, the banter, calling each other out, the affection, and actually pushing each other to be better."
        },
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
    underConstruction: {
      blocks: [
        {
          type: "construction",
          gif: "img/gifs/xUStFKHmuFPYk.gif",
          text: "This website is always being updated so check back soon to see what other section I add next!"
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
  singlesEvents: {
    tag: "🥂 Singles & Events",
    title: "Singles & Social Events",
    subtitle: "Curated platforms, events, and venues to meet people and find singles mixers.",
    items: [
      {
        name: "CitySwoon UK",
        url: "https://cityswoon.com/uk/",
        category: "Speed Dating & Mixers",
        location: "UK / London",
        description: "Algorithm-matched speed dating and singles mixer events held at various stylish bars and venues.",
        tags: ["Speed Dating", "Social", "In-Person"]
      },
      {
        name: "The Art Dating Club",
        url: "https://www.artdatingclub.com/",
        category: "Creative & Arts Mixer",
        location: "London",
        description: "Curated singles mixers and social dating experiences hosted in contemporary art galleries and creative exhibition spaces.",
        tags: ["Art Gallery", "Creative", "Mixer", "Culture", "London"]
      },
      {
        name: "Circle Up",
        url: "https://www.circleup.space/",
        category: "Curated Social Dinners",
        location: "London",
        description: "Curated group dinners and social gatherings designed to bring people together naturally over delicious food without the awkwardness of speed dating.",
        tags: ["Dinner Club", "Community", "Social Dining", "London"]
      },
      {
        name: "Haystack Dating",
        url: "https://www.haystack-dating.com/",
        category: "Activity Dating",
        location: "London",
        description: "Activity-focused singles events prioritizing natural offline connections through shared interests and fun group experiences.",
        tags: ["Activities", "Social", "Events", "London"]
      },
      {
        name: "Date in a Dash",
        url: "https://dateinadash.com/",
        category: "Speed Dating & Mixers",
        location: "London (Clapham, Soho, Shoreditch)",
        description: "One of London's top speed dating and singles event organisers, featuring pub crawls, speed dating nights, quiz nights, and rooftop mixers.",
        tags: ["Speed Dating", "Pub Crawls", "Mixers", "London"]
      },
      {
        name: "It's a Date Club",
        url: "https://itsadate.club/events/london/",
        category: "Activity & Supper Club",
        location: "London",
        description: "Low-pressure activity dating and supper club events across London, from pottery masterclasses to wine tastings and dinner socials.",
        tags: ["Workshops", "Dinner", "Social", "London"]
      },
      {
        name: "True Dating — London (23–35)",
        url: "https://truedating.co.uk/events/search/city/london/age/23-to-35",
        category: "Speed Dating & Parties",
        location: "London",
        description: "Speed dating nights and lively singles parties held at premier cocktail bars across London specifically for ages 23 to 35.",
        tags: ["Speed Dating", "Ages 23-35", "Cocktail Bars", "London"]
      },
      {
        name: "True Dating — St Albans (23–35)",
        url: "https://truedating.co.uk/events/search/city/st-albans/age/23-to-35",
        category: "Local Speed Dating",
        location: "St Albans, Hertfordshire",
        description: "Local speed dating events and relaxed singles mixers hosted at friendly venues in St Albans for ages 23 to 35.",
        tags: ["Speed Dating", "Ages 23-35", "Local", "St Albans", "Hertfordshire"]
      },
      {
        name: "Thursday Events",
        url: "https://www.thursday.com/events/london",
        category: "Singles Bar Takeovers",
        location: "London",
        description: "Weekly Thursday night offline bar takeovers across London where 100% of attendees are single and ready to mingle.",
        tags: ["Thursday", "Bar Takeover", "Singles Night", "London"]
      },
      {
        name: "Original Dating — St Albans",
        url: "https://www.originaldating.com/st-albans/",
        category: "Local Speed Dating",
        location: "St Albans, Hertfordshire",
        description: "Speed dating evenings and social mixers at top bars in St Albans with equal numbers of singles.",
        tags: ["Speed Dating", "St Albans", "Hertfordshire", "Local"]
      },
      {
        name: "Original Dating — London",
        url: "https://www.originaldating.com/london/",
        category: "Speed Dating & Parties",
        location: "London",
        description: "London's leading singles events brand running speed dating, lock & key parties, quiz nights, and themed mixer socials.",
        tags: ["Speed Dating", "Parties", "Quizzes", "London"]
      },
      {
        name: "Bored of Dating Apps (BODA)",
        url: "https://www.boredofdatingapps.com/",
        category: "Offline Singles Community",
        location: "London & UK",
        description: "A refreshing offline community hosting relaxed singles mixers, casual pub drinks, active run clubs, and social meetups.",
        tags: ["Offline", "Community", "Casual", "Social", "Run Club"]
      },
      {
        name: "Dinner for One Hundred",
        url: "https://www.dinnerforonehundred.com/",
        category: "Supper Club & Pizza",
        location: "London",
        description: "A community supper club bringing people together on communal long tables for incredible sourdough pizza, drinks, and lively conversation.",
        tags: ["Supper Club", "Pizza", "Social Dining", "Community", "London"]
      },
      {
        name: "Sofar Sounds London",
        url: "https://www.sofarsounds.com/cities/london/",
        category: "Intimate Secret Gigs",
        location: "London (Secret Locations)",
        description: "Intimate, secret live music gigs in unique everyday spaces across London — perfect for music lovers looking for a memorable evening.",
        tags: ["Live Music", "Secret Gigs", "Acoustic", "Atmospheric", "London"]
      },
      {
        name: "Chicken Rush — Blind Dates",
        url: "https://chickenru.sh/events/blind-dates/",
        category: "Fun Food & Blind Dates",
        location: "London",
        description: "A quirky, playful food and dating concept combining blind dates, hilarious challenges, and casual dining in London.",
        tags: ["Blind Date", "Food Challenge", "Playful", "London"]
      },
      {
        name: "DesignMyNight — London Singles Events",
        url: "https://www.designmynight.com/london/whats-on/singles-events-in-london",
        category: "Singles Guide & Tickets",
        location: "London",
        description: "London's definitive nightlife and ticketing guide for upcoming singles nights, silent discos, comedy mixers, and speed dating events.",
        tags: ["Event Guide", "Tickets", "Nightlife", "London"]
      }
    ]
  },

  dateIdeas: {
    "tag": "💡 Date Ideas & Map",
    "title": "Recommended Date Ideas & Map",
    "subtitle": "Fun, creative, and memorable date ideas, local spots, food markets & activities across London & Hertfordshire.",
    "transit": {
        "home": {
            "name": "Home — Welwyn Garden City",
            "lat": 51.8016,
            "lng": -0.2073,
            "icon": "🏡",
            "category": "Home Base",
            "description": "Alec's home in Welwyn Garden City, Hertfordshire. Direct fast trains to King's Cross and Moorgate."
        },
        "office": {
            "name": "Deliveroo HQ (1 Cousin Lane)",
            "lat": 51.5113,
            "lng": -0.0903,
            "icon": "💼",
            "category": "Workplace",
            "description": "Deliveroo tech HQ right beside Cannon Street Station and the River Thames."
        },
        "lines": [
            {
                "name": "Great Northern (WGC → Finsbury Park)",
                "shortName": "Great Northern",
                "color": "#0284c7",
                "style": "solid",
                "stations": [
                    {
                        "name": "Welwyn Garden City",
                        "lat": 51.8005,
                        "lng": -0.2052,
                        "type": "origin",
                        "note": "Home station — direct trains to King's Cross (25m) & Moorgate"
                    },
                    {
                        "name": "Hatfield",
                        "lat": 51.7644,
                        "lng": -0.2185,
                        "type": "station"
                    },
                    {
                        "name": "Welham Green",
                        "lat": 51.7384,
                        "lng": -0.2227,
                        "type": "station"
                    },
                    {
                        "name": "Brookmans Park",
                        "lat": 51.7196,
                        "lng": -0.2039,
                        "type": "station"
                    },
                    {
                        "name": "Potters Bar",
                        "lat": 51.6987,
                        "lng": -0.1802,
                        "type": "station"
                    },
                    {
                        "name": "Hadley Wood",
                        "lat": 51.669,
                        "lng": -0.177,
                        "type": "station"
                    },
                    {
                        "name": "New Barnet",
                        "lat": 51.6496,
                        "lng": -0.1725,
                        "type": "station"
                    },
                    {
                        "name": "Oakleigh Park",
                        "lat": 51.6366,
                        "lng": -0.1656,
                        "type": "station"
                    },
                    {
                        "name": "New Southgate",
                        "lat": 51.6146,
                        "lng": -0.1429,
                        "type": "station"
                    },
                    {
                        "name": "Alexandra Palace",
                        "lat": 51.5982,
                        "lng": -0.1206,
                        "type": "station",
                        "note": "Alexandra Palace & parkland"
                    },
                    {
                        "name": "Hornsey",
                        "lat": 51.5866,
                        "lng": -0.1132,
                        "type": "station"
                    },
                    {
                        "name": "Harringay",
                        "lat": 51.5768,
                        "lng": -0.1044,
                        "type": "station"
                    },
                    {
                        "name": "Finsbury Park",
                        "lat": 51.5642,
                        "lng": -0.1065,
                        "type": "interchange",
                        "note": "Change: Victoria line, Piccadilly line"
                    }
                ]
            },
            {
                "name": "Great Northern City Branch (→ Moorgate)",
                "shortName": "GN City Branch",
                "color": "#0284c7",
                "style": "dashed",
                "stations": [
                    {
                        "name": "Finsbury Park",
                        "lat": 51.5642,
                        "lng": -0.1065,
                        "type": "interchange"
                    },
                    {
                        "name": "Drayton Park",
                        "lat": 51.5532,
                        "lng": -0.1054,
                        "type": "station"
                    },
                    {
                        "name": "Highbury & Islington",
                        "lat": 51.5463,
                        "lng": -0.1033,
                        "type": "interchange",
                        "note": "Change: Victoria line, Mildmay, Windrush"
                    },
                    {
                        "name": "Essex Road",
                        "lat": 51.5385,
                        "lng": -0.0964,
                        "type": "station"
                    },
                    {
                        "name": "Old Street",
                        "lat": 51.5256,
                        "lng": -0.0875,
                        "type": "interchange",
                        "note": "Change: Northern line (Bank branch)"
                    },
                    {
                        "name": "Moorgate",
                        "lat": 51.5186,
                        "lng": -0.0886,
                        "type": "terminus",
                        "note": "Change: Circle, H&C, Metropolitan, Northern, Elizabeth"
                    }
                ]
            },
            {
                "name": "Great Northern Mainline (→ King's Cross)",
                "shortName": "GN Fast",
                "color": "#7c3aed",
                "style": "dashed",
                "stations": [
                    {
                        "name": "Finsbury Park",
                        "lat": 51.5642,
                        "lng": -0.1065,
                        "type": "interchange"
                    },
                    {
                        "name": "King's Cross St Pancras",
                        "lat": 51.5308,
                        "lng": -0.1238,
                        "type": "terminus",
                        "note": "Fast from WGC (25 min). Change: Victoria, Piccadilly, Northern, Circle, H&C, Met"
                    }
                ]
            },
            {
                "name": "Victoria Line",
                "shortName": "Victoria",
                "color": "#0098D4",
                "style": "solid",
                "stations": [
                    {
                        "name": "Walthamstow Central",
                        "lat": 51.583,
                        "lng": -0.0198,
                        "type": "terminus",
                        "note": "Northern terminus — Walthamstow Village & market"
                    },
                    {
                        "name": "Blackhorse Road",
                        "lat": 51.5867,
                        "lng": -0.0414,
                        "type": "interchange",
                        "note": "Suffragette line interchange"
                    },
                    {
                        "name": "Tottenham Hale",
                        "lat": 51.5882,
                        "lng": -0.0602,
                        "type": "interchange",
                        "note": "Stansted Express + Lea Valley"
                    },
                    {
                        "name": "Seven Sisters",
                        "lat": 51.5822,
                        "lng": -0.0749,
                        "type": "interchange",
                        "note": "Overground & National Rail"
                    },
                    {
                        "name": "Finsbury Park",
                        "lat": 51.5642,
                        "lng": -0.1065,
                        "type": "interchange",
                        "note": "Cross-platform interchange with Great Northern"
                    },
                    {
                        "name": "Highbury & Islington",
                        "lat": 51.5463,
                        "lng": -0.1033,
                        "type": "interchange",
                        "note": "Interchange with GN City Branch, Mildmay, Windrush"
                    },
                    {
                        "name": "King's Cross St Pancras",
                        "lat": 51.5308,
                        "lng": -0.1238,
                        "type": "interchange",
                        "note": "Interchange with GN Mainline, Piccadilly, Northern, Circle, H&C, Met"
                    },
                    {
                        "name": "Euston",
                        "lat": 51.5282,
                        "lng": -0.1337,
                        "type": "interchange",
                        "note": "Northern line + West Coast Main Line"
                    },
                    {
                        "name": "Warren Street",
                        "lat": 51.5247,
                        "lng": -0.1384,
                        "type": "interchange",
                        "note": "Northern line (Charing Cross branch)"
                    },
                    {
                        "name": "Oxford Circus",
                        "lat": 51.5152,
                        "lng": -0.1418,
                        "type": "interchange",
                        "note": "Central & Bakerloo lines"
                    },
                    {
                        "name": "Green Park",
                        "lat": 51.5067,
                        "lng": -0.1428,
                        "type": "interchange",
                        "note": "Jubilee & Piccadilly lines"
                    },
                    {
                        "name": "Victoria",
                        "lat": 51.4965,
                        "lng": -0.1444,
                        "type": "interchange",
                        "note": "District, Circle & National Rail"
                    },
                    {
                        "name": "Pimlico",
                        "lat": 51.4893,
                        "lng": -0.1335,
                        "type": "station",
                        "note": "Tate Britain"
                    },
                    {
                        "name": "Vauxhall",
                        "lat": 51.4861,
                        "lng": -0.1233,
                        "type": "interchange",
                        "note": "National Rail interchange"
                    },
                    {
                        "name": "Stockwell",
                        "lat": 51.4723,
                        "lng": -0.1228,
                        "type": "interchange",
                        "note": "Northern line cross-platform interchange"
                    },
                    {
                        "name": "Brixton",
                        "lat": 51.4627,
                        "lng": -0.1145,
                        "type": "terminus",
                        "note": "Southern terminus — Brixton Village & O2 Academy"
                    }
                ]
            },
            {
                "name": "Piccadilly Line",
                "shortName": "Piccadilly",
                "color": "#003688",
                "style": "solid",
                "stations": [
                    {
                        "name": "Cockfosters",
                        "lat": 51.6517,
                        "lng": -0.1496,
                        "type": "terminus",
                        "note": "Northern terminus — Trent Country Park"
                    },
                    {
                        "name": "Oakwood",
                        "lat": 51.6476,
                        "lng": -0.1318,
                        "type": "station"
                    },
                    {
                        "name": "Southgate",
                        "lat": 51.6322,
                        "lng": -0.1278,
                        "type": "station",
                        "note": "Iconic Holden Art Deco architecture"
                    },
                    {
                        "name": "Arnos Grove",
                        "lat": 51.6164,
                        "lng": -0.1335,
                        "type": "station"
                    },
                    {
                        "name": "Bounds Green",
                        "lat": 51.6071,
                        "lng": -0.1243,
                        "type": "station"
                    },
                    {
                        "name": "Wood Green",
                        "lat": 51.5975,
                        "lng": -0.1096,
                        "type": "station",
                        "note": "Shopping City & Alexandra Palace bus"
                    },
                    {
                        "name": "Turnpike Lane",
                        "lat": 51.5902,
                        "lng": -0.1032,
                        "type": "station"
                    },
                    {
                        "name": "Manor House",
                        "lat": 51.5712,
                        "lng": -0.0958,
                        "type": "station",
                        "note": "Finsbury Park green space"
                    },
                    {
                        "name": "Finsbury Park",
                        "lat": 51.5642,
                        "lng": -0.1065,
                        "type": "interchange",
                        "note": "Great Northern & Victoria cross-platform"
                    },
                    {
                        "name": "Arsenal",
                        "lat": 51.5586,
                        "lng": -0.1059,
                        "type": "station",
                        "note": "Emirates Stadium"
                    },
                    {
                        "name": "Holloway Road",
                        "lat": 51.5526,
                        "lng": -0.1132,
                        "type": "station"
                    },
                    {
                        "name": "Caledonian Road",
                        "lat": 51.5481,
                        "lng": -0.1188,
                        "type": "station"
                    },
                    {
                        "name": "King's Cross St Pancras",
                        "lat": 51.5308,
                        "lng": -0.1238,
                        "type": "interchange"
                    },
                    {
                        "name": "Russell Square",
                        "lat": 51.5228,
                        "lng": -0.1244,
                        "type": "station",
                        "note": "British Museum & Bloomsbury"
                    },
                    {
                        "name": "Holborn",
                        "lat": 51.5174,
                        "lng": -0.12,
                        "type": "interchange",
                        "note": "Central line interchange"
                    },
                    {
                        "name": "Covent Garden",
                        "lat": 51.5129,
                        "lng": -0.1243,
                        "type": "station",
                        "note": "West End theatres, Opera House & piazza"
                    },
                    {
                        "name": "Leicester Square",
                        "lat": 51.5113,
                        "lng": -0.1281,
                        "type": "interchange",
                        "note": "Northern line interchange & West End cinemas"
                    },
                    {
                        "name": "Piccadilly Circus",
                        "lat": 51.51,
                        "lng": -0.1347,
                        "type": "interchange",
                        "note": "Bakerloo line interchange"
                    },
                    {
                        "name": "Green Park",
                        "lat": 51.5067,
                        "lng": -0.1428,
                        "type": "interchange",
                        "note": "Victoria & Jubilee lines"
                    },
                    {
                        "name": "Hyde Park Corner",
                        "lat": 51.5027,
                        "lng": -0.1527,
                        "type": "station",
                        "note": "Hyde Park & Wellington Arch"
                    },
                    {
                        "name": "Knightsbridge",
                        "lat": 51.5015,
                        "lng": -0.1607,
                        "type": "station",
                        "note": "Harrods & luxury shopping"
                    },
                    {
                        "name": "South Kensington",
                        "lat": 51.4941,
                        "lng": -0.1738,
                        "type": "interchange",
                        "note": "District & Circle lines — V&A, Natural History, Science Museum"
                    },
                    {
                        "name": "Gloucester Road",
                        "lat": 51.4945,
                        "lng": -0.1828,
                        "type": "interchange",
                        "note": "District & Circle lines"
                    },
                    {
                        "name": "Earl's Court",
                        "lat": 51.4907,
                        "lng": -0.1937,
                        "type": "interchange",
                        "note": "District line interchange"
                    },
                    {
                        "name": "Barons Court",
                        "lat": 51.4905,
                        "lng": -0.2138,
                        "type": "interchange",
                        "note": "District line cross-platform"
                    },
                    {
                        "name": "Hammersmith",
                        "lat": 51.4936,
                        "lng": -0.2251,
                        "type": "interchange",
                        "note": "District, H&C, Circle lines"
                    },
                    {
                        "name": "Turnham Green",
                        "lat": 51.4951,
                        "lng": -0.2547,
                        "type": "station",
                        "note": "Chiswick High Road"
                    },
                    {
                        "name": "Acton Town",
                        "lat": 51.5028,
                        "lng": -0.2801,
                        "type": "interchange",
                        "note": "Piccadilly branches & District line"
                    },
                    {
                        "name": "South Ealing",
                        "lat": 51.5011,
                        "lng": -0.3007,
                        "type": "station"
                    },
                    {
                        "name": "Northfields",
                        "lat": 51.4995,
                        "lng": -0.3148,
                        "type": "station"
                    },
                    {
                        "name": "Boston Manor",
                        "lat": 51.4956,
                        "lng": -0.3247,
                        "type": "station"
                    },
                    {
                        "name": "Osterley",
                        "lat": 51.4813,
                        "lng": -0.3522,
                        "type": "station",
                        "note": "Osterley Park (National Trust)"
                    },
                    {
                        "name": "Hounslow East",
                        "lat": 51.4733,
                        "lng": -0.3614,
                        "type": "station"
                    },
                    {
                        "name": "Hounslow Central",
                        "lat": 51.4713,
                        "lng": -0.3674,
                        "type": "station"
                    },
                    {
                        "name": "Hounslow West",
                        "lat": 51.4734,
                        "lng": -0.3858,
                        "type": "station"
                    },
                    {
                        "name": "Hatton Cross",
                        "lat": 51.4666,
                        "lng": -0.4227,
                        "type": "station"
                    },
                    {
                        "name": "Heathrow Terminals 2 & 3",
                        "lat": 51.4713,
                        "lng": -0.4524,
                        "type": "interchange",
                        "note": "Heathrow Airport + Elizabeth Line"
                    },
                    {
                        "name": "Heathrow Terminal 5",
                        "lat": 51.4723,
                        "lng": -0.4889,
                        "type": "terminus",
                        "note": "Western terminus — Heathrow Airport T5"
                    }
                ]
            },
            {
                "name": "Northern Line (Bank Branch)",
                "shortName": "Northern",
                "color": "#000000",
                "style": "solid",
                "stations": [
                    {
                        "name": "High Barnet",
                        "lat": 51.6505,
                        "lng": -0.194,
                        "type": "terminus",
                        "note": "Northern terminus"
                    },
                    {
                        "name": "Totteridge & Whetstone",
                        "lat": 51.6302,
                        "lng": -0.1795,
                        "type": "station"
                    },
                    {
                        "name": "Woodside Park",
                        "lat": 51.6179,
                        "lng": -0.1856,
                        "type": "station"
                    },
                    {
                        "name": "West Finchley",
                        "lat": 51.6095,
                        "lng": -0.1887,
                        "type": "station"
                    },
                    {
                        "name": "Finchley Central",
                        "lat": 51.6012,
                        "lng": -0.1927,
                        "type": "interchange",
                        "note": "Mill Hill East branch"
                    },
                    {
                        "name": "East Finchley",
                        "lat": 51.5874,
                        "lng": -0.1648,
                        "type": "station"
                    },
                    {
                        "name": "Highgate",
                        "lat": 51.5777,
                        "lng": -0.1466,
                        "type": "station",
                        "note": "Highgate Cemetery & Waterlow Park"
                    },
                    {
                        "name": "Archway",
                        "lat": 51.5653,
                        "lng": -0.1353,
                        "type": "station"
                    },
                    {
                        "name": "Tufnell Park",
                        "lat": 51.5567,
                        "lng": -0.138,
                        "type": "station"
                    },
                    {
                        "name": "Kentish Town",
                        "lat": 51.5503,
                        "lng": -0.1404,
                        "type": "station"
                    },
                    {
                        "name": "Camden Town",
                        "lat": 51.5392,
                        "lng": -0.1426,
                        "type": "interchange",
                        "note": "Camden Market & branch split"
                    },
                    {
                        "name": "Mornington Crescent",
                        "lat": 51.5342,
                        "lng": -0.1387,
                        "type": "station"
                    },
                    {
                        "name": "Euston",
                        "lat": 51.5282,
                        "lng": -0.1337,
                        "type": "interchange",
                        "note": "Victoria line & National Rail"
                    },
                    {
                        "name": "King's Cross St Pancras",
                        "lat": 51.5308,
                        "lng": -0.1238,
                        "type": "interchange"
                    },
                    {
                        "name": "Angel",
                        "lat": 51.5322,
                        "lng": -0.1058,
                        "type": "station",
                        "note": "Upper Street dining & boutique shopping"
                    },
                    {
                        "name": "Old Street",
                        "lat": 51.5256,
                        "lng": -0.0875,
                        "type": "interchange",
                        "note": "Great Northern City Branch connection"
                    },
                    {
                        "name": "Moorgate",
                        "lat": 51.5186,
                        "lng": -0.0886,
                        "type": "interchange",
                        "note": "Great Northern City Branch terminus"
                    },
                    {
                        "name": "Bank",
                        "lat": 51.5133,
                        "lng": -0.0886,
                        "type": "interchange",
                        "note": "Central, Waterloo & City, DLR, Elizabeth line"
                    },
                    {
                        "name": "London Bridge",
                        "lat": 51.5052,
                        "lng": -0.0864,
                        "type": "interchange",
                        "note": "Jubilee line + Borough Market"
                    },
                    {
                        "name": "Borough",
                        "lat": 51.5011,
                        "lng": -0.0943,
                        "type": "station",
                        "note": "Borough Market"
                    },
                    {
                        "name": "Elephant & Castle",
                        "lat": 51.4943,
                        "lng": -0.1001,
                        "type": "interchange",
                        "note": "Bakerloo line & National Rail"
                    },
                    {
                        "name": "Kennington",
                        "lat": 51.4884,
                        "lng": -0.1053,
                        "type": "interchange",
                        "note": "Branch merge / Battersea extension"
                    },
                    {
                        "name": "Nine Elms",
                        "lat": 51.48,
                        "lng": -0.128,
                        "type": "station",
                        "note": "New US Embassy quarter"
                    },
                    {
                        "name": "Battersea Power Station",
                        "lat": 51.4795,
                        "lng": -0.1422,
                        "type": "terminus",
                        "note": "Battersea Power Station shopping & dining hub"
                    },
                    {
                        "name": "Oval",
                        "lat": 51.4819,
                        "lng": -0.1126,
                        "type": "station",
                        "note": "The Oval cricket ground"
                    },
                    {
                        "name": "Stockwell",
                        "lat": 51.4723,
                        "lng": -0.1228,
                        "type": "interchange",
                        "note": "Victoria line cross-platform"
                    },
                    {
                        "name": "Clapham North",
                        "lat": 51.4649,
                        "lng": -0.1299,
                        "type": "station"
                    },
                    {
                        "name": "Clapham Common",
                        "lat": 51.4618,
                        "lng": -0.1384,
                        "type": "station",
                        "note": "Clapham Common park & pubs"
                    },
                    {
                        "name": "Clapham South",
                        "lat": 51.4527,
                        "lng": -0.148,
                        "type": "station"
                    },
                    {
                        "name": "Balham",
                        "lat": 51.4431,
                        "lng": -0.1525,
                        "type": "interchange",
                        "note": "National Rail interchange"
                    },
                    {
                        "name": "Tooting Bec",
                        "lat": 51.4358,
                        "lng": -0.1594,
                        "type": "station",
                        "note": "Tooting Bec Lido"
                    },
                    {
                        "name": "Tooting Broadway",
                        "lat": 51.4275,
                        "lng": -0.1685,
                        "type": "station",
                        "note": "Tooting Market & street food"
                    },
                    {
                        "name": "Colliers Wood",
                        "lat": 51.418,
                        "lng": -0.177,
                        "type": "station"
                    },
                    {
                        "name": "South Wimbledon",
                        "lat": 51.4154,
                        "lng": -0.1863,
                        "type": "station"
                    },
                    {
                        "name": "Morden",
                        "lat": 51.4022,
                        "lng": -0.1948,
                        "type": "terminus",
                        "note": "Southern terminus — Morden Hall Park (National Trust)"
                    }
                ],
                "branches": [
                    [
                        {
                            "name": "High Barnet",
                            "lat": 51.6505,
                            "lng": -0.194,
                            "type": "terminus",
                            "note": "Northern terminus"
                        },
                        {
                            "name": "Totteridge & Whetstone",
                            "lat": 51.6302,
                            "lng": -0.1795,
                            "type": "station"
                        },
                        {
                            "name": "Woodside Park",
                            "lat": 51.6179,
                            "lng": -0.1856,
                            "type": "station"
                        },
                        {
                            "name": "West Finchley",
                            "lat": 51.6095,
                            "lng": -0.1887,
                            "type": "station"
                        },
                        {
                            "name": "Finchley Central",
                            "lat": 51.6012,
                            "lng": -0.1927,
                            "type": "interchange",
                            "note": "Mill Hill East branch"
                        },
                        {
                            "name": "East Finchley",
                            "lat": 51.5874,
                            "lng": -0.1648,
                            "type": "station"
                        },
                        {
                            "name": "Highgate",
                            "lat": 51.5777,
                            "lng": -0.1466,
                            "type": "station",
                            "note": "Highgate Cemetery & Waterlow Park"
                        },
                        {
                            "name": "Archway",
                            "lat": 51.5653,
                            "lng": -0.1353,
                            "type": "station"
                        },
                        {
                            "name": "Tufnell Park",
                            "lat": 51.5567,
                            "lng": -0.138,
                            "type": "station"
                        },
                        {
                            "name": "Kentish Town",
                            "lat": 51.5503,
                            "lng": -0.1404,
                            "type": "station"
                        },
                        {
                            "name": "Camden Town",
                            "lat": 51.5392,
                            "lng": -0.1426,
                            "type": "interchange",
                            "note": "Camden Market & branch split"
                        },
                        {
                            "name": "Mornington Crescent",
                            "lat": 51.5342,
                            "lng": -0.1387,
                            "type": "station"
                        },
                        {
                            "name": "Euston",
                            "lat": 51.5282,
                            "lng": -0.1337,
                            "type": "interchange",
                            "note": "Victoria line & National Rail"
                        },
                        {
                            "name": "King's Cross St Pancras",
                            "lat": 51.5308,
                            "lng": -0.1238,
                            "type": "interchange"
                        },
                        {
                            "name": "Angel",
                            "lat": 51.5322,
                            "lng": -0.1058,
                            "type": "station",
                            "note": "Upper Street dining & boutique shopping"
                        },
                        {
                            "name": "Old Street",
                            "lat": 51.5256,
                            "lng": -0.0875,
                            "type": "interchange",
                            "note": "Great Northern City Branch connection"
                        },
                        {
                            "name": "Moorgate",
                            "lat": 51.5186,
                            "lng": -0.0886,
                            "type": "interchange",
                            "note": "Great Northern City Branch terminus"
                        },
                        {
                            "name": "Bank",
                            "lat": 51.5133,
                            "lng": -0.0886,
                            "type": "interchange",
                            "note": "Central, Waterloo & City, DLR, Elizabeth line"
                        },
                        {
                            "name": "London Bridge",
                            "lat": 51.5052,
                            "lng": -0.0864,
                            "type": "interchange",
                            "note": "Jubilee line + Borough Market"
                        },
                        {
                            "name": "Borough",
                            "lat": 51.5011,
                            "lng": -0.0943,
                            "type": "station",
                            "note": "Borough Market"
                        },
                        {
                            "name": "Elephant & Castle",
                            "lat": 51.4943,
                            "lng": -0.1001,
                            "type": "interchange",
                            "note": "Bakerloo line & National Rail"
                        },
                        {
                            "name": "Kennington",
                            "lat": 51.4884,
                            "lng": -0.1053,
                            "type": "interchange",
                            "note": "Branch merge / Battersea extension"
                        },
                        {
                            "name": "Oval",
                            "lat": 51.4819,
                            "lng": -0.1126,
                            "type": "station",
                            "note": "The Oval cricket ground"
                        },
                        {
                            "name": "Stockwell",
                            "lat": 51.4723,
                            "lng": -0.1228,
                            "type": "interchange",
                            "note": "Victoria line cross-platform"
                        },
                        {
                            "name": "Clapham North",
                            "lat": 51.4649,
                            "lng": -0.1299,
                            "type": "station"
                        },
                        {
                            "name": "Clapham Common",
                            "lat": 51.4618,
                            "lng": -0.1384,
                            "type": "station",
                            "note": "Clapham Common park & pubs"
                        },
                        {
                            "name": "Clapham South",
                            "lat": 51.4527,
                            "lng": -0.148,
                            "type": "station"
                        },
                        {
                            "name": "Balham",
                            "lat": 51.4431,
                            "lng": -0.1525,
                            "type": "interchange",
                            "note": "National Rail interchange"
                        },
                        {
                            "name": "Tooting Bec",
                            "lat": 51.4358,
                            "lng": -0.1594,
                            "type": "station",
                            "note": "Tooting Bec Lido"
                        },
                        {
                            "name": "Tooting Broadway",
                            "lat": 51.4275,
                            "lng": -0.1685,
                            "type": "station",
                            "note": "Tooting Market & street food"
                        },
                        {
                            "name": "Colliers Wood",
                            "lat": 51.418,
                            "lng": -0.177,
                            "type": "station"
                        },
                        {
                            "name": "South Wimbledon",
                            "lat": 51.4154,
                            "lng": -0.1863,
                            "type": "station"
                        },
                        {
                            "name": "Morden",
                            "lat": 51.4022,
                            "lng": -0.1948,
                            "type": "terminus",
                            "note": "Southern terminus — Morden Hall Park (National Trust)"
                        }
                    ],
                    [
                        {
                            "name": "Kennington",
                            "lat": 51.4884,
                            "lng": -0.1053,
                            "type": "interchange",
                            "note": "Branch merge / Battersea extension"
                        },
                        {
                            "name": "Nine Elms",
                            "lat": 51.48,
                            "lng": -0.128,
                            "type": "station",
                            "note": "New US Embassy quarter"
                        },
                        {
                            "name": "Battersea Power Station",
                            "lat": 51.4795,
                            "lng": -0.1422,
                            "type": "terminus",
                            "note": "Battersea Power Station shopping & dining hub"
                        }
                    ]
                ]
            },
            {
                "name": "Circle Line",
                "shortName": "Circle",
                "color": "#FFD300",
                "style": "solid",
                "stations": [
                    {
                        "name": "Moorgate",
                        "lat": 51.5186,
                        "lng": -0.0886,
                        "type": "interchange"
                    },
                    {
                        "name": "Liverpool Street",
                        "lat": 51.5178,
                        "lng": -0.0823,
                        "type": "interchange",
                        "note": "Elizabeth, Central, Metropolitan lines + National Rail"
                    },
                    {
                        "name": "Aldgate",
                        "lat": 51.5143,
                        "lng": -0.0755,
                        "type": "station",
                        "note": "Metropolitan line interchange"
                    },
                    {
                        "name": "Tower Hill",
                        "lat": 51.5101,
                        "lng": -0.0765,
                        "type": "station",
                        "note": "Tower of London & Tower Bridge"
                    },
                    {
                        "name": "Monument",
                        "lat": 51.5107,
                        "lng": -0.0858,
                        "type": "interchange",
                        "note": "District line + walkway to Bank"
                    },
                    {
                        "name": "Cannon Street",
                        "lat": 51.5114,
                        "lng": -0.0905,
                        "type": "station",
                        "note": "National Rail terminus"
                    },
                    {
                        "name": "Mansion House",
                        "lat": 51.5122,
                        "lng": -0.0945,
                        "type": "station"
                    },
                    {
                        "name": "Blackfriars",
                        "lat": 51.512,
                        "lng": -0.1037,
                        "type": "station",
                        "note": "Thameslink interchange"
                    },
                    {
                        "name": "Temple",
                        "lat": 51.5113,
                        "lng": -0.1137,
                        "type": "station",
                        "note": "Near Somerset House"
                    },
                    {
                        "name": "Embankment",
                        "lat": 51.5074,
                        "lng": -0.1223,
                        "type": "interchange",
                        "note": "Bakerloo, Northern lines + river boats"
                    },
                    {
                        "name": "Westminster",
                        "lat": 51.5013,
                        "lng": -0.1246,
                        "type": "interchange",
                        "note": "Houses of Parliament, Big Ben, Jubilee line"
                    },
                    {
                        "name": "St James's Park",
                        "lat": 51.4994,
                        "lng": -0.1335,
                        "type": "station",
                        "note": "Buckingham Palace & St James's Park"
                    },
                    {
                        "name": "Victoria",
                        "lat": 51.4965,
                        "lng": -0.1444,
                        "type": "interchange"
                    },
                    {
                        "name": "Sloane Square",
                        "lat": 51.4924,
                        "lng": -0.1565,
                        "type": "station",
                        "note": "King's Road & Chelsea"
                    },
                    {
                        "name": "South Kensington",
                        "lat": 51.4941,
                        "lng": -0.1738,
                        "type": "interchange"
                    },
                    {
                        "name": "Gloucester Road",
                        "lat": 51.4945,
                        "lng": -0.1828,
                        "type": "station",
                        "note": "Piccadilly line interchange"
                    },
                    {
                        "name": "High Street Kensington",
                        "lat": 51.5009,
                        "lng": -0.1918,
                        "type": "station",
                        "note": "Kensington Palace & Gardens"
                    },
                    {
                        "name": "Notting Hill Gate",
                        "lat": 51.509,
                        "lng": -0.1963,
                        "type": "interchange",
                        "note": "Central line + Portobello Market"
                    },
                    {
                        "name": "Bayswater",
                        "lat": 51.5121,
                        "lng": -0.1878,
                        "type": "station",
                        "note": "Near Kensington Gardens"
                    },
                    {
                        "name": "Paddington",
                        "lat": 51.5154,
                        "lng": -0.1755,
                        "type": "interchange",
                        "note": "Elizabeth line, H&C + Heathrow Express + GWR"
                    },
                    {
                        "name": "Edgware Road (Circle)",
                        "lat": 51.5199,
                        "lng": -0.1679,
                        "type": "station"
                    },
                    {
                        "name": "Baker Street",
                        "lat": 51.5226,
                        "lng": -0.1571,
                        "type": "interchange",
                        "note": "Jubilee, Metropolitan, Bakerloo, H&C lines"
                    },
                    {
                        "name": "Great Portland Street",
                        "lat": 51.5238,
                        "lng": -0.144,
                        "type": "station"
                    },
                    {
                        "name": "Euston Square",
                        "lat": 51.526,
                        "lng": -0.1359,
                        "type": "station",
                        "note": "Walking distance to Euston station"
                    },
                    {
                        "name": "King's Cross St Pancras",
                        "lat": 51.5308,
                        "lng": -0.1238,
                        "type": "interchange"
                    },
                    {
                        "name": "Farringdon",
                        "lat": 51.5203,
                        "lng": -0.1053,
                        "type": "interchange",
                        "note": "Thameslink + Elizabeth line"
                    },
                    {
                        "name": "Barbican",
                        "lat": 51.5204,
                        "lng": -0.0979,
                        "type": "station",
                        "note": "Barbican Centre — arts, theatre, cinema"
                    }
                ]
            },
            {
                "name": "Hammersmith & City Line (Barking ↔ Hammersmith)",
                "shortName": "H&C",
                "color": "#F3A9BB",
                "style": "solid",
                "stations": [
                    {
                        "name": "Barking",
                        "lat": 51.5396,
                        "lng": 0.0813,
                        "type": "terminus",
                        "note": "Eastern terminus — c2c & Suffragette line interchange"
                    },
                    {
                        "name": "East Ham",
                        "lat": 51.539,
                        "lng": 0.0519,
                        "type": "station"
                    },
                    {
                        "name": "Upton Park",
                        "lat": 51.5353,
                        "lng": 0.0349,
                        "type": "station"
                    },
                    {
                        "name": "Plaistow",
                        "lat": 51.5313,
                        "lng": 0.0172,
                        "type": "station"
                    },
                    {
                        "name": "West Ham",
                        "lat": 51.5285,
                        "lng": 0.0053,
                        "type": "interchange",
                        "note": "Jubilee, DLR, Elizabeth line & c2c"
                    },
                    {
                        "name": "Bromley-by-Bow",
                        "lat": 51.5248,
                        "lng": -0.0117,
                        "type": "station"
                    },
                    {
                        "name": "Bow Road",
                        "lat": 51.5269,
                        "lng": -0.0248,
                        "type": "station"
                    },
                    {
                        "name": "Mile End",
                        "lat": 51.5253,
                        "lng": -0.0337,
                        "type": "interchange",
                        "note": "Central line cross-platform interchange"
                    },
                    {
                        "name": "Stepney Green",
                        "lat": 51.5219,
                        "lng": -0.0514,
                        "type": "station"
                    },
                    {
                        "name": "Whitechapel",
                        "lat": 51.5194,
                        "lng": -0.0612,
                        "type": "interchange",
                        "note": "Elizabeth line & Windrush line interchange"
                    },
                    {
                        "name": "Aldgate East",
                        "lat": 51.5154,
                        "lng": -0.0726,
                        "type": "interchange",
                        "note": "District line interchange & Brick Lane"
                    },
                    {
                        "name": "Liverpool Street",
                        "lat": 51.5178,
                        "lng": -0.0823,
                        "type": "interchange",
                        "note": "Elizabeth, Central, Circle, Met + National Rail"
                    },
                    {
                        "name": "Moorgate",
                        "lat": 51.5186,
                        "lng": -0.0886,
                        "type": "interchange",
                        "note": "GN City Branch terminus"
                    },
                    {
                        "name": "Barbican",
                        "lat": 51.5204,
                        "lng": -0.0979,
                        "type": "station",
                        "note": "Barbican Arts Centre"
                    },
                    {
                        "name": "Farringdon",
                        "lat": 51.5203,
                        "lng": -0.1053,
                        "type": "interchange",
                        "note": "Thameslink + Elizabeth line interchange"
                    },
                    {
                        "name": "King's Cross St Pancras",
                        "lat": 51.5308,
                        "lng": -0.1238,
                        "type": "interchange",
                        "note": "GN Mainline terminus + Eurostar"
                    },
                    {
                        "name": "Euston Square",
                        "lat": 51.526,
                        "lng": -0.1359,
                        "type": "station",
                        "note": "Walk to Euston station"
                    },
                    {
                        "name": "Great Portland Street",
                        "lat": 51.5238,
                        "lng": -0.144,
                        "type": "station",
                        "note": "Regent's Park south entrance"
                    },
                    {
                        "name": "Baker Street",
                        "lat": 51.5226,
                        "lng": -0.1571,
                        "type": "interchange",
                        "note": "Jubilee, Metropolitan, Bakerloo lines"
                    },
                    {
                        "name": "Edgware Road (Circle)",
                        "lat": 51.5199,
                        "lng": -0.1679,
                        "type": "station"
                    },
                    {
                        "name": "Paddington",
                        "lat": 51.5154,
                        "lng": -0.1755,
                        "type": "interchange",
                        "note": "Elizabeth line, Heathrow Express, GWR"
                    },
                    {
                        "name": "Royal Oak",
                        "lat": 51.519,
                        "lng": -0.1883,
                        "type": "station"
                    },
                    {
                        "name": "Westbourne Park",
                        "lat": 51.521,
                        "lng": -0.2011,
                        "type": "station"
                    },
                    {
                        "name": "Ladbroke Grove",
                        "lat": 51.5172,
                        "lng": -0.2107,
                        "type": "station",
                        "note": "Portobello Road Market & Notting Hill"
                    },
                    {
                        "name": "Latimer Road",
                        "lat": 51.5133,
                        "lng": -0.2174,
                        "type": "station"
                    },
                    {
                        "name": "Wood Lane",
                        "lat": 51.5096,
                        "lng": -0.2244,
                        "type": "station",
                        "note": "Westfield London & BBC Television Centre"
                    },
                    {
                        "name": "Shepherd's Bush Market",
                        "lat": 51.5054,
                        "lng": -0.2265,
                        "type": "station",
                        "note": "Historic market & music venues"
                    },
                    {
                        "name": "Goldhawk Road",
                        "lat": 51.5018,
                        "lng": -0.2267,
                        "type": "station"
                    },
                    {
                        "name": "Hammersmith",
                        "lat": 51.4936,
                        "lng": -0.2251,
                        "type": "terminus",
                        "note": "Western terminus — Eventim Apollo & Thames riverside"
                    }
                ]
            },
            {
                "name": "Mildmay Line (Richmond / Clapham Jct ↔ Stratford)",
                "shortName": "Mildmay",
                "color": "#009DDC",
                "style": "solid",
                "stations": [
                    {
                        "name": "Richmond",
                        "lat": 51.4632,
                        "lng": -0.3013,
                        "type": "terminus",
                        "note": "Western terminus — Richmond Park, riverside & pubs"
                    },
                    {
                        "name": "Kew Gardens",
                        "lat": 51.4771,
                        "lng": -0.2847,
                        "type": "station",
                        "note": "Royal Botanic Gardens Kew"
                    },
                    {
                        "name": "Gunnersbury",
                        "lat": 51.4916,
                        "lng": -0.2753,
                        "type": "interchange",
                        "note": "District line interchange"
                    },
                    {
                        "name": "South Acton",
                        "lat": 51.4996,
                        "lng": -0.2709,
                        "type": "station"
                    },
                    {
                        "name": "Acton Central",
                        "lat": 51.5087,
                        "lng": -0.2634,
                        "type": "station"
                    },
                    {
                        "name": "Willesden Junction",
                        "lat": 51.5323,
                        "lng": -0.2442,
                        "type": "interchange",
                        "note": "Bakerloo & Lioness line interchange"
                    },
                    {
                        "name": "Kensal Rise",
                        "lat": 51.5346,
                        "lng": -0.2205,
                        "type": "station",
                        "note": "Chamberlayne Road dining & bars"
                    },
                    {
                        "name": "Brondesbury Park",
                        "lat": 51.5407,
                        "lng": -0.2101,
                        "type": "station"
                    },
                    {
                        "name": "Brondesbury",
                        "lat": 51.5451,
                        "lng": -0.2016,
                        "type": "station",
                        "note": "Kilburn High Road"
                    },
                    {
                        "name": "West Hampstead",
                        "lat": 51.5478,
                        "lng": -0.1912,
                        "type": "interchange",
                        "note": "Jubilee line & Thameslink interchange"
                    },
                    {
                        "name": "Finchley Road & Frognal",
                        "lat": 51.5502,
                        "lng": -0.1831,
                        "type": "station",
                        "note": "Near O2 Centre"
                    },
                    {
                        "name": "Hampstead Heath",
                        "lat": 51.5553,
                        "lng": -0.1656,
                        "type": "station",
                        "note": "Parliament Hill, swimming ponds & heath walks"
                    },
                    {
                        "name": "Gospel Oak",
                        "lat": 51.5553,
                        "lng": -0.1513,
                        "type": "interchange",
                        "note": "Suffragette line interchange"
                    },
                    {
                        "name": "Kentish Town West",
                        "lat": 51.5467,
                        "lng": -0.1458,
                        "type": "station"
                    },
                    {
                        "name": "Camden Road",
                        "lat": 51.5417,
                        "lng": -0.1389,
                        "type": "station",
                        "note": "Camden Market & Regent's Canal"
                    },
                    {
                        "name": "Caledonian Road & Barnsbury",
                        "lat": 51.543,
                        "lng": -0.1179,
                        "type": "station"
                    },
                    {
                        "name": "Highbury & Islington",
                        "lat": 51.5463,
                        "lng": -0.1033,
                        "type": "interchange",
                        "note": "Direct interchange with GN City Branch & Victoria line"
                    },
                    {
                        "name": "Canonbury",
                        "lat": 51.5486,
                        "lng": -0.0922,
                        "type": "station"
                    },
                    {
                        "name": "Dalston Kingsland",
                        "lat": 51.5482,
                        "lng": -0.0756,
                        "type": "station",
                        "note": "Ridley Road Market & Dalston nightlife"
                    },
                    {
                        "name": "Hackney Central",
                        "lat": 51.5467,
                        "lng": -0.0556,
                        "type": "station",
                        "note": "Mare Street & Hackney Empire"
                    },
                    {
                        "name": "Homerton",
                        "lat": 51.5468,
                        "lng": -0.0394,
                        "type": "station"
                    },
                    {
                        "name": "Hackney Wick",
                        "lat": 51.5434,
                        "lng": -0.0252,
                        "type": "station",
                        "note": "Canalside breweries & creative quarter"
                    },
                    {
                        "name": "Stratford",
                        "lat": 51.5416,
                        "lng": -0.0033,
                        "type": "terminus",
                        "note": "Eastern terminus — Elizabeth, Jubilee, Central, DLR + Westfield"
                    }
                ]
            },
            {
                "name": "Windrush Line (H&I ↔ Clapham Jct / Crystal Palace / West Croydon)",
                "shortName": "Windrush",
                "color": "#EE3124",
                "style": "solid",
                "branches": [
                    [
                        {
                            "name": "Highbury & Islington",
                            "lat": 51.5463,
                            "lng": -0.1033,
                            "type": "interchange",
                            "note": "Interchange with GN City Branch & Victoria line"
                        },
                        {
                            "name": "Canonbury",
                            "lat": 51.5486,
                            "lng": -0.0922,
                            "type": "station"
                        },
                        {
                            "name": "Dalston Junction",
                            "lat": 51.5462,
                            "lng": -0.0755,
                            "type": "interchange",
                            "note": "Dalston bars & music venues"
                        },
                        {
                            "name": "Haggerston",
                            "lat": 51.5387,
                            "lng": -0.0766,
                            "type": "station",
                            "note": "Regent's Canal & Broadway Market"
                        },
                        {
                            "name": "Hoxton",
                            "lat": 51.5316,
                            "lng": -0.0762,
                            "type": "station",
                            "note": "Hoxton Square & Museum of the Home"
                        },
                        {
                            "name": "Shoreditch High Street",
                            "lat": 51.5233,
                            "lng": -0.0756,
                            "type": "station",
                            "note": "Brick Lane, Boxpark, Spitalfields"
                        },
                        {
                            "name": "Whitechapel",
                            "lat": 51.5194,
                            "lng": -0.0612,
                            "type": "interchange",
                            "note": "Elizabeth line, District & H&C lines"
                        },
                        {
                            "name": "Shadwell",
                            "lat": 51.5117,
                            "lng": -0.0566,
                            "type": "interchange",
                            "note": "DLR interchange"
                        },
                        {
                            "name": "Wapping",
                            "lat": 51.5043,
                            "lng": -0.0559,
                            "type": "station",
                            "note": "Historic riverside pubs (Prospect of Whitby)"
                        },
                        {
                            "name": "Rotherhithe",
                            "lat": 51.5007,
                            "lng": -0.0521,
                            "type": "station",
                            "note": "Brunel Museum & Thames Tunnel"
                        },
                        {
                            "name": "Canada Water",
                            "lat": 51.4982,
                            "lng": -0.0498,
                            "type": "interchange",
                            "note": "Jubilee line interchange"
                        },
                        {
                            "name": "Surrey Quays",
                            "lat": 51.4933,
                            "lng": -0.0476,
                            "type": "interchange"
                        },
                        {
                            "name": "Queens Road Peckham",
                            "lat": 51.4735,
                            "lng": -0.0573,
                            "type": "station",
                            "note": "Peckham dining & rooftop bars"
                        },
                        {
                            "name": "Peckham Rye",
                            "lat": 51.4697,
                            "lng": -0.0694,
                            "type": "interchange",
                            "note": "Peckham Levels & Bussey Building"
                        },
                        {
                            "name": "Denmark Hill",
                            "lat": 51.4682,
                            "lng": -0.0895,
                            "type": "interchange",
                            "note": "Camberwell arts & Ruskin Park"
                        },
                        {
                            "name": "Clapham High Street",
                            "lat": 51.4646,
                            "lng": -0.1328,
                            "type": "station",
                            "note": "Clapham Old Town dining"
                        },
                        {
                            "name": "Wandsworth Road",
                            "lat": 51.4704,
                            "lng": -0.1389,
                            "type": "station"
                        },
                        {
                            "name": "Clapham Junction",
                            "lat": 51.4652,
                            "lng": -0.1708,
                            "type": "terminus",
                            "note": "Southern terminus 1 — South Western & Southern rail hub"
                        }
                    ],
                    [
                        {
                            "name": "Surrey Quays",
                            "lat": 51.4933,
                            "lng": -0.0476,
                            "type": "interchange"
                        },
                        {
                            "name": "New Cross Gate",
                            "lat": 51.4752,
                            "lng": -0.0402,
                            "type": "interchange",
                            "note": "Southern rail interchange"
                        },
                        {
                            "name": "Brockley",
                            "lat": 51.4645,
                            "lng": -0.0371,
                            "type": "station",
                            "note": "Brockley Market"
                        },
                        {
                            "name": "Honor Oak Park",
                            "lat": 51.4504,
                            "lng": -0.0451,
                            "type": "station",
                            "note": "One Tree Hill views"
                        },
                        {
                            "name": "Forest Hill",
                            "lat": 51.4393,
                            "lng": -0.0528,
                            "type": "station",
                            "note": "Horniman Museum & Gardens"
                        },
                        {
                            "name": "Sydenham",
                            "lat": 51.4275,
                            "lng": -0.0546,
                            "type": "interchange",
                            "note": "Branch to Crystal Palace vs West Croydon"
                        },
                        {
                            "name": "Crystal Palace",
                            "lat": 51.4182,
                            "lng": -0.0724,
                            "type": "terminus",
                            "note": "Southern terminus 2 — Victorian Dinosaurs & park"
                        }
                    ],
                    [
                        {
                            "name": "Sydenham",
                            "lat": 51.4275,
                            "lng": -0.0546,
                            "type": "interchange"
                        },
                        {
                            "name": "Penge West",
                            "lat": 51.4178,
                            "lng": -0.0617,
                            "type": "station"
                        },
                        {
                            "name": "Anerley",
                            "lat": 51.4116,
                            "lng": -0.0664,
                            "type": "station"
                        },
                        {
                            "name": "Norwood Junction",
                            "lat": 51.397,
                            "lng": -0.0747,
                            "type": "interchange",
                            "note": "Selhurst Park nearby"
                        },
                        {
                            "name": "West Croydon",
                            "lat": 51.3789,
                            "lng": -0.0984,
                            "type": "terminus",
                            "note": "Southern terminus 3 — Tramlink interchange"
                        }
                    ],
                    [
                        {
                            "name": "Surrey Quays",
                            "lat": 51.4933,
                            "lng": -0.0476,
                            "type": "interchange"
                        },
                        {
                            "name": "New Cross",
                            "lat": 51.477,
                            "lng": -0.0326,
                            "type": "terminus",
                            "note": "Southeastern rail interchange & Goldsmiths"
                        }
                    ]
                ],
                "stations": [
                    {
                        "name": "Highbury & Islington",
                        "lat": 51.5463,
                        "lng": -0.1033,
                        "type": "interchange",
                        "note": "Interchange with GN City Branch & Victoria line"
                    },
                    {
                        "name": "Canonbury",
                        "lat": 51.5486,
                        "lng": -0.0922,
                        "type": "station"
                    },
                    {
                        "name": "Dalston Junction",
                        "lat": 51.5462,
                        "lng": -0.0755,
                        "type": "interchange",
                        "note": "Dalston bars & music venues"
                    },
                    {
                        "name": "Haggerston",
                        "lat": 51.5387,
                        "lng": -0.0766,
                        "type": "station",
                        "note": "Regent's Canal & Broadway Market"
                    },
                    {
                        "name": "Hoxton",
                        "lat": 51.5316,
                        "lng": -0.0762,
                        "type": "station",
                        "note": "Hoxton Square & Museum of the Home"
                    },
                    {
                        "name": "Shoreditch High Street",
                        "lat": 51.5233,
                        "lng": -0.0756,
                        "type": "station",
                        "note": "Brick Lane, Boxpark, Spitalfields"
                    },
                    {
                        "name": "Whitechapel",
                        "lat": 51.5194,
                        "lng": -0.0612,
                        "type": "interchange",
                        "note": "Elizabeth line, District & H&C lines"
                    },
                    {
                        "name": "Shadwell",
                        "lat": 51.5117,
                        "lng": -0.0566,
                        "type": "interchange",
                        "note": "DLR interchange"
                    },
                    {
                        "name": "Wapping",
                        "lat": 51.5043,
                        "lng": -0.0559,
                        "type": "station",
                        "note": "Historic riverside pubs (Prospect of Whitby)"
                    },
                    {
                        "name": "Rotherhithe",
                        "lat": 51.5007,
                        "lng": -0.0521,
                        "type": "station",
                        "note": "Brunel Museum & Thames Tunnel"
                    },
                    {
                        "name": "Canada Water",
                        "lat": 51.4982,
                        "lng": -0.0498,
                        "type": "interchange",
                        "note": "Jubilee line interchange"
                    },
                    {
                        "name": "Surrey Quays",
                        "lat": 51.4933,
                        "lng": -0.0476,
                        "type": "interchange"
                    },
                    {
                        "name": "Queens Road Peckham",
                        "lat": 51.4735,
                        "lng": -0.0573,
                        "type": "station",
                        "note": "Peckham dining & rooftop bars"
                    },
                    {
                        "name": "Peckham Rye",
                        "lat": 51.4697,
                        "lng": -0.0694,
                        "type": "interchange",
                        "note": "Peckham Levels & Bussey Building"
                    },
                    {
                        "name": "Denmark Hill",
                        "lat": 51.4682,
                        "lng": -0.0895,
                        "type": "interchange",
                        "note": "Camberwell arts & Ruskin Park"
                    },
                    {
                        "name": "Clapham High Street",
                        "lat": 51.4646,
                        "lng": -0.1328,
                        "type": "station",
                        "note": "Clapham Old Town dining"
                    },
                    {
                        "name": "Wandsworth Road",
                        "lat": 51.4704,
                        "lng": -0.1389,
                        "type": "station"
                    },
                    {
                        "name": "Clapham Junction",
                        "lat": 51.4652,
                        "lng": -0.1708,
                        "type": "terminus",
                        "note": "Southern terminus 1 — South Western & Southern rail hub"
                    },
                    {
                        "name": "New Cross Gate",
                        "lat": 51.4752,
                        "lng": -0.0402,
                        "type": "interchange",
                        "note": "Southern rail interchange"
                    },
                    {
                        "name": "Brockley",
                        "lat": 51.4645,
                        "lng": -0.0371,
                        "type": "station",
                        "note": "Brockley Market"
                    },
                    {
                        "name": "Honor Oak Park",
                        "lat": 51.4504,
                        "lng": -0.0451,
                        "type": "station",
                        "note": "One Tree Hill views"
                    },
                    {
                        "name": "Forest Hill",
                        "lat": 51.4393,
                        "lng": -0.0528,
                        "type": "station",
                        "note": "Horniman Museum & Gardens"
                    },
                    {
                        "name": "Sydenham",
                        "lat": 51.4275,
                        "lng": -0.0546,
                        "type": "interchange"
                    },
                    {
                        "name": "Crystal Palace",
                        "lat": 51.4182,
                        "lng": -0.0724,
                        "type": "terminus",
                        "note": "Southern terminus 2 — Victorian Dinosaurs & park"
                    },
                    {
                        "name": "Penge West",
                        "lat": 51.4178,
                        "lng": -0.0617,
                        "type": "station"
                    },
                    {
                        "name": "Anerley",
                        "lat": 51.4116,
                        "lng": -0.0664,
                        "type": "station"
                    },
                    {
                        "name": "Norwood Junction",
                        "lat": 51.397,
                        "lng": -0.0747,
                        "type": "interchange",
                        "note": "Selhurst Park nearby"
                    },
                    {
                        "name": "West Croydon",
                        "lat": 51.3789,
                        "lng": -0.0984,
                        "type": "terminus",
                        "note": "Southern terminus 3 — Tramlink interchange"
                    },
                    {
                        "name": "New Cross",
                        "lat": 51.477,
                        "lng": -0.0326,
                        "type": "terminus",
                        "note": "Southeastern rail interchange & Goldsmiths"
                    }
                ]
            }
        ]
    },
    "items": [
        {
            "name": "Mercato Metropolitano",
            "url": "https://mercatometropolitano.com/locations/elephant-and-castle/",
            "category": "Markets & Food Halls",
            "location": "Elephant & Castle, London",
            "region": "South London",
            "lat": 51.4985,
            "lng": -0.0998,
            "description": "🍕 Massive artisan food hall in a repurposed paper factory with 40+ independent street food stalls, craft beer bars, and buzzing communal vibes.",
            "tags": [
                "Food Hall",
                "Street Food",
                "Craft Beer",
                "Elephant & Castle"
            ]
        },
        {
            "name": "Seven Dials Market",
            "url": "https://www.sevendialsmarket.com/",
            "category": "Markets & Food Halls",
            "location": "Covent Garden, Central London",
            "region": "Central London",
            "lat": 51.5137,
            "lng": -0.1264,
            "description": "🧀 Indoor food market inside a former banana warehouse in Covent Garden, famous for the world's first cheese conveyor-belt bar and killer truffle burgers.",
            "tags": [
                "Street Food",
                "Cheese Bar",
                "Covent Garden",
                "Food Hall"
            ]
        },
        {
            "name": "Borough Market",
            "url": "https://boroughmarket.org.uk/",
            "category": "Markets & Food Halls",
            "location": "London Bridge",
            "region": "Central London",
            "lat": 51.5055,
            "lng": -0.091,
            "description": "🥖 London's historic food mecca beneath Victorian railway arches — warm sourdough, artisanal cheeses, gourmet scotch eggs, and fresh oysters.",
            "tags": [
                "Food Market",
                "Artisan",
                "London Bridge",
                "Street Food"
            ]
        },
        {
            "name": "Columbia Road Flower Market",
            "url": "https://www.columbiaroad.info/",
            "category": "Markets & Food Halls",
            "location": "Bethnal Green / Shoreditch",
            "region": "East London",
            "lat": 51.5292,
            "lng": -0.0718,
            "description": "🌸 Sunday morning East London ritual: fragrant floral blooms, street buskers, indie coffee shops, and independent vintage boutiques.",
            "tags": [
                "Market",
                "Flowers",
                "Sunday",
                "East London",
                "Coffee",
                "Walk"
            ]
        },
        {
            "name": "Maltby Street Market",
            "url": "https://www.maltbystreetmarket.co.uk/",
            "category": "Markets & Food Halls",
            "location": "Bermondsey, London",
            "region": "South London",
            "lat": 51.5002,
            "lng": -0.0763,
            "description": "🥪 Cozy ropewalk food market tucked under railway arches in Bermondsey — gourmet toasties, fresh cannoli, and duck confit wraps.",
            "tags": [
                "Street Food",
                "Bermondsey",
                "Weekend Market",
                "Hidden Gem"
            ]
        },
        {
            "name": "Market Halls Oxford Street",
            "url": "https://markethalls.co.uk/venue/oxford-street",
            "category": "Markets & Food Halls",
            "location": "Oxford Street, Central London",
            "region": "Central London",
            "lat": 51.5152,
            "lng": -0.1458,
            "description": "🍜 Multi-storey street food haven just off Oxford Street with rooftop terrace cocktails, crispy tacos, and spicy Malaysian roti.",
            "tags": [
                "Food Court",
                "Oxford Street",
                "Central London",
                "Drinks"
            ]
        },
        {
            "name": "Market Halls Victoria",
            "url": "https://markethalls.co.uk/venue/victoria",
            "category": "Markets & Food Halls",
            "location": "Victoria, London",
            "region": "Central London",
            "lat": 51.4965,
            "lng": -0.1444,
            "description": "🍔 8 diverse kitchens under a Victorian roof with a lush rooftop bar, craft cocktails, and dim sum right next to Victoria station.",
            "tags": [
                "Food Hall",
                "Victoria",
                "Rooftop Bar",
                "Street Food"
            ]
        },
        {
            "name": "Victoria Park Market",
            "url": "https://www.victoriaparkmarket.com/",
            "category": "Markets & Food Halls",
            "location": "Victoria Park, East London",
            "region": "East London",
            "lat": 51.5367,
            "lng": -0.0401,
            "description": "🥐 Sunday farmers' market in Victoria Park with organic produce, street food stalls, artisanal pastries, and lakeside picnic spots.",
            "tags": [
                "Sunday Market",
                "Food Market",
                "Victoria Park",
                "East London"
            ]
        },
        {
            "name": "Brockley Market",
            "url": "https://www.instagram.com/brockleymarket/",
            "category": "Markets & Food Halls",
            "location": "Brockley, South East London",
            "region": "South London",
            "lat": 51.4695,
            "lng": -0.0345,
            "description": "☕ Award-winning South London Saturday market with farm-to-fork produce, sourdough bakers, specialty roasted coffee, and street food vans.",
            "tags": [
                "Farmers Market",
                "Saturday",
                "Brockley",
                "Speciality Food"
            ]
        },
        {
            "name": "Udderly Fresh Raw Milk",
            "url": "https://www.udderlyfreshrawmilk.net/",
            "category": "Farm Shops & Country",
            "location": "Hertfordshire Countryside",
            "region": "Hertfordshire (Local)",
            "lat": 51.782,
            "lng": -0.315,
            "description": "🥛 Family-run Hertfordshire dairy farm with fresh raw milk vending, local farm goodies, honey, and open rolling country views.",
            "tags": [
                "Farm Vending",
                "Raw Milk",
                "Hertfordshire",
                "Local"
            ]
        },
        {
            "name": "Stepney City Farm",
            "url": "https://stepneycityfarm.org/",
            "category": "Zoos & Farms",
            "location": "Stepney, East London",
            "region": "East London",
            "lat": 51.5173,
            "lng": -0.0487,
            "description": "🐑 Charming working city farm with rescue sheep, goats, donkeys, a bustling weekend farmers' market, and cozy rural farm cafe.",
            "tags": [
                "City Farm",
                "Animals",
                "East London",
                "Cafe"
            ]
        },
        {
            "name": "Orcs Nest",
            "url": "https://www.orcsnest.com/",
            "category": "Board Games",
            "location": "Earlham St, Covent Garden",
            "region": "Central London",
            "lat": 51.5133,
            "lng": -0.1284,
            "description": "🎲 Legendary Covent Garden tabletop gaming shop packed floor-to-ceiling with board games, RPGs, and niche miniature dice sets.",
            "tags": [
                "D&D",
                "Board Games",
                "Tabletop",
                "Covent Garden",
                "Nerd Culture"
            ]
        },
        {
            "name": "IKEA Milton Keynes",
            "url": "https://www.ikea.com/gb/en/stores/milton-keynes/",
            "category": "Quirky & Shops",
            "location": "Milton Keynes",
            "region": "Day Trips & Beyond",
            "lat": 52.0083,
            "lng": -0.7303,
            "description": "🪛 The ultimate couple's day-out: Swedish meatballs, soft-serve ice cream, room mockups, testing sofas, and flatpack banter.",
            "tags": [
                "DIY Date",
                "Flatpack Building",
                "Swedish Deli",
                "Meatballs",
                "Showroom Date"
            ]
        },
        {
            "name": "Lunar Coven Cove at Everchange Emporium",
            "url": "https://www.everchangeemporium.co.uk/",
            "category": "Quirky & Shops",
            "location": "London / Online",
            "region": "East London",
            "lat": 51.52,
            "lng": -0.075,
            "description": "✨ Enchanting esoteric shop filled with crystals, tarot cards, incense, celestial jewelry, and mystical curiosity finds.",
            "tags": [
                "Metaphysical",
                "Crystals",
                "Tarot",
                "Quirky"
            ]
        },
        {
            "name": "Twinings — Tea Masterclass & Tasting Experience",
            "url": "https://twinings.co.uk/pages/tea-masterclass-tasting-experience",
            "category": "Quirky & Shops",
            "location": "216 The Strand, Central London",
            "region": "Central London",
            "lat": 51.5134,
            "lng": -0.1134,
            "description": "🫖 Historic Strand flagship tasting session exploring rare artisanal tea blends, brewing science, and pairing notes.",
            "tags": [
                "Tea Tasting",
                "Masterclass",
                "The Strand",
                "Sensory Experience",
                "Historic"
            ]
        },
        {
            "name": "NQ64 Arcade Bar",
            "url": "https://nq64.co.uk/shoreditch/",
            "category": "Video Games & Arcades",
            "location": "Shoreditch, London",
            "region": "East London",
            "lat": 51.5244,
            "lng": -0.0772,
            "description": "👾 Neon-drenched subterranean arcade bar serving retro console gaming, classic 80s/90s cabinets, and themed cocktails.",
            "tags": [
                "Retro Arcade",
                "Video Games",
                "Cocktails",
                "Shoreditch"
            ]
        },
        {
            "name": "Four Quarters East",
            "url": "https://fourquarters.bar/",
            "category": "Video Games & Arcades",
            "location": "Hackney Wick, London",
            "region": "East London",
            "lat": 51.5422,
            "lng": -0.0215,
            "description": "🕹️ Canalside Hackney Wick arcade bar with authentic retro arcade cabinets, vintage pinball machines, and local craft brews.",
            "tags": [
                "Retro Arcade",
                "Craft Beer",
                "Pizza",
                "Hackney Wick"
            ]
        },
        {
            "name": "Lucia's",
            "url": "",
            "category": "Dinner & Dining",
            "location": "Hackney Wick, London",
            "region": "East London",
            "lat": 51.5431415,
            "lng": -0.0237189,
            "description": "🌮 Tacos and mezcal in the heart of Hackney Wick.",
            "tags": [
                "Tacos",
                "Mezcal",
                "Hackney Wick",
                "Dinner"
            ]
        },
        {
            "name": "Electric Shuffle",
            "url": "https://electricshuffle.com/",
            "category": "Shuffleboard",
            "location": "Canary Wharf & London Bridge",
            "region": "East London",
            "lat": 51.5034,
            "lng": -0.0201,
            "description": "🥌 Custom digital shuffleboard tables with interactive mini-games, bespoke cocktails, sharing plates, and electric atmosphere.",
            "tags": [
                "Shuffleboard",
                "Interactive",
                "Cocktails",
                "Canary Wharf",
                "London Bridge"
            ]
        },
        {
            "name": "Lane7 (Victoria & Camden)",
            "url": "https://lane7.co.uk/",
            "category": "Bowling & Lanes",
            "location": "Victoria & Camden, London",
            "region": "Central London",
            "lat": 51.4975,
            "lng": -0.142,
            "description": "🎳 Boutique bowling alley meets arcade playground with beer pong, augmented reality darts, retro games, and upbeat tunes.",
            "tags": [
                "Bowling",
                "Arcade",
                "Beer Pong",
                "Victoria",
                "Camden"
            ]
        },
        {
            "name": "Bloomsbury Lanes",
            "url": "https://bloomsburybowling.com/",
            "category": "Bowling & Lanes",
            "location": "Bloomsbury, Central London",
            "region": "Central London",
            "lat": 51.5231,
            "lng": -0.1287,
            "description": "🎳 Retro 1950s American bowling alley with private karaoke booths, diner milkshakes, wood-fired pizzas, and vintage vibes.",
            "tags": [
                "Bowling",
                "Karaoke",
                "Diner",
                "Bloomsbury"
            ]
        },
        {
            "name": "The Pixel Bunker & Sci-Fi Museum",
            "url": "https://www.thepixelbunker.com/",
            "category": "Museums & Culture",
            "location": "Milton Keynes",
            "region": "Day Trips & Beyond",
            "lat": 52.0435,
            "lng": -0.7483,
            "description": "🏛️ Retro gaming & sci-fi heritage museum packed with over 100 original arcade cabinets set to free-play mode alongside iconic movie props.",
            "tags": [
                "Sci-Fi Museum",
                "Pixel Bunker",
                "Retro Arcade Museum",
                "Classic Gaming",
                "Exhibition"
            ]
        },
        {
            "name": "Library Pot Board Game Cafe",
            "url": "https://librarypot.uk/",
            "category": "Board Games",
            "location": "Richmond, London",
            "region": "South London",
            "lat": 51.4612,
            "lng": -0.3015,
            "description": "🎲 Whimsical cafe with over 600 board games, ball pit, noodle bar, and endless games for two.",
            "tags": [
                "Board Games",
                "Cafe",
                "Richmond"
            ]
        },
        {
            "name": "Junkyard Golf Club",
            "url": "https://www.junkyardgolfclub.co.uk/london/",
            "category": "Mini Golf & Topgolf",
            "location": "Shoreditch, London",
            "region": "East London",
            "lat": 51.5218,
            "lng": -0.0715,
            "description": "⛳ Wild, neon-lit crazy golf with bizarre obstacle courses made from scrap cars, UV slides, circus tents, and boozy sweet cocktails.",
            "tags": [
                "Crazy Golf",
                "Mini Golf",
                "Cocktails",
                "Shoreditch"
            ]
        },
        {
            "name": "Ballie Ballerson",
            "url": "https://www.ballieballerson.com/london/",
            "category": "Video Games & Arcades",
            "location": "Shoreditch, London",
            "region": "East London",
            "lat": 51.5262,
            "lng": -0.0784,
            "description": "🟡 Giant glowing adult ball pit bar with 1 million balls, retro arcade cocktails, bottomless pizza, and nostalgic soundtrack.",
            "tags": [
                "Ball Pit",
                "Cocktails",
                "Party",
                "Shoreditch"
            ]
        },
        {
            "name": "Cernamic Dalston",
            "url": "https://www.cernamic.com/classes/dalston",
            "category": "Pottery & Ceramics",
            "location": "Dalston, East London",
            "region": "East London",
            "lat": 51.5471,
            "lng": -0.0754,
            "description": "🏺 Relaxed pottery classes and pottery wheel-throwing taster sessions in an airy East London ceramicist studio.",
            "tags": [
                "Pottery",
                "Creative",
                "Hands-on",
                "Dalston"
            ]
        },
        {
            "name": "SkandiHus Pottery Studio",
            "url": "https://www.skandihus.co.uk/",
            "category": "Pottery & Ceramics",
            "location": "Hackney / Walthamstow",
            "region": "East London",
            "lat": 51.554,
            "lng": -0.055,
            "description": "🤍 Scandinavian-inspired ceramic studio offering beginner pottery wheel workshops in minimalist, welcoming spaces.",
            "tags": [
                "Pottery",
                "Ceramics",
                "Creative",
                "Hackney"
            ]
        },
        {
            "name": "London Terrariums",
            "url": "https://londonterrariums.com/",
            "category": "Art & Workshops",
            "location": "New Cross & Bermondsey",
            "region": "South London",
            "lat": 51.4754,
            "lng": -0.0381,
            "description": "🌿 Hands-on plant workshop crafting your own self-sustaining tropical glass biome terrarium to take home.",
            "tags": [
                "Terrarium",
                "Plants",
                "Workshop",
                "Hands-on"
            ]
        },
        {
            "name": "Botanical Boys",
            "url": "https://www.botanicalboys.com/",
            "category": "Art & Workshops",
            "location": "Coal Drops Yard, King's Cross",
            "region": "Central London",
            "lat": 51.5358,
            "lng": -0.1252,
            "description": "🌱 Coal Drops Yard masterclass creating miniature desert and rainforest ecosystems in sealed glass vessels.",
            "tags": [
                "Terrarium",
                "Plants",
                "King's Cross",
                "Creative"
            ]
        },
        {
            "name": "Columbia Road Clay",
            "url": "https://columbiaroadclay.co.uk/",
            "category": "Pottery & Ceramics",
            "location": "Bethnal Green, East London",
            "region": "East London",
            "lat": 51.5288,
            "lng": -0.0712,
            "description": "🏺 Clay sculpting and wheel workshops right on historic Columbia Road — ideal for creative date afternoons.",
            "tags": [
                "Pottery",
                "Clay",
                "East London"
            ]
        },
        {
            "name": "Colour and Clay Studio",
            "url": "https://colourandclay.co.uk/",
            "category": "Pottery & Ceramics",
            "location": "Studio 9, ACAVA, 54 Blechynden St, North Kensington, W10 6RJ",
            "region": "West London",
            "lat": 51.5165,
            "lng": -0.2178,
            "description": "🎨 Friendly pottery studio in North Kensington (Studio 9, ACAVA, 54 Blechynden St, W10 6RJ) hosting beginner wheel throwing, hand-building, and evening glaze sessions.",
            "tags": [
                "Pottery Wheel",
                "Ceramics",
                "ACAVA Studios",
                "Latimer Road",
                "North Kensington"
            ]
        },
        {
            "name": "Maison S.Sommet Studio",
            "url": "https://www.maisonsommet.com/",
            "category": "Pottery & Ceramics",
            "location": "London",
            "region": "Central London",
            "lat": 51.52,
            "lng": -0.11,
            "description": "✨ High-craft Parisian-style ceramic and craft workshop studio in the heart of London.",
            "tags": [
                "Pottery",
                "Ceramics",
                "Studio"
            ]
        },
        {
            "name": "The Slightly Curious Studio",
            "url": "https://www.theslightlycurious.studio/",
            "category": "Art & Workshops",
            "location": "London",
            "region": "East London",
            "lat": 51.532,
            "lng": -0.072,
            "description": "🌿 Botanical art and printmaking workshops designed to spark creativity and playful design.",
            "tags": [
                "Pottery",
                "Creative",
                "Ceramics"
            ]
        },
        {
            "name": "The Murdér Express Part Deux",
            "url": "https://funicularproductions.com/",
            "category": "Dinner & Dining",
            "location": "Pedley Street Station, Bethnal Green",
            "region": "East London",
            "lat": 51.5222,
            "lng": -0.0634,
            "description": "🚂 1920s luxury dining experience aboard a vintage train carriage with comedic live murder mystery and 4-course menu.",
            "tags": [
                "Immersive Dining",
                "Murder Mystery",
                "Theatre",
                "Bethnal Green"
            ]
        },
        {
            "name": "Gingerline: The Grand Expedition",
            "url": "https://www.gingerline.co.uk/",
            "category": "Dinner & Dining",
            "location": "London",
            "region": "East London",
            "lat": 51.53,
            "lng": -0.07,
            "description": "🍽️ Secret immersive dining journey combining live performance, whimsical projection mapping, and multi-course dining.",
            "tags": [
                "Immersive Dining",
                "Storytelling",
                "Gourmet",
                "London"
            ]
        },
        {
            "name": "Phantom Peak (Canada Water)",
            "url": "https://phantompeak.com/",
            "category": "Dinner & Dining",
            "location": "Canada Water (Windrush & Jubilee lines)",
            "region": "Central London",
            "lat": 51.4982,
            "lng": -0.0498,
            "description": "🎩 Europe's premier open-world immersive steampunk experience — explore a living fictional town with waterways, mystery trails, carnival games, and cocktails.",
            "tags": [
                "Phantom Peak",
                "Immersive Experience",
                "Steampunk",
                "Canada Water",
                "Windrush Line"
            ]
        },
        {
            "name": "Dans le Noir ? London",
            "url": "https://london.danslenoir.com/",
            "category": "Dinner & Dining",
            "location": "Clerkenwell, London",
            "region": "Central London",
            "lat": 51.5226,
            "lng": -0.1039,
            "description": "🕶️ Unique sensory dining in pitch darkness guided by visually impaired staff — taste, scent, and conversation elevated.",
            "tags": [
                "Sensory Dining",
                "Pitch Black",
                "Clerkenwell",
                "Unique"
            ]
        },
        {
            "name": "Bob Bob Ricard (Soho)",
            "url": "https://www.bobbobricard.com/",
            "category": "Dinner & Dining",
            "location": "1 Upper James St, Soho, W1F 9DF (near Piccadilly Circus)",
            "region": "Central London",
            "lat": 51.5118,
            "lng": -0.1378,
            "description": "🍾 Iconic glamourous booth-dining restaurant famous for its vintage luxury Orient Express decor and the legendary 'Press for Champagne' button at every table.",
            "tags": [
                "Bob Bob Ricard",
                "Press for Champagne",
                "Soho",
                "Romantic Dinner",
                "Piccadilly Line"
            ]
        },
        {
            "name": "Lightroom",
            "url": "https://lightroom.uk/",
            "category": "Museums & Culture",
            "location": "King's Cross, London",
            "region": "Central London",
            "lat": 51.5355,
            "lng": -0.1265,
            "description": "📽️ Vast 4-storey immersive projection gallery hosting David Hockney and Apollo moon landing visual journeys.",
            "tags": [
                "Immersive Art",
                "Digital Exhibition",
                "King's Cross"
            ]
        },
        {
            "name": "Ronnie Scott's Jazz Club",
            "url": "https://www.ronniescotts.co.uk/",
            "category": "Live Music & Jazz",
            "location": "Soho, Central London",
            "region": "Central London",
            "lat": 51.5135,
            "lng": -0.1315,
            "description": "🎷 Legendary Soho jazz sanctuary with world-class live musicians, intimate candlelit tables, and timeless cocktails.",
            "tags": [
                "Live Jazz",
                "Music",
                "Soho",
                "Cocktails",
                "Historic"
            ]
        },
        {
            "name": "The Faltering Fullback",
            "url": "https://falteringfullback.com/",
            "category": "Bars & Speakeasies",
            "location": "Finsbury Park, North London",
            "region": "North London",
            "lat": 51.5663,
            "lng": -0.1118,
            "description": "🍀 Enchanting Finsbury Park pub featuring a multi-tiered fairytale treehouse beer garden and authentic Thai food.",
            "tags": [
                "Beer Garden",
                "Pub",
                "Thai Food",
                "Finsbury Park"
            ]
        },
        {
            "name": "The Jamie Oliver Cookery School",
            "url": "https://www.jamieolivercookeryschool.com/",
            "category": "Cooking Classes",
            "location": "John Lewis, Oxford Street / Holloway",
            "region": "Central London",
            "lat": 51.5152,
            "lng": -0.1448,
            "description": "👨‍🍳 Hands-on couples masterclass cooking fresh hand-rolled pasta, South East Asian street food, or Spanish tapas alongside expert chefs with wine pairings.",
            "tags": [
                "Cookery School",
                "Cooking Masterclass",
                "Handmade Pasta",
                "Oxford Street",
                "Victoria Line"
            ]
        },
        {
            "name": "Horizon 22",
            "url": "https://horizon22.co.uk/",
            "category": "Rooftops & Views",
            "location": "Bishopsgate, City of London",
            "region": "Central London",
            "lat": 51.5146,
            "lng": -0.0828,
            "description": "🏙️ London's highest free viewing platform (Level 58 of 22 Bishopsgate) offering breathtaking 300-metre panoramas.",
            "tags": [
                "Skyline Views",
                "Free",
                "Bishopsgate",
                "City Views"
            ]
        },
        {
            "name": "Sky Garden",
            "url": "https://skygarden.london/",
            "category": "Rooftops & Views",
            "location": "Fenchurch Street, City of London",
            "region": "Central London",
            "lat": 51.5113,
            "lng": -0.0836,
            "description": "🌴 Lush sub-tropical gardens, open-air terrace, and 360° London skyline views atop the Walkie Talkie skyscraper.",
            "tags": [
                "Sky Garden",
                "Views",
                "Cocktails",
                "City of London"
            ]
        },
        {
            "name": "Rooftop Cinema Club (Peckham & Stratford)",
            "url": "https://rooftopcinemaclub.com/london/",
            "category": "Rooftops & Views",
            "location": "Peckham (Bussey Building) & Stratford",
            "region": "South London",
            "lat": 51.4697,
            "lng": -0.0682,
            "description": "🎬 Open-air cinema with deckchairs, personal headphones, panoramic sunset city views, popcorn, and craft cocktails.",
            "tags": [
                "Rooftop Cinema",
                "Film",
                "Cocktails",
                "Peckham",
                "Stratford"
            ]
        },
        {
            "name": "Circe's Rooftop",
            "url": "https://www.circesrooftop.co.uk/",
            "category": "Bars & Speakeasies",
            "location": "Waterloo, Central London",
            "region": "Central London",
            "lat": 51.5033,
            "lng": -0.1132,
            "description": "🍹 Mediterranean-inspired Waterloo rooftop lounge with cocktail bar, panoramic skyline vistas, and sunset DJ sets.",
            "tags": [
                "Rooftop Bar",
                "Cocktails",
                "Waterloo",
                "Views"
            ]
        },
        {
            "name": "Archery Fit",
            "url": "https://archeryfit.com/",
            "category": "Archery",
            "location": "Greenwich, London",
            "region": "South London",
            "lat": 51.4795,
            "lng": -0.0165,
            "description": "🏹 Modern indoor archery range near Greenwich with beginner-friendly instruction and friendly target-scoring matches.",
            "tags": [
                "Archery",
                "Active",
                "Greenwich",
                "Indoor Sports"
            ]
        },
        {
            "name": "Axeperience Axe Throwing",
            "url": "https://axeperience.co.uk/",
            "category": "Axe Throwing",
            "location": "Tower Hill / Aldgate, London",
            "region": "Central London",
            "lat": 51.5126,
            "lng": -0.0754,
            "description": "🪓 Adrenaline-packed urban axe throwing in Whitechapel with dedicated instructor coaching and target mini-games.",
            "tags": [
                "Axe Throwing",
                "Active",
                "Tower Hill",
                "Fun"
            ]
        },
        {
            "name": "Revolution Karting",
            "url": "https://www.revolutionkarting.com/",
            "category": "Go-Karting",
            "location": "Mile End, East London",
            "region": "East London",
            "lat": 51.5204,
            "lng": -0.0382,
            "description": "🏎️ Mile End electric outdoor karting track reaching up to 45mph with floodlights for evening adrenaline races.",
            "tags": [
                "Go-Karting",
                "Racing",
                "Mile End",
                "Outdoors"
            ]
        },
        {
            "name": "The Regent's Park & Rose Gardens",
            "url": "https://www.royalparks.org.uk/parks/the-regents-park",
            "category": "Parks & Scenic Walks",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5313,
            "lng": -0.157,
            "description": "🌹 12,000 blooming roses in Queen Mary's Gardens, open-air theatre, pedal boats on the boating lake, and weeping willows.",
            "tags": [
                "Park",
                "Gardens",
                "Boating Lake",
                "Walk",
                "Central London"
            ]
        },
        {
            "name": "Greenwich Park & Royal Observatory",
            "url": "https://www.royalparks.org.uk/parks/greenwich-park",
            "category": "Parks & Scenic Walks",
            "location": "Greenwich, South East London",
            "region": "South London",
            "lat": 51.4769,
            "lng": -0.0005,
            "description": "⏱️ Panoramic hilltop views of Canary Wharf and the Thames, the Prime Meridian line, ancient chestnut trees, and flower gardens.",
            "tags": [
                "Park",
                "Skyline Views",
                "Greenwich",
                "Walk",
                "Observatory"
            ]
        },
        {
            "name": "Victoria Park & Pavilion Cafe",
            "url": "https://www.towerhamlets.gov.uk/lgnl/leisure_and_culture/parks_and_open_spaces/victoria_park/victoria_park.aspx",
            "category": "Parks & Scenic Walks",
            "location": "East London",
            "region": "East London",
            "lat": 51.5367,
            "lng": -0.0382,
            "description": "🛶 'The People's Park' with a tranquil boating lake, Chinese pagoda, weekend food stalls, and the famous lakeside Pavilion Cafe.",
            "tags": [
                "Park",
                "Boating Lake",
                "East London",
                "Walk"
            ]
        },
        {
            "name": "The Postal Museum & Mail Rail",
            "url": "https://www.postalmuseum.org/",
            "category": "Museums & Culture",
            "location": "Clerkenwell, London",
            "region": "Central London",
            "lat": 51.5247,
            "lng": -0.1147,
            "description": "📮 Ride a miniature subterranean train through the secret underground railway tunnels that once moved London's post.",
            "tags": [
                "Museum",
                "Underground Train",
                "Clerkenwell",
                "Hidden Gem"
            ]
        },
        {
            "name": "Charles Dickens Museum",
            "url": "https://dickensmuseum.com/",
            "category": "Museums & Culture",
            "location": "Bloomsbury, London",
            "region": "Central London",
            "lat": 51.5238,
            "lng": -0.1167,
            "description": "📖 The Victorian townhouse where Dickens wrote Oliver Twist, preserved with original furniture, candlelight, and hidden garden cafe.",
            "tags": [
                "Museum",
                "Literature",
                "Bloomsbury",
                "Historic House"
            ]
        },
        {
            "name": "The Crypt Gallery",
            "url": "https://cryptgallery.org/",
            "category": "Museums & Culture",
            "location": "St Pancras Church, Euston",
            "region": "Central London",
            "lat": 51.5273,
            "lng": -0.1298,
            "description": "🕯️ Atmospheric 1822 church crypt beneath St Pancras displaying contemporary art exhibitions by flickering candlelight.",
            "tags": [
                "Art Gallery",
                "Underground Crypt",
                "Euston",
                "Atmospheric"
            ]
        },
        {
            "name": "Wellcome Collection",
            "url": "https://wellcomecollection.org/",
            "category": "Museums & Culture",
            "location": "Euston, London",
            "region": "Central London",
            "lat": 51.5258,
            "lng": -0.1339,
            "description": "🧬 Thought-provoking museum & library exploring medicine, science, and the human condition with cozy reading rooms.",
            "tags": [
                "Museum",
                "Science & Art",
                "Euston",
                "Free"
            ]
        },
        {
            "name": "Tate Modern & Tate Britain",
            "url": "https://www.tate.org.uk/",
            "category": "Museums & Culture",
            "location": "Bankside & Millbank, London",
            "region": "Central London",
            "lat": 51.5076,
            "lng": -0.0994,
            "description": "🎨 World-leading modern art inside a former power station on the South Bank, linked by riverboat to historic Tate Britain.",
            "tags": [
                "Art Gallery",
                "Tate",
                "Bankside",
                "Millbank"
            ]
        },
        {
            "name": "London Transport Museum",
            "url": "https://www.ltmuseum.co.uk/",
            "category": "Museums & Culture",
            "location": "Covent Garden, London",
            "region": "Central London",
            "lat": 51.512,
            "lng": -0.1215,
            "description": "🚌 Covent Garden heritage museum packed with vintage red Routemaster buses, classic Tube trains, and iconic poster art.",
            "tags": [
                "Museum",
                "Transport",
                "Covent Garden",
                "Interactive"
            ]
        },
        {
            "name": "Bletchley Park",
            "url": "https://bletchleypark.org.uk/",
            "category": "Museums & Culture",
            "location": "Bletchley, Milton Keynes",
            "region": "Day Trips & Beyond",
            "lat": 51.9976,
            "lng": -0.7414,
            "description": "🔐 The WW2 codebreaking HQ where Alan Turing cracked Enigma — hands-on National Museum of Computing and lakeside grounds.",
            "tags": [
                "Codebreaking",
                "WW2 History",
                "Computing Museum",
                "Alan Turing",
                "Day Trip"
            ]
        },
        {
            "name": "Green Park",
            "url": "https://www.royalparks.org.uk/parks/green-park",
            "category": "Parks & Scenic Walks",
            "location": "Piccadilly / Mayfair, Central London",
            "region": "Central London",
            "lat": 51.5049,
            "lng": -0.1419,
            "description": "🌳 Royal Park of mature canopy trees and open green lawns connecting Buckingham Palace to Piccadilly.",
            "tags": [
                "Park",
                "Royal Park",
                "Walk",
                "Piccadilly",
                "Central London"
            ]
        },
        {
            "name": "Hyde Park & Serpentine",
            "url": "https://www.royalparks.org.uk/parks/hyde-park",
            "category": "Parks & Scenic Walks",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5073,
            "lng": -0.1657,
            "description": "🦆 London's grandest Royal Park featuring pedal boats on the Serpentine lake, Diana Memorial Fountain, and wide tree-lined avenues.",
            "tags": [
                "Park",
                "Boating Lake",
                "Walk",
                "Serpentine",
                "Central London"
            ]
        },
        {
            "name": "St James's Park",
            "url": "https://www.royalparks.org.uk/parks/st-jamess-park",
            "category": "Parks & Scenic Walks",
            "location": "Westminster, Central London",
            "region": "Central London",
            "lat": 51.5025,
            "lng": -0.134,
            "description": "🦢 London's oldest Royal Park with iconic views of Buckingham Palace across the lake, resident pelicans, and spring flower beds.",
            "tags": [
                "Park",
                "Royal Park",
                "Buckingham Palace",
                "Walk",
                "Westminster"
            ]
        },
        {
            "name": "Hampstead Heath",
            "url": "https://www.cityoflondon.gov.uk/things-to-do/green-spaces/hampstead-heath",
            "category": "Parks & Scenic Walks",
            "location": "Hampstead, North London",
            "region": "North London",
            "lat": 51.5609,
            "lng": -0.1631,
            "description": "🌲 Wild 790-acre ancient heath with panoramic London skyline vistas from Parliament Hill, bathing ponds, and forest trails.",
            "tags": [
                "Park",
                "Heath",
                "Swimming Ponds",
                "Skyline Views",
                "North London"
            ]
        },
        {
            "name": "Primrose Hill",
            "url": "https://www.royalparks.org.uk/parks/the-regents-park/things-to-see-and-do/primrose-hill",
            "category": "Parks & Scenic Walks",
            "location": "Primrose Hill, North London",
            "region": "North London",
            "lat": 51.5392,
            "lng": -0.1602,
            "description": "🌅 Romantic grassy hilltop with uninterrupted 360° panoramas of the London skyline at sunset.",
            "tags": [
                "Viewpoint",
                "Sunset",
                "Skyline Views",
                "Walk",
                "North London"
            ]
        },
        {
            "name": "Battersea Park",
            "url": "https://www.wandsworth.gov.uk/batterseapark",
            "category": "Parks & Scenic Walks",
            "location": "Battersea, South London",
            "region": "South London",
            "lat": 51.479,
            "lng": -0.1564,
            "description": "⛲ Thames riverside park featuring a grand boating lake, Peace Pagoda, sub-tropical gardens, and Go Ape treetop course.",
            "tags": [
                "Park",
                "Riverside",
                "Boating Lake",
                "Go Ape",
                "South London"
            ]
        },
        {
            "name": "Holland Park & Kyoto Garden",
            "url": "https://www.rbkc.gov.uk/parks-leisure-and-culture/parks/holland-park",
            "category": "Parks & Scenic Walks",
            "location": "Kensington, West London",
            "region": "Central London",
            "lat": 51.502,
            "lng": -0.203,
            "description": "🌸 A tranquil Japanese oasis tucked inside Kensington with a tiered waterfall, koi carp, stone lanterns, wandering peacocks, and peaceful woodland trails.",
            "tags": [
                "Kyoto Garden",
                "Japanese Garden",
                "Peacocks",
                "Romantic Walk",
                "Kensington"
            ]
        },
        {
            "name": "Richmond Park & Isabella Plantation",
            "url": "https://www.royalparks.org.uk/parks/richmond-park",
            "category": "Parks & Scenic Walks",
            "location": "Richmond, South West London",
            "region": "Day Trips & Beyond",
            "lat": 51.4428,
            "lng": -0.2749,
            "description": "🦌 London's grandest National Nature Reserve with 600+ free-roaming deer, panoramic vistas of St Paul's from King Henry's Mound, and the magical Isabella Plantation woodland.",
            "tags": [
                "Deer Park",
                "Isabella Plantation",
                "Nature Reserve",
                "Panoramic Views",
                "Richmond"
            ]
        },
        {
            "name": "Kensington Gardens & Italian Gardens",
            "url": "https://www.royalparks.org.uk/parks/kensington-gardens",
            "category": "Parks & Scenic Walks",
            "location": "Kensington / Bayswater, Central London",
            "region": "Central London",
            "lat": 51.507,
            "lng": -0.178,
            "description": "🏛️ Royal grounds featuring the 150-year-old Italian water gardens with ornate carved urns, the famous Peter Pan statue, Round Pond, and Serpentine gallery strolls.",
            "tags": [
                "Italian Gardens",
                "Royal Park",
                "Peter Pan",
                "Kensington Palace",
                "Central London"
            ]
        },
        {
            "name": "Alexandra Park & Palace Parkland",
            "url": "https://www.alexandrapalace.com/park/",
            "category": "Parks & Scenic Walks",
            "location": "Muswell Hill / Wood Green, North London",
            "region": "North London",
            "lat": 51.5945,
            "lng": -0.1305,
            "description": "🏰 196 acres of parkland with unmatched panoramic hilltop views over London's entire skyline, a scenic boating lake, rose garden, pub terrace, and farmers' market.",
            "tags": [
                "Skyline Views",
                "Boating Lake",
                "Great Northern Line",
                "Farmers Market",
                "North London"
            ]
        },
        {
            "name": "St Dunstan in the East Church Garden",
            "url": "https://www.historic-uk.com/HistoryMagazine/DestinationsUK/St-Dunstan-in-the-East/",
            "category": "Parks & Scenic Walks",
            "location": "City of London (near Monument / Tower Hill)",
            "region": "Central London",
            "lat": 51.5097,
            "lng": -0.0825,
            "description": "🌿 London's most secret romantic ruin — an ivy-draped medieval Wren church transformed into an enchanting public garden with climbing vines, fountain, and hidden benches.",
            "tags": [
                "Secret Garden",
                "Church Ruin",
                "Hidden Gem",
                "Romantic Spot",
                "City of London"
            ]
        },
        {
            "name": "London Fields & Regent's Canal Walk",
            "url": "https://hackney.gov.uk/london-fields",
            "category": "Parks & Scenic Walks",
            "location": "Hackney, East London",
            "region": "East London",
            "lat": 51.5408,
            "lng": -0.0601,
            "description": "☕ Vibrant East London park with wildflower meadows, table tennis, heated open-air 50m Lido, and scenic waterside walks connecting directly to Broadway Market & Regent's Canal.",
            "tags": [
                "Lido",
                "Broadway Market",
                "Regent's Canal",
                "Wildflowers",
                "East London"
            ]
        },
        {
            "name": "Chiswick House & Gardens",
            "url": "https://chiswickhouseandgardens.org.uk/",
            "category": "Parks & Scenic Walks",
            "location": "Chiswick, West London",
            "region": "West London",
            "lat": 51.4837,
            "lng": -0.2587,
            "description": "🏛️ 65 acres of Grade I listed landscaped gardens with an Italianate classical villa, historic camellia conservatory, cascading waterfall, and serene lake walk.",
            "tags": [
                "Italianate Garden",
                "Historic Villa",
                "Lake Walk",
                "Camellia Conservatory",
                "Chiswick"
            ]
        },
        {
            "name": "Bushy Park & Water Gardens",
            "url": "https://www.royalparks.org.uk/parks/bushy-park",
            "category": "Parks & Scenic Walks",
            "location": "Teddington / Richmond, South West London",
            "region": "Day Trips & Beyond",
            "lat": 51.4137,
            "lng": -0.3414,
            "description": "🦌 London's second largest Royal Park with 1,100 acres of open grassland, roaming red and fallow deer, the grand Longford River, and restored baroque Upper Lodge Water Gardens.",
            "tags": [
                "Deer Park",
                "Royal Park",
                "Baroque Water Gardens",
                "Diana Fountain",
                "South West London"
            ]
        },
        {
            "name": "Kuro Coffee (Notting Hill)",
            "url": "https://kuro-london.com/kuro-coffee-london",
            "category": "Coffee & Cafes",
            "location": "3 Hillgate St, Notting Hill, W8 7SP (near Notting Hill Gate Station)",
            "region": "Central London",
            "lat": 51.5079,
            "lng": -0.1985,
            "description": "☕ Minimalist Japanese specialty coffee house & bakery at 3 Hillgate St in Notting Hill, serving silky flat whites and flaky matcha pastries right by Notting Hill Gate station.",
            "tags": [
                "Kuro Coffee",
                "3 Hillgate St",
                "Japanese Coffee",
                "Notting Hill Gate",
                "Specialty Coffee"
            ]
        },
        {
            "name": "Pavilion Bakery & Cafe (Victoria Park)",
            "url": "https://pavilionbread.com/locations",
            "category": "Bakeries & Pastries",
            "location": "Victoria Park / Broadway Market, East London",
            "region": "East London",
            "lat": 51.5368,
            "lng": -0.0401,
            "description": "🥐 Lakeside cafe in Victoria Park renowned for cardamom buns, sourdough toasties, and exceptional Sri Lankan breakfast curries over water views.",
            "tags": [
                "Lakeside Cafe",
                "Cardamom Buns",
                "Victoria Park",
                "Specialty Coffee",
                "East London"
            ]
        },
        {
            "name": "Pophams Bakery (Islington & London Fields)",
            "url": "https://www.pophamsbakery.com/",
            "category": "Bakeries & Pastries",
            "location": "Islington / London Fields",
            "region": "North London",
            "lat": 51.5401,
            "lng": -0.0982,
            "description": "🥐 Cult artisanal bakery famous for imaginative layered viennoiserie — maple bacon swirls, rosemary sea salt twists, fresh hand-rolled pasta, and Ozone coffee.",
            "tags": [
                "Artisan Pastry",
                "Maple Bacon Swirl",
                "Islington",
                "Coffee & Walk",
                "North London"
            ]
        },
        {
            "name": "Jolene Bakery & Restaurant (Newington Green)",
            "url": "https://jolenen16.com/",
            "category": "Bakeries & Pastries",
            "location": "Newington Green (near Clissold Park)",
            "region": "North London",
            "lat": 51.5518,
            "lng": -0.0862,
            "description": "🌾 Farm-to-table bakery milling regenerative heritage grains on-site: heavenly warm cinnamon buns, palmiers, and natural wines near Clissold Park.",
            "tags": [
                "Heritage Grains",
                "Cinnamon Buns",
                "Natural Wine",
                "Newington Green",
                "North London"
            ]
        },
        {
            "name": "The Dusty Knuckle Bakery (Dalston)",
            "url": "https://www.thedustyknuckle.com/",
            "category": "Bakeries & Pastries",
            "location": "Dalston, East London (near Regent's Canal)",
            "region": "East London",
            "lat": 51.5471,
            "lng": -0.0759,
            "description": "🥪 Legendary bakery tucked inside a converted shipping container courtyard serving giant focaccia sandwiches, potato sourdough, and morning pastries.",
            "tags": [
                "Focaccia Sandwiches",
                "Sourdough",
                "Dalston",
                "Courtyard",
                "East London"
            ]
        },
        {
            "name": "Fortitude Bakehouse (Bloomsbury / Russell Square)",
            "url": "https://www.fortitudebakehouse.com/",
            "category": "Bakeries & Pastries",
            "location": "Bloomsbury (near King's Cross & Russell Square)",
            "region": "Central London",
            "lat": 51.5222,
            "lng": -0.1219,
            "description": "🍯 Sourdough bakery tucked down a cobbled mews, world-famous for its cream-filled sourdough beignets, sticky buns, and craft coffees.",
            "tags": [
                "Sourdough Beignets",
                "Cobbled Mews",
                "Bloomsbury",
                "King's Cross",
                "Central London"
            ]
        },
        {
            "name": "The Castle Climbing Centre",
            "url": "https://www.castle-climbing.co.uk/",
            "category": "Rock Climbing & Bouldering",
            "location": "Stoke Newington / Manor House (Piccadilly Line)",
            "region": "North London",
            "lat": 51.5694,
            "lng": -0.0917,
            "description": "🧗 Stunning Victorian water pumping station designed like a medieval castle, transformed into London's premier climbing, bouldering, and organic cafe venue.",
            "tags": [
                "Rock Climbing",
                "Bouldering",
                "Victorian Castle",
                "Active Date",
                "North London"
            ]
        },
        {
            "name": "Substation Brixton (Bouldering)",
            "url": "https://substation.co.uk/brixton/",
            "category": "Rock Climbing & Bouldering",
            "location": "Brixton (Victoria Line Terminus)",
            "region": "South London",
            "lat": 51.4641,
            "lng": -0.1182,
            "description": "🧗 Massive modern bouldering gym in Brixton with colorful beginner-friendly routes, fitness studio, specialty coffee, and friendly social community.",
            "tags": [
                "Bouldering",
                "Active Date",
                "Brixton",
                "Victoria Line",
                "South London"
            ]
        },
        {
            "name": "Nightjar (Old Street)",
            "url": "https://www.barnightjar.com/",
            "category": "Bars & Speakeasies",
            "location": "Old Street (Great Northern & Northern Line)",
            "region": "Central London",
            "lat": 51.5262,
            "lng": -0.0868,
            "description": "🎷 World-renowned subterranean 1920s speakeasy steps from Old Street station with live vintage jazz, candlelit tables, and breathtaking theatrical cocktail vessels.",
            "tags": [
                "Speakeasy",
                "Live Jazz",
                "Old Street Station",
                "Cocktails",
                "Central London"
            ]
        },
        {
            "name": "Discount Suit Company (Spitalfields / Liverpool St)",
            "url": "https://discountsuitcompany.co.uk/",
            "category": "Bars & Speakeasies",
            "location": "Spitalfields (near Moorgate & Liverpool Street)",
            "region": "Central London",
            "lat": 51.5173,
            "lng": -0.0718,
            "description": "🍸 Intimate basement cocktail bar hidden behind a dilapidated tailor shop facade — exposed brick, low lighting, Northern Soul records, and punchy drinks.",
            "tags": [
                "Hidden Bar",
                "Speakeasy",
                "Spitalfields",
                "Liverpool Street",
                "Central London"
            ]
        },
        {
            "name": "Bar Termini (Soho / Leicester Square)",
            "url": "https://bar-termini-soho.com/",
            "category": "Bars & Speakeasies",
            "location": "Soho (near Leicester Square & Piccadilly Circus)",
            "region": "Central London",
            "lat": 51.5135,
            "lng": -0.1309,
            "description": "☕ Elegant 1950s Rome-inspired bar serving world-class espresso by day and bespoke bottled Negronis (Classico, Superiore, Rosato) by candlelight at night.",
            "tags": [
                "Italian Negronis",
                "Soho",
                "Candlelit Bar",
                "Piccadilly Line",
                "Central London"
            ]
        },
        {
            "name": "Gordon's Wine Bar (Embankment)",
            "url": "https://www.gordonswinebar.com/",
            "category": "Bars & Speakeasies",
            "location": "Embankment / Charing Cross",
            "region": "Central London",
            "lat": 51.5085,
            "lng": -0.1235,
            "description": "🍷 London's oldest wine bar (established 1890) — candlelit 14th-century vaulted stone cellars, dusty wine bottles, artisan cheese boards, and Thames riverside terrace.",
            "tags": [
                "Historic Wine Bar",
                "Candlelit Cellar",
                "Cheese Boards",
                "Embankment",
                "Central London"
            ]
        },
        {
            "name": "Cahoots London (Soho / Oxford Circus)",
            "url": "https://www.cahoots-london.com/",
            "category": "Bars & Speakeasies",
            "location": "Kingly Court, Soho (near Oxford Circus)",
            "region": "Central London",
            "lat": 51.5127,
            "lng": -0.1387,
            "description": "🚇 Underground 1940s disused tube station cocktail bar with vintage carriage seating, swing music, black-market rations, and cocktail flasks.",
            "tags": [
                "Tube Carriage Bar",
                "1940s Retro",
                "Soho",
                "Victoria Line",
                "Central London"
            ]
        },
        {
            "name": "Trullo (Highbury & Islington)",
            "url": "https://www.trullorestaurant.com/",
            "category": "Dinner & Dining",
            "location": "Highbury & Islington (Great Northern & Mildmay / Windrush)",
            "region": "North London",
            "lat": 51.5467,
            "lng": -0.1022,
            "description": "🍝 Legendary candlelit Italian restaurant right next to Highbury & Islington station — silky hand-rolled pasta, 8-hour beef shin ragu, and charcoal grill dishes.",
            "tags": [
                "Hand-Rolled Pasta",
                "Romantic Dining",
                "Highbury Station",
                "Italian",
                "North London"
            ]
        },
        {
            "name": "Coal Office (King's Cross)",
            "url": "https://coaloffice.com/",
            "category": "Dinner & Dining",
            "location": "Coal Drops Yard, King's Cross",
            "region": "Central London",
            "lat": 51.5358,
            "lng": -0.1258,
            "description": "🫓 Stunning Middle Eastern rooftop & canal terrace by chef Assaf Granit and Tom Dixon — sizzling fresh labneh, fresh Yemeni breads, and spiced lamb skewers.",
            "tags": [
                "Rooftop Terrace",
                "Coal Drops Yard",
                "King's Cross",
                "Middle Eastern",
                "Central London"
            ]
        },
        {
            "name": "Dishoom King's Cross",
            "url": "https://www.dishoom.com/kings-cross/",
            "category": "Dinner & Dining",
            "location": "5 Stable St, Granary Square, King's Cross, N1C 4AB",
            "region": "Central London",
            "lat": 51.5355,
            "lng": -0.1245,
            "description": "🍛 Sprawling 1930s Bombay cafe inside a restored railway transit shed at Granary Square — 24-hour black daal, spiced chai, chicken ruby, and the hidden Permit Room bar.",
            "tags": [
                "Dishoom",
                "Bombay Cafe",
                "Black Daal",
                "Granary Square",
                "King's Cross"
            ]
        },
        {
            "name": "Blacklock City (Moorgate / Bank)",
            "url": "https://theblacklock.com/restaurants/city/",
            "category": "Dinner & Dining",
            "location": "City of London (near Moorgate & Bank)",
            "region": "Central London",
            "lat": 51.5126,
            "lng": -0.0863,
            "description": "🥩 Housed inside an atmospheric medieval meat cellar — charcoal-grilled skinny chops, flatbread drip-trays, white chocolate cheesecake, and £5 cocktails.",
            "tags": [
                "Chops & Steaks",
                "Medieval Cellar",
                "Moorgate Station",
                "Bank",
                "Central London"
            ]
        },
        {
            "name": "Duck & Waffle (Liverpool Street / Moorgate)",
            "url": "https://duckandwaffle.com/",
            "category": "Dinner & Dining",
            "location": "Bishopsgate (near Moorgate & Liverpool Street)",
            "region": "Central London",
            "lat": 51.5161,
            "lng": -0.0808,
            "description": "🧇 40th-floor sky dining via a glass bullet lift, serving signature crispy duck leg with fried duck egg and mustard maple syrup with 360° panoramic views.",
            "tags": [
                "40th Floor",
                "Sky Dining",
                "Liverpool Street",
                "Moorgate",
                "Central London"
            ]
        },
        {
            "name": "Royal Botanic Gardens, Kew",
            "url": "https://www.kew.org/",
            "category": "Parks & Scenic Walks",
            "location": "Kew, Richmond (Mildmay Line & District Line)",
            "region": "Day Trips & Beyond",
            "lat": 51.4787,
            "lng": -0.2956,
            "description": "🌺 World-famous UNESCO World Heritage botanical gardens spanning 300 acres — iconic Victorian Palm House, Temperate House, treetop canopy walkway, and tranquil lily ponds.",
            "tags": [
                "Kew Gardens",
                "Botanical Garden",
                "UNESCO World Heritage",
                "Mildmay Line",
                "Romantic Walk"
            ]
        },
        {
            "name": "Knoops (King's Cross)",
            "url": "https://knoops.com/pages/store-locations",
            "category": "Ice Cream & Chocolates",
            "location": "King's Cross (near station & Coal Drops Yard)",
            "region": "Central London",
            "lat": 51.532,
            "lng": -0.125,
            "description": "🍫 Cult bespoke chocolate drink bar offering 20+ precise chocolate percentages (from 28% white to 100% Solomon Islands dark), marshmallow toppings, iced chocolates, and milkshakes.",
            "tags": [
                "Knoops",
                "Hot Chocolate",
                "King's Cross Station",
                "Milkshakes",
                "Central London"
            ]
        },
        {
            "name": "Knoops (Covent Garden)",
            "url": "https://knoops.com/pages/store-locations",
            "category": "Ice Cream & Chocolates",
            "location": "Covent Garden (New Row)",
            "region": "Central London",
            "lat": 51.5115,
            "lng": -0.1265,
            "description": "🍫 Cozy West End chocolate bar steps from Leicester Square and Covent Garden piazza — pick your chocolate cocoa %, herbs, sea salt, or plant-based milks for the ultimate treat.",
            "tags": [
                "Knoops",
                "Hot Chocolate",
                "Covent Garden",
                "Piccadilly Line",
                "Central London"
            ]
        },
        {
            "name": "Knoops (Richmond)",
            "url": "https://knoops.com/pages/store-locations",
            "category": "Ice Cream & Chocolates",
            "location": "Richmond (George Street, near Richmond Green)",
            "region": "Day Trips & Beyond",
            "lat": 51.4608,
            "lng": -0.304,
            "description": "🍫 Perfect post-walk hot chocolate spot right by Richmond Green and the Thames riverside, straight off the Mildmay line from Highbury & Islington.",
            "tags": [
                "Knoops",
                "Hot Chocolate",
                "Richmond Park",
                "Mildmay Line",
                "River Walk"
            ]
        },
        {
            "name": "Knoops (Kensington)",
            "url": "https://knoops.com/pages/store-locations",
            "category": "Ice Cream & Chocolates",
            "location": "Kensington High Street (near Holland Park)",
            "region": "Central London",
            "lat": 51.5012,
            "lng": -0.192,
            "description": "🍫 Artisanal chocolate drink salon on Kensington High Street, ideal for grabbing an iced chocolate before strolling in Kyoto Garden or Kensington Gardens.",
            "tags": [
                "Knoops",
                "Hot Chocolate",
                "Kensington Gardens",
                "Holland Park",
                "Central London"
            ]
        },
        {
            "name": "IKEA Oxford Street",
            "url": "https://www.ikea.com/gb/en/stores/oxford-street/",
            "category": "Quirky & Shops",
            "location": "Oxford Street, Central London (near Oxford Circus)",
            "region": "Central London",
            "lat": 51.515,
            "lng": -0.143,
            "description": "🪛 Oxford Street flagship IKEA store in the heart of London: Swedish deli meatballs, modern home decor inspiration, and flatpack testing on the Victoria line.",
            "tags": [
                "DIY Date",
                "Flatpack Building",
                "Swedish Deli",
                "Meatballs",
                "Showroom Date"
            ]
        },
        {
            "name": "IKEA Hammersmith",
            "url": "https://www.ikea.com/gb/en/stores/hammersmith/",
            "category": "Quirky & Shops",
            "location": "King Street, Hammersmith (Livat)",
            "region": "West London",
            "lat": 51.4925,
            "lng": -0.229,
            "description": "🪛 Compact urban IKEA inside Livat Hammersmith at the end of the Hammersmith & City line: Swedish food market, plant room, and interior styling browsing.",
            "tags": [
                "DIY Date",
                "Flatpack Building",
                "Swedish Deli",
                "Meatballs",
                "Showroom Date"
            ]
        },
        {
            "name": "IKEA Greenwich",
            "url": "https://www.ikea.com/gb/en/stores/greenwich/",
            "category": "Quirky & Shops",
            "location": "Millennium Way, Greenwich",
            "region": "South London",
            "lat": 51.492,
            "lng": 0.006,
            "description": "🪛 Eco-friendly flagship store featuring a public rooftop garden, sustainable architecture workshop spaces, restaurant meatballs, and endless showroom wandering.",
            "tags": [
                "DIY Date",
                "Flatpack Building",
                "Swedish Deli",
                "Meatballs",
                "Showroom Date"
            ]
        },
        {
            "name": "Darlish (Bloomsbury / British Museum)",
            "url": "https://darlish.com/pages/darlish-bloomsbury-british-museum",
            "category": "Ice Cream & Chocolates",
            "location": "Bloomsbury (near British Museum & Russell Square)",
            "region": "Central London",
            "lat": 51.5186,
            "lng": -0.125,
            "description": "🍨 Cult Persian-inspired ice cream parlour famous for warm pistachio baklava ice cream sandwiches, saffron rosewater scoops, sour cherry tahini, and iced cardamom tea.",
            "tags": [
                "Darlish",
                "Baklava Ice Cream",
                "Persian Ice Cream",
                "Bloomsbury",
                "British Museum"
            ]
        },
        {
            "name": "Darlish (St Albans Flagship)",
            "url": "https://darlish.com/",
            "category": "Ice Cream & Chocolates",
            "location": "The Pavilion, Jubilee Square, Victoria St, St Albans AL1 3LT",
            "region": "Hertfordshire (Local)",
            "lat": 51.7515,
            "lng": -0.334,
            "description": "🍨 The original St Albans flagship parlour serving signature baklava sandwiches, Turkish coffee, Persian halva scoops, and toasted Iranian pistachio milkshakes.",
            "tags": [
                "Darlish",
                "St Albans",
                "Baklava Sandwich",
                "Hertfordshire Local",
                "Ice Cream Parlour"
            ]
        },
        {
            "name": "Darlish (Spitalfields)",
            "url": "https://darlish.com/",
            "category": "Ice Cream & Chocolates",
            "location": "Old Spitalfields Market (near Liverpool Street & Moorgate)",
            "region": "Central London",
            "lat": 51.5197,
            "lng": -0.076,
            "description": "🍨 East London parlour right in Old Spitalfields Market — grab a hot-pressed baklava ice cream sandwich after exploring street food stalls and craft vintage markets.",
            "tags": [
                "Darlish",
                "Spitalfields",
                "Baklava Sandwich",
                "Liverpool Street",
                "East London"
            ]
        },
        {
            "name": "Darlish (Notting Hill)",
            "url": "https://darlish.com/",
            "category": "Ice Cream & Chocolates",
            "location": "Portobello Road, Notting Hill",
            "region": "Central London",
            "lat": 51.5147,
            "lng": -0.203,
            "description": "🍨 Chic pastel parlour on Portobello Road — Persian floral ice creams, coconut sour cherry, and flaky filo baklava buns for date walks toward Holland Park.",
            "tags": [
                "Darlish",
                "Notting Hill",
                "Portobello Road",
                "Baklava",
                "Date Walk"
            ]
        },
        {
            "name": "Buns from Home (Covent Garden)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "140 Long Acre, Covent Garden",
            "region": "Central London",
            "lat": 51.513,
            "lng": -0.1251,
            "description": "🥐 Cult bakery crafting layered croissant-dough buns — pistachio cream, cinnamon sugar, cheesecake buns, and cardamom twists right in Covent Garden.",
            "tags": [
                "Buns from Home",
                "Croissant Buns",
                "Pistachio Bun",
                "Covent Garden",
                "Central London"
            ]
        },
        {
            "name": "Buns from Home (Notting Hill Original)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "128 Talbot Rd, Notting Hill",
            "region": "Central London",
            "lat": 51.5181,
            "lng": -0.2032,
            "description": "🥐 The original bakery where the viral lockdown project began — grab fresh-baked cinnamon or tiramisu buns before strolling along Portobello Road.",
            "tags": [
                "Buns from Home",
                "Notting Hill",
                "Original Bakery",
                "Portobello Road",
                "Coffee & Bun"
            ]
        },
        {
            "name": "Buns from Home (The Royal Exchange / Bank)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "33 The Royal Exchange, City of London (Bank)",
            "region": "Central London",
            "lat": 51.5136,
            "lng": -0.0877,
            "description": "🥐 Historic City location under the Royal Exchange arches — perfect morning sweet stop right by Bank and Moorgate stations.",
            "tags": [
                "Buns from Home",
                "Royal Exchange",
                "Bank Station",
                "Moorgate",
                "City of London"
            ]
        },
        {
            "name": "Buns from Home (Camden Market)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "Camden Lock Market, Camden Town",
            "region": "North London",
            "lat": 51.5415,
            "lng": -0.1462,
            "description": "🥐 Canalside bakery kiosk in Camden Market serving warm braided custard & fruit buns for a Regent's Canal walking date toward Primrose Hill.",
            "tags": [
                "Buns from Home",
                "Camden Market",
                "Regent's Canal",
                "Primrose Hill",
                "North London"
            ]
        },
        {
            "name": "Buns from Home (Piccadilly)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "172 Piccadilly (near Green Park)",
            "region": "Central London",
            "lat": 51.5078,
            "lng": -0.1396,
            "description": "🥐 West End bakery opposite Fortnum & Mason — pair a warm hazelnut bun with an espresso before a stroll through Green Park or St James's Park.",
            "tags": [
                "Buns from Home",
                "Piccadilly",
                "Green Park Walk",
                "West End",
                "Central London"
            ]
        },
        {
            "name": "Buns from Home (Victoria)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "27 Strutton Ground, Victoria",
            "region": "Central London",
            "lat": 51.4981,
            "lng": -0.1342,
            "description": "🥐 Bustling market-street bakery near Victoria station serving flaky chocolate hazelnut, vanilla custard, and seasonal fruit laminated buns.",
            "tags": [
                "Buns from Home",
                "Victoria Station",
                "Strutton Ground",
                "Victoria Line",
                "Central London"
            ]
        },
        {
            "name": "Buns from Home (Richmond)",
            "url": "https://www.bunsfromhome.com/our-bakeries",
            "category": "Bakeries & Pastries",
            "location": "44 George St, Richmond",
            "region": "Day Trips & Beyond",
            "lat": 51.4605,
            "lng": -0.3035,
            "description": "🥐 Richmond town-centre bakery right off the Mildmay line — grab warm cinnamon buns to enjoy by Richmond Riverside or inside Richmond Park.",
            "tags": [
                "Buns from Home",
                "Richmond Riverside",
                "Mildmay Line",
                "Richmond Park",
                "Bakery Date"
            ]
        },
        {
            "name": "Victoria and Albert Museum (V&A)",
            "url": "https://www.vam.ac.uk/",
            "category": "Museums & Culture",
            "location": "Cromwell Rd, South Kensington",
            "region": "Central London",
            "lat": 51.4966,
            "lng": -0.1722,
            "description": "🏛️ World's leading museum of art and design — magnificent Italian renaissance courtyard with fountain cafe, sparkling jewelry gallery, and late-night Friday openings.",
            "tags": [
                "V&A",
                "South Kensington",
                "Design Museum",
                "Courtyard Cafe",
                "Friday Lates"
            ]
        },
        {
            "name": "National Gallery & Portrait Gallery",
            "url": "https://www.nationalgallery.org.uk/",
            "category": "Museums & Culture",
            "location": "Trafalgar Square, Central London",
            "region": "Central London",
            "lat": 51.5089,
            "lng": -0.1283,
            "description": "🎨 World masterpieces by Van Gogh, Da Vinci, and Monet overlooking Trafalgar Square, linked to the newly reopened National Portrait Gallery and Portrait Restaurant.",
            "tags": [
                "National Gallery",
                "Trafalgar Square",
                "Masterpieces",
                "National Portrait Gallery",
                "Piccadilly Line"
            ]
        },
        {
            "name": "Natural History Museum",
            "url": "https://www.nhm.ac.uk/",
            "category": "Museums & Culture",
            "location": "Cromwell Rd, South Kensington",
            "region": "Central London",
            "lat": 51.4967,
            "lng": -0.1764,
            "description": "🦕 Grand Romanesque cathedral of nature with the giant blue whale skeleton (Hope) suspended in Hintze Hall, dinosaur gallery, and lush wildlife gardens.",
            "tags": [
                "Natural History Museum",
                "South Kensington",
                "Hintze Hall",
                "Dinosaurs",
                "Architecture"
            ]
        },
        {
            "name": "Science Museum",
            "url": "https://www.sciencemuseum.org.uk/",
            "category": "Museums & Culture",
            "location": "Exhibition Rd, South Kensington",
            "region": "Central London",
            "lat": 51.4978,
            "lng": -0.1745,
            "description": "🚀 Interactive wonderland featuring Apollo 10 command module, Wonderlab interactive science gallery, IMAX 3D cinema, and flight simulators.",
            "tags": [
                "Science Museum",
                "South Kensington",
                "Wonderlab",
                "IMAX",
                "Space Exploration"
            ]
        },
        {
            "name": "Sir John Soane's Museum",
            "url": "https://www.soane.org/",
            "category": "Museums & Culture",
            "location": "Lincoln's Inn Fields, Holborn",
            "region": "Central London",
            "lat": 51.517,
            "lng": -0.1175,
            "description": "🕯️ Romantic labyrinth of eccentric architectural treasures, ancient Roman antiquities, and Hogarth paintings shown by candlelight during popular monthly Soane Lates.",
            "tags": [
                "Sir John Soane",
                "Candlelight Lates",
                "Hidden Gem",
                "Holborn",
                "Eccentric Townhouse"
            ]
        },
        {
            "name": "The Wallace Collection",
            "url": "https://www.wallacecollection.org/",
            "category": "Museums & Culture",
            "location": "Hertford House, Manchester Square, Marylebone",
            "region": "Central London",
            "lat": 51.5176,
            "lng": -0.153,
            "description": "💎 18th-century French rococo palace with world-famous Old Masters and arms & armor, centered around a sunlit glass-roofed courtyard restaurant serving afternoon tea.",
            "tags": [
                "Wallace Collection",
                "Marylebone",
                "Courtyard Restaurant",
                "Old Masters",
                "Romantic Museum"
            ]
        },
        {
            "name": "Saatchi Gallery",
            "url": "https://www.saatchigallery.com/",
            "category": "Museums & Culture",
            "location": "Duke of York's HQ, King's Road, Chelsea",
            "region": "Central London",
            "lat": 51.4907,
            "lng": -0.1584,
            "description": "🎨 Dynamic contemporary art space in Chelsea featuring groundbreaking global artists, immersive installations, and Duke of York Square weekend food market outside.",
            "tags": [
                "Saatchi Gallery",
                "Chelsea",
                "King's Road",
                "Contemporary Art",
                "Sloane Square"
            ]
        },
        {
            "name": "Royal Academy of Arts",
            "url": "https://www.royalacademy.org.uk/",
            "category": "Museums & Culture",
            "location": "Burlington House, Piccadilly",
            "region": "Central London",
            "lat": 51.5093,
            "lng": -0.1396,
            "description": "🏛️ Prestigious Piccadilly art institution hosting world-class blockbuster exhibitions, the iconic Summer Exhibition, and the elegant Courtyard cafe.",
            "tags": [
                "Royal Academy",
                "Piccadilly",
                "Summer Exhibition",
                "Blockbuster Art",
                "Green Park"
            ]
        },
        {
            "name": "Somerset House & The Courtauld Gallery",
            "url": "https://www.somersethouse.org.uk/",
            "category": "Museums & Culture",
            "location": "Strand, Central London (near Temple)",
            "region": "Central London",
            "lat": 51.5111,
            "lng": -0.1171,
            "description": "🏛️ Neoclassical riverside arts palace housing The Courtauld's Impressionist treasures (Manet, Van Gogh, Cézanne), summer courtyard fountains, and winter ice rink.",
            "tags": [
                "Somerset House",
                "The Courtauld",
                "Impressionism",
                "Courtyard Fountains",
                "Strand"
            ]
        },
        {
            "name": "Whitechapel Gallery",
            "url": "https://www.whitechapelgallery.org/",
            "category": "Museums & Culture",
            "location": "Whitechapel High St (Windrush Line Interchange)",
            "region": "Central London",
            "lat": 51.5161,
            "lng": -0.0702,
            "description": "🎨 Trailblazing East London modern gallery that debuted Picasso's Guernica, featuring rotating avant-garde exhibitions and beautiful Townsend restaurant on the Windrush line.",
            "tags": [
                "Whitechapel Gallery",
                "Windrush Line",
                "Contemporary Art",
                "Townsend Restaurant",
                "East London"
            ]
        },
        {
            "name": "Hayward Gallery & Southbank Centre",
            "url": "https://www.southbankcentre.co.uk/venues/hayward-gallery",
            "category": "Museums & Culture",
            "location": "Belvedere Rd, South Bank (Waterloo)",
            "region": "Central London",
            "lat": 51.5061,
            "lng": -0.1165,
            "description": "🎨 World-famous brutalist contemporary art gallery overlooking the Thames, with outdoor sculpture terraces, food market, and riverside date walks.",
            "tags": [
                "Hayward Gallery",
                "South Bank",
                "Thames Walk",
                "Brutalist Architecture",
                "Waterloo"
            ]
        },
        {
            "name": "Barbican Art Gallery & Conservatory",
            "url": "https://www.barbican.org.uk/whats-on/art-design",
            "category": "Museums & Culture",
            "location": "Silk St, Barbican (near Moorgate)",
            "region": "Central London",
            "lat": 51.5202,
            "lng": -0.0935,
            "description": "🌿 Brutalist cultural landmark featuring major photography/design exhibitions and a hidden multi-level tropical conservatory with 1,500 exotic plant species and koi carp.",
            "tags": [
                "Barbican Conservatory",
                "Art Gallery",
                "Tropical Plants",
                "Moorgate Station",
                "Brutalist Icon"
            ]
        },
        {
            "name": "Design Museum",
            "url": "https://designmuseum.org/",
            "category": "Museums & Culture",
            "location": "Kensington High St (near Holland Park)",
            "region": "Central London",
            "lat": 51.4998,
            "lng": -0.1996,
            "description": "📐 Striking hyperbolic paraboloid roof building on the edge of Holland Park, celebrating industrial design, fashion, architecture, and technology innovations.",
            "tags": [
                "Design Museum",
                "Kensington",
                "Holland Park",
                "Modern Architecture",
                "Date Walk"
            ]
        },
        {
            "name": "The Photographers' Gallery",
            "url": "https://thephotographersgallery.org.uk/",
            "category": "Museums & Culture",
            "location": "Ramillies St, Soho (near Oxford Circus)",
            "region": "Central London",
            "lat": 51.5151,
            "lng": -0.1399,
            "description": "📷 Six floors dedicated entirely to global contemporary photography, iconic photojournalism, rare photobooks, and relaxed Soho cafe.",
            "tags": [
                "Photography",
                "Soho",
                "Oxford Circus",
                "Victoria Line",
                "Central London"
            ]
        },
        {
            "name": "Old Spitalfields Market",
            "url": "https://oldspitalfieldsmarket.com/",
            "category": "Markets & Food Halls",
            "location": "Commercial St, Spitalfields (near Liverpool St & Moorgate)",
            "region": "Central London",
            "lat": 51.5197,
            "lng": -0.0759,
            "description": "🛍️ Historic covered market bustling with artisan food trucks (Bleeker Burger, Dumpling Shack, Fen Noodles), indie fashion stalls, vinyl records, and craft workshops.",
            "tags": [
                "Old Spitalfields",
                "Street Food",
                "Artisan Market",
                "Liverpool Street",
                "Moorgate"
            ]
        },
        {
            "name": "Broadway Market & Schoolyard Market",
            "url": "https://broadwaymarket.co.uk/",
            "category": "Markets & Food Halls",
            "location": "Broadway Market, Hackney (London Fields)",
            "region": "East London",
            "lat": 51.5367,
            "lng": -0.0607,
            "description": "🥐 Hackney's most popular Saturday market: gourmet street food, organic oyster bars, vintage clothes, craft beer, and direct Regent's Canal walkway to London Fields.",
            "tags": [
                "Broadway Market",
                "Saturday Market",
                "London Fields",
                "Regent's Canal",
                "East London"
            ]
        },
        {
            "name": "Greenwich Market",
            "url": "https://www.greenwichmarket.london/",
            "category": "Markets & Food Halls",
            "location": "Greenwich Town Centre (near Greenwich Park)",
            "region": "South London",
            "lat": 51.4816,
            "lng": -0.0094,
            "description": "🍜 Covered Georgian market with 40+ street food stalls (Ethiopian injera, artisanal churros, ramen burgers) and independent arts & crafts right by the Royal Observatory.",
            "tags": [
                "Greenwich Market",
                "Covered Market",
                "Street Food",
                "Greenwich Park",
                "South London"
            ]
        },
        {
            "name": "Camden Market & Hawley Wharf",
            "url": "https://www.camdenmarket.com/",
            "category": "Markets & Food Halls",
            "location": "Camden High St / Hawley Wharf, Camden",
            "region": "North London",
            "lat": 51.5414,
            "lng": -0.1444,
            "description": "🌮 Iconic North London market spanning historic stable arches and canalside Hawley Wharf with 100+ global food stalls, craft beer terraces, and comedy clubs.",
            "tags": [
                "Camden Market",
                "Hawley Wharf",
                "Canalside",
                "Street Food",
                "North London"
            ]
        },
        {
            "name": "Southbank Centre Food Market",
            "url": "https://www.southbankcentre.co.uk/visit/cafes-restaurants-bars/sc-food-market",
            "category": "Markets & Food Halls",
            "location": "Southbank Centre, Royal Festival Hall (Waterloo)",
            "region": "Central London",
            "lat": 51.5065,
            "lng": -0.116,
            "description": "🍔 Bustling weekend food market behind the Royal Festival Hall — aromatic curries, artisan duck wraps, fresh churros, and craft ciders beside the Thames.",
            "tags": [
                "Southbank Food Market",
                "Weekend Market",
                "Waterloo",
                "Thames Riverside",
                "Central London"
            ]
        },
        {
            "name": "Mercato Mayfair",
            "url": "https://mercatometropolitano.com/locations/mayfair/",
            "category": "Markets & Food Halls",
            "location": "St Mark's Church, North Audley St, Mayfair",
            "region": "Central London",
            "lat": 51.5129,
            "lng": -0.1518,
            "description": "⛪ Magnificent Grade I listed former church transformed into a stunning artisan food hall with vaulted ceilings, altar wine bar, stained glass, and roof terrace.",
            "tags": [
                "Mercato Mayfair",
                "Church Food Hall",
                "Mayfair",
                "Roof Terrace",
                "Central London"
            ]
        },
        {
            "name": "Brixton Village & Market Row",
            "url": "https://brixtonvillage.com/",
            "category": "Markets & Food Halls",
            "location": "Coldharbour Ln, Brixton (Victoria Line Terminus)",
            "region": "South London",
            "lat": 51.4632,
            "lng": -0.113,
            "description": "🇯🇲 Historic 1930s covered arcades bursting with world flavours: Jamaican jerk, sourdough pizza (Franco Manca original), Colombian arepas, and cocktail dens.",
            "tags": [
                "Brixton Village",
                "Market Row",
                "Victoria Line",
                "Caribbean Food",
                "South London"
            ]
        },
        {
            "name": "Vinegar Yard & Flat Iron Square",
            "url": "https://www.vinegaryard.london/",
            "category": "Markets & Food Halls",
            "location": "St Thomas St, London Bridge",
            "region": "Central London",
            "lat": 51.5036,
            "lng": -0.0848,
            "description": "🍻 Vibrant open-air food yard under the Shard featuring rotating street food kitchens (Nanny Bill's, Sugo), giant outdoor beer garden, art installations, and flea market.",
            "tags": [
                "Vinegar Yard",
                "London Bridge",
                "The Shard",
                "Outdoor Beer Garden",
                "Central London"
            ]
        },
        {
            "name": "Exmouth Market",
            "url": "https://www.instagram.com/exmouth.market/",
            "category": "Markets & Food Halls",
            "location": "Exmouth Market, Clerkenwell (near Farringdon / King's Cross)",
            "region": "Central London",
            "lat": 51.5262,
            "lng": -0.1082,
            "description": "🥘 Semi-pedestrianised foodie street lined with fairy lights and weekday/weekend street food pans: giant paellas, salt beef bagels, Moro tapas, and craft coffee.",
            "tags": [
                "Exmouth Market",
                "Clerkenwell",
                "Farringdon",
                "Fairy Lights",
                "Street Food"
            ]
        },
        {
            "name": "Flight Club Shoreditch",
            "url": "https://flightclubdarts.com/london/venues/shoreditch",
            "category": "Social Darts",
            "location": "2A Worship St, Shoreditch (near Old St & Moorgate)",
            "region": "Central London",
            "lat": 51.5218,
            "lng": -0.0858,
            "description": "🎯 The original social darts venue near Old Street station with animated multiplayer dartboards, sharing pizza paddles, and fairground cocktails.",
            "tags": [
                "Flight Club",
                "Social Darts",
                "Old Street",
                "Moorgate",
                "Active Date"
            ]
        },
        {
            "name": "Flight Club Bloomsbury",
            "url": "https://flightclubdarts.com/london/venues/bloomsbury",
            "category": "Social Darts",
            "location": "55 New Oxford St, Bloomsbury (near Tottenham Court Rd)",
            "region": "Central London",
            "lat": 51.5167,
            "lng": -0.1264,
            "description": "🎯 Grand two-floor Victorian fairground darts palace on New Oxford Street with private oches, slushy cocktail bar, and party atmosphere.",
            "tags": [
                "Flight Club",
                "Bloomsbury",
                "Social Darts",
                "Central London",
                "Active Date"
            ]
        },
        {
            "name": "Flight Club Victoria",
            "url": "https://flightclubdarts.com/london/venues/victoria",
            "category": "Social Darts",
            "location": "6 Sir Milton Square, Nova Victoria",
            "region": "Central London",
            "lat": 51.4983,
            "lng": -0.1432,
            "description": "🎯 Spectacular multi-level darts bar with giant fairground carousel bar and terrace in the vibrant Nova Victoria complex right on the Victoria Line.",
            "tags": [
                "Flight Club",
                "Victoria Station",
                "Victoria Line",
                "Carousel Bar",
                "Social Darts"
            ]
        },
        {
            "name": "Flight Club Islington",
            "url": "https://flightclubdarts.com/london/",
            "category": "Social Darts",
            "location": "56 Upper St, Islington (near Angel)",
            "region": "North London",
            "lat": 51.536,
            "lng": -0.103,
            "description": "🎯 Boutique social darts haven on bustling Upper Street with cozy wooden oches, cocktail carousels, and sourdough pizzas.",
            "tags": [
                "Flight Club",
                "Islington",
                "Upper Street",
                "Angel Station",
                "Social Darts"
            ]
        },
        {
            "name": "Swingers City",
            "url": "https://swingers.club/uk/venues/city",
            "category": "Mini Golf & Topgolf",
            "location": "80-86 Leadenhall St, City of London (near Aldgate / Bank)",
            "region": "Central London",
            "lat": 51.5133,
            "lng": -0.0792,
            "description": "⛳ 1920s English country clubhouse crazy golf venue with two 9-hole obstacle courses, gourmet street food (Patty & Bun, Pizza Pilgrims), and cocktail caddies.",
            "tags": [
                "Swingers Golf",
                "Crazy Golf",
                "City of London",
                "Cocktail Caddies",
                "Central London"
            ]
        },
        {
            "name": "Swingers West End",
            "url": "https://swingers.club/uk/venues/west-end",
            "category": "Mini Golf & Topgolf",
            "location": "15 John Prince's St, Oxford Circus",
            "region": "Central London",
            "lat": 51.5158,
            "lng": -0.1448,
            "description": "⛳ Seaside-themed crazy golf palace just off Oxford Street with a retro boardwalk, Ferris wheel cocktail bar, beach huts, and street food.",
            "tags": [
                "Swingers West End",
                "Crazy Golf",
                "Oxford Circus",
                "Victoria Line",
                "Central London"
            ]
        },
        {
            "name": "Puttshack Bank",
            "url": "https://www.puttshack.com/uk/locations/bank",
            "category": "Mini Golf & Topgolf",
            "location": "1 Poultry, Bank",
            "region": "Central London",
            "lat": 51.5132,
            "lng": -0.0898,
            "description": "⛳ High-tech indoor crazy golf powered by microchipped balls that track your score, hazard bonuses, trivia questions, and luxury bar service right at Bank station.",
            "tags": [
                "Puttshack",
                "Tech Mini Golf",
                "Bank Station",
                "Moorgate",
                "Central London"
            ]
        },
        {
            "name": "Puttshack White City",
            "url": "https://www.puttshack.com/uk/locations/white-city",
            "category": "Mini Golf & Topgolf",
            "location": "Westfield London, White City",
            "region": "West London",
            "lat": 51.5076,
            "lng": -0.2222,
            "description": "⛳ Supercharged interactive mini golf with four 9-hole courses, digital beer pong, live weekend DJs, and cocktail bar inside Westfield.",
            "tags": [
                "Puttshack",
                "White City",
                "Westfield",
                "H&C Line",
                "Tech Mini Golf"
            ]
        },
        {
            "name": "Plonk Golf (Camden Market)",
            "url": "https://www.plonkgolf.co.uk/venue/camden/",
            "category": "Mini Golf & Topgolf",
            "location": "The Stables Market, Chalk Farm Rd, Camden",
            "region": "North London",
            "lat": 51.5422,
            "lng": -0.1469,
            "description": "⛳ UV neon-lit crazy golf obstacle course built inside the Victorian horse tunnels of Camden Stables Market with arcade machines and cocktail bar.",
            "tags": [
                "Plonk Golf",
                "UV Crazy Golf",
                "Camden Market",
                "Stables Tunnels",
                "North London"
            ]
        },
        {
            "name": "Rowans Tenpin Bowl (Finsbury Park)",
            "url": "https://rowans.co.uk/",
            "category": "Bowling & Lanes",
            "location": "10 Stroud Green Rd, Finsbury Park",
            "region": "North London",
            "lat": 51.5651,
            "lng": -0.1081,
            "description": "🎳 Legendary North London retro bowling institution right by Finsbury Park station: 24 bowling lanes, retro arcade machines, pool tables, slushy cocktails, and karaoke.",
            "tags": [
                "Rowans Bowling",
                "Finsbury Park",
                "Great Northern Line",
                "Retro Bowling",
                "Karaoke"
            ]
        },
        {
            "name": "All Star Lanes Holborn",
            "url": "https://www.allstarlanes.co.uk/locations/holborn",
            "category": "Bowling & Lanes",
            "location": "Victoria House, Bloomsbury Square, Holborn",
            "region": "Central London",
            "lat": 51.5186,
            "lng": -0.1221,
            "description": "🎳 Retro 1950s American boutique bowling alley with retro polished lanes, craft cocktails, buttermilk fried chicken burgers, and private karaoke booths.",
            "tags": [
                "All Star Lanes",
                "Boutique Bowling",
                "Holborn",
                "Bloomsbury",
                "Central London"
            ]
        },
        {
            "name": "All Star Lanes Brick Lane",
            "url": "https://www.allstarlanes.co.uk/locations/brick-lane",
            "category": "Bowling & Lanes",
            "location": "95 Brick Ln, Shoreditch",
            "region": "Central London",
            "lat": 51.5212,
            "lng": -0.0717,
            "description": "🎳 Shoreditch bowling hangout featuring vintage neon bowling lanes, outdoor terrace, arcade claw machines, and loaded milkshakes off the Windrush line.",
            "tags": [
                "All Star Lanes",
                "Brick Lane",
                "Shoreditch",
                "Windrush Line",
                "Boutique Bowling"
            ]
        },
        {
            "name": "All Star Lanes Stratford",
            "url": "https://www.allstarlanes.co.uk/locations/stratford",
            "category": "Bowling & Lanes",
            "location": "Westfield Stratford City (Mildmay Terminus)",
            "region": "East London",
            "lat": 51.5432,
            "lng": -0.0065,
            "description": "🎳 14 retro bowling lanes, VIP suites, American diner menu, and craft cocktails at the Stratford terminus of the Mildmay line.",
            "tags": [
                "All Star Lanes",
                "Stratford",
                "Mildmay Line",
                "Westfield",
                "Boutique Bowling"
            ]
        },
        {
            "name": "Hon's BBQ (Bloomsbury / West End)",
            "url": "https://www.honsbbq.com/",
            "category": "Dinner & Dining",
            "location": "New Oxford St / St Giles, Central London",
            "region": "Central London",
            "lat": 51.5165,
            "lng": -0.1285,
            "description": "🍖 Authentic Cantonese charcoal roast meat specialist — signature melt-in-the-mouth char siu pork, crackling roast pork belly, roast duck, and silky wonton noodles.",
            "tags": [
                "Cantonese BBQ",
                "Char Siu",
                "Roast Duck",
                "New Oxford St",
                "Central London"
            ]
        },
        {
            "name": "Zapote (Shoreditch)",
            "url": "https://zapote.co.uk/",
            "category": "Dinner & Dining",
            "location": "70 Leonard St, Shoreditch (near Old Street Station)",
            "region": "Central London",
            "lat": 51.5244,
            "lng": -0.0825,
            "description": "🌮 Vibrant contemporary Mexican dining room and cocktail lounge steps from Old Street station — charcoal-grilled octopus, wild sea bass ceviche, and artisanal mezcals.",
            "tags": [
                "Mexican Dining",
                "Mezcal Cocktails",
                "Charcoal Grill",
                "Old Street Station",
                "Shoreditch"
            ]
        },
        {
            "name": "Yeast Bakery (Broadway Market / Regent's Canal)",
            "url": "https://www.yeastbakery.com/",
            "category": "Bakeries & Pastries",
            "location": "Canalside, The Oval / Broadway Market, East London",
            "region": "East London",
            "lat": 51.5348,
            "lng": -0.057,
            "description": "🥐 Acclaimed specialty French viennoiserie bakery on the Regent's Canal — famous for caramelized butter kouign-amann, pistachio croissants, and canal walk coffees.",
            "tags": [
                "Kouign-Amann",
                "Viennoiserie",
                "Regent's Canal",
                "Broadway Market",
                "Coffee & Walk"
            ]
        },
        {
            "name": "Los Mochis (Notting Hill)",
            "url": "https://www.losmochis.co.uk/nh/notting-hill#notting-hill-menu-narrow-bannertitle",
            "category": "Dinner & Dining",
            "location": "2-4 Farmer St, Notting Hill (near Notting Hill Gate)",
            "region": "Central London",
            "lat": 51.5085,
            "lng": -0.1982,
            "description": "🍣 Stylish Mexican-Japanese fusion restaurant & cocktail den: truffle guacamole, yellowtail ceviche, wagyu carne asada tacos, and agave cocktail flights.",
            "tags": [
                "Mexican Japanese",
                "Tacos & Sushi",
                "Cocktail Den",
                "Notting Hill",
                "Date Night"
            ]
        },
        {
            "name": "Suzi Tros (Notting Hill)",
            "url": "https://suzitros.com/a-la-carte-menu/",
            "category": "Dinner & Dining",
            "location": "18 Hillgate St, Notting Hill",
            "region": "Central London",
            "lat": 51.5078,
            "lng": -0.1989,
            "description": "🇬🇷 Intimate modern Greek bistro inspired by Thessaloniki's food scene — grilled mastic octopus, smoked aubergine with tahini, metsovone croquettes, and Greek wines.",
            "tags": [
                "Greek Bistro",
                "Grilled Octopus",
                "Natural Wines",
                "Hillgate Village",
                "Notting Hill"
            ]
        },
        {
            "name": "Dishoom Covent Garden",
            "url": "https://www.dishoom.com/covent-garden/",
            "category": "Dinner & Dining",
            "location": "12 Upper St Martin's Lane, Covent Garden, WC2H 9FB",
            "region": "Central London",
            "lat": 51.5126,
            "lng": -0.1268,
            "description": "🍛 The original flagship Dishoom in the heart of Covent Garden — Irani cafe booth seating, gunpowder potatoes, roomali roti rolls, and chai tea.",
            "tags": [
                "Dishoom",
                "Covent Garden",
                "West End",
                "Black Daal",
                "Central London"
            ]
        },
        {
            "name": "Dishoom Shoreditch",
            "url": "https://www.dishoom.com/shoreditch/",
            "category": "Dinner & Dining",
            "location": "7 Boundary St, Shoreditch, E2 7JE",
            "region": "Central London",
            "lat": 51.5248,
            "lng": -0.0768,
            "description": "🍛 Shoreditch outpost with a lush garden verandah, open kitchen charcoal grills, famous bacon naan rolls, and evening cocktail lounge.",
            "tags": [
                "Dishoom",
                "Shoreditch",
                "Verandah",
                "Bacon Naan",
                "East London"
            ]
        },
        {
            "name": "Dishoom Carnaby (Soho)",
            "url": "https://www.dishoom.com/carnaby/",
            "category": "Dinner & Dining",
            "location": "22 Kingly St, Soho / Carnaby, W1B 5QP",
            "region": "Central London",
            "lat": 51.5133,
            "lng": -0.1396,
            "description": "🍛 1960s Bombay rock-and-roll tribute tucked behind Regent Street in Kingly Court — sizzling lamb chops, keema pau, and bespoke tipples.",
            "tags": [
                "Dishoom",
                "Carnaby",
                "Soho",
                "Kingly Court",
                "Central London"
            ]
        },
        {
            "name": "Dishoom Kensington",
            "url": "https://www.dishoom.com/kensington/",
            "category": "Dinner & Dining",
            "location": "4A Derry St, Kensington, W8 5SE (near High St Kensington)",
            "region": "Central London",
            "lat": 51.5011,
            "lng": -0.1912,
            "description": "🍛 Opulent 1940s Art Deco Bombay cinema hall aesthetic off Kensington High Street — mutton pepper fry, biryanis, and vintage cocktails.",
            "tags": [
                "Dishoom",
                "Kensington",
                "Art Deco",
                "High St Kensington",
                "Central London"
            ]
        },
        {
            "name": "Dishoom Battersea",
            "url": "https://www.dishoom.com/battersea/",
            "category": "Dinner & Dining",
            "location": "42 Electric Blvd, Battersea Power Station, SW11 8BZ",
            "region": "South London",
            "lat": 51.4796,
            "lng": -0.1435,
            "description": "🍛 Futuristic retro-futuristic Bombay cafe set on Electric Boulevard outside Battersea Power Station on the Northern Line extension.",
            "tags": [
                "Dishoom",
                "Battersea Power Station",
                "Northern Line",
                "Electric Blvd",
                "South London"
            ]
        },
        {
            "name": "Dishoom Canary Wharf",
            "url": "https://www.dishoom.com/canary-wharf/",
            "category": "Dinner & Dining",
            "location": "13 Water St, Wood Wharf, Canary Wharf, E14 5GX",
            "region": "East London",
            "lat": 51.5028,
            "lng": -0.0162,
            "description": "🍛 Canalside Wood Wharf destination with sun-drenched outdoor terrace, vintage Iranian family portraits, and lavish Bombay breakfasts.",
            "tags": [
                "Dishoom",
                "Canary Wharf",
                "Wood Wharf",
                "Terrace",
                "East London"
            ]
        },
        {
            "name": "Darlish (Hatfield House Stable Yard)",
            "url": "https://darlish.com/",
            "category": "Ice Cream & Chocolates",
            "location": "The Stable Yard, Hatfield House, Great North Rd, Hatfield AL9 5HX",
            "region": "Hertfordshire (Local)",
            "lat": 51.7608,
            "lng": -0.211,
            "description": "🍨 Beautiful Persian ice cream parlour in the historic Stable Yard of Hatfield House — saffron rosewater scoops, pistachio baklava sandwiches, and estate garden strolls just 5 minutes from WGC.",
            "tags": [
                "Darlish",
                "Hatfield House",
                "Stable Yard",
                "Baklava Sandwich",
                "Hertfordshire Local",
                "Great Northern Line"
            ]
        },
        {
            "name": "Knoops (St Albans)",
            "url": "https://knoops.com/pages/store-locations",
            "category": "Ice Cream & Chocolates",
            "location": "12 Market Place, St Albans AL3 5DG",
            "region": "Hertfordshire (Local)",
            "lat": 51.7523,
            "lng": -0.3395,
            "description": "🍫 Luxury chocolate drink bar on St Albans historic Market Place — custom hot chocolates (28% to 100% cocoa), iced chocolate shakes, and chocolate soft serve.",
            "tags": [
                "Knoops",
                "St Albans",
                "Hot Chocolate",
                "Market Place",
                "Hertfordshire Local"
            ]
        },
        {
            "name": "Pavilion Bakery (Broadway Market)",
            "url": "https://pavilionbread.com/locations",
            "category": "Bakeries & Pastries",
            "location": "18 Broadway Market, Hackney, E8 4QJ",
            "region": "East London",
            "lat": 51.5372,
            "lng": -0.0609,
            "description": "🥐 Bustling Broadway Market artisan bakery: cardamom buns, sourdough loaves, cinnamon swirls, and craft espresso for a Regent's Canal stroll.",
            "tags": [
                "Pavilion Bakery",
                "Broadway Market",
                "Cardamom Buns",
                "Sourdough",
                "East London"
            ]
        },
        {
            "name": "Pavilion Bakery (Columbia Road)",
            "url": "https://pavilionbread.com/locations",
            "category": "Bakeries & Pastries",
            "location": "130 Columbia Rd, Shoreditch, E2 7RG",
            "region": "Central London",
            "lat": 51.5288,
            "lng": -0.0712,
            "description": "🥐 Historic Columbia Road bakery shop — grab fresh morning pastries, coffee, and sourdough before wandering the Sunday flower market.",
            "tags": [
                "Pavilion Bakery",
                "Columbia Road",
                "Flower Market",
                "Shoreditch",
                "Central London"
            ]
        },
        {
            "name": "Pavilion Bakery (Newington Green)",
            "url": "https://pavilionbread.com/locations",
            "category": "Bakeries & Pastries",
            "location": "78 Newington Green, London N16 9PX",
            "region": "North London",
            "lat": 51.5516,
            "lng": -0.0864,
            "description": "🥐 Charming neighborhood bakery on Newington Green serving sourdough breads, flaky pastries, and filter coffee near Clissold Park.",
            "tags": [
                "Pavilion Bakery",
                "Newington Green",
                "Clissold Park",
                "Coffee & Bun",
                "North London"
            ]
        },
        {
            "name": "Paulie's London (Shoreditch)",
            "url": "https://paulieslondon.com/#menu",
            "category": "Dinner & Dining",
            "location": "144-146 Commercial St, Shoreditch, E1 6NU",
            "region": "Central London",
            "lat": 51.5204,
            "lng": -0.0765,
            "description": "🥪 NYC-style Italian-American deli and cocktail bar on Commercial Street — famous hot pastrami sandwiches, smash burgers, chicken parm hero subs, and cocktails.",
            "tags": [
                "Paulies",
                "NYC Deli",
                "Pastrami",
                "Commercial Street",
                "Shoreditch"
            ]
        },
        {
            "name": "Dark Sugars Chocolates (Brick Lane)",
            "url": "https://www.darksugars.co.uk/",
            "category": "Ice Cream & Chocolates",
            "location": "141 Brick Lane, Shoreditch, E1 6SB",
            "region": "Central London",
            "lat": 51.5222,
            "lng": -0.0718,
            "description": "🍫 World-famous Ghanaian cocoa house on Brick Lane — renowned for hot chocolates heaped with giant mountains of shaved chocolate curls and handcrafted truffles.",
            "tags": [
                "Dark Sugars",
                "Hot Chocolate",
                "Shaved Chocolate",
                "Brick Lane",
                "Shoreditch"
            ]
        },
        {
            "name": "Dark Sugars Cocoa House (Greenwich)",
            "url": "https://www.darksugars.co.uk/",
            "category": "Ice Cream & Chocolates",
            "location": "9 Nelson Road, Greenwich, SE10 9JB",
            "region": "South London",
            "lat": 51.4819,
            "lng": -0.0098,
            "description": "🍫 Multi-floor cocoa house in Greenwich town centre right by the market — signature shaved hot chocolates, chilli chocolates, vegan truffles, and rich coffees.",
            "tags": [
                "Dark Sugars",
                "Cocoa House",
                "Greenwich Market",
                "Greenwich Park",
                "Hot Chocolate"
            ]
        },
        {
            "name": "Dark Sugars Ice Creams (Greenwich)",
            "url": "https://www.darksugars.co.uk/",
            "category": "Ice Cream & Chocolates",
            "location": "21 Nelson Road, Greenwich, SE10 9JB",
            "region": "South London",
            "lat": 51.4818,
            "lng": -0.0092,
            "description": "🍨 Luxury chocolate gelato parlour next to Greenwich Park gates — dark cocoa gelato, passionfruit chocolate cones, and handmade waffle creations.",
            "tags": [
                "Dark Sugars",
                "Ice Cream",
                "Chocolate Gelato",
                "Greenwich Park",
                "South London"
            ]
        },
        {
            "name": "The Arch Climbing Wall (Bermondsey / London Bridge)",
            "url": "https://www.archclimbingwall.com/",
            "category": "Rock Climbing & Bouldering",
            "location": "Drummond Rd, Bermondsey (near London Bridge)",
            "region": "Central London",
            "lat": 51.4947,
            "lng": -0.0632,
            "description": "🧗 Iconic East London bouldering centre set inside a historic Victorian biscuit factory — airy high-ceiling arches, social coffee bar, and routes for all levels.",
            "tags": [
                "Bouldering",
                "The Arch",
                "Bermondsey",
                "Biscuit Factory",
                "Active Date"
            ]
        },
        {
            "name": "VauxWall Climbing Centre (Vauxhall Station)",
            "url": "https://vauxwall.co.uk/",
            "category": "Rock Climbing & Bouldering",
            "location": "Arch 46-47a, South Lambeth Rd, Vauxhall (Victoria Line)",
            "region": "Central London",
            "lat": 51.4852,
            "lng": -0.1228,
            "description": "🧗 Atmospheric bouldering centre built inside Victorian railway arches directly under Vauxhall station on the Victoria line — air conditioned, friendly community, and craft coffee.",
            "tags": [
                "Bouldering",
                "VauxWall",
                "Vauxhall Station",
                "Victoria Line",
                "Railway Arches"
            ]
        },
        {
            "name": "Yonder Climbing & Cafe (Blackhorse Road)",
            "url": "https://thisisyonder.com/",
            "category": "Rock Climbing & Bouldering",
            "location": "4-6 Hookers Rd, Blackhorse Road (Victoria Line)",
            "region": "North London",
            "lat": 51.5878,
            "lng": -0.041,
            "description": "🧗 Multi-faceted creative community hub by Blackhorse Road station featuring vast bouldering walls, artisan bakery, specialty coffee, and natural wine bar.",
            "tags": [
                "Bouldering",
                "Yonder",
                "Blackhorse Road",
                "Victoria Line",
                "Bakery & Climbing"
            ]
        },
        {
            "name": "Topgolf Watford",
            "url": "https://topgolf.com/uk/watford/",
            "category": "Mini Golf & Topgolf",
            "location": "A41 Bushey Mill Lane, Watford WD24 7GW",
            "region": "Hertfordshire (Local)",
            "lat": 51.6775,
            "lng": -0.3755,
            "description": "⛳ Multi-level high-tech driving range with microchipped golf balls, interactive target scoring games, heated bays, burgers, and craft cocktails.",
            "tags": [
                "Topgolf",
                "Watford",
                "Driving Range",
                "Target Golf",
                "Hertfordshire Local"
            ]
        },
        {
            "name": "Topgolf Chigwell (Essex)",
            "url": "https://topgolf.com/uk/chigwell/",
            "category": "Mini Golf & Topgolf",
            "location": "Abridge Rd, Chigwell, Essex IG7 6BX",
            "region": "Day Trips & Beyond",
            "lat": 51.6285,
            "lng": 0.0885,
            "description": "⛳ High-tech interactive golf bays with neon outfield targets, climate-controlled hitting lounges, sports bar menu, and social game modes.",
            "tags": [
                "Topgolf",
                "Chigwell",
                "Essex",
                "Tech Golf",
                "Heated Bays"
            ]
        },
        {
            "name": "WatchHouse (Covent Garden & Seven Dials)",
            "url": "https://watchhouse.com/",
            "category": "Coffee & Cafes",
            "location": "Upper St Martin's Lane, Covent Garden",
            "region": "Central London",
            "lat": 51.5127,
            "lng": -0.1264,
            "description": "☕ Modern design-led 'Modern Coffee' sanctuary serving rare micro-lot espresso, pour-overs, brunch plates, and house pastries in a sculptural interior.",
            "tags": [
                "WatchHouse",
                "Specialty Coffee",
                "Covent Garden",
                "Micro-lot",
                "Piccadilly Line"
            ]
        },
        {
            "name": "Monmouth Coffee Company (Borough & Covent Garden)",
            "url": "https://www.monmouthcoffee.co.uk/",
            "category": "Coffee & Cafes",
            "location": "27 Monmouth St, Covent Garden / Borough Market",
            "region": "Central London",
            "lat": 51.5137,
            "lng": -0.1276,
            "description": "☕ London's legendary specialty coffee pioneer since 1978 — world-class pour-over filter coffees, artisanal single-origin beans, and freshly baked croissants.",
            "tags": [
                "Monmouth Coffee",
                "Seven Dials",
                "Specialty Coffee",
                "Pioneer",
                "Central London"
            ]
        },
        {
            "name": "Omotesando Koffee (Fitzrovia)",
            "url": "https://ooo-koffee.com/",
            "category": "Coffee & Cafes",
            "location": "8 Newman St, Fitzrovia (near Tottenham Court Rd)",
            "region": "Central London",
            "lat": 51.5168,
            "lng": -0.136,
            "description": "☕ Minimalist Japanese cube-design espresso bar from Tokyo serving pristine iced cappuccinos and signature baked custard kashi cubes.",
            "tags": [
                "Omotesando Koffee",
                "Japanese Coffee",
                "Iced Cappuccino",
                "Fitzrovia",
                "Central London"
            ]
        },
        {
            "name": "Kiss the Hippo Coffee (Fitzrovia & King's Cross)",
            "url": "https://kissthehippo.com/",
            "category": "Coffee & Cafes",
            "location": "George's House, 51 Margaret St, Oxford Circus",
            "region": "Central London",
            "lat": 51.5165,
            "lng": -0.1415,
            "description": "☕ Certified B-Corp organic specialty roaster serving velvety flat whites, single-origin pour overs, and matcha lattes steps from Oxford Circus.",
            "tags": [
                "Kiss the Hippo",
                "Organic Coffee",
                "Oxford Circus",
                "Victoria Line",
                "Specialty Coffee"
            ]
        },
        {
            "name": "The Comedy Store (Leicester Square)",
            "url": "https://london.thecomedystore.co.uk/",
            "category": "Comedy Clubs",
            "location": "1a Oxendon St, London SW1Y 4EE",
            "region": "Central London",
            "lat": 51.51,
            "lng": -0.1315,
            "description": "🎤 London's premier and most famous comedy club right in Leicester Square — featuring top-tier stand-up comedians and legendary improv nights.",
            "tags": [
                "Comedy Store",
                "Stand Up",
                "Leicester Square",
                "Live Comedy"
            ]
        },
        {
            "name": "Top Secret Comedy Club (Covent Garden)",
            "url": "https://thetopsecretcomedyclub.co.uk/",
            "category": "Comedy Clubs",
            "location": "170 Drury Ln, London WC2B 5PD",
            "region": "Central London",
            "lat": 51.5152,
            "lng": -0.1235,
            "description": "😂 Highly rated subterranean comedy club in Covent Garden — known for big-name surprise guests trying out new material in an intimate setting.",
            "tags": [
                "Top Secret",
                "Comedy",
                "Covent Garden",
                "Stand Up"
            ]
        },
        {
            "name": "Up the Creek Comedy Club (Greenwich)",
            "url": "https://upthecreekcomedy.co.uk/",
            "category": "Comedy Clubs",
            "location": "302 Creek Rd, London SE10 9SW",
            "region": "South London",
            "lat": 51.4816,
            "lng": -0.0135,
            "description": "🎤 Vibrant, lively comedy club in the heart of Greenwich — grab a pint and enjoy hilarious local and touring stand-up acts.",
            "tags": [
                "Up the Creek",
                "Comedy",
                "Greenwich",
                "Stand Up"
            ]
        },
        {
            "name": "Ann's Smart School of Cookery",
            "url": "https://www.annsmartschool.com/",
            "category": "Cooking Classes",
            "location": "Unit 3, West India Quay, London E14 4AL",
            "region": "East London",
            "lat": 51.5074,
            "lng": -0.021,
            "description": "🍳 Interactive hands-on cooking classes — learn to make professional-grade sushi, dim sum, or Italian feasts in a fun, relaxed kitchen environment.",
            "tags": [
                "Cooking Class",
                "Canary Wharf",
                "Food Experience"
            ]
        },
        {
            "name": "ZSL London Zoo (Regent's Park)",
            "url": "https://www.londonzoo.org/",
            "category": "Zoos & Farms",
            "location": "Regent's Park, London NW1 4RY",
            "region": "Central London",
            "lat": 51.5353,
            "lng": -0.1534,
            "description": "🦁 Iconic scientific zoo set in Regent's Park — wander through the Land of the Lions, Penguin Beach, and the tropical Rainforest Life exhibit.",
            "tags": [
                "London Zoo",
                "Animals",
                "Regent's Park",
                "Nature"
            ]
        },
        {
            "name": "SEA LIFE London Aquarium",
            "url": "https://www.visitsealife.com/london/",
            "category": "Zoos & Farms",
            "location": "County Hall, Westminster Bridge Rd, London SE1 7PB",
            "region": "Central London",
            "lat": 51.502,
            "lng": -0.1195,
            "description": "🦈 Explore the deep blue right on the South Bank — walk through the glass ocean tunnel, see sharks, penguins, and vibrant coral reefs.",
            "tags": [
                "Aquarium",
                "Sea Life",
                "South Bank",
                "Marine Biology"
            ]
        },
        {
            "name": "Hertfordshire Zoo (Paradise Wildlife Park)",
            "url": "https://hertfordshirezoo.com/",
            "category": "Zoos & Farms",
            "location": "White Stubbs Ln, Broxbourne EN10 7QA",
            "region": "Hertfordshire (Local)",
            "lat": 51.738,
            "lng": -0.046,
            "description": "🐅 Premier zoo in Hertfordshire famous for its big cats, red pandas, and the sprawling World of Dinosaurs animatronic trail.",
            "tags": [
                "Zoo",
                "Hertfordshire",
                "Big Cats",
                "Animals",
                "Broxbourne"
            ]
        }
        ,
        {
            "name": "Arcadia Games",
            "url": "https://www.arcadiagames.co.uk",
            "category": "Board Games",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5129521,
            "lng": -0.1130357,
            "description": "🎲 Board game club.",
            "tags": [
          "Board Games",
          "Gaming"
            ]
        }        ,
        {
            "name": "Draughts - Waterloo",
            "url": "https://www.draughtslondon.com",
            "category": "Board Games",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5017821,
            "lng": -0.1154534,
            "description": "🎲 Board game cafe and licensed restaurant under the arches.",
            "tags": [
          "Board Games",
          "Cafe",
          "Waterloo"
            ]
        }        ,
        {
            "name": "Otter Chaos",
            "url": "https://otterchaos.co.uk",
            "category": "Board Games",
            "location": "South London",
            "region": "South London",
            "lat": 51.4628998,
            "lng": -0.1134693,
            "description": "🎲 Board game club.",
            "tags": [
          "Board Games",
          "Gaming"
            ]
        }        ,
        {
            "name": "Stonecutters Lane",
            "url": "",
            "category": "Quirky & Shops",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5066886,
            "lng": -0.0921076,
            "description": "🛍️ Shopping Centre.",
            "tags": [
          "Shopping"
            ]
        }        ,
        {
            "name": "Anatomie Studio London",
            "url": "",
            "category": "Active & Social Sports",
            "location": "South London",
            "region": "South London",
            "lat": 51.4750996,
            "lng": -0.0565537,
            "description": "💪 Alternative gym and studio.",
            "tags": [
          "Gym",
          "Fitness"
            ]
        }        ,
        {
            "name": "Four Quarters Peckham",
            "url": "https://fourquarters.bar",
            "category": "Video Games & Arcades",
            "location": "South London",
            "region": "South London",
            "lat": 51.4680069,
            "lng": -0.0670145,
            "description": "🕹️ Retro arcade bar in Peckham.",
            "tags": [
          "Arcade",
          "Bar",
          "Peckham"
            ]
        }        ,
        {
            "name": "Cable Street Studios",
            "url": "",
            "category": "Quirky & Shops",
            "location": "East London",
            "region": "East London",
            "lat": 51.5112951,
            "lng": -0.0432546,
            "description": "🎨 Creative workspace and studios.",
            "tags": [
          "Studios",
          "Creative"
            ]
        }        ,
        {
            "name": "Daunt Books Marylebone",
            "url": "https://dauntbooks.co.uk/",
            "category": "Quirky & Shops",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5204371,
            "lng": -0.1522504,
            "description": "📚 Beautiful Edwardian bookshop.",
            "tags": [
          "Books",
          "Marylebone"
            ]
        }        ,
        {
            "name": "Cecil Court",
            "url": "https://www.cecilcourt.co.uk/",
            "category": "Quirky & Shops",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5107273,
            "lng": -0.1276572,
            "description": "📚 Historic alleyway famous for antiquarian bookshops.",
            "tags": [
          "Books",
          "History"
            ]
        }        ,
        {
            "name": "Foyles",
            "url": "https://www.foyles.co.uk/",
            "category": "Quirky & Shops",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5142726,
            "lng": -0.130083,
            "description": "📚 Massive multi-story bookshop.",
            "tags": [
          "Books",
          "Reading"
            ]
        }        ,
        {
            "name": "BookBar Islington",
            "url": "https://bookbaruk.com/",
            "category": "Quirky & Shops",
            "location": "North London",
            "region": "North London",
            "lat": 51.560263,
            "lng": -0.0987492,
            "description": "📚 Book shop and wine bar.",
            "tags": [
          "Books",
          "Wine",
          "Islington"
            ]
        }        ,
        {
            "name": "Bad Moon Cafe",
            "url": "https://www.badmooncafe.co.uk/",
            "category": "Board Games",
            "location": "South London",
            "region": "South London",
            "lat": 51.4966026,
            "lng": -0.0883479,
            "description": "🎲 Tabletop gaming cafe and bar.",
            "tags": [
          "Board Games",
          "Cafe",
          "Tabletop"
            ]
        }        ,
        {
            "name": "Loading Bar",
            "url": "https://loading.bar/",
            "category": "Video Games & Arcades",
            "location": "North London",
            "region": "North London",
            "lat": 51.5605692,
            "lng": -0.0740582,
            "description": "🕹️ Cocktail bar with board games and video games.",
            "tags": [
          "Arcade",
          "Bar",
          "Gaming"
            ]
        }        ,
        {
            "name": "The Brotherhood Games Cafe",
            "url": "https://brotherhoodgames.co.uk/",
            "category": "Board Games",
            "location": "South London",
            "region": "South London",
            "lat": 51.4938,
            "lng": -0.0716,
            "description": "🃏 Trading Card Shop and cafe.",
            "tags": [
          "Trading Cards",
          "Games"
            ]
        }        ,
        {
            "name": "Zombie Games Cafe & Bar",
            "url": "https://www.zombiegamescafe.com/",
            "category": "Board Games",
            "location": "North London",
            "region": "North London",
            "lat": 51.5839,
            "lng": -0.1541,
            "description": "🃏 Trading Card Shop and gaming space.",
            "tags": [
          "Trading Cards",
          "Games"
            ]
        }        ,
        {
            "name": "Dark Sphere Shepherd's Bush Gaming Centre",
            "url": "https://www.darksphere.co.uk/",
            "category": "Board Games",
            "location": "West London",
            "region": "West London",
            "lat": 51.5037,
            "lng": -0.2227,
            "description": "🎲 Hobby shop and gaming centre.",
            "tags": [
          "Hobby",
          "Tabletop",
          "Shepherd's Bush"
            ]
        }        ,
        {
            "name": "Notting Hill Book & Comic Exchange",
            "url": "https://www.bookcomicexchange.com/",
            "category": "Quirky & Shops",
            "location": "West London",
            "region": "West London",
            "lat": 51.5097,
            "lng": -0.1978,
            "description": "📚 Comic book shop.",
            "tags": [
          "Comics",
          "Books",
          "Notting Hill"
            ]
        }        ,
        {
            "name": "Gosh! Comics",
            "url": "https://goshlondon.com/",
            "category": "Quirky & Shops",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5135,
            "lng": -0.1328,
            "description": "📚 Comic book shop in Soho.",
            "tags": [
          "Comics",
          "Soho"
            ]
        }        ,
        {
            "name": "Forbidden Planet London Megastore",
            "url": "https://forbiddenplanet.com/",
            "category": "Quirky & Shops",
            "location": "Central London",
            "region": "Central London",
            "lat": 51.5147,
            "lng": -0.1293,
            "description": "📚 Massive comic book and collectibles store.",
            "tags": [
          "Comics",
          "Collectibles"
            ]
        }        ,
        {
            "name": "The Thieves",
            "url": "https://thethieves.co.uk/",
            "category": "Bars & Speakeasies",
            "location": "South London",
            "region": "South London",
            "lat": 51.4503,
            "lng": -0.0818,
            "description": "🍻 Cosy local pub.",
            "tags": [
          "Pub",
          "Drinks"
            ]
        }        ,
        {
            "name": "Ink@84 Books",
            "url": "https://www.ink84bookshop.co.uk/",
            "category": "Quirky & Shops",
            "location": "North London",
            "region": "North London",
            "lat": 51.5583,
            "lng": -0.1018,
            "description": "📚 Independent bookshop.",
            "tags": [
          "Books",
          "Independent"
            ]
        }        ,
        {
            "name": "The Arcanist's Tavern: Gaming Café",
            "url": "https://www.arcaniststavern.uk/",
            "category": "Board Games",
            "location": "East London",
            "region": "East London",
            "lat": 51.5235,
            "lng": -0.0768,
            "description": "🎲 Board game club and fantasy tavern.",
            "tags": [
          "Board Games",
          "Tavern"
            ]
        }
        ,
        {
            "name": "Plonk Golf (Hackney & Borough Market)",
            "url": "https://plonkgolf.co.uk/",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.5422828,
            "lng": -0.0578349,
            "description": "",
            "tags": [
          "Crazy Golf",
          "Hackney",
          "Borough Market"
            ]
        }        ,
        {
            "name": "Swingers (West End & City)",
            "url": "https://swingers.club/uk",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.5144,
            "lng": -0.1416,
            "description": "",
            "tags": [
          "Crazy Golf",
          "West End",
          "City"
            ]
        }        ,
        {
            "name": "Puttshack (White City & Bank)",
            "url": "https://puttshack.com/uk",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.5092547,
            "lng": -0.2232658,
            "description": "",
            "tags": [
          "Crazy Golf",
          "White City",
          "Bank"
            ]
        }        ,
        {
            "name": "Junkyard Golf Club (Shoreditch)",
            "url": "https://www.junkyardgolfclub.co.uk/london",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.5218,
            "lng": -0.0784,
            "description": "",
            "tags": [
          "Crazy Golf",
          "Shoreditch"
            ]
        }        ,
        {
            "name": "Putt In The Park",
            "url": "https://www.puttinthepark.com/",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.4616713,
            "lng": -0.2012615,
            "description": "",
            "tags": [
          "Crazy Golf",
          "Outdoors"
            ]
        }        ,
        {
            "name": "Birdies at Roof East (Stratford)",
            "url": "https://www.playbirdies.com/",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.5428,
            "lng": -0.0006,
            "description": "",
            "tags": [
          "Crazy Golf",
          "Stratford",
          "Roof East"
            ]
        }        ,
        {
            "name": "Minigolf by Craig & Karl (Canary Wharf)",
            "url": "https://canarywharf.com/whats-on/minigolf-by-craig-karl/",
            "category": "Crazy Golf",
            "location": "London",
            "region": "London",
            "lat": 51.5045,
            "lng": -0.0195,
            "description": "",
            "tags": [
          "Crazy Golf",
          "Canary Wharf"
            ]
        }        ,
        {
            "name": "Axeperience Axe Throwing (Tower Hill)",
            "url": "https://axeperience.co.uk/",
            "category": "Axe Throwing",
            "location": "London",
            "region": "London",
            "lat": 51.5111,
            "lng": -0.0748,
            "description": "",
            "tags": [
          "Axe Throwing",
          "Tower Hill"
            ]
        }        ,
        {
            "name": "Game of Throwing (Hammersmith)",
            "url": "https://www.gameofthrowing.co.uk/axe-throwing-london",
            "category": "Axe Throwing",
            "location": "London",
            "region": "London",
            "lat": 51.4927113,
            "lng": -0.2321833,
            "description": "",
            "tags": [
          "Axe Throwing",
          "Hammersmith"
            ]
        }        ,
        {
            "name": "Boom Battle Bar (Liverpool Street)",
            "url": "https://boombattlebar.com/uk/london-liverpool-street",
            "category": "Axe Throwing",
            "location": "London",
            "region": "London",
            "lat": 51.5173,
            "lng": -0.0813,
            "description": "",
            "tags": [
          "Axe Throwing",
          "Liverpool Street"
            ]
        },
        {
            "name": "Rogues Quarter",
            "url": "https://www.roguesquarter.com/",
            "category": "Board Games",
            "location": "North London",
            "region": "North London",
            "lat": 51.5500379,
            "lng": -0.1516648,
            "description": "☕ Coffee shop and gaming space.",
            "tags": [
                "Board Games",
                "Coffee",
                "Kentish Town"
            ]
        }
    ]
},

  footer: {
    note: '&copy; <span class="year"></span> Alec &middot; date.alec.today &middot; All rights reserved.',
    credit: 'Powered by <a href="https://alec.today/" target="_blank" rel="noopener noreferrer">Alec Doran-Twyford (Alectronic&trade;)</a>',
    emoji: '🎮❤️🎮',
    wishlistUrl: 'https://gift.alec.today/'
  },

  easterEgg: {
    toastTitle: '1-UP!', toastBody: "It's a secret to everybody.", toastSub: '🍄 +30 lives · you found the cheat code 🎮', emojis: [
      '❤️',
      '🍄',
      '⭐',
      '🎮'
    ]
  }
};
