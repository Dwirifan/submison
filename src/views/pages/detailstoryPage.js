import detailstoryPresenter from "../../presenters/detailstoryPresenter";

class detailstoryPage {
  #presenter;

  constructor() {
    this.#presenter = new detailstoryPresenter(this);
  }

  async render() {
    return `
        <a id="skip-to-content" href="#main-content" class="skip-link">
      <section class="story-detail container">
        <a href="#/stories" class="back-link">&laquo; Kembali</a>
        <div id="storyContent" class="story-detail__body">
          <div id="main-content" class="loading" tabindex="-1">
            Memuat detail cerita...
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const storyId = this.#extractStoryIdFromURL();
    const container = document.getElementById("storyContent");

    if (!storyId) {
      this.#renderError(container, "ID cerita tidak valid");
      return;
    }

    try {
      const storyData = await this.#presenter.loadStoryData(storyId);
      this.#renderStoryContent(container, storyData);

      if (this.#presenter.hasLocation) {
        this.#setupMap();
      }

      await this.#presenter.showSaveButton();
      this.#focusMainContent();
    } catch (error) {
      this.#renderError(container, `Tidak dapat menampilkan cerita. ${error.message}`);
    }
  }

  #extractStoryIdFromURL() {
    const hash = window.location.hash;
    const segments = hash.split("/");
    return segments[2] || null;
  }

  #renderStoryContent(container, storyData) {
    const mapSection = this.#presenter.hasLocation
      ? this.#presenter.generateMapSectionHTML()
      : "";

    container.innerHTML = `
      <h1 id="main-content" tabindex="-1" class="story-title">
        ${storyData.name}
      </h1>
      <p class="story-date">${storyData.formattedDate}</p>
      <img src="${storyData.photoUrl}" 
           alt="Foto milik ${storyData.name}" 
           class="story-image" />
      <p class="story-description">${storyData.description}</p>
      ${mapSection}
      <div id="save-actions-container" class="save-actions"></div>
    `;
  }

  #setupMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    setTimeout(() => {
      const success = this.#presenter.setupCompleteMap(mapElement);
      if (!success) {
        mapElement.innerHTML = '<p class="error">Gagal memuat peta</p>';
      }
    }, 100);
  }

  #focusMainContent() {
    const mainContent = document.getElementById("main-content");
    if (mainContent && window.location.hash.includes("#main-content")) {
      mainContent.focus();
    }
  }

  #renderError(container, errorMessage) {
    container.innerHTML = `
      <div id="main-content" class="error-message" tabindex="-1">
        ${errorMessage}
      </div>
    `;
  }

  async destroy() {
    try {
      this.#presenter.cleanup();
    } catch (error) {
      console.warn("Error during cleanup:", error);
    }
  }

  async refresh() {
    const storyId = this.#extractStoryIdFromURL();
    if (storyId) {
      await this.afterRender();
    }
  }

  getCurrentStoryData() {
    return this.#presenter.formattedStoryData;
  }

  renderSaveButton() {
    const container = document.getElementById("save-actions-container");
    if (!container) return;

    container.innerHTML = `
      <button id="save-button" class="btn btn-primary">
        Simpan Cerita
      </button>
    `;
    document.getElementById("save-button").addEventListener("click", () => {
      this.#presenter.saveStoryToBookmark();
    });
  }

  renderRemoveButton() {
    const container = document.getElementById("save-actions-container");
    if (!container) return;

    container.innerHTML = `
      <button id="remove-button" class="btn btn-danger">
        Hapus Cerita
      </button>
    `;
    document.getElementById("remove-button").addEventListener("click", () => {
      this.#presenter.removeStoryFromBookmark();
    });
  }
}

export default detailstoryPage;
