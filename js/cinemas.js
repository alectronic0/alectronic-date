// Cinema Discovery Map & Engine with Integrated Transit Networks, Official Chain Logos & Film Societies
(function () {
    'use strict';

    let map = null;
    let markersLayer = null;
    let societyMarkersLayer = null;
    let primaryTransitLayer = null;
    let coreTransitLayer = null;
    let tertiaryTransitLayer = null;
    let stationMarkersLayer = null;
    let cinemas = [];
    let activeChain = 'All';
    let searchQuery = '';
    let selectedId = null;
    let currentRenderLimit = 60;

    const CHAIN_COLORS = {
        'Everyman': '#e6a979',
        'Curzon': '#a855f7',
        'Picturehouse': '#ff6b8a',
        'BFI': '#7fc2a6',
        'Rooftop Film Club': '#ff3366',
        'ODEON': '#00b4d8',
        'Cineworld': '#f77f00',
        'Vue': '#e63946',
        'Independent': '#ffd166',
        'Film Society': '#c084fc',
        'Omniplex': '#9b5de5',
        'The Light': '#48cae4'
    };

    const CHAIN_LOGOS = {
        'Everyman': 'img/logos/everyman.png',
        'Curzon': 'img/logos/curzon.png',
        'Picturehouse': 'img/logos/picturehouse.png',
        'BFI': 'img/logos/bfi.svg',
        'Rooftop Film Club': 'img/logos/rooftop-film-club.png',
        'ODEON': 'img/logos/odeon.png',
        'Cineworld': 'img/logos/cineworld.png',
        'Vue': 'img/logos/vue.png',
        'Omniplex': 'img/logos/omniplex.png',
        'The Light': 'img/logos/the-light.png'
    };

    const PREFERRED_CHAIN_ORDER = [
        'All',
        'Everyman',
        'Curzon',
        'Picturehouse',
        'BFI',
        'Independent',
        'Film Society',
        'Rooftop Film Club',
        'ODEON',
        'Cineworld',
        'Vue',
        'Omniplex',
        'The Light'
    ];

    function boot() {
        const mapEl = document.getElementById('map');
        if (typeof L === 'undefined' || typeof window.CINEMAS_DATA === 'undefined' || !mapEl) {
            setTimeout(boot, 50);
            return;
        }
        initCinemasApp();
    }

    function initCinemasApp() {
        if (map) return; // Prevent double initialization

        // Map Setup centered between Greater London and Home Counties
        map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([51.5074, -0.1278], 11);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        markersLayer = L.layerGroup().addTo(map);
        societyMarkersLayer = L.layerGroup().addTo(map); // Hybrid Film Society Layer (On by default)
        primaryTransitLayer = L.layerGroup().addTo(map); // On by default
        coreTransitLayer = L.layerGroup().addTo(map);    // On by default
        tertiaryTransitLayer = L.layerGroup();           // Off by default
        stationMarkersLayer = L.layerGroup().addTo(map); // Dynamic stations

        const overlayMaps = {
            "🎬 Cinema Venues": markersLayer,
            "🎟️ Film Societies & Clubs": societyMarkersLayer,
            "🚆 Primary Commute (Great Northern)": primaryTransitLayer,
            "🚇 Core Tube & Overground": coreTransitLayer,
            "🟣 Tertiary & Regional Routes (Thameslink, Elizabeth, SWR, London Bridge/Kent, Cambridge)": tertiaryTransitLayer
        };

        // Canals & Rivers
        if (window.CANALS_GEOJSON) {
            const canalLayer = L.geoJSON(window.CANALS_GEOJSON, {
                style: {
                    color: '#3498db',
                    weight: 2.5,
                    opacity: 0.75
                }
            });
            overlayMaps["🌊 Canals & Rivers"] = canalLayer;
        }

        // Add Layer Control
        L.control.layers(null, overlayMaps, { position: 'topright' }).addTo(map);

        map.on('overlayadd overlayremove', function () {
            updateActiveStations();
        });

        setTimeout(() => {
            if (map) map.invalidateSize();
        }, 200);

        cinemas = Array.isArray(window.CINEMAS_DATA) ? window.CINEMAS_DATA : [];

        renderTransitLayers();
        renderChainPills();
        setupSearch();
        setupMobileToggle();
        applyFilters();
    }

    function renderTransitLayers() {
        const data = window.CONTENT && window.CONTENT.dateIdeas;
        const t = data && data.transit;
        if (!t || !map) return;

        if (primaryTransitLayer) primaryTransitLayer.clearLayers();
        if (coreTransitLayer) coreTransitLayer.clearLayers();
        if (tertiaryTransitLayer) tertiaryTransitLayer.clearLayers();
        if (stationMarkersLayer) stationMarkersLayer.clearLayers();

        // 1. Home Base Marker (Welwyn Garden City)
        if (t.home && primaryTransitLayer) {
            const homeIcon = L.divIcon({
                className: 'home-marker-icon',
                html: `<div style="background:#e6a979; color:#160d14; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; border:2.5px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,0.4);">🏡</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });

            L.marker([t.home.lat, t.home.lng], { icon: homeIcon, zIndexOffset: 1000 })
                .bindPopup(`
                    <div style="font-family:'Poppins',sans-serif; min-width:200px;">
                        <span style="font-size:0.75rem; background:#e6a979; color:#160d14; padding:2px 8px; border-radius:4px; font-weight:700;">🏡 Home Base</span>
                        <h4 style="margin:4px 0; color:#1a1320; font-size:1rem;">${escapeHTML(t.home.name)}</h4>
                        <p style="font-size:0.82rem; color:#555; margin:0;">${escapeHTML(t.home.description)}</p>
                    </div>
                `)
                .addTo(primaryTransitLayer);
        }

        // 2. Office Marker (Deliveroo Tech HQ)
        if (t.office && primaryTransitLayer) {
            const officeIcon = L.divIcon({
                className: 'office-marker-icon',
                html: `<div style="background:#00cdbc; color:#fff; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; border:2.5px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,0.4);">💼</div>`,
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });

            L.marker([t.office.lat, t.office.lng], { icon: officeIcon, zIndexOffset: 1000 })
                .bindPopup(`
                    <div style="font-family:'Poppins',sans-serif; min-width:200px;">
                        <span style="font-size:0.75rem; background:#ccfbf1; color:#0f766e; padding:2px 8px; border-radius:4px; font-weight:700;">💼 Deliveroo Tech HQ</span>
                        <h4 style="margin:4px 0; color:#1a1320; font-size:1rem;">${escapeHTML(t.office.name)}</h4>
                        <p style="font-size:0.82rem; color:#555; margin:0;">${escapeHTML(t.office.description)}</p>
                    </div>
                `)
                .addTo(primaryTransitLayer);
        }

        // 3. Draw Route Polylines
        if (t.lines && t.lines.length > 0) {
            t.lines.forEach(line => {
                let targetLayer = coreTransitLayer;
                if (line.tier === 'primary') targetLayer = primaryTransitLayer;
                else if (line.tier === 'tertiary') targetLayer = tertiaryTransitLayer;

                if (!targetLayer) return;

                const branchLists = line.branches || [line.stations];
                branchLists.forEach(branch => {
                    const coords = branch.map(s => [s.lat, s.lng]);
                    if (coords.length > 1) {
                        L.polyline(coords, {
                            color: line.color,
                            weight: line.style === 'dashed' ? 3.5 : 3,
                            opacity: 0.82,
                            dashArray: line.style === 'dashed' ? '8, 5' : null
                        }).addTo(targetLayer);
                    }
                });
            });
        }

        updateActiveStations();
    }

    function updateActiveStations() {
        const data = window.CONTENT && window.CONTENT.dateIdeas;
        const t = data && data.transit;
        if (!t || !stationMarkersLayer || !map) return;

        stationMarkersLayer.clearLayers();

        const visibleLines = [];
        if (primaryTransitLayer && map.hasLayer(primaryTransitLayer)) {
            visibleLines.push(...(t.lines || []).filter(l => l.tier === 'primary'));
        }
        if (coreTransitLayer && map.hasLayer(coreTransitLayer)) {
            visibleLines.push(...(t.lines || []).filter(l => l.tier === 'core' || !l.tier));
        }
        if (tertiaryTransitLayer && map.hasLayer(tertiaryTransitLayer)) {
            visibleLines.push(...(t.lines || []).filter(l => l.tier === 'tertiary'));
        }

        if (visibleLines.length === 0) return;

        const stationIndex = {};
        visibleLines.forEach(line => {
            line.stations.forEach(st => {
                const key = `${st.lat.toFixed(4)},${st.lng.toFixed(4)}`;
                if (!stationIndex[key]) {
                    stationIndex[key] = { name: st.name, lat: st.lat, lng: st.lng, type: st.type, note: st.note, lines: [] };
                }
                if (!stationIndex[key].lines.some(l => l.shortName === (line.shortName || line.name))) {
                    stationIndex[key].lines.push({ shortName: line.shortName || line.name, color: line.color });
                }
                const rank = { origin: 4, terminus: 3, interchange: 2, station: 1 };
                if ((rank[st.type] || 0) > (rank[stationIndex[key].type] || 0)) {
                    stationIndex[key].type = st.type;
                }
                if (st.note && !stationIndex[key].note) stationIndex[key].note = st.note;
            });
        });

        Object.values(stationIndex).forEach(st => {
            const isTerminus = st.type === 'terminus' || st.type === 'origin';
            const isInterchange = st.type === 'interchange';
            const multiLine = st.lines.length > 1;
            const primaryColor = st.lines[0].color;

            const size = isTerminus ? 22 : (isInterchange || multiLine) ? 20 : 16;
            const bg = isTerminus ? primaryColor : '#ffffff';
            const textCol = isTerminus ? '#ffffff' : primaryColor;
            const borderCol = multiLine ? '#333' : primaryColor;

            const stIcon = L.divIcon({
                className: 'train-station-icon',
                html: `<div style="background:${bg}; color:${textCol}; width:${size}px; height:${size}px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:${size * 0.52}px; border:2px solid ${borderCol}; box-shadow:0 2px 5px rgba(0,0,0,0.25);" title="${escapeHTML(st.name)}">🚆</div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
            });

            const lineChips = st.lines.map(l => `<span style="background:${l.color}20; color:${l.color}; border:1px solid ${l.color}60; padding:1px 5px; border-radius:3px; font-size:0.7rem; font-weight:700;">${escapeHTML(l.shortName)}</span>`).join(' ');

            L.marker([st.lat, st.lng], { icon: stIcon, zIndexOffset: 200 })
                .bindPopup(`
                    <div style="font-family:'Poppins',sans-serif; min-width:180px;">
                        <h4 style="margin:0 0 4px 0; color:#1a1320; font-size:0.95rem;">🚆 ${escapeHTML(st.name)}</h4>
                        <div style="display:flex; flex-wrap:wrap; gap:3px; margin-bottom:4px;">${lineChips}</div>
                        ${st.note ? `<p style="font-size:0.78rem; color:#666; margin:0;">${escapeHTML(st.note)}</p>` : ''}
                    </div>
                `)
                .addTo(stationMarkersLayer);
        });
    }

    function renderChainPills() {
        const container = document.getElementById('chain-pills');
        const bottomContainer = document.getElementById('bottom-chain-pills');
        if (!container && !bottomContainer) return;

        // Calculate counts per chain
        const chainCounts = {};
        cinemas.forEach(c => {
            const chain = c.chain || 'Independent';
            chainCounts[chain] = (chainCounts[chain] || 0) + 1;
        });

        const orderedChains = [];
        PREFERRED_CHAIN_ORDER.forEach(chainName => {
            if (chainName === 'All' || chainCounts[chainName]) {
                orderedChains.push(chainName);
            }
        });
        Object.keys(chainCounts).forEach(k => {
            if (!orderedChains.includes(k)) {
                orderedChains.push(k);
            }
        });

        const fullOptions = orderedChains.map(chain => {
            const count = chain === 'All' ? cinemas.length : (chainCounts[chain] || 0);
            return {
                name: chain,
                count: count,
                label: `${chain} (${count})`
            };
        });

        [container, bottomContainer].forEach(target => {
            if (!target) return;
            target.innerHTML = '';

            fullOptions.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = `filter-btn pill ${activeChain === opt.name ? 'active' : ''}`;
                btn.type = 'button';
                btn.setAttribute('data-chain', opt.name);
                btn.style.display = 'inline-flex';
                btn.style.alignItems = 'center';
                btn.style.gap = '6px';

                let iconHTML = '';
                if (opt.name === 'All') {
                    iconHTML = '<span>🌟</span>';
                } else if (opt.name === 'Independent') {
                    iconHTML = '<span style="font-size:14px;">✨</span>';
                } else if (opt.name === 'Film Society') {
                    iconHTML = '<span style="font-size:14px;">🎟️</span>';
                } else if (CHAIN_LOGOS[opt.name]) {
                    iconHTML = `<img src="${CHAIN_LOGOS[opt.name]}" alt="" style="width:14px; height:14px; object-fit:contain; border-radius:2px;">`;
                } else {
                    iconHTML = '<span>🎬</span>';
                }

                btn.innerHTML = `${iconHTML} <span>${escapeHTML(opt.label)}</span>`;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    activeChain = opt.name;
                    document.querySelectorAll('.filter-btn.pill').forEach(p => {
                        p.classList.toggle('active', p.getAttribute('data-chain') === opt.name);
                    });
                    currentRenderLimit = 60;
                    applyFilters();
                });
                target.appendChild(btn);
            });
        });
    }

    function setupSearch() {
        const input = document.getElementById('search');
        if (!input) return;

        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.trim().toLowerCase();
                currentRenderLimit = 60;
                applyFilters();
            }, 100);
        });
    }

    function applyFilters() {
        let filtered = cinemas;

        // Filter by chain
        if (activeChain !== 'All') {
            filtered = filtered.filter(c => (c.chain || 'Independent').toLowerCase() === activeChain.toLowerCase());
        }

        // Search query filter
        if (searchQuery !== '') {
            filtered = filtered.filter(c => {
                const name = (c.name || c.title || '').toLowerCase();
                const chain = (c.chain || '').toLowerCase();
                const chainName = (c.chainName || '').toLowerCase();
                const location = (c.location || c.address || '').toLowerCase();
                const postcode = (c.postcode || '').toLowerCase();
                const w3w = (c.what3words || '').toLowerCase();
                const parking = (c.parking || '').toLowerCase();
                const desc = (c.description || '').toLowerCase();
                const features = Array.isArray(c.features) ? c.features.join(' ').toLowerCase() : '';
                const food = Array.isArray(c.foodAndDrink) ? c.foodAndDrink.join(' ').toLowerCase() : '';

                return name.includes(searchQuery) ||
                       chain.includes(searchQuery) ||
                       chainName.includes(searchQuery) ||
                       location.includes(searchQuery) ||
                       postcode.includes(searchQuery) ||
                       w3w.includes(searchQuery) ||
                       parking.includes(searchQuery) ||
                       desc.includes(searchQuery) ||
                       features.includes(searchQuery) ||
                       food.includes(searchQuery);
            });
        }

        const mapCount = filtered.filter(c => c.lat && c.lng).length;
        updateCount(filtered.length, mapCount);
        renderCinemaList(filtered);
        renderMapMarkers(filtered);
    }

    function updateCount(totalCount, mapCount) {
        const countEl = document.getElementById('results-count');
        if (countEl) {
            if (totalCount === 0) {
                countEl.innerHTML = `Showing <strong>0</strong> venues / societies`;
            } else {
                countEl.innerHTML = `Showing <strong>${totalCount.toLocaleString()}</strong> venues & societies (<strong>${mapCount.toLocaleString()}</strong> on map)`;
            }
        }
    }

    function renderCinemaList(list) {
        const container = document.getElementById('cinema-list');
        if (!container) return;
        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align:center; padding:var(--space-6) var(--space-4); color:var(--muted); background:var(--surface); border:1px dashed var(--border); border-radius:var(--radius); margin:var(--space-4);">
                    <div style="font-size:2.2rem; margin-bottom:8px;">🎬</div>
                    <h3 style="font-size:1.1rem; color:var(--text); margin-bottom:6px;">No cinemas or film societies found</h3>
                    <p style="font-size:0.85rem; line-height:1.4;">${cinemas.length === 0 ? 'Data is loading or empty.' : 'Try adjusting your search query or chain filter.'}</p>
                </div>
            `;
            return;
        }

        const toRender = list.slice(0, currentRenderLimit);

        toRender.forEach(c => {
            const card = document.createElement('div');
            card.className = `activity-card ${selectedId === c.id ? 'selected' : ''}`;
            card.id = `card-${c.id}`;
            card.addEventListener('click', () => focusCinema(c));

            const chainColor = CHAIN_COLORS[c.chain] || 'var(--gold)';
            const isIndie = (c.chain || 'Independent') === 'Independent';
            const isSoc = c.chain === 'Film Society';
            const iconSrc = c.icon || CHAIN_LOGOS[c.chain];

            let badgeIconHTML = '';
            if (isSoc) {
                badgeIconHTML = '<span>🎟️</span>';
            } else if (isIndie) {
                badgeIconHTML = '<span>✨</span>';
            } else if (iconSrc) {
                badgeIconHTML = `<img src="${iconSrc}" alt="" style="width:16px; height:16px; object-fit:contain; border-radius:3px;">`;
            } else {
                badgeIconHTML = '<span>🎬</span>';
            }

            const featuresHTML = Array.isArray(c.features) && c.features.length > 0
                ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">
                    ${c.features.map(f => `<span style="font-size:0.72rem; background:rgba(255,255,255,0.06); color:var(--muted); padding:2px 6px; border-radius:4px; border:1px solid var(--border);">${escapeHTML(f)}</span>`).join('')}
                   </div>`
                : '';

            const what3wordsHTML = c.what3words
                ? `<div style="margin-top:4px;">
                    <a href="https://what3words.com/${c.what3words.replace('///', '')}" target="_blank" rel="noopener" style="font-size:0.76rem; color:#e11d48; text-decoration:none; font-weight:700; background:rgba(225,29,72,0.1); border:1px solid rgba(225,29,72,0.3); padding:2px 6px; border-radius:4px; display:inline-flex; align-items:center; gap:3px;" onclick="event.stopPropagation();">
                        📍 ${escapeHTML(c.what3words)} ↗
                    </a>
                   </div>`
                : '';

            const parkingHTML = c.parking
                ? `<div style="font-size:0.78rem; color:var(--muted); margin-top:4px; display:flex; align-items:flex-start; gap:4px;">
                    <span>🅿️</span>
                    <span style="line-height:1.3;">${escapeHTML(c.parking)}</span>
                   </div>`
                : '';

            const screensBreakdownHTML = Array.isArray(c.screensList) && c.screensList.length > 0
                ? `<details style="margin-top:6px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:4px; padding:4px 8px; font-size:0.75rem;" onclick="event.stopPropagation();">
                    <summary style="cursor:pointer; color:var(--accent-light); font-weight:600;">View Screen Breakdown (${c.screensList.length} screens)</summary>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:6px;">
                        ${c.screensList.map(s => `
                            <div style="background:rgba(0,0,0,0.2); padding:3px 6px; border-radius:3px; border:1px solid rgba(255,255,255,0.05);">
                                <strong>${escapeHTML(s.screen)}:</strong> ${s.capacity ? `${s.capacity} seats` : ''} ${s.wheelchair ? `(${s.wheelchair} ♿)` : ''}
                            </div>
                        `).join('')}
                    </div>
                   </details>`
                : '';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; gap:8px;">
                    <span class="source-badge" style="background:rgba(255,255,255,0.06); color:${chainColor}; border:1px solid ${chainColor}40; display:inline-flex; align-items:center; gap:6px;">
                        ${badgeIconHTML} ${escapeHTML(c.chainName || c.chain || 'Cinema')}
                    </span>
                    ${c.screens ? `<span style="font-size:0.75rem; color:var(--mint); background:rgba(78,205,196,0.15); padding:2px 8px; border-radius:999px; font-weight:700; border:1px solid rgba(78,205,196,0.3);">🎦 ${c.screens} ${c.screens === 1 ? 'Screen' : 'Screens'}</span>` : ''}
                </div>

                <h3 style="margin:0 0 4px 0; font-size:1.08rem; color:var(--text); line-height:1.3; font-weight:700;">${escapeHTML(c.name || c.title || 'Cinema')}</h3>
                
                <div style="font-size:0.82rem; color:var(--muted); margin-bottom:4px; display:flex; flex-direction:column; gap:3px;">
                    <span>📍 ${escapeHTML(c.location || c.address || 'London')}</span>
                </div>

                ${what3wordsHTML}
                ${parkingHTML}
                ${featuresHTML}
                ${screensBreakdownHTML}

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; padding-top:8px; border-top:1px solid var(--border);">
                    ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener" class="back-link" style="padding:2px 8px; font-size:0.75rem; color:${chainColor};" onclick="event.stopPropagation();">Official Website ↗</a>` : '<span></span>'}
                    <span style="font-size:0.75rem; color:var(--accent-light); font-weight:600;">View on Map →</span>
                </div>
            `;
            container.appendChild(card);
        });

        // Load More button
        if (list.length > currentRenderLimit) {
            const moreBtn = document.createElement('button');
            moreBtn.className = 'btn-action btn-primary';
            moreBtn.style.cssText = 'margin: 12px auto; display: block; width: calc(100% - 32px); text-align: center; padding: 8px; font-size: 0.85rem;';
            moreBtn.textContent = `Show More (${list.length - currentRenderLimit} remaining)`;
            moreBtn.onclick = () => {
                currentRenderLimit += 60;
                renderCinemaList(list);
            };
            container.appendChild(moreBtn);
        }
    }

    function renderMapMarkers(list) {
        if (!markersLayer || !societyMarkersLayer) return;
        markersLayer.clearLayers();
        societyMarkersLayer.clearLayers();

        const mapItems = list.filter(c => c.lat && c.lng);
        if (mapItems.length === 0) return;

        mapItems.forEach(c => {
            const chainColor = CHAIN_COLORS[c.chain] || '#e6a979';
            const isIndie = (c.chain || 'Independent') === 'Independent';
            const isSoc = c.chain === 'Film Society';
            const iconSrc = c.icon || CHAIN_LOGOS[c.chain];

            let pinInner = '';
            if (isSoc) {
                pinInner = `<div style="background:#1a1320; border:2px solid ${chainColor}; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;">🎟️</div>`;
            } else if (isIndie) {
                pinInner = `<div style="background:#1a1320; border:2px solid ${chainColor}; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;">✨</div>`;
            } else if (iconSrc) {
                pinInner = `<div style="background:#1a1320; border:2px solid ${chainColor}; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; overflow:hidden; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;"><img src="${iconSrc}" alt="" style="width:20px; height:20px; object-fit:contain; border-radius:50%;"></div>`;
            } else {
                pinInner = `<div style="background:#1a1320; border:2px solid ${chainColor}; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 3px 8px rgba(0,0,0,0.5); cursor:pointer;">🎬</div>`;
            }
            
            const customIcon = L.divIcon({
                html: pinInner,
                className: 'custom-map-pin',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16]
            });

            const marker = L.marker([c.lat, c.lng], { icon: customIcon });

            const mapDirectionUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((c.name || c.title || 'Cinema') + ' ' + (c.location || c.address || 'London'))}`;

            const featuresPopup = Array.isArray(c.features) && c.features.length > 0
                ? `<div style="display:flex; flex-wrap:wrap; gap:3px; margin-top:6px;">
                    ${c.features.map(f => `<span style="font-size:0.68rem; background:#f0e6ee; color:#444; padding:1px 5px; border-radius:3px;">${escapeHTML(f)}</span>`).join('')}
                   </div>`
                : '';

            const w3wPopup = c.what3words
                ? `<div style="margin-top:4px;">
                    <a href="https://what3words.com/${c.what3words.replace('///', '')}" target="_blank" rel="noopener" style="font-size:0.75rem; color:#e11d48; text-decoration:none; font-weight:700;">
                        📍 ${escapeHTML(c.what3words)} ↗
                    </a>
                   </div>`
                : '';

            const parkingPopup = c.parking
                ? `<p style="margin:4px 0 0 0; color:#444; font-size:0.78rem; line-height:1.3;">
                    🅿️ <strong>Parking:</strong> ${escapeHTML(c.parking)}
                   </p>`
                : '';

            let popupBadgeIcon = '';
            if (isSoc) {
                popupBadgeIcon = '<span>🎟️</span>';
            } else if (isIndie) {
                popupBadgeIcon = '<span>✨</span>';
            } else if (iconSrc) {
                popupBadgeIcon = `<img src="${iconSrc}" alt="" style="width:14px; height:14px; object-fit:contain; border-radius:2px;">`;
            } else {
                popupBadgeIcon = '<span>🎬</span>';
            }

            const popupContent = `
                <div style="min-width:230px; max-width:290px; font-family:'Poppins', sans-serif;">
                    <div style="display:inline-flex; align-items:center; gap:5px; font-size:0.72rem; color:${chainColor}; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:3px; font-weight:700;">
                        ${popupBadgeIcon} ${escapeHTML(c.chainName || c.chain || 'Cinema')}
                    </div>
                    <h4 style="margin:0 0 6px 0; color:#1a1320; font-size:1.02rem; line-height:1.25; font-weight:700;">
                        ${escapeHTML(c.name || c.title || 'Cinema')}
                    </h4>
                    <p style="margin:0 0 4px 0; color:#555; font-size:0.82rem; line-height:1.35;">
                        📍 ${escapeHTML(c.location || c.address || 'London')}
                    </p>
                    ${w3wPopup}
                    ${parkingPopup}
                    ${c.screens ? `<p style="margin:4px 0 0 0; color:#2e7d32; font-size:0.8rem; font-weight:700;">🎦 ${c.screens} ${c.screens === 1 ? 'Screen' : 'Screens'}</p>` : ''}
                    ${featuresPopup}
                    <div style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;">
                        ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener" style="display:inline-block; background:#1a1320; color:#fff; text-decoration:none; padding:5px 10px; border-radius:4px; font-size:0.75rem; font-weight:600;">Website ↗</a>` : ''}
                        <a href="${mapDirectionUrl}" target="_blank" rel="noopener" style="display:inline-block; background:rgba(230,169,121,0.2); color:#994ea8; border:1px solid #994ea8; text-decoration:none; padding:5px 10px; border-radius:4px; font-size:0.75rem; font-weight:600;">Directions ↗</a>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', () => {
                selectedId = c.id;
                highlightCard(c.id);
            });

            if (isSoc) {
                societyMarkersLayer.addLayer(marker);
            } else {
                markersLayer.addLayer(marker);
            }
        });
    }

    function focusCinema(c) {
        selectedId = c.id;
        document.querySelectorAll('.activity-card').forEach(card => card.classList.remove('selected'));
        const card = document.getElementById(`card-${c.id}`);
        if (card) card.classList.add('selected');

        if (c.lat && c.lng && map) {
            map.flyTo([c.lat, c.lng], 15, { duration: 0.8 });
            // Open popup from either markersLayer or societyMarkersLayer
            const findLayer = (layerGroup) => {
                layerGroup.eachLayer(layer => {
                    if (layer.getLatLng && Math.abs(layer.getLatLng().lat - c.lat) < 0.0001 && Math.abs(layer.getLatLng().lng - c.lng) < 0.0001) {
                        layer.openPopup();
                    }
                });
            };
            if (markersLayer) findLayer(markersLayer);
            if (societyMarkersLayer) findLayer(societyMarkersLayer);
        }

        // On mobile, switch to map view
        if (window.innerWidth <= 768) {
            setMobileView('map');
        }
    }

    function highlightCard(id) {
        document.querySelectorAll('.activity-card').forEach(card => card.classList.remove('selected'));
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.classList.add('selected');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Mobile View Toggle
    function setMobileView(view) {
        const appLayout = document.querySelector('.app-layout');
        const toggleMapBtn = document.getElementById('toggle-map-btn');
        const toggleListBtn = document.getElementById('toggle-list-btn');

        if (view === 'list') {
            if (appLayout) appLayout.classList.add('view-list');
            document.body.classList.add('view-list');
            if (toggleListBtn) {
                toggleListBtn.classList.add('active');
                toggleListBtn.setAttribute('aria-selected', 'true');
            }
            if (toggleMapBtn) {
                toggleMapBtn.classList.remove('active');
                toggleMapBtn.setAttribute('aria-selected', 'false');
            }
        } else {
            if (appLayout) appLayout.classList.remove('view-list');
            document.body.classList.remove('view-list');
            if (toggleMapBtn) {
                toggleMapBtn.classList.add('active');
                toggleMapBtn.setAttribute('aria-selected', 'true');
            }
            if (toggleListBtn) {
                toggleListBtn.classList.remove('active');
                toggleListBtn.setAttribute('aria-selected', 'false');
            }
            setTimeout(() => {
                if (map) map.invalidateSize();
            }, 200);
        }
    }

    function setupMobileToggle() {
        const toggleMapBtn = document.getElementById('toggle-map-btn');
        const toggleListBtn = document.getElementById('toggle-list-btn');

        if (toggleMapBtn) {
            toggleMapBtn.addEventListener('click', () => setMobileView('map'));
        }
        if (toggleListBtn) {
            toggleListBtn.addEventListener('click', () => setMobileView('list'));
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Bootloader: runs when DOM and dependencies are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
