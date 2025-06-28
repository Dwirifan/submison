import auth from "../../scripts/utils/auth";
import NotificationHelper from "../../scripts/utils/notification-helper";
import StoryDatabase from "../../scripts/data/story-db";

class Navbar {
  static #currentLogoutListener = null;

  static init() {
    this._updateNavigation();
    this._attachHashChangeListener();
  }

  static _renderNavigation(navList, isLoggedIn) {
    navList.innerHTML = `
      <ul class="nav-list">
        ${this._getNavigationItems(isLoggedIn)}
      </ul>
    `;
  }

  static _getNavigationItems(isLoggedIn) {
    return isLoggedIn
      ? this._getLoggedInNavigation()
      : this._getLoggedOutNavigation();
  }

  static _getLoggedInNavigation() {
    return `
      <li>
        <button id="notification-toggle-button" class="button-notif">
          <i class="fas fa-bell"></i>
        </button>
      </li>
      <li>
        <a href="#/bookmark">
          <i class="fas fa-bookmark"></i>
          <span class="badge" id="bookmark-badge"></span>
        </a>
      </li>
      <li><a href="#/stories"><i class="fas fa-book"></i> Cerita</a></li>
      <li><a href="#/stories/add"><i class="fas fa-plus"></i> Tambah Cerita</a></li>
      <li><a href="#/about"><i class="fas fa-info-circle"></i> Tentang</a></li>
      <li><a href="#" id="logoutButton"><i class="fas fa-sign-out-alt"></i> Keluar</a></li>
    `;
  }

  static _getLoggedOutNavigation() {
    return `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
      <li><a href="#/about">Tentang</a></li>
    `;
  }

  static async _updateNavigation() {
    const navList = document.getElementById("nav-list");
    const isLoggedIn = auth.checkLoggedIn();

    this._cleanupExistingListeners();
    this._renderNavigation(navList, isLoggedIn);

    if (isLoggedIn) {
      this._setupLogoutHandler();
      this.updateBookmarkBadge(); // ✅ tambahkan ini

      const notifButton = document.getElementById("notification-toggle-button");

      if (notifButton && "serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await NotificationHelper.updateToggleButtonUI(notifButton);

          notifButton.addEventListener("click", () => {
            NotificationHelper.toggleSubscription(notifButton);
          });
        } catch (err) {
          console.error("❌ Gagal mendapatkan Service Worker:", err);
        }
      }
    }
  }

  static async updateBookmarkBadge() {
    try {
      const count = await StoryDatabase.countStories();
      const badge = document.getElementById("bookmark-badge");
      if (badge) {
        if (count > 0) {
          badge.textContent = count;
          badge.style.display = "inline-block";
        } else {
          badge.style.display = "none";
        }
      }
    } catch (err) {
      console.error("❌ Gagal memuat jumlah bookmark:", err);
    }
  }

  static _attachHashChangeListener() {
    window.addEventListener("hashchange", () => {
      this._updateNavigation();
    });
  }

  static _setupLogoutHandler() {
    const logoutButton = document.getElementById("logoutButton");
    const logoutHandler = (e) => {
      this._handleLogout(e);
    };

    this.#currentLogoutListener = logoutHandler;
    logoutButton.addEventListener("click", logoutHandler);
  }

  static _handleLogout(e) {
    e.preventDefault();
    this._performLogout();
  }

  static _performLogout() {
    localStorage.removeItem("token");
    window.location.hash = "#/login";
  }

  static _cleanupExistingListeners() {
    if (this.#currentLogoutListener) {
      const oldLogoutButton = document.getElementById("logoutButton");
      if (oldLogoutButton) {
        oldLogoutButton.removeEventListener(
          "click",
          this.#currentLogoutListener
        );
      }
      this.#currentLogoutListener = null;
    }
  }
}

export default Navbar;
