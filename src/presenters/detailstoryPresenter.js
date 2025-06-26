// presenters/story-detail-presenter.js
import detailstoryModel from "../models/detailstoryModel";
import Swal from "sweetalert2";
import L from "leaflet";
import MapHelper from "../scripts/utils/map";
import { showFormattedDate } from "../scripts/utils/index";

class detailstoryPresenter {
  #viewInstance = null;
  #model = null;
  #leafletMap = null;

  constructor(viewInstance) {
    this.#viewInstance = viewInstance;
    this.#model = new detailstoryModel();
  }

  async loadStoryData(storyId) {
    try {
      const story = await this.#model.loadStoryDetail(storyId);
      return this.#formatStoryForView(story);
    } catch (error) {
      await this.#handleError(error);
      throw error;
    }
  }

  #formatStoryForView(story) {
    return {
      ...story,
      formattedDate: showFormattedDate(story.createdAt),
      locationInfo: this.#model.getLocationInfo()
    };
  }

  // Handle error dengan SweetAlert
  async #handleError(error) {
    await Swal.fire({
      icon: "error",
      title: "Kesalahan Saat Memuat Cerita",
      text: error.message,
      confirmButtonText: "OK"
    });

    if (error.message.includes("Authentication token") || 
        error.message.includes("Token tidak tersedia")) {
      this.#redirectToLogin();
    }
  }

  #redirectToLogin() {
    window.location.hash = "#/login";
  }

  generateMapSectionHTML() {
    const locationInfo = this.#model.getLocationInfo();
    
    if (!locationInfo) {
      return "";
    }

    return `
      <div class="map-section">
        <h2>Lokasi Cerita</h2>
        <div class="coordinates">
          <i class="fas fa-map-marker-alt"></i>
          Latitude: <span>${locationInfo.latitude.toFixed(6)}</span>,
          Longitude: <span>${locationInfo.longitude.toFixed(6)}</span>
        </div>
        <div id="map" class="story-map"></div>
      </div>
    `;
  }

  generatePopupHTML() {
    const popupInfo = this.#model.getPopupInfo();
    
    if (!popupInfo) {
      return "";
    }

    return `
      <div class="popup-info">
        <h3>${popupInfo.title}</h3>
        <img src="${popupInfo.photoUrl}" alt="Foto ${popupInfo.title}" 
             style="max-width: 200px;" />
        <p>${popupInfo.description}</p>
        <p><strong>Koordinat:</strong><br>
           Lat: ${popupInfo.coordinates.latitude.toFixed(6)}<br>
           Lng: ${popupInfo.coordinates.longitude.toFixed(6)}
        </p>
      </div>
    `;
  }

  initializeMap(mapContainer) {
    try {
      this.#leafletMap = MapHelper.initMap(mapContainer, false);
      return true;
    } catch (error) {
      console.error("Error initializing map:", error);
      return false;
    }
  }

  centerMapFromModel() {
    const locationInfo = this.#model.getLocationInfo();
    
    if (!locationInfo || !this.#leafletMap) {
      return false;
    }

    this.#leafletMap.setView([locationInfo.latitude, locationInfo.longitude], 13);
    return true;
  }

  // Tambah marker berdasarkan data dari model
  addMarkerFromModel() {
    const locationInfo = this.#model.getLocationInfo();
    
    if (!locationInfo || !this.#leafletMap) {
      return false;
    }

    const popupHTML = this.generatePopupHTML();
    MapHelper.addMarker(
      this.#leafletMap, 
      locationInfo.latitude, 
      locationInfo.longitude, 
      popupHTML
    );
    
    return true;
  }

  // Setup complete map (center + marker)
  setupCompleteMap(mapContainer) {
    if (!this.initializeMap(mapContainer)) {
      return false;
    }

    if (!this.centerMapFromModel()) {
      return false;
    }

    return this.addMarkerFromModel();
  }

  // Cleanup resources
  cleanup() {
    this.#removeMap();
    this.#model.reset();
  }

  // Remove map instance
  #removeMap() {
    if (this.#leafletMap) {
      this.#leafletMap.remove();
      this.#leafletMap = null;
    }
  }

  // Getter untuk mengecek apakah story memiliki lokasi
  get hasLocation() {
    return this.#model.isLoaded() && this.#model.getLocationInfo() !== null;
  }

  // Getter untuk data story yang sudah di-format
  get formattedStoryData() {
    if (!this.#model.isLoaded()) {
      return null;
    }
    return this.#formatStoryForView(this.#model.storyData);
  }
}

export default detailstoryPresenter;