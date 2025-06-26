const auth = {
  /**
   * Memeriksa apakah pengguna sudah login berdasarkan token di localStorage.
   * @returns {boolean} True jika sudah login, false jika belum.
   */
  checkLoggedIn() {
    return Boolean(localStorage.getItem("token"));
  },

  /**
   * Memeriksa apakah pengguna memiliki akses ke path tertentu,
   * dan melakukan redirect jika tidak memenuhi syarat.
   * @param {string} path - Path tujuan.
   * @returns {boolean} True jika akses diizinkan, false jika tidak.
   */
  requireAuth(path) {
    const publicPaths = ["/login", "/register", "/about"];
    const isPublicPath = publicPaths.includes(path);

    if (!this.checkLoggedIn() && !isPublicPath) {
      window.location.hash = "#/login";
      return false;
    }

    if (this.checkLoggedIn() && ["/login", "/register"].includes(path)) {
      window.location.hash = "#/stories";
      return false;
    }

    return true;
  },
};

export default auth;
