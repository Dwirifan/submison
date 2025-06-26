const skipContent = {
  init({
    skipLinkId = "skip-to-content",
    mainContentId = "main-content",
  } = {}) {
    this._injectSkipLink(skipLinkId, mainContentId);
    this._injectStyles();
    this._bindEvent(skipLinkId, mainContentId);
  },

  _injectSkipLink(skipLinkId, mainContentId) {
    if (document.getElementById(skipLinkId)) return;

    const link = document.createElement("a");
    link.id = skipLinkId;
    link.href = `#${mainContentId}`;
    link.textContent = "Lewati ke konten";
    link.className = "skip-to-content";
    link.setAttribute("aria-label", "Lewati ke konten utama");

    document.body.insertBefore(link, document.body.firstChild);
  },

  _injectStyles() {
    if (document.getElementById("skip-to-content-style")) return;

    const style = document.createElement("style");
    style.id = "skip-to-content-style";
    style.textContent = `
      .skip-to-content {
        position: absolute;
        left: -9999px; /* Pindahkan keluar layar secara horizontal */
        top: auto;
        width: 1px; /* Minimalkan ukuran untuk performa */
        height: 1px;
        overflow: hidden; /* Sembunyikan konten yang meluap */
        background-color: #1e90ff;
        color: #fff;
        padding: 10px 16px;
        text-decoration: none;
        z-index: 10000;
        font-weight: 600;
        border-radius: 0 0 6px 0;
        transition: top 0.3s ease, left 0s 0.3s; /* Transisi untuk 'top' saat fokus, tunda transisi 'left' */
      }

      .skip-to-content:focus,
      .skip-to-content:focus-visible {
        left: 0; /* Kembalikan ke posisi normal saat fokus */
        top: 0;
        width: auto; /* Kembalikan ukuran normal */
        height: auto;
        overflow: visible; /* Tampilkan konten */
        outline: 3px solid #ffdd57;
        outline-offset: 2px;
        transition: top 0.3s ease; /* Hanya transisi 'top' saat fokus */
      }
    `;
    document.head.appendChild(style);
  },

  _bindEvent(skipLinkId, mainContentId) {
    document.addEventListener("click", (event) => {
      if (event.target.id === skipLinkId) {
        event.preventDefault();
        const mainElement = document.getElementById(mainContentId);
        if (mainElement) {
          if (!mainElement.hasAttribute("tabindex")) {
            mainElement.setAttribute("tabindex", "-1");
          }
          mainElement.focus({ preventScroll: false });
          mainElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });

    this._observeContentChange(mainContentId);
  },

  _observeContentChange(mainContentId) {
    const observer = new MutationObserver(() => {
      const contentElement = document.getElementById(mainContentId);
      if (contentElement && !contentElement.hasAttribute("tabindex")) {
        contentElement.setAttribute("tabindex", "-1");
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
};

export default skipContent;
