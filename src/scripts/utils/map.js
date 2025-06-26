import L from "leaflet";
import "leaflet/dist/leaflet.css";

class MapHelper {
  static #DEFAULT_MAP_CENTER = [-2.548926, 118.014863];
  static #DEFAULT_MAP_ZOOM = 5;

  static #defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  static initMap(container, isInteractive = false) {
    const map = L.map(container).setView(
      this.#DEFAULT_MAP_CENTER,
      this.#DEFAULT_MAP_ZOOM
    );

    const openStreet = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    );

    const esriSat = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri",
      }
    );
    const maptiller = L.tileLayer(
      "https://api.maptiler.com/maps/aquarelle/{z}/{x}/{y}.png?key=bcUdu3jtiRbrA8Rv269X",
      {
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
      }
    );

    const baseLayers = {
      OpenStreetMap: openStreet,
      "Satelit (ESRI)": esriSat,
      Aquarelle: maptiller,
    };

    openStreet.addTo(map); // default

    L.control.layers(baseLayers).addTo(map);

    if (isInteractive) {
      this.#enableClickHandler(map, container);
    }

    return map;
  }

  static addMarker(map, lat, lon, popupContent = "") {
    const marker = L.marker([lat, lon], { icon: this.#defaultIcon });
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    marker.addTo(map);
    return marker;
  }

  static #enableClickHandler(map, containerElement) {
    map.on("click", (e) => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      L.marker(e.latlng, { icon: this.#defaultIcon }).addTo(map);

      const { lat, lng } = e.latlng;
      const event = new CustomEvent("locationselected", {
        detail: { lat, lng },
      });

      if (containerElement instanceof HTMLElement) {
        containerElement.dispatchEvent(event);
      } else if (typeof containerElement === "string") {
        const element = document.getElementById(containerElement);
        element?.dispatchEvent(event);
      }
    });
  }
}

export default MapHelper;
