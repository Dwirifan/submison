import storyPresenter from "../../presenters/storypresenters.js";
import storyModel from "../../models/storyModel.js";
import { showFormattedDate } from "../../scripts/utils/index.js";
import MapHelper from "../../scripts/utils/map.js";

class storyPage {
  constructor() {
    this.model = new storyModel();
    this.presenter = null;
    this.leafletMap = null;
    this.activeMarkers = [];
    this.elements = {};
  }

  async render() {
    return `
      <section id="mainContent" class="stories container" tabindex="-1">
        <div id="loadingIndicator" class="loading-indicator" style="display: none;">
          <div class="spinner"></div>
          <p>Memuat cerita...</p>
        </div>
        
        <div id="messageContainer" class="message-container" style="display: none;"></div>
        
        <div id="stories" class="stories__list"></div>
        
        <div class="stories__pagination">
          <button id="prevPage" class="pagination-button" disabled>
            <i class="fas fa-chevron-left"></i> Sebelumnya
          </button>
          <span id="pageInfo" class="pagination-info">Halaman 1</span>
          <button id="nextPage" class="pagination-button" disabled>
            Selanjutnya <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div id="map" class="stories__map"></div>
        
        <a href="#/stories/add" class="floating-button" aria-label="Tambah cerita baru">
          <i class="fas fa-plus"></i>
        </a>
      </section>
    `;
  }

  async afterRender() {
    this.initializeElements();
    this.presenter = new storyPresenter(this.model, this);
    this.initializeMap();
    this.setupEventListeners();
    await this.presenter.loadStories(1);
  }

  initializeElements() {
    this.elements = {
      storiesList: document.querySelector("#stories"),
      mapElement: document.querySelector("#map"),
      prevBtn: document.querySelector("#prevPage"),
      nextBtn: document.querySelector("#nextPage"),
      pageInfo: document.querySelector("#pageInfo"),
      loadingIndicator: document.querySelector("#loadingIndicator"),
      messageContainer: document.querySelector("#messageContainer"),
    };
  }

  initializeMap() {
    if (this.elements.mapElement) {
      this.leafletMap = MapHelper.initMap(this.elements.mapElement, false);
    }
  }

  setupEventListeners() {
    this.elements.prevBtn?.addEventListener("click", () => {
      this.presenter.loadPreviousPage();
    });

    this.elements.nextBtn?.addEventListener("click", () => {
      this.presenter.loadNextPage();
    });
  }
  showLoading(show) {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = show ? "block" : "none";
    }
  }

  showMessage(message, isSuccess) {
    if (this.elements.messageContainer) {
      this.elements.messageContainer.textContent = message;
      this.elements.messageContainer.className = `message-container ${isSuccess ? 'success' : 'error'}`;
      this.elements.messageContainer.style.display = "block";
    }
  }

  clearMessage() {
    if (this.elements.messageContainer) {
      this.elements.messageContainer.style.display = "none";
    }
  }

  displayStories(stories) {
    if (!this.elements.storiesList) return;

    this.elements.storiesList.innerHTML = "";

    if (!stories || stories.length === 0) {
      this.elements.storiesList.innerHTML = `
        <div class="no-stories">
          <p>Belum ada cerita untuk ditampilkan.</p>
        </div>
      `;
      return;
    }

    stories.forEach((story) => {
      this.elements.storiesList.innerHTML += this.generateStoryCard(story);
    });
  }

  updatePagination({ currentPage, hasMore, canGoPrevious }) {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = !canGoPrevious;
    }
    
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled = !hasMore;
    }
    
    if (this.elements.pageInfo) {
      this.elements.pageInfo.textContent = `Halaman ${currentPage}`;
    }
  }

  updateMapMarkers(storiesWithLocation) {
    this.activeMarkers.forEach((marker) => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    this.activeMarkers = [];
    if (this.leafletMap && storiesWithLocation) {
      storiesWithLocation.forEach((story) => {
        const marker = MapHelper.addMarker(
          this.leafletMap,
          story.lat,
          story.lon,
          this.generatePopupContent(story)
        );
        this.activeMarkers.push(marker);
      });
    }
  }

  generateStoryCard(story) {
    return `
      <article class="story-item">
        <img src="${story.photoUrl}" 
             alt="Foto dari ${story.name}" 
             class="story-item__image"
             loading="lazy">
        <div class="story-item__content">
          <h2 class="story-item__title">${story.name}</h2>
          <p class="story-item__description">${story.description}</p>
          <p class="story-item__date">
            <i class="far fa-calendar-alt"></i> ${showFormattedDate(story.createdAt)}
          </p>
          <a href="#/stories/${story.id}" class="read-more-button">
            Selengkapnya <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  }

  generatePopupContent(story) {
    return `
      <div class="popup-content">
        <h3>${story.name}</h3>
        <img src="${story.photoUrl}" 
             alt="Foto dari ${story.name}" 
             style="max-width: 200px; height: auto;">
        <p>${story.description}</p>
      </div>
    `;
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  async destroy() {
    this.activeMarkers.forEach((marker) => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    this.activeMarkers = [];
    
    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }
    
    this.presenter.destroy();
  }
}

export default storyPage;