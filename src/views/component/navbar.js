import auth from "../../scripts/utils/auth";
import NotificationHelper from "../../scripts/utils/notification-helper";

class Navbar {
  static #currentLogoutListener = null;

  static init() {
    this._updateNavigation();
    this._attachHashChangeListener();
  }

  static _attachHashChangeListener() {
    window.addEventListener("hashchange", () => {
      this._updateNavigation();
    });
  }

  static _updateNavigation() {
    const navList = document.getElementById("nav-list");
    const isLoggedIn = auth.checkLoggedIn();
    
    this._cleanupExistingListeners();
    this._renderNavigation(navList, isLoggedIn);
    
    if (isLoggedIn) {
      this._setupLogoutHandler();
    }
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
      <i class="fas fa-bell"></i> Aktifkan Notifikasi
    </button>
  </li>
      <li><a href="#/stories"><i class="fas fa-book"></i> Cerita</a></li>
      <li><a href="#/stories/add"><i class="fas fa-plus"></i> Tambah Cerita</a></li>
      <li><a href="#/about"><i class="fas fa-info-circle"></i> Tentang</a></li>
      <li><a href="#" id="logoutButton"><i class="fas fa-sign-out-alt"></i> Keluar</a></li>
    `;
  }
  
  // push notification
  static async _updateNavigation() {
  const navList = document.getElementById("nav-list");
  const isLoggedIn = auth.checkLoggedIn();

  this._cleanupExistingListeners();
  this._renderNavigation(navList, isLoggedIn);

  if (isLoggedIn) {
    this._setupLogoutHandler();
    const notifButton = document.getElementById("notification-toggle-button");
    if (notifButton) {
      await NotificationHelper.updateToggleButtonUI(notifButton);
      notifButton.addEventListener("click", () => {
        NotificationHelper.toggleSubscription(notifButton);
      });
    }
  }
}

  static _getLoggedOutNavigation() {
    return `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
      <li><a href="#/about">Tentang</a></li>
    `;
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
        oldLogoutButton.removeEventListener("click", this.#currentLogoutListener);
      }
      this.#currentLogoutListener = null;
    }
  }
}

export default Navbar;