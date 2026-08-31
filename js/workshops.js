// Workshops Discovery Map Logic
(function () {
    'use strict';

    // Map Setup
    const map = L.map('map').setView([51.5074, -0.1278], 11); // Center on London
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const primaryTransitLayer = L.layerGroup(); // Switched OFF by default
    const coreTransitLayer = L.layerGroup();    // Switched OFF by default
    const tertiaryTransitLayer = L.layerGroup();// Switched OFF by default
    const stationMarkersLayer = L.layerGroup().addTo(map);

    const overlayMaps = {
        "📍 Workshop Venues": markersLayer,
        "🚆 Primary Commute (Great Northern)": primaryTransitLayer,
        "🚇 Core Tube & Overground": coreTransitLayer,
        "🟣 Tertiary & Regional Routes": tertiaryTransitLayer
    };
    L.control.layers(null, overlayMaps, { position: 'topright' }).addTo(map);

    map.on('overlayadd overlayremove', function() {
        updateActiveStations();
    });

    let workshops = [];
    let markers = [];

    let activeCategory = 'All';
    let activeTime = 'Anytime';

    // Render transit layer data
    renderTransitLayers();

    // Load offline data directly from JS array
    if (window.WORKSHOPS_DATA) {
        workshops = window.WORKSHOPS_DATA;
        renderPills();
        renderTimePills();
        renderWorkshops(workshops);
        renderMarkers(workshops);
    } else {
        const listEl = document.getElementById('workshop-list');
        if (listEl) {
            listEl.innerHTML = `
                <div style="color:#cb2431; padding:15px; border:1px solid #cb2431; border-radius:6px; background:#ffeef0;">
                    <strong>Error:</strong> Could not load data.<br>
                    Ensure <code>workshops_geo.js</code> has been generated and is in the same directory.
                </div>`;
        }
    }

    function renderWorkshops(list) {
        const container = document.getElementById('workshop-list');
        if (!container) return;
        container.innerHTML = '';
        
        if (list.length === 0) {
            container.innerHTML = '<p style="color: var(--muted); padding: var(--space-4);">No activities match the current filters.</p>';
            return;
        }

        // Limit to 100 on sidebar for performance, while map shows all
        list.slice(0, 100).forEach((w) => { 
            const div = document.createElement('div');
            div.className = 'workshop-card';
            div.onclick = () => focusWorkshop(w);
            const badgeColor = w.source === 'Airbnb' ? 'var(--rose-light)' : 'var(--gold)';
            const badgeBg = w.source === 'Airbnb' ? 'rgba(255,107,138,0.16)' : 'rgba(230,169,121,0.16)';
            
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                    <span style="background:${badgeBg}; color:${badgeColor}; padding:3px 10px; border-radius:999px; font-size:0.75rem; font-weight:600; border:1px solid ${badgeBg}; text-transform:uppercase; letter-spacing:1px;">
                        ${w.source || 'ClassBento'}
                    </span>
                    <span style="font-size:0.8rem; color:var(--muted-2);">⭐ ${w.rating || 'New'}</span>
                </div>
                <h3>${w.title}</h3>
                <div class="company" style="color:var(--gold); font-size:0.95rem; margin-bottom:8px;">${w.company_teacher}</div>
                
                <div style="font-size:0.85rem; color:var(--muted-2); margin-bottom:12px; display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
                    ${w.location_precision === 'mobile' ? '<span>🚐 Teacher comes to you / Mobile</span>' : `<span>📍 ${w.exact_location || w.location || 'London'}</span>`}
                    ${!w.exact_coords && w.location_precision !== 'mobile' ? '<span style="font-size:0.7rem; color:var(--muted-2); background:var(--surface-2); padding:1px 6px; border-radius:4px; border:1px solid var(--border);">Approx Area</span>' : ''}
                </div>
                
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
                    <span style="background:var(--surface-2); color:var(--text); padding:4px 8px; border-radius:6px; font-size:0.8rem; border:1px solid var(--border);">
                        💰 £${w.price}
                    </span>
                    <span style="background:var(--surface-2); color:var(--text); padding:4px 8px; border-radius:6px; font-size:0.8rem; border:1px solid var(--border);">
                        ⏱️ ${w.duration || '?'}
                    </span>
                </div>
                
                <div style="font-size:0.85rem; color:var(--mint); margin-bottom:8px; font-weight:500;">
                    📅 ${w.activity_patterns || 'Check availability'}
                </div>
                
                ${w.times && w.times.length > 0 ? `
                <div style="margin-top:4px; font-size:0.8rem; color:var(--muted); background:var(--surface-2); padding:8px; border-radius:8px; border:1px solid var(--border); margin-bottom:12px;">
                    <strong style="color:var(--accent-light);">Upcoming Dates:</strong><br>
                    <div style="margin-top:4px; line-height:1.4;">
                        ${w.times.slice(0, 3).join('<br>')}
                        ${w.times.length > 3 ? `<br><em style="color:var(--muted-2);">+ ${w.times.length - 3} more dates</em>` : ''}
                    </div>
                </div>
                ` : ''}
            `;
            container.appendChild(div);
        });
    }

    function getCategory(title) {
        const t = (title || "").toLowerCase();
        
        // 🌟 Ultra Niche / Unique
        if (t.match(/neon/)) return { name: 'Neon Art', emoji: '✨' };
        if (t.match(/leather|bag /)) return { name: 'Leathercraft', emoji: '👜' };
        if (t.match(/resin/)) return { name: 'Resin Art', emoji: '🧪' };
        if (t.match(/forag/)) return { name: 'Foraging', emoji: '🍄' };
        if (t.match(/tarot|astrology|psychic|magic|witch/)) return { name: 'Mystic & Tarot', emoji: '🔮' };
        if (t.match(/blacksmith|forge|knife|axe|sword|metalwork/)) return { name: 'Blacksmithing', emoji: '⚒️' };
        if (t.match(/glass|lampwork|stained|fused glass/)) return { name: 'Glasswork', emoji: '🪟' };
        if (t.match(/perfume|oil |scent|soap|bath bomb|skincare/)) return { name: 'Bath & Fragrance', emoji: '🛁' };
        
        // 💮 Arts & Crafts
        if (t.match(/stamp|lino|printing|screen print|block print/)) return { name: 'Print & Stamp', emoji: '💮' };
        if (t.match(/potter|ceramic|clay|wheel|sculpt|kintsugi/)) return { name: 'Pottery & Kintsugi', emoji: '🏺' };
        if (t.match(/sip & paint|sip and paint|paint & sip|paint and sip/)) return { name: 'Paint & Sip', emoji: '🖌️' };
        if (t.match(/paint|art |draw|watercolour|sketch|acrylic|portrait|life drawing/)) return { name: 'Painting & Art', emoji: '🎨' };
        if (t.match(/mosaic|collage|decoupage/)) return { name: 'Mosaic & Collage', emoji: '✂️' };
        if (t.match(/candle|wax /)) return { name: 'Candlemaking', emoji: '🕯️' };
        if (t.match(/ring|jewel|silver|gold|earring|necklace|silversmith/)) return { name: 'Jewellery', emoji: '💍' };
        if (t.match(/sew|tuft|textile|rug|knit|crochet|embroid|weave|clothes|garment|macrame/)) return { name: 'Textiles & Yarn', emoji: '🧶' };
        if (t.match(/wood|carpentry|furniture|carv|whittling/)) return { name: 'Woodwork', emoji: '🪚' };
        if (t.match(/letter|calligraphy|paper|bookbinding|origami/)) return { name: 'Papercraft', emoji: '📜' };
        
        // 🫖 Food & Drink
        if (t.match(/tea /)) return { name: 'Tea & Tasting', emoji: '🫖' };
        if (t.match(/coffee|barista|latte/)) return { name: 'Coffee', emoji: '☕' };
        if (t.match(/chocolate|truffle/)) return { name: 'Chocolate', emoji: '🍫' };
        if (t.match(/cake|bak|pastry|biscuit|cookie|bread|sourdough/)) return { name: 'Baking', emoji: '🧁' };
        if (t.match(/sushi|dim sum|dumpling|asian|chinese|japanese|thai|korean|ramen/)) return { name: 'Asian Cuisine', emoji: '🥢' };
        if (t.match(/pizza|pasta|italian|gnocchi/)) return { name: 'Italian Cuisine', emoji: '🍝' };
        if (t.match(/cheese/)) return { name: 'Cheese', emoji: '🧀' };
        if (t.match(/cook|food|beef|culinary|kitchen|vegan|bbq|meat/)) return { name: 'Cooking', emoji: '🍳' };
        if (t.match(/cocktail|mixology|gin |vodka|rum /)) return { name: 'Cocktails', emoji: '🍹' };
        if (t.match(/wine|tasting|whisky|beer|byob|drink/)) return { name: 'Drinks & Tastings', emoji: '🍷' };

        // 🌿 Life & Wellness
        if (t.match(/flower|terrarium|plant|botanical|ikebana|wreath|florist|garden|floral|bouquet|bonsai/)) return { name: 'Plants & Floristry', emoji: '🌿' };
        if (t.match(/yoga|meditat|breath|mindful|sound bath|healing|pilates/)) return { name: 'Wellness & Yoga', emoji: '🧘' };
        if (t.match(/dance|bachata|salsa|ballet|bollywood|twerk|tango/)) return { name: 'Dance', emoji: '💃' };
        
        // 📸 Media & Activities
        if (t.match(/photo|camera|videography|film|darkroom/)) return { name: 'Photography', emoji: '📸' };
        if (t.match(/walk|tour|guide|museum|history/)) return { name: 'Walking Tours', emoji: '🚶' };
        if (t.match(/comedy|improv/)) return { name: 'Comedy & Acting', emoji: '🎭' };
        if (t.match(/music|singing|choir|dj |djing|instrument/)) return { name: 'Music', emoji: '🎵' };

        return { name: 'Unique & Fun', emoji: '✨' }; // Fallback
    }

    function renderMarkers(list) {
        markersLayer.clearLayers();
        markers = [];
        
        const grouped = {};

        list.forEach((w) => {
            if (w.location_precision === 'mobile' || w.location_precision === 'online') return;
            if (!w.lat) return;
            if (!w.lng) return;

            const coordKey = `${w.lat.toFixed(4)},${w.lng.toFixed(4)}`; // approx 11m grid
            const company = w.company_teacher || "Independent";
            const groupKey = `${coordKey}_${company}`; // GROUP BY COMPANY + LOCATION
            
            if (!grouped[groupKey]) {
                grouped[groupKey] = {
                    lat: w.lat,
                    lng: w.lng,
                    coordKey: coordKey,
                    company: company,
                    location: w.exact_location || w.location,
                    exact_coords: w.exact_coords,
                    location_precision: w.location_precision,
                    classes: []
                };
            }
            grouped[groupKey].classes.push(w);
        });

        const seenCoords = {};

        Object.values(grouped).forEach(g => {
            let finalLat = g.lat;
            let finalLng = g.lng;
            
            // If multiple COMPANIES run at the exact same studio, spiral them slightly outward
            if (seenCoords[g.coordKey]) {
                const count = seenCoords[g.coordKey];
                const angle = count * 2.39996; // Golden angle
                const radius = 0.0002 * Math.sqrt(count);
                
                finalLat += Math.sin(angle) * radius;
                finalLng += Math.cos(angle) * radius * 1.5;
                
                seenCoords[g.coordKey]++;
            } else {
                seenCoords[g.coordKey] = 1;
            }

            const isMulti = g.classes.length > 1;
            
            // Determine the pin emoji: if all classes have the same emoji, use it. Otherwise, use 🏢.
            let uniqueEmojis = new Set();
            g.classes.forEach(w => uniqueEmojis.add(getCategory(w.title).emoji));
            
            let emoji;
            if (uniqueEmojis.size === 1) {
                emoji = [...uniqueEmojis][0];
            } else {
                emoji = '🏢';
            }
            
            const badgeHtml = isMulti ? `<div style="background:red; color:white; border-radius:50%; width:18px; height:18px; line-height:18px; font-size:11px; position:absolute; top:-8px; right:-8px; font-weight:bold; border:2px solid white;">${g.classes.length}</div>` : '';
            
            const icon = L.divIcon({
                html: `<div style="font-size:24px; text-align:center; filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.4)); position:relative;">${emoji}${badgeHtml}</div>`,
                className: 'custom-emoji-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
            });
            
            const marker = L.marker([finalLat, finalLng], { icon }).addTo(markersLayer);
            
            let classesHtml = g.classes.map(w => {
                const badgeColor = w.source === 'Airbnb' ? 'var(--rose-light)' : 'var(--gold)';
                const badgeBg = w.source === 'Airbnb' ? 'rgba(255,107,138,0.16)' : 'rgba(230,169,121,0.16)';
                return `<div style="margin-bottom:12px; text-align:left; border-bottom:1px solid #e1e4e8; padding-bottom:12px;">
                    <span class="map-popup-badge" style="background:${badgeBg}; color:${badgeColor}; border:1px solid ${badgeBg};">
                        ${w.source || 'ClassBento'}
                    </span>
                    <h4 class="map-popup-title" style="margin-top:4px; font-size:1.05rem;">${w.title}</h4>
                    <div style="font-size:0.85rem; color:#0f766e; margin:6px 0; font-weight:600;">📅 ${w.activity_patterns || 'Check availability'}</div>
                    ${w.times && w.times.length > 0 ? `
                    <div style="font-size:0.75rem; color:#4b5563; background:#f3f4f6; padding:6px; border-radius:6px; margin-top:6px; margin-bottom:8px;">
                        <strong style="color:#1f2937;">Upcoming Dates:</strong><br>
                        ${w.times.slice(0, 2).join('<br>')}
                        ${w.times.length > 2 ? `<br><em style="color:#6b7280;">+ ${w.times.length - 2} more</em>` : ''}
                    </div>
                    ` : ''}
                    <div style="font-size:0.8rem; color:#4b5563; margin-bottom:8px;">💰 £${w.price} &nbsp; ⏱️ ${w.duration || '?'} &nbsp; ⭐ ${w.rating || 'New'}</div>
                    <a href="${w.url}" target="_blank" class="map-popup-btn">Book for £${w.price}</a>
                </div>`;
            }).join('');
            
            let locPrecisionBadge = '';
            if (g.location_precision === 'mobile') {
                locPrecisionBadge = `<span style="font-size:0.7rem; color:#b45309; background:#fef3c7; border:1px solid #fde68a; padding:1px 5px; border-radius:4px; margin-left:4px;">Mobile / Teacher travels</span>`;
            } else if (!g.exact_coords) {
                locPrecisionBadge = `<span style="font-size:0.7rem; color:#6b7280; background:#f3f4f6; border:1px solid #e5e7eb; padding:1px 5px; border-radius:4px; margin-left:4px;">Approx area</span>`;
            }

            marker.bindPopup(`
                <div class="map-popup-card" style="max-height:340px; overflow-y:auto; width:240px; padding-right:4px;">
                    <div style="padding:4px 0 8px; border-bottom:1px solid #e5e7eb; margin-bottom:12px;">
                        <span class="map-popup-badge" style="background:#f3f4f6; color:#1f2937; border-color:#e5e7eb; font-size:0.75rem;"><span style="color:var(--gold);">★</span> ${g.company}</span>
                        <p class="map-popup-desc" style="margin-top:6px; font-size:0.8rem; font-weight:500;">
                            📍 ${g.location || 'London'} ${locPrecisionBadge}
                        </p>
                        ${isMulti ? `<div style="font-size:0.75rem; font-weight:700; color:#b91c1c;">${g.classes.length} Activities Here</div>` : ''}
                    </div>
                    ${classesHtml}
                </div>
            `);
            
            // For focus functionality from sidebar
            g.classes.forEach(w => {
                markers.push({ id: w.id, marker });
            });
        });
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
                html: `<div class="custom-map-icon" style="background: #e6a979; color: #160d14; width: 36px; height: 36px; font-size: 19px; border: 2.5px solid #fff; box-shadow: 0 4px 12px rgba(230,169,121,0.6);">🏡</div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });

            L.marker([t.home.lat, t.home.lng], { icon: homeIcon, zIndexOffset: 1000 })
                .bindPopup(`
                    <div class="map-popup-card">
                        <span class="map-popup-badge" style="background: #e6a979; color: #160d14;">🏡 Home Base</span>
                        <h4 class="map-popup-title">${t.home.name}</h4>
                        <p class="map-popup-desc">${t.home.description}</p>
                    </div>
                `)
                .addTo(primaryTransitLayer);
        }

        // 2. Office Marker (Deliveroo HQ)
        if (t.office && primaryTransitLayer) {
            const officeIcon = L.divIcon({
                className: 'office-marker-icon',
                html: `<div class="custom-map-icon" style="background: #00cdbc; color: #fff; width: 36px; height: 36px; font-size: 19px; border: 2.5px solid #fff; box-shadow: 0 4px 12px rgba(0,205,188,0.6);">💼</div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });

            L.marker([t.office.lat, t.office.lng], { icon: officeIcon, zIndexOffset: 1000 })
                .bindPopup(`
                    <div class="map-popup-card">
                        <span class="map-popup-badge" style="background: #ccfbf1; color: #0f766e; border-color: #99f6e4;">💼 Deliveroo Tech HQ</span>
                        <h4 class="map-popup-title">${t.office.name}</h4>
                        <p class="map-popup-desc">${t.office.description}</p>
                    </div>
                `)
                .addTo(primaryTransitLayer);
        }

        // 3. Draw Polylines into appropriate layer groups
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
                            weight: line.style === 'dashed' ? 4 : 3.5,
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

        // Collect lines from active visible layers only
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
                if (st.note && st.note.length > (stationIndex[key].note || '').length) stationIndex[key].note = st.note;
            });
        });

        Object.values(stationIndex).forEach(st => {
            const isTerminus = st.type === 'terminus' || st.type === 'origin';
            const isInterchange = st.type === 'interchange';
            const multiLine = st.lines.length > 1;
            const primaryColor = st.lines[0].color;

            const size = isTerminus ? 26 : (isInterchange || multiLine) ? 24 : 18;
            const bg = isTerminus ? primaryColor : '#ffffff';
            const textCol = isTerminus ? '#ffffff' : primaryColor;
            const borderCol = multiLine ? '#333' : primaryColor;
            const borderW = (isInterchange || multiLine) ? 2.5 : 2;

            const stIcon = L.divIcon({
                className: 'train-station-icon',
                html: `<div class="custom-map-icon" style="background: ${bg}; color: ${textCol}; width: ${size}px; height: ${size}px; font-size: ${size * 0.52}px; border: ${borderW}px solid ${borderCol}; box-shadow: 0 2px 5px rgba(0,0,0,0.18);" title="${st.name}">🚆</div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
            });

            // Build line badges for popup
            const lineBadges = st.lines.map(l =>
                `<span style="display:inline-flex;align-items:center;gap:3px;background:${l.color}14;color:${l.color};border:1px solid ${l.color}40;border-radius:4px;padding:1px 6px;font-size:0.72rem;font-weight:600;"><span style="width:7px;height:7px;border-radius:50%;background:${l.color};"></span>${l.shortName}</span>`
            ).join(' ');

            L.marker([st.lat, st.lng], { icon: stIcon })
                .bindPopup(`
                    <div class="map-popup-card">
                        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;">${lineBadges}</div>
                        <h4 class="map-popup-title">${st.name}</h4>
                        <p class="map-popup-desc">${st.note || st.lines.map(l => l.shortName).join(' · ')}</p>
                    </div>
                `)
                .addTo(stationMarkersLayer);
        });
    }

    function focusWorkshop(w) {
        if (w.location_precision === 'mobile') return;
        if (!w.lat || !w.lng) return;

        if (window.setMobileView) {
            window.setMobileView('map');
        }

        setTimeout(() => {
            map.invalidateSize();
            map.flyTo([w.lat, w.lng], 15, { duration: 0.5 });
            const m = markers.find(mark => mark.id === w.id);
            if (m) m.marker.openPopup();
        }, 80);
    }

    function renderPills() {
        const container = document.getElementById('category-pills');
        if (!container) return;
        const counts = { 'All': workshops.length };
        const emojis = { 'All': '' };
        
        workshops.forEach(w => {
            const cat = getCategory(w.title);
            if (!counts[cat.name]) {
                counts[cat.name] = 0;
                emojis[cat.name] = cat.emoji;
            }
            counts[cat.name]++;
        });
        
        // Sort categories by count (descending)
        const sortedCats = Object.keys(counts).filter(k => k !== 'All').sort((a,b) => counts[b] - counts[a]);
        const finalCats = ['All', ...sortedCats];
        
        container.innerHTML = finalCats.map(cat => {
            return `
                <button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-category="${cat}" type="button">
                    ${emojis[cat]} ${cat} <span class="filter-count">${counts[cat]}</span>
                </button>
            `;
        }).join('');
        
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.category;
                renderPills(); // Re-render to update active styling
                applyFilters();
            });
        });
        
        // Leaflet needs to know container size changed when pills were injected/wrapped
        setTimeout(() => map.invalidateSize(), 100);
    }

    function hasMatchingTime(w, filter) {
        if (filter === 'Anytime') return true;
        
        // Items without scheduled times (like flexible Airbnb activities) are included
        // in all filters to avoid artificially hiding them.
        if (!w.times || w.times.length === 0) return true;
        
        for (let t of w.times) {
            const isWeekend = t.startsWith('Sat') || t.startsWith('Sun');
            const isWeekday = !isWeekend && /^(Mon|Tue|Wed|Thu|Fri)/.test(t);
            
            // Extract hour
            let hour24 = -1;
            const hourMatch = t.match(/,\s*(\d{1,2})(:\d{2})?(am|pm)/i);
            if (hourMatch) {
                let h = parseInt(hourMatch[1], 10);
                let ampm = hourMatch[3].toLowerCase();
                if (ampm === 'pm' && h < 12) h += 12;
                if (ampm === 'am' && h === 12) h = 0;
                hour24 = h;
            }
            
            if (filter === 'Weekends' && isWeekend) return true;
            if (filter === 'Weekday Evenings (After 5pm)' && isWeekday && hour24 >= 17) return true;
            if (filter === 'Weekday Daytimes (Before 5pm)' && isWeekday && hour24 >= 0 && hour24 < 17) return true;
        }
        return false;
    }

    function renderTimePills() {
        const container = document.getElementById('time-pills');
        if (!container) return;
        const filters = [
            { name: 'Anytime', icon: '🕒' },
            { name: 'Weekends', icon: '🎉' },
            { name: 'Weekday Evenings (After 5pm)', icon: '🌙' },
            { name: 'Weekday Daytimes (Before 5pm)', icon: '☀️' }
        ];
        
        container.innerHTML = filters.map(f => {
            return `
                <button class="filter-btn ${f.name === activeTime ? 'active' : ''}" data-time="${f.name}" type="button">
                    ${f.icon} ${f.name}
                </button>
            `;
        }).join('');
        
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeTime = btn.dataset.time;
                renderTimePills();
                applyFilters();
            });
        });
    }

    function applyFilters() {
        const searchInput = document.getElementById('search');
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const filtered = workshops.filter(w => {
            const matchSearch = 
                (w.title && w.title.toLowerCase().includes(term)) ||
                (w.company_teacher && w.company_teacher.toLowerCase().includes(term)) ||
                (w.location && w.location.toLowerCase().includes(term)) ||
                (w.exact_location && w.exact_location.toLowerCase().includes(term)) ||
                (w.description && w.description.toLowerCase().includes(term));
            
            const matchCat = activeCategory === 'All' || getCategory(w.title).name === activeCategory;
            const matchTime = hasMatchingTime(w, activeTime);
            
            return matchSearch && matchCat && matchTime;
        });
        renderWorkshops(filtered);
        renderMarkers(filtered);
    }

    // Search filter listener
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Mobile View Toggle
    const appLayout = document.querySelector('.app-layout');
    const toggleMapBtn = document.getElementById('toggle-map-btn');
    const toggleListBtn = document.getElementById('toggle-list-btn');

    function setMobileView(view) {
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
            if (map) {
                setTimeout(() => map.invalidateSize(), 50);
            }
        }
    }
    window.setMobileView = setMobileView;

    if (toggleMapBtn) toggleMapBtn.addEventListener('click', () => setMobileView('map'));
    if (toggleListBtn) toggleListBtn.addEventListener('click', () => setMobileView('list'));

})();
