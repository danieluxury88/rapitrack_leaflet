async function fetchData(deviceId, numberOfDays) {
  const url = `https://flespi.io/gw/calcs/1662297/devices/${deviceId}/intervals/all`;
  const authToken = 'PbjxQbkhxd39UO8FanOJQlTiO558apgProb5plcKm5K5IIyIUdhyoYF2TA1RO5v3';
  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `${authToken}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const now = Date.now() / 1000;
      const daysLimit = now - (numberOfDays * 24 * 60 * 60);

      const filteredData = data.result
          .filter(item => item.timestamp > daysLimit)
          .map(({ route, duration, timestamp }) => ({ route, duration, timestamp }));

          filteredData.map((route, index) => {
            createStaticMap(index, route.route, route.timestamp);
          })

      return filteredData; // or process the data as needed
  } catch (error) {
      console.error('There was an error!', error);
  }
}


var polineas = L.layerGroup();

document.addEventListener("DOMContentLoaded", () => {
    fetchData(4960484, 7);
});

function formatDateToSpanish(timestamp) {
  let date = new Date(timestamp * 1000);
  const options = {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  };
  let formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);
  return formattedDate.split(' ').map( part => {
    return part.charAt(0).toUpperCase()+ part.slice(1);
  }).join(' ');
}

function createStaticMap(index, json, timestamp) {
    // const routePoints = decodePolyline(encodedString);
    let date = formatDateToSpanish(timestamp);
    console.log(date);
    const mapContainer = document.getElementById('maps');
    const mapId = `map-${index}`;
    let mapDiv = document.createElement('div');
    mapDiv.id = mapId;
    mapDiv.classList = 'map';
    mapContainer.appendChild(mapDiv);

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
        attribution: '© OpenStreetMap'
    }).addTo(map);
    const polylineLayer = L.polyline(routePoints, { color: 'blue' }).addTo(map);
    map.fitBounds(polylineLayer.getBounds());

    	// control that shows state info on hover
    const info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this._div.innerHTML = `<h4>${date}</h4>`;
      return this._div;
    };


    info.addTo(map, date);
}

function decodePolyline(encoded) {
  var points = [];
  var index = 0,
    len = encoded.length;
  var lat = 0,
    lng = 0;

  while (index < len) {
    var b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    var dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    var dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

function parseJsonResponse(routeData) {
  return decodePolyline(routeData);
}



