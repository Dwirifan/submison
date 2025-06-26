class storyPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.isProcessing = false;
  }

    async loadStories(page = 1) {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;

      // Pastikan view tersedia sebelum akses
      if (this.view?.showLoading) this.view.showLoading(true);
      if (this.view?.clearMessage) this.view.clearMessage();

      const result = await this.model.getStories(page);
      this.handleLoadStoriesSuccess(result);
    } catch (error) {
      this.handleLoadStoriesError(error);
    } finally {
      this.isProcessing = false;
      if (this.view?.showLoading) this.view.showLoading(false);
    }
  }
  
  async loadNextPage() {
    if (!this.model.hasMoreStories()) {
      return;
    }
    await this.loadStories(this.model.getCurrentPage() + 1);
  }

  async loadPreviousPage() {
    const currentPage = this.model.getCurrentPage();
    if (currentPage > 1) {
      await this.loadStories(currentPage - 1);
    }
  }

  handleLoadStoriesSuccess(result) {
    this.view.displayStories(result.stories);
    this.view.updatePagination({
      currentPage: result.currentPage,
      hasMore: result.hasMore,
      canGoPrevious: result.currentPage > 1,
    });

    // Update map markers
    const storiesWithLocation = this.model.getStoriesWithLocation();
    this.view.updateMapMarkers(storiesWithLocation);
  }

  handleLoadStoriesError(error) {
    console.error('Load stories error:', error);
    
    const errorMessage = error.message || 'Terjadi kesalahan saat memuat cerita';
    this.view.showMessage(errorMessage, false);

    // Handle auth error
    if (error.message.includes('Session') || error.message.includes('token')) {
      this.handleAuthError();
    }
  }

  handleAuthError() {
    this.model.removeAuthToken();
    this.view.showMessage('Session telah berakhir. Mengalihkan ke halaman login...', false);
    
    setTimeout(() => {
      this.view.redirectToLogin();
    }, 2000);
  }

  // Getters for view
  getCurrentPage() {
    return this.model.getCurrentPage();
  }

  hasMoreStories() {
    return this.model.hasMoreStories();
  }

  canGoPrevious() {
    return this.model.getCurrentPage() > 1;
  }

  // Navigation helpers
  refreshStories() {
    return this.loadStories(1);
  }

  destroy() {
    this.model = null;
    this.view = null;
    this.isProcessing = false;
  }
}

export default storyPresenter;