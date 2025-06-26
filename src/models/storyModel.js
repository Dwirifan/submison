import StoryAPI from "../scripts/data/api";

class storyModel {
  constructor() {
    this.stories = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.hasMore = false;
  }

  // Login user
  async loginUser(email, password) {
    try {
      const result = await StoryAPI.login({ email, password });
      
      if (result.loginResult?.token) {
        this.setAuthToken(result.loginResult.token);
        return result;
      }
      
      throw new Error('Token tidak ditemukan');
    } catch (error) {
      // Re-throw dengan pesan yang lebih user-friendly
      if (error.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server');
      }
      throw error;
    }
  }

  // Register user
  async registerUser(name, email, password) {
    try {
      const result = await StoryAPI.register({ name, email, password });
      return result;
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server');
      }
      throw error;
    }
  }

  // Get stories with pagination
  async getStories(page = 1) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Token tidak ditemukan');
    }

    try {
      const result = await StoryAPI.getStories(token, {
        page: page,
        size: this.pageSize,
      });

      // Update internal state
      this.stories = result.listStory || [];
      this.currentPage = page;
      this.hasMore = this.stories.length >= this.pageSize;

      return {
        stories: this.stories,
        currentPage: this.currentPage,
        hasMore: this.hasMore,
      };
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Tidak dapat terhubung ke server');
      }
      if (error.message.includes('token') || error.message.includes('Unauthorized')) {
        throw new Error('Session telah berakhir');
      }
      throw error;
    }
  }

  // Auth helpers
  getAuthToken() {
    return localStorage.getItem("token");
  }

  setAuthToken(token) {
    localStorage.setItem("token", token);
  }

  removeAuthToken() {
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Getters
  getCurrentPage() {
    return this.currentPage;
  }

  hasMoreStories() {
    return this.hasMore;
  }

  getStoriesWithLocation() {
    return this.stories.filter(story => story.lat && story.lon);
  }
}

export default storyModel;