import polyline from '@mapbox/polyline';
import L from 'leaflet';

var json = [
    {
      route:
        "hwXjr`~McF\\CC@sAx@Mlh@gEEIO?gHn@w@DG?yXvBaNz@cBFaNuCkQ_Fgo@_Mq[sCgZiCAEN{CYGmGBi@@_QRqEBmOq@b@_DNGtD?zHZGjE@rDLBlSKz{@dExQzBjObCzQ`F|OfErPlEBMt@iGtAwRb@sHNClHr@BNSjGu@vXgBLuHZWAKBAJ}FpJe@LHBrF_B",
      // Other properties...
    },
    // ... other objects ...
  ];


  document.addEventListener("DOMContentLoaded", () => {
      createStaticMap('map1', json);
      createStaticMap('map2', json);
      createStaticMap('map3', json);
  });

  function createStaticMap(mapId, json) {
      const routePoints = parseJsonResponse(json);
      const map = L.map(mapId, {
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: false,
          doubleClickZoom: false,
          boxZoom: false,
          touchZoom: false,
          tap: false,
      }).setView([0, 0], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      const polylineLayer = L.polyline(routePoints, { color: 'blue' }).addTo(map);
      map.fitBounds(polylineLayer.getBounds());
  }

  function parseJsonResponse(jsonData) {
    console.log(jsonData[0]["route"]);
    return polyline.decode(jsonData[0]["route"]).map(point => ({ lat: point[0], lng: point[1] }));
  }