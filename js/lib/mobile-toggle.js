// Mobile map/list view switcher.
//
// Extracted verbatim in behaviour from cinemas.js / workshops.js /
// london_activities.js, which each carried their own identical copy.
//
// Toggles the `view-list` class on `.app-layout` and <body>, and keeps the two
// floating tab buttons' `active` class and aria-selected in sync.
(function () {
    'use strict';

    var MOBILE_BREAKPOINT = 768;

    // setMobileView('map' | 'list', ids?)
    // ids defaults to the toggle button ids every page already uses.
    function setMobileView(view, ids) {
        var mapBtnId = (ids && ids.map) || 'toggle-map-btn';
        var listBtnId = (ids && ids.list) || 'toggle-list-btn';

        var appLayout = document.querySelector('.app-layout');
        var toggleMapBtn = document.getElementById(mapBtnId);
        var toggleListBtn = document.getElementById(listBtnId);

        var wantList = view === 'list';

        if (appLayout) appLayout.classList.toggle('view-list', wantList);
        document.body.classList.toggle('view-list', wantList);

        setActive(toggleListBtn, wantList);
        setActive(toggleMapBtn, !wantList);
    }

    function setActive(btn, isActive) {
        if (!btn) return;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }

    // Wire the two toggle buttons. Safe to call when the buttons are absent.
    function setup(ids) {
        var mapBtnId = (ids && ids.map) || 'toggle-map-btn';
        var listBtnId = (ids && ids.list) || 'toggle-list-btn';

        var toggleMapBtn = document.getElementById(mapBtnId);
        var toggleListBtn = document.getElementById(listBtnId);

        if (toggleMapBtn) {
            toggleMapBtn.addEventListener('click', function () {
                setMobileView('map', ids);
            });
        }
        if (toggleListBtn) {
            toggleListBtn.addEventListener('click', function () {
                setMobileView('list', ids);
            });
        }
    }

    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    window.MobileToggle = {
        setMobileView: setMobileView,
        setup: setup,
        isMobile: isMobile,
        BREAKPOINT: MOBILE_BREAKPOINT
    };
})();
