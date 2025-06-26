// models/story-detail-model.js
import StoryAPI from "../scripts/data/api";
import detailStoryPage from "../views/pages/detailstoryPage";

class detailstoryModel {
  #storyData = null;

  constructor() {
    this.#storyData = null;
  }

  // Getter untuk data cerita
  get storyData() {
    return this.#storyData;
  }

  // Validasi data cerita
  #validateStoryData(story) {
    const requiredFields = ['id', 'name', 'description', 'photoUrl', 'createdAt'];
    
    for (const field of requiredFields) {
      if (!story[field]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    return true;
  }

  // Format data cerita
  #formatStoryData(rawStory) {
    return {
      id: rawStory.id,
      name: rawStory.name,
      description: rawStory.description,
      photoUrl: rawStory.photoUrl,
      createdAt: rawStory.createdAt,
      lat: rawStory.lat || null,
      lon: rawStory.lon || null,
      // Properti computed
      hasLocation: !!(rawStory.lat && rawStory.lon),
      coordinates: rawStory.lat && rawStory.lon ? {
        latitude: parseFloat(rawStory.lat),
        longitude: parseFloat(rawStory.lon)
      } : null
    };
  }

  // Load data cerita dari API
  async loadStoryDetail(storyId) {
    try {
      const authToken = this.#getAuthToken();
      
      const apiResponse = await StoryAPI.getStoryById(storyId, authToken);
      
      if (apiResponse.error) {
        throw new Error(apiResponse.message || 'Failed to fetch story');
      }

      this.#validateStoryData(apiResponse.story);
      this.#storyData = this.#formatStoryData(apiResponse.story);
      
      return this.#storyData;
    } catch (error) {
      this.#storyData = null;
      throw error;
    }
  }

  // Helper untuk mendapatkan token
  #getAuthToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    return token;
  }

  // Method untuk mendapatkan informasi lokasi
  getLocationInfo() {
    if (!this.#storyData || !this.#storyData.hasLocation) {
      return null;
    }

    return {
      latitude: this.#storyData.coordinates.latitude,
      longitude: this.#storyData.coordinates.longitude,
      formattedCoordinates: `${this.#storyData.coordinates.latitude.toFixed(6)}, ${this.#storyData.coordinates.longitude.toFixed(6)}`
    };
  }

  // Method untuk mendapatkan info popup map
  getPopupInfo() {
    if (!this.#storyData) return null;

    return {
      title: this.#storyData.name,
      description: this.#storyData.description,
      photoUrl: this.#storyData.photoUrl,
      coordinates: this.getLocationInfo()
    };
  }

  // Reset data
  reset() {
    this.#storyData = null;
  }

  // Check apakah data sudah di-load
  isLoaded() {
    return this.#storyData !== null;
  }
}

export default detailstoryModel;