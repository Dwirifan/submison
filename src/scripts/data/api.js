import CONFIG from "../config.js";

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  DELETE_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE_NOTIFICATIONS: `${CONFIG.BASE_URL}/notifications/subscribe`,
};
export function getAccessToken() {
  return localStorage.getItem('accessToken') || '';
}

const StoryAPI = {
  // Private method untuk handle HTTP errors
  _handleHTTPError(response, result) {
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(result.message || "Data yang dikirim tidak valid");
        case 401:
          throw new Error(
            "Token tidak valid atau sudah expired. Silakan login kembali."
          );
        case 403:
          throw new Error("Akses ditolak");
        case 404:
          throw new Error("Data tidak ditemukan");
        case 413:
          throw new Error(
            "File terlalu besar. Maksimal ukuran file adalah 1MB"
          );
        case 500:
          throw new Error("Server sedang bermasalah, coba lagi nanti");
        default:
          throw new Error(
            result.message || `Error ${response.status}: ${response.statusText}`
          );
      }
    }
  },

  // Private method untuk handle network errors
  _handleNetworkError(error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
      );
    }
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Coba lagi nanti.");
    }
    throw error;
  },

  // Private method untuk validate token
  _validateToken(token) {
    if (!token || typeof token !== "string" || token.trim() === "") {
      throw new Error(
        "Token authentication tidak tersedia. Silakan login kembali."
      );
    }
  },

  async login({ email, password }) {
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("Email atau password tidak valid");
          case 401:
            throw new Error("Email atau password salah");
          case 404:
            throw new Error("Akun tidak ditemukan");
          case 500:
            throw new Error("Server sedang bermasalah, coba lagi nanti");
          default:
            throw new Error(
              result.message ||
                `Error ${response.status}: ${response.statusText}`
            );
        }
      }

      return {
        error: false,
        message: result.message || "Login berhasil",
        loginResult: result.loginResult,
      };
    } catch (error) {
      this._handleNetworkError(error);
    }
  },

  async register({ name, email, password }) {
    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        this._handleHTTPError(response, result);
      }

      return {
        error: false,
        message: result.message || "Registrasi berhasil",
      };
    } catch (error) {
      this._handleNetworkError(error);
    }
  },

  // Fungsi untuk mengambil daftar cerita
  async getStories(token, { page = 1, size = 10, location = 0 } = {}) {
    try {
      this._validateToken(token);

      const url = new URL(ENDPOINTS.GET_STORIES);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("size", size.toString());
      url.searchParams.append("location", location.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        this._handleHTTPError(response, result);
      }

      return {
        error: false,
        message: result.message || "Berhasil mengambil daftar cerita",
        listStory: result.listStory || [],
        totalCount: result.totalCount || 0,
        currentPage: page,
      };
    } catch (error) {
      console.error("Get stories error:", error);
      this._handleNetworkError(error);
    }
  },

  // Fungsi untuk mengambil detail cerita berdasarkan ID
  async getStoryById(id, token) {
    try {
      if (!id) {
        throw new Error("ID cerita tidak boleh kosong");
      }

      this._validateToken(token);

      const response = await fetch(ENDPOINTS.GET_STORY_DETAIL(id), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        this._handleHTTPError(response, result);
      }

      // Validasi format response
      if (!result.story) {
        throw new Error("Format response dari server tidak valid");
      }

      return {
        error: false,
        message: result.message || "Berhasil mengambil detail cerita",
        story: result.story,
      };
    } catch (error) {
      console.error("Get story detail error:", error);
      return {
        error: true,
        message: error.message || "Gagal mengambil detail cerita",
        story: null,
      };
    }
  },

  // Menambahkan cerita
  async addStory({ description, photo, lat, lon }, token) {
    try {
      this._validateToken(token);

      // Validasi input sebelum membuat FormData
      if (!description || !photo || !(photo instanceof File)) {
        return {
          error: true,
          message: !description
            ? "Deskripsi tidak boleh kosong"
            : !photo
            ? "Foto tidak ditemukan"
            : !(photo instanceof File)
            ? "Format foto tidak valid"
            : "Data tidak lengkap",
        };
      }

      // Validasi ukuran file (1MB = 1024 * 1024 bytes)
      const maxSize = 1024 * 1024; 
      if (photo.size > maxSize) {
        return {
          error: true,
          message: "Ukuran foto terlalu besar. Maksimal 1MB",
        };
      }

      // Validasi tipe file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(photo.type)) {
        return {
          error: true,
          message:
            "Format foto tidak didukung. Gunakan format JPEG, PNG, atau WebP",
        };
      }

      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("photo", photo);

      // Validasi koordinat jika ada
      if (lat !== undefined && lon !== undefined) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
          return {
            error: true,
            message: "Koordinat lokasi tidak valid",
          };
        }

        if (latitude < -90 || latitude > 90) {
          return {
            error: true,
            message: "Latitude harus berada dalam rentang -90 sampai 90",
          };
        }

        if (longitude < -180 || longitude > 180) {
          return {
            error: true,
            message: "Longitude harus berada dalam rentang -180 sampai 180",
          };
        }

        formData.append("lat", latitude.toString());
        formData.append("lon", longitude.toString());
      }

      // Set up timeout untuk request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); 
      const response = await fetch(ENDPOINTS.ADD_STORY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        this._handleHTTPError(response, result);
      }

      return {
        error: false,
        message: result.message || "Cerita berhasil ditambahkan",
      };
    } catch (error) {
      console.error("Add story error:", error);

      if (error.name === "AbortError") {
        return { error: true, message: "Request timeout. Coba lagi nanti." };
      }

      if (error instanceof TypeError) {
        return {
          error: true,
          message:
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        };
      }

      return {
        error: true,
        message: error.message || "Terjadi kesalahan saat menambahkan cerita",
      };
    }
  },

  // logout
  logout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        error: false,
        message: "Logout berhasil",
      };
    } catch (error) {
      return {
        error: true,
        message: "Gagal logout",
      };
    }
  },

  // Method untuk get current user token
  getCurrentToken() {
    return localStorage.getItem("token");
  },

  // Method untuk validate current token
  async validateCurrentToken() {
    const token = this.getCurrentToken();
    if (!token) {
      return { valid: false, message: "Token tidak ditemukan" };
    }

    try {
      const response = await this.getStories(token, { page: 1, size: 1 });
      return {
        valid: !response.error,
        message: response.error ? response.message : "Token valid",
      };
    } catch (error) {
      return {
        valid: false,
        message: "Token tidak valid atau expired",
      };
    }
  },

  // notification
async subscribeNotification(subscription) {
    try {
      const token = localStorage.getItem('token'); // atau cara Anda mendapatkan token
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengirim data subscription ke server');
      }
      return result;
    } catch (error) {
      console.error('Error in subscribeNotification:', error);
      throw error;
    }
  },

  // FUNGSI UNTUK MENGHAPUS DATA LANGGANAN DARI SERVER
  async unsubscribeNotification(endpoint) {
    try {
      const token = localStorage.getItem('token'); // atau cara Anda mendapatkan token
      if (!token) throw new Error('Token tidak ditemukan. Silakan login.');

      const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghapus subscription dari server');
      }
      return result;
    } catch (error) {
      console.error('Error in unsubscribeNotification:', error);
      throw error;
    }
  },
};

export default StoryAPI;
