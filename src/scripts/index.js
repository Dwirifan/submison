import "../styles/styles.css";

import App from "../views/app";
import Navbar from "../views/component/navbar";

import SkipToContentInitiator from "../scripts/utils/skipcontent";
import { registerServiceWorker } from './utils/index';

document.addEventListener("DOMContentLoaded", async () => {
  SkipToContentInitiator.init({
    skipLinkId: "skip-to-content",
    mainContentId: "main-content",
  });

  await registerServiceWorker(); 
  console.log('Berhasil mendaftarkan service worker.');

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  Navbar.init();

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
