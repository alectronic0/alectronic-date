// London Activities Discovery Map & Engine (High Precision)
(function () {
    'use strict';

    // Map Setup
    const map = L.map('map').setView([51.5136, -0.1365], 13); // Center on Soho / Central London
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    let activities = [];
    let activeCategory = 'All';
    let activeSource = 'all';
    let activePrice = 'All';
    let activeLocationFilter = 'All'; // 'All' vs 'Pinned'
    let searchQuery = '';
    let selectedId = null;

    const categories = [
        { label: '🌟 All Activities', value: 'All' },
        { label: '📍 Map Pinned Only', value: 'Pinned' },
        { label: '✨ Free Only', value: 'Free' },
        { label: '🍸 Bars & Nightlife', value: 'Bars & Nightlife' },
        { label: '🎭 Theatre & Shows', value: 'Theatre & Shows' },
        { label: '🎵 Music & Gigs', value: 'Music & Gigs' },
        { label: '🎨 Art & Exhibitions', value: 'Art & Exhibitions' },
        { label: '🍕 Food & Drink', value: 'Food & Drink' },
        { label: '🌳 Parks & Outdoors', value: 'Parks & Outdoors' },
        { label: '🏛️ Attractions', value: 'Attractions & Sightseeing' },
        { label: '📖 Curated Guides', value: 'Curated Guide' }
    ];

    const priceTiers = [
        { label: '💰 All Prices', value: 'All' },
        { label: '✨ Free Admission', value: 'Free' },
        { label: '🏷️ Paid / Ticketed', value: 'Paid' }
    ];

    // Initialize dataset
    if (window.LONDON_ACTIVITIES_DATA && Array.isArray(window.LONDON_ACTIVITIES_DATA)) {
        activities = window.LONDON_ACTIVITIES_DATA;
        initUI();
    } else {
        const listEl = document.getElementById('activity-list');
        if (listEl) {
            listEl.innerHTML = `
                <div style="color:var(--rose-light); padding:15px; border:1px solid rgba(255,107,138,0.3); border-radius:8px; background:rgba(255,107,138,0.1);">
                    <strong>Data Notice:</strong> Activities dataset is loading or not found.<br>
                    Ensure <code>london_activities_geo.js</code> is present.
                </div>`;
        }
    }

    function initUI() {
        renderCategoryPills();
        renderPricePills();
        setupSearch();
        setupSourceFilters();
        setupMobileToggle();
        applyFilters();
    }

    function renderCategoryPills() {
        const container = document.getElementById('category-pills');
        if (!container) return;
        container.innerHTML = '';

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `pill ${activeCategory === cat.value ? 'active' : ''}`;
            btn.textContent = cat.label;
            btn.type = 'button';
            btn.onclick = () => {
                activeCategory = cat.value;
                document.querySelectorAll('#category-pills .pill').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            };
            container.appendChild(btn);
        });
    }

    function renderPricePills() {
        const container = document.getElementById('price-pills');
        if (!container) return;
        container.innerHTML = '';

        priceTiers.forEach(p => {
            const btn = document.createElement('button');
            btn.className = `pill ${activePrice === p.value ? 'active' : ''}`;
            btn.textContent = p.label;
            btn.type = 'button';
            btn.onclick = () => {
                activePrice = p.value;
                document.querySelectorAll('#price-pills .pill').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            };
            container.appendChild(btn);
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('search');
        if (!searchInput) return;

        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.toLowerCase().trim();
                applyFilters();
            }, 200);
        });
    }

    let currentRenderLimit = 100;

    function setupSourceFilters() {
        const pills = document.querySelectorAll('#source-pills .pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const src = pill.getAttribute('data-source');
                if (activeSource === src) {
                    pill.classList.remove('active');
                    activeSource = 'all';
                } else {
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    activeSource = src;
                }
                currentRenderLimit = 100;
                applyFilters();
            });
        });
    }

    function applyFilters() {
        let filtered = activities;

        // Source filter
        if (activeSource !== 'all') {
            filtered = filtered.filter(a => a.source.toLowerCase() === activeSource.toLowerCase());
        }

        // Category filter
        if (activeCategory === 'Pinned') {
            filtered = filtered.filter(a => a.location_precision === 'exact' || a.location_precision === 'neighborhood');
        } else if (activeCategory === 'Free') {
            filtered = filtered.filter(a => a.is_free);
        } else if (activeCategory !== 'All') {
            filtered = filtered.filter(a => a.category === activeCategory);
        }

        // Price filter
        if (activePrice === 'Free') {
            filtered = filtered.filter(a => a.is_free);
        } else if (activePrice === 'Paid') {
            filtered = filtered.filter(a => !a.is_free);
        }

        // Search query
        if (searchQuery !== '') {
            filtered = filtered.filter(a => {
                return (a.title && a.title.toLowerCase().includes(searchQuery)) ||
                       (a.venue_name && a.venue_name.toLowerCase().includes(searchQuery)) ||
                       (a.area && a.area.toLowerCase().includes(searchQuery)) ||
                       (a.postcode && a.postcode.toLowerCase().includes(searchQuery)) ||
                       (a.description && a.description.toLowerCase().includes(searchQuery));
            });
        }

        const mapCount = filtered.filter(a => a.location_precision === 'exact' || a.location_precision === 'neighborhood').length;
        updateCount(filtered.length, mapCount);
        renderActivityList(filtered);
        renderMapMarkers(filtered);
    }

    function updateCount(totalCount, mapCount) {
        const countEl = document.getElementById('results-count');
        if (countEl) {
            countEl.innerHTML = `Showing <strong>${totalCount.toLocaleString()}</strong> activities (<strong>${mapCount.toLocaleString()}</strong> pinned on map)`;
        }
    }

    function renderActivityList(list) {
        const container = document.getElementById('activity-list');
        if (!container) return;
        container.innerHTML = '';

        if (list.length === 0) {
            container.innerHTML = '<p style="color: var(--muted); padding: var(--space-4);">No activities found matching your filters.</p>';
            return;
        }

        const toRender = list.slice(0, currentRenderLimit);
        toRender.forEach(act => {
            const card = document.createElement('div');
            card.className = `activity-card ${selectedId === act.id ? 'selected' : ''}`;
            card.id = `card-${act.id}`;
            card.onclick = () => focusActivity(act);

            let sourceClass = 'source-dmn';
            let sourceLabel = 'DesignMyNight';
            if (act.source === 'timeout') {
                sourceClass = 'source-timeout';
                sourceLabel = 'Time Out';
            } else if (act.source === 'secretlondon') {
                sourceClass = 'source-secretlondon';
                sourceLabel = 'Secret London';
            }

            const imgHTML = act.image_url ? `<img src="${act.image_url}" alt="${escapeHTML(act.title)}" class="activity-thumb" loading="lazy" onerror="this.style.display='none'">` : '';

            // Precision Badge
            let precisionBadge = `<span style="font-size:0.72rem; color:var(--muted-2); background:var(--surface-2); padding:1px 6px; border-radius:4px; border:1px solid var(--border);">🌍 London-Wide</span>`;
            if (act.location_precision === 'exact') {
                precisionBadge = `<span style="font-size:0.72rem; color:var(--mint); background:rgba(78,205,196,0.12); padding:1px 6px; border-radius:4px; border:1px solid rgba(78,205,196,0.3); font-weight:600;">📍 Exact Pin</span>`;
            } else if (act.location_precision === 'neighborhood') {
                precisionBadge = `<span style="font-size:0.72rem; color:var(--gold); background:rgba(230,169,121,0.12); padding:1px 6px; border-radius:4px; border:1px solid rgba(230,169,121,0.3); font-weight:600;">🏘️ ${escapeHTML(act.area || 'Neighborhood')}</span>`;
            }

            card.innerHTML = `
                ${imgHTML}
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; gap:8px;">
                    <span class="source-badge ${sourceClass}">${sourceLabel}</span>
                    ${act.is_free ? '<span class="source-badge free-pill">✨ FREE</span>' : (act.price_raw ? `<span style="font-size:0.8rem; color:var(--mint); font-weight:700;">${escapeHTML(act.price_raw)}</span>` : '')}
                </div>
                <h3 style="margin:0 0 6px 0; font-size:1.05rem; color:var(--text); line-height:1.3; font-weight:700;">${escapeHTML(act.title)}</h3>
                
                <div style="font-size:0.82rem; color:var(--gold); margin-bottom:6px; display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
                    ${act.venue_name ? `<span>🏛️ ${escapeHTML(act.venue_name)}</span>` : ''}
                    <span>📍 ${escapeHTML(act.area || act.postcode || 'London')}</span>
                    ${precisionBadge}
                </div>

                ${act.description ? `<p style="font-size:0.82rem; color:var(--muted); margin:0 0 8px 0; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${escapeHTML(act.description)}</p>` : ''}

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:6px; border-top:1px solid var(--border);">
                    <span style="font-size:0.75rem; color:var(--muted-2);">${escapeHTML(act.category || 'Things To Do')}</span>
                    ${act.url ? `<a href="${act.url}" target="_blank" rel="noopener" class="back-link" style="padding:2px 8px; font-size:0.78rem; color:var(--gold);" onclick="event.stopPropagation();">Explore →</a>` : ''}
                </div>
            `;
            container.appendChild(card);
        });

        // Load More button if more items exist
        if (list.length > currentRenderLimit) {
            const loadMoreWrapper = document.createElement('div');
            loadMoreWrapper.style.padding = '16px';
            loadMoreWrapper.style.textAlign = 'center';

            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'pill active';
            loadMoreBtn.style.cursor = 'pointer';
            loadMoreBtn.style.padding = '8px 20px';
            loadMoreBtn.style.fontSize = '0.9rem';
            loadMoreBtn.textContent = `Load More (${(list.length - currentRenderLimit).toLocaleString()} remaining) ↓`;
            loadMoreBtn.onclick = () => {
                currentRenderLimit += 100;
                renderActivityList(list);
            };
            loadMoreWrapper.appendChild(loadMoreBtn);
            container.appendChild(loadMoreWrapper);
        }
    }

    function renderMapMarkers(list) {
        markersLayer.clearLayers();

        // Only place pins for items with exact GPS coordinates or specific neighborhood resolution
        const mapItems = list.filter(a => (a.location_precision === 'exact' || a.location_precision === 'neighborhood') && a.lat && a.lng).slice(0, 500);

        mapItems.forEach(act => {
            const iconEmoji = getCategoryEmoji(act.category);
            const pinBorder = act.location_precision === 'exact' ? '#4ecdc4' : getCategoryColor(act.category);
            const iconHtml = `<div style="background:#1a1320; border:2px solid ${pinBorder}; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:14px; box-shadow:0 3px 8px rgba(0,0,0,0.4); cursor:pointer;">${iconEmoji}</div>`;
            
            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-map-pin',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
            });

            const marker = L.marker([act.lat, act.lng], { icon: customIcon });

            let precisionTag = act.location_precision === 'exact' ? '📍 Exact Venue Pin' : `🏘️ ${escapeHTML(act.area || 'Neighborhood')}`;

            const popupContent = `
                <div style="min-width:210px; max-width:270px; font-family:'Poppins', sans-serif;">
                    ${act.image_url ? `<img src="${act.image_url}" style="width:100%; height:95px; object-fit:cover; border-radius:6px; margin-bottom:6px;">` : ''}
                    <div style="font-size:0.7rem; color:#888; margin-bottom:4px; font-weight:600;">${precisionTag}</div>
                    <h4 style="margin:0 0 4px 0; color:#1a1320; font-size:0.95rem; line-height:1.25;">${escapeHTML(act.title)}</h4>
                    <p style="margin:0 0 4px 0; color:#e6a979; font-size:0.8rem; font-weight:600;">📍 ${escapeHTML(act.venue_name || act.area || 'London')}</p>
                    ${act.price_raw ? `<p style="margin:0 0 6px 0; color:#2e7d32; font-size:0.8rem; font-weight:700;">${escapeHTML(act.price_raw)}</p>` : ''}
                    ${act.url ? `<a href="${act.url}" target="_blank" rel="noopener" style="display:inline-block; background:#1a1320; color:#fff; text-decoration:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; font-weight:600;">View Details →</a>` : ''}
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', () => {
                selectedId = act.id;
                highlightCard(act.id);
            });

            markersLayer.addLayer(marker);
        });
    }

    function focusActivity(act) {
        selectedId = act.id;
        document.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected'));
        const card = document.getElementById(`card-${act.id}`);
        if (card) card.classList.add('selected');

        if (act.lat && act.lng && act.location_precision !== 'citywide') {
            map.flyTo([act.lat, act.lng], 15, { duration: 1.0 });
        }

        // On mobile, switch to map view
        if (window.innerWidth <= 768) {
            showMobileMap();
        }
    }

    function highlightCard(id) {
        document.querySelectorAll('.activity-card').forEach(c => c.classList.remove('selected'));
        const card = document.getElementById(`card-${id}`);
        if (card) {
            card.classList.add('selected');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function setupMobileToggle() {
        const toggleMapBtn = document.getElementById('toggle-map-btn');
        const toggleListBtn = document.getElementById('toggle-list-btn');
        const sidebar = document.getElementById('sidebar');
        const mapContainer = document.getElementById('map-view-container');

        if (toggleMapBtn && toggleListBtn && sidebar && mapContainer) {
            toggleMapBtn.onclick = () => showMobileMap();
            toggleListBtn.onclick = () => showMobileList();
        }
    }

    function showMobileMap() {
        const toggleMapBtn = document.getElementById('toggle-map-btn');
        const toggleListBtn = document.getElementById('toggle-list-btn');
        const sidebar = document.getElementById('sidebar');
        const mapContainer = document.getElementById('map-view-container');

        if (toggleMapBtn) toggleMapBtn.classList.add('active');
        if (toggleListBtn) toggleListBtn.classList.remove('active');
        if (sidebar) sidebar.style.display = 'none';
        if (mapContainer) mapContainer.style.display = 'flex';
        map.invalidateSize();
    }

    function showMobileList() {
        const toggleMapBtn = document.getElementById('toggle-map-btn');
        const toggleListBtn = document.getElementById('toggle-list-btn');
        const sidebar = document.getElementById('sidebar');
        const mapContainer = document.getElementById('map-view-container');

        if (toggleListBtn) toggleListBtn.classList.add('active');
        if (toggleMapBtn) toggleMapBtn.classList.remove('active');
        if (sidebar) sidebar.style.display = 'flex';
        if (mapContainer) mapContainer.style.display = 'none';
    }

    function getCategoryEmoji(cat) {
        switch (cat) {
            case 'Bars & Nightlife': return '🍸';
            case 'Theatre & Shows': return '🎭';
            case 'Music & Gigs': return '🎵';
            case 'Art & Exhibitions': return '🎨';
            case 'Food & Drink': return '🍕';
            case 'Parks & Outdoors': return '🌳';
            case 'Attractions & Sightseeing': return '🏛️';
            case 'Comedy': return '🎙️';
            case 'Free Activities': return '✨';
            default: return '🎡';
        }
    }

    function getCategoryColor(cat) {
        switch (cat) {
            case 'Bars & Nightlife': return '#e6a979';
            case 'Theatre & Shows': return '#ff6b8a';
            case 'Music & Gigs': return '#a277ff';
            case 'Art & Exhibitions': return '#4ecdc4';
            case 'Food & Drink': return '#f7b731';
            case 'Parks & Outdoors': return '#20bf6b';
            case 'Free Activities': return '#4ecdc4';
            default: return '#e6a979';
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }
})();
