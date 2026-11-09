// Discovery Engine — generic map + filter pills + searchable list + transit overlay
//
// Extracted from js/cinemas.js, js/workshops.js and js/london_activities.js.
// Each tool calls Discovery.create(config) with its own data, HTML callbacks,
// map settings and facets. All shared logic (filter, search, marker render,
// list render with show-more, pill wiring, count update, mobile toggle, transit
// layers, focus/highlight) lives here.
//
// Dependencies (loaded before this file):
//   - Leaflet (L) global
//   - js/lib/mobile-toggle.js (window.MobileToggle)
(function () {
    'use strict';

    // ─── Helpers ────────────────────────────────────────────────────────────

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function debounce(fn, ms) {
        var timer;
        return function (e) {
            clearTimeout(timer);
            timer = setTimeout(function () { fn(e); }, ms);
        };
    }

    // Default search: substring-OR across record fields.
    function defaultSearch(records, query) {
        if (!query) return records;
        var q = query.toLowerCase();
        return records.filter(function (r) {
            return Object.keys(r).some(function (k) {
                var v = r[k];
                if (v == null) return false;
                if (Array.isArray(v)) v = v.join(' ');
                return String(v).toLowerCase().indexOf(q) !== -1;
            });
        });
    }

    // ─── create(config) ─────────────────────────────────────────────────────
    //
    // config = {
    //   mount: {
    //     map: 'map', list: 'cinema-list',
    //     search: 'search', count: 'results-count',
    //     pills: { el: 'chain-pills', bottom: 'bottom-chain-pills' }
    //   },
    //   data:  window.CINEMAS_DATA,
    //   map:   { center: [51.5, -0.12], zoom: 11, maxZoom: 18, minZoom: 9 },
    //   facets: [{
    //     id: 'chain',
    //     valueOf: r => r.chain || 'Independent',
    //     preferredOrder: ['All','Everyman',...],
    //     withLogos: false,
    //     colors: { Everyman: '#e6a979', ... },
    //     icons:  { Everyman: 'https://...' }
    //   }],
    //   label:  'venues & societies',  // shown in count line
    //   renderLimit: 60,
    //   renderIncrement: 60,
    //   marker:    r => ({ emoji:'🎬', color:'#e6a979' }),
    //   card:      r => '<div>...</div>',
    //   popup:     r => '<div>...</div>',
    //   overlays:  [{ name:'Canals', layer:L.geoJSON(...) }],
    //   transit:   false,
    //   transitIds: 'content-dateideas-transit',
    //   tileLayer:  url + options (see below)
    // }

    function create(config) {
        var data       = config.data || [];
        var facets     = config.facets || [];
        var label      = config.label || 'results';
        var RENDER_INC = config.renderIncrement || config.renderLimit || 60;

        // ── State ───────────────────────────────────────────────────────────
        var map            = null;
        var markersLayer   = null;
        var selectedId     = null;
        var filtered       = data.slice();
        var facetState     = {};  // { facetId: 'All' | '<value>' }
        var searchQuery    = '';
        var currentLimit   = config.renderLimit || 60;

        facets.forEach(function (f) { facetState[f.id] = 'All'; });

        // ── Map ─────────────────────────────────────────────────────────────
        var mapOpts = config.map || {};
        var mapEl   = document.getElementById(config.mount.map);
        if (!mapEl) return;

        map = L.map(config.mount.map, {
            zoomControl:        true,
            scrollWheelZoom:    true,
            attributionControl: true
        }).setView(mapOpts.center || [51.5074, -0.1278], mapOpts.zoom || 11);

        L.tileLayer(
            (config.tileLayer && config.tileLayer.url) ||
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            Object.assign({
                attribution: '&copy; OpenStreetMap contributors | Tiles: OSM',
                maxZoom: mapOpts.maxZoom || 18,
                minZoom: mapOpts.minZoom || 9
            }, (config.tileLayer && config.tileLayer.options) || {})
        ).addTo(map);

        markersLayer = L.layerGroup().addTo(map);

        // ── Custom overlays (canals, etc.) ──────────────────────────────────
        var customOverlayLayers = [];
        var overlayMaps = {};
        (config.overlays || []).forEach(function (ov) {
            customOverlayLayers.push(ov.layer);
            overlayMaps[ov.name] = ov.layer;
        });

        // ── Layer control ───────────────────────────────────────────────────
        var controlLayers = {};
        if (customOverlayLayers.length) {
            controlLayers = overlayMaps;
        }
        if (Object.keys(controlLayers).length) {
            L.control.layers(null, controlLayers, { collapsed: false }).addTo(map);
        }

        // ── Transit ─────────────────────────────────────────────────────────
        var transitLayers = null;
        if (config.transit) {
            transitLayers = {
                primary:       L.layerGroup(),
                core:          L.layerGroup(),
                tertiary:      L.layerGroup(),
                stations:      L.layerGroup().addTo(map),
                homeLayer:     null,
                officeLayer:   null
            };
            renderTransitLayers();
        }

        // ── Pills ───────────────────────────────────────────────────────────
        facets.forEach(function (f) { renderPills(f); });

        // ── Search ──────────────────────────────────────────────────────────
        setupSearch();

        // ── Mobile toggle ───────────────────────────────────────────────────
        if (window.MobileToggle) {
            window.MobileToggle.setup();
        }

        // ── Initial render ──────────────────────────────────────────────────
        applyFilters();

        // ─── Internal functions ──────────────────────────────────────────────

        function applyFilters() {
            filtered = data.slice();

            // Apply each facet
            facets.forEach(function (f) {
                var val = facetState[f.id];
                if (val === 'All') return;
                var key = f.id;
                filtered = filtered.filter(function (r) {
                    return (r[key] || f.defaultValue || '').toLowerCase() === val.toLowerCase();
                });
            });

            // Search
            if (searchQuery) {
                if (config.matches) {
                    filtered = config.matches(filtered, searchQuery);
                } else {
                    filtered = defaultSearch(filtered, searchQuery);
                }
            }

            var mapCount = filtered.filter(function (r) {
                return r.lat && r.lng;
            }).length;

            updateCount(filtered.length, mapCount);
            renderList(filtered);
            renderMarkers(filtered);
        }

        function updateCount(total, mapCount) {
            var el = document.getElementById(config.mount.count);
            if (!el) return;
            if (total === 0) {
                el.innerHTML = 'Showing <strong>0</strong> ' + label;
            } else {
                el.innerHTML = 'Showing <strong>' + total.toLocaleString() + '</strong> ' +
                    label + ' (<strong>' + mapCount.toLocaleString() + '</strong> on map)';
            }
        }

        // ── Pill rendering ──────────────────────────────────────────────────

        function renderPills(facet) {
            var container   = document.getElementById(config.mount.pills && config.mount.pills.el ? config.mount.pills.el : config.mount.pills);
            var bottomEl    = (config.mount.pills && config.mount.pills.bottom)
                ? document.getElementById(config.mount.pills.bottom)
                : null;

            var targets = [container, bottomEl].filter(Boolean);
            if (!targets.length) return;

            // Count per facet value
            var counts = {};
            data.forEach(function (r) {
                var v = facet.valueOf(r) || facet.defaultValue || 'Other';
                counts[v] = (counts[v] || 0) + 1;
            });

            // Order: All first, then preferred order, then rest alphabetically
            var ordered = ['All'];
            (facet.preferredOrder || []).forEach(function (name) {
                if (name !== 'All' && counts[name]) ordered.push(name);
            });
            Object.keys(counts).sort().forEach(function (k) {
                if (ordered.indexOf(k) === -1) ordered.push(k);
            });

            targets.forEach(function (container) {
                if (!container) return;
                container.innerHTML = '';
                ordered.forEach(function (name) {
                    if (!counts[name] && name !== 'All') return;
                    var count = name === 'All' ? data.length : counts[name];
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'pill' + (facetState[facet.id] === name ? ' active' : '');

                    var iconHTML = '';
                    if (facet.withLogos && facet.icons && facet.icons[name]) {
                        iconHTML = '<img src="' + facet.icons[name] + '" alt="" style="width:14px;height:14px;object-fit:contain;border-radius:2px;vertical-align:-2px;"> ';
                    } else if (facet.emoji && facet.emoji[name]) {
                        iconHTML = facet.emoji[name] + ' ';
                    } else if (name === 'All') {
                        iconHTML = facet.allEmoji || '🌟 ';
                    }

                    btn.innerHTML = iconHTML + name + ' <span class="pill-count">' + count + '</span>';
                    btn.addEventListener('click', function () {
                        facetState[facet.id] = name;
                        currentLimit = RENDER_INC;
                        applyFilters();
                        renderPills(facet);
                    });
                    container.appendChild(btn);
                });
            });
        }

        // ── Search ──────────────────────────────────────────────────────────

        function setupSearch() {
            var input = document.getElementById(config.mount.search);
            if (!input) return;
            input.addEventListener('input', debounce(function (e) {
                searchQuery = e.target.value.trim().toLowerCase();
                currentLimit = RENDER_INC;
                applyFilters();
            }, 100));
        }

        // ── List rendering ──────────────────────────────────────────────────

        function renderList(list) {
            var container = document.getElementById(config.mount.list);
            if (!container) return;
            container.innerHTML = '';

            list.slice(0, currentLimit).forEach(function (r) {
                var div = document.createElement('div');
                div.className = 'activity-card';
                div.id = 'card-' + r.id;
                div.innerHTML = config.card(r, escapeHTML);
                div.addEventListener('click', function () {
                    focus(r);
                });
                container.appendChild(div);
            });

            if (list.length > currentLimit) {
                var more = document.createElement('button');
                more.className = 'btn-action btn-primary';
                more.style.cssText = 'margin:12px auto;display:block;width:calc(100% - 32px);text-align:center;padding:8px;font-size:0.85rem;';
                more.textContent = 'Show More (' + (list.length - currentLimit) + ' remaining)';
                more.onclick = function () {
                    currentLimit += RENDER_INC;
                    renderList(list);
                };
                container.appendChild(more);
            }
        }

        // ── Marker rendering ────────────────────────────────────────────────

        function renderMarkers(list) {
            if (!markersLayer) return;
            markersLayer.clearLayers();

            list.forEach(function (r) {
                if (!r.lat || !r.lng) return;
                var iconSpec = config.marker(r, escapeHTML);

                var customIcon = L.divIcon({
                    html: iconSpec.html || buildPinHTML(iconSpec),
                    className: 'custom-map-pin',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    popupAnchor: [0, -16]
                });

                var marker = L.marker([r.lat, r.lng], { icon: customIcon });
                marker.bindPopup(config.popup(r, escapeHTML));
                marker.on('click', function () {
                    selectedId = r.id;
                    highlightCard(r.id);
                });
                markersLayer.addLayer(marker);
            });
        }

        function buildPinHTML(spec) {
            var color = spec.color || '#e6a979';
            var emoji = spec.emoji || '📍';
            var iconSrc = spec.iconSrc || null;

            if (iconSrc) {
                return '<div style="background:#1a1320;border:2px solid ' + color +
                    ';border-radius:50%;width:32px;height:32px;display:flex;align-items:center;' +
                    'justify-content:center;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.5);' +
                    'cursor:pointer;"><img src="' + iconSrc + '" alt="" style="width:20px;height:20px;' +
                    'object-fit:contain;border-radius:50%;"></div>';
            }
            return '<div style="background:#1a1320;border:2px solid ' + color +
                ';border-radius:50%;width:32px;height:32px;display:flex;align-items:center;' +
                'justify-content:center;font-size:15px;box-shadow:0 3px 8px rgba(0,0,0,0.5);' +
                'cursor:pointer;">' + emoji + '</div>';
        }

        // ── Focus (click card → fly to marker) ──────────────────────────────

        function focus(r) {
            selectedId = r.id;
            highlightCard(r.id);
            if (r.lat && r.lng && map) {
                map.flyTo([r.lat, r.lng], 15, { duration: 0.8 });
                markersLayer.eachLayer(function (layer) {
                    if (layer.getLatLng &&
                        Math.abs(layer.getLatLng().lat - r.lat) < 0.0001 &&
                        Math.abs(layer.getLatLng().lng - r.lng) < 0.0001) {
                        layer.openPopup();
                    }
                });
            }
            if (window.MobileToggle && window.MobileToggle.isMobile()) {
                window.MobileToggle.setMobileView('map');
            }
        }

        function highlightCard(id) {
            var list = document.getElementById(config.mount.list);
            if (list) {
                list.querySelectorAll('.activity-card').forEach(function (c) {
                    c.classList.remove('selected');
                });
            }
            var card = document.getElementById('card-' + id);
            if (card) {
                card.classList.add('selected');
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        // ── Transit layers (from window.CONTENT.dateIdeas.transit) ──────────

        function renderTransitLayers() {
            if (!transitLayers) return;
            var data = window.CONTENT && window.CONTENT.dateIdeas;
            var t = data && data.transit;
            if (!t) return;

            // Home marker
            if (t.home) {
                var homeIcon = L.divIcon({
                    html: '<div style="background:#16a34a;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">🏠</div>',
                    className: 'custom-map-pin',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });
                transitLayers.homeLayer = L.marker([t.home.lat, t.home.lng], { icon: homeIcon })
                    .bindTooltip(t.home.label || 'Home', { permanent: false })
                    .addTo(transitLayers.stations);
            }

            // Office marker
            if (t.office) {
                var officeIcon = L.divIcon({
                    html: '<div style="background:#2563eb;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.4);">💼</div>',
                    className: 'custom-map-pin',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });
                transitLayers.officeLayer = L.marker([t.office.lat, t.office.lng], { icon: officeIcon })
                    .bindTooltip(t.office.label || 'Office', { permanent: false })
                    .addTo(transitLayers.stations);
            }

            // Route polylines
            (t.lines || []).forEach(function (line) {
                var branchLists = line.branches || [line.stations];
                branchLists.forEach(function (branch) {
                    var coords = branch
                        .filter(function (s) { return s.lat && s.lng; })
                        .map(function (s) { return [s.lat, s.lng]; });
                    if (coords.length < 2) return;

                    var layer = transitLayers.core;
                    if (line.tier === 'primary') layer = transitLayers.primary;
                    if (line.tier === 'tertiary') layer = transitLayers.tertiary;

                    L.polyline(coords, {
                        color: line.color || '#888',
                        weight: line.tier === 'primary' ? 4 : 2.5,
                        opacity: 0.7,
                        dashArray: line.dashed ? '6 4' : null
                    }).addTo(layer);
                });
            });

            updateActiveStations();
        }

        function updateActiveStations() {
            if (!transitLayers || !transitLayers.stations) return;
            var data = window.CONTENT && window.CONTENT.dateIdeas;
            var t = data && data.transit;
            if (!t || !t.stations) return;

            // Rebuild station markers (toggling transit layers on/off via
            // Leaflet's layer-control doesn't re-run this — stations were
            // added once during boot. Keep it simple.)
            transitLayers.stations.clearLayers();
            (t.stations || []).forEach(function (st) {
                if (!st.lat || !st.lng) return;
                var primaryColor = (st.lines && st.lines[0] && st.lines[0].color) || '#888';
                var isTerminus   = st.type === 'terminus' || st.type === 'origin';
                var isInterchange = st.type === 'interchange' || (st.lines && st.lines.length > 1);
                var size = isTerminus ? 22 : isInterchange ? 20 : 16;
                var bg = isTerminus ? primaryColor : '#fff';
                var textCol = isTerminus ? '#fff' : primaryColor;

                var stIcon = L.divIcon({
                    html: '<div style="background:' + bg + ';border:2px solid ' + primaryColor +
                        ';border-radius:50%;width:' + size + 'px;height:' + size + 'px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:' + textCol +
                        ';box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;">' +
                        escapeHTML(st.shortName || st.name || '') + '</div>',
                    className: 'custom-map-pin',
                    iconSize: [size, size],
                    iconAnchor: [size / 2, size / 2]
                });

                var chipHTML = (st.lines || []).map(function (l) {
                    return '<span style="background:' + (l.color || '#888') + '20;color:' + (l.color || '#888') +
                        ';border:1px solid ' + (l.color || '#888') + '60;padding:1px 5px;border-radius:3px;font-size:0.7rem;font-weight:700;">' +
                        escapeHTML(l.shortName || '') + '</span>';
                }).join(' ');

                var m = L.marker([st.lat, st.lng], { icon: stIcon })
                    .bindTooltip(st.name + (chipHTML ? ' ' + chipHTML : ''), { direction: 'top', offset: [0, -6] });
                transitLayers.stations.addLayer(m);
            });
        }

        // ─── Public API (for tools that need to reach in) ────────────────────
        return {
            map:          map,
            markersLayer: markersLayer,
            applyFilters: applyFilters,
            focus:        focus,
            escapeHTML:   escapeHTML
        };
    }

    // ─── Expose on window ───────────────────────────────────────────────────
    window.Discovery = { create: create };
})();
