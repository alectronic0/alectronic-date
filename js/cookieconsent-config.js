window.addEventListener('load', function() {
    if (typeof CookieConsent === 'undefined') return;

    CookieConsent.run({
        guiOptions: {
            consentModal: {
                layout: 'box',
                position: 'bottom right',
                equalWeightButtons: true,
                flipButtons: false
            },
            preferencesModal: {
                layout: 'box',
                position: 'right',
                equalWeightButtons: true,
                flipButtons: false
            }
        },
        categories: {
            necessary: {
                readOnly: true
            },
            preferences: {},
            analytics: {}
        },
        language: {
            default: 'en',
            translations: {
                en: {
                    consentModal: {
                        title: "🍪 Would you like some cookies?... Yes, Boring GDPR Stuff🙄",
                        description: "💬 <b>The obligatory bit before the fun.</b><br><br>Before we get to the fun stuff, we need to talk about consent. 🛑<br>These cookies quietly help me understand how people explore this site, so I know what's actually working (and what's not).<br><br>• 🚫 No ads.<br>• 💰 No data selling.<br>• 🙅‍♂️ No funny business.<br><br>Just honest, anonymous stats. If you're okay with the cookies, go for it! If you're not, that's completely fine too. I want to be upfront from the start (just like I'll try to be if this goes any further).",
                        acceptAllBtn: "Yes Please! Gimme the cookies 🍪",
                        acceptNecessaryBtn: "🙅‍♂️ No thanks! I don't want cookies",
                        showPreferencesBtn: "⚙️ Cookie settings"
                    },
                    preferencesModal: {
                        title: "🍪 Cookie Settings & Vault",
                        acceptAllBtn: "Yes Please! Gimme the cookies 🍪",
                        acceptNecessaryBtn: "🙅‍♂️ No thanks! I don't want cookies",
                        savePreferencesBtn: "Save Settings",
                        closeIconLabel: "Close",
                        sections: [
                            {
                                title: "🍪 About These Cookies",
                                description: "• <b>Cookies:</b> Tiny text files, zero calories, helping the site run smarter.<br>• <b>The Law:</b> Essential ones run automatically; everything else requires asking nicely.<br>• <b>Third Parties:</b> Google Analytics for background stats.<br>• <b>Change of heart?</b> You can change your mind anytime via Cookie Settings in the footer.<br>• <b>Privacy Questions:</b> Email <code>privacy@alectronic.co</code> — I'm a real person trying to find my Player 2, not a faceless corporation. 🎮"
                            },
                            {
                                title: "⚙️ Necessary Cookies",
                                description: "The bare essentials. Without these, the site cannot load, forms won't work, and we can't even get past the first screen. The law lets me keep these on by default. 🛠️",
                                category: "necessary"
                            },
                            {
                                title: "🎨 Preferences Cookies",
                                description: "Saves your dating preferences (<code>alec-date-prompts</code>) locally in your browser so you can pick up where you left off. I only ever see this if you choose to send it to me — via email, WhatsApp, or another message platform.",
                                category: "preferences"
                            },
                            {
                                title: "📊 Statistics Cookies",
                                description: "These tell me how people use the site—like which pages get clicked and where people get stuck. It is entirely anonymous, helping me improve the experience for everyone. 📊",
                                category: "analytics"
                            }
                        ]
                    }
                }
            }
        },
        onAccept: function() {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied'
                });
            }
        },
        onChange: function() {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied'
                });
            }
        }
    });
});
