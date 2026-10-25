// Shared basemap for every Leaflet map on the site.
// Production (*.alec.today) uses OpenStreetMap tiles, which load fine there. OSM serves
// "Access blocked" tiles to local previews, and CARTO now returns "API KEY REQUIRED" tiles
// everywhere, so localhost falls back to Esri's keyless dark grey canvas + label overlay.
window.addBaseTiles = function addBaseTiles(map) {
  const osmCredit = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  if (/(^|\.)alec\.today$/.test(location.hostname)) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: osmCredit,
      maxZoom: 19,
    }).addTo(map);
    return;
  }
  const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas';
  L.tileLayer(`${esri}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
    attribution: `Tiles &copy; Esri, HERE, Garmin, ${osmCredit}`,
    maxNativeZoom: 16,
    maxZoom: 19,
  }).addTo(map);
  L.tileLayer(`${esri}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, {
    maxNativeZoom: 16,
    maxZoom: 19,
  }).addTo(map);
};
