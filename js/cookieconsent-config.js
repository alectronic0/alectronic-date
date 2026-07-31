window.addEventListener('load', function() {
    if (typeof CookieConsent === 'undefined') return;

    function handleConsentUpdate() {
        const analyticsAccepted = CookieConsent.acceptedCategory('analytics');
        const preferencesAccepted = CookieConsent.acceptedCategory('preferences');

        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': analyticsAccepted ? 'granted' : 'denied'
            });
        }

        // Clean up analytics cookies if rejected/revoked
        if (!analyticsAccepted) {
            const cookies = document.cookie.split(';');
            const domain = window.location.hostname;
            const parts = domain.split('.');
            const rootDomain = parts.length > 1 ? parts.slice(-2).join('.') : domain;

            cookies.forEach(function(c) {
                const name = c.split('=')[0].trim();
                if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain + ';';
                    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + rootDomain + ';';
                }
            });
        }

        // Remove alec-date-prompts from localStorage if preferences category is rejected/revoked
        if (!preferencesAccepted) {
            try {
                localStorage.removeItem('alec-date-prompts');
            } catch (e) {}
        }
    }

    CookieConsent.run({
        autoClearCookies: true,
        guiOptions: {
            consentModal: {
                layout: 'box',
                position: 'bottom left',
                equalWeightButtons: true,
                flipButtons: false
            },
            preferencesModal: {
                layout: 'box',
                position: 'left',
                equalWeightButtons: true,
                flipButtons: false
            }
        },
        categories: {
            necessary: {
                readOnly: true
            },
            preferences: {
                autoClear: {
                    cookies: []
                }
            },
            analytics: {
                autoClear: {
                    cookies: [
                        { name: /^(_ga|_gid|_gat|_ga_.*)/ }
                    ]
                }
            }
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
                                description: "Saves your dating preferences (<code>alec-date-prompts</code>) locally in your browser so you can pick up where you left off. If rejected, this data is erased.",
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
        onAccept: handleConsentUpdate,
        onChange: handleConsentUpdate
    });

    // Bind floating cookie button strictly to open the initial consent modal
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.cookie-floating-btn') || e.target.closest('[data-cc="show-preferencesModal"]');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof CookieConsent !== 'undefined' && typeof CookieConsent.show === 'function') {
                CookieConsent.show(true);
            }
        }
    }, true);
});
