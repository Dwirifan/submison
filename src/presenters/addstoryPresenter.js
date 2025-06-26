import storyModel from "../models/addstoryModel";
import Swal from "sweetalert2";

class addStoryPresenter {
  #view = null;
  #model = null;

  constructor(view) {
    this.#view = view;
    this.#model = new storyModel();
  }

  // Fungsi untuk menambahkan cerita - DIPERBAIKI
  async addStory(description, photo) {
    try {
      // Tampilkan loading state di view
      this.#view.setSubmitButtonLoading(true);

      // Validasi input terlebih dahulu
      if (!description || description.trim().length < 10) {
        throw new Error('Deskripsi minimal 10 karakter');
      }
      
      if (!photo || !(photo instanceof File)) {
        throw new Error('Foto harus dipilih');
      }

      // Gunakan model untuk menyimpan cerita
      const result = await this.#model.saveStory(
        description, 
        photo, 
        this.#model.getSelectedLocation()
      );

      if (result.success) {
        // Tampilkan notifikasi sukses
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form dan redirect
        this.resetForm();
        this.navigateToStories();
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error("Error in addStory presenter:", error);
      
      // Tampilkan error menggunakan SweetAlert
      await Swal.fire({
        icon: "error",
        title: "Gagal Menambahkan Cerita",
        text: error.message || "Terjadi kesalahan yang tidak terduga",
        confirmButtonText: "OK"
      });

      // Jika error terkait autentikasi, redirect ke login
      if (error.message && (
        error.message.includes('Token') || 
        error.message.includes('Sesi') ||
        error.message.includes('login') ||
        error.message.includes('401')
      )) {
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      }

    } finally {
      // Kembalikan state tombol submit
      this.#view.setSubmitButtonLoading(false);
    }
  }

  // Fungsi untuk mengelola kamera
  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Gunakan kamera belakang jika tersedia
        },
        audio: false,
      });

      // Simpan stream di model
      this.#model.setCameraStream(stream);
      
      return stream;
    } catch (error) {
      console.error("Camera access error:", error);
      
      let errorMessage = "Tidak dapat mengakses kamera.";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Izin kamera ditolak. Silakan berikan izin kamera dan coba lagi.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "Kamera tidak ditemukan di perangkat ini.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Kamera sedang digunakan oleh aplikasi lain.";
      }

      throw new Error(errorMessage);
    }
  }

  async stopCamera() {
    this.#model.stopCameraStream();
  }

  // Fungsi untuk mengambil foto dari kamera
  async capturePhotoFromCamera(videoElement, canvasElement) {
    try {
      if (!videoElement || !canvasElement) {
        throw new Error("Element video atau canvas tidak ditemukan");
      }

      if (!videoElement.srcObject) {
        throw new Error("Kamera belum aktif");
      }

      // Set ukuran canvas sesuai video
      canvasElement.width = videoElement.videoWidth || 640;
      canvasElement.height = videoElement.videoHeight || 480;

      // Gambar frame dari video ke canvas
      const context = canvasElement.getContext("2d");
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Konversi canvas ke file
      const photoFile = await this.#model.createPhotoFromCanvas(canvasElement, 0.9);
      
      // Validasi dan simpan foto di model
      this.#model.setSelectedPhoto(photoFile);
      
      return photoFile;

    } catch (error) {
      console.error("Error capturing photo:", error);
      throw error;
    }
  }

  // Fungsi untuk memvalidasi dan mengatur foto dari file upload - DIPERBAIKI
  setPhotoFromFile(file) {
    try {
      this.#model.setSelectedPhoto(file);
      return true;
    } catch (error) {
      console.error("Error setting photo from file:", error);
      throw error;
    }
  }

  // Method validateImage yang dipanggil dari page
  validateImage(file) {
    try {
      return this.validateImageFile(file);
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk mengatur lokasi - DIPERBAIKI
  setSelectedLocation(locationObj) {
    try {
      // Terima objek {lat, lng} atau dua parameter terpisah
      if (typeof locationObj === 'object' && locationObj.lat && locationObj.lng) {
        return this.#model.setSelectedLocation(locationObj.lat, locationObj.lng);
      } else if (arguments.length === 2) {
        // Untuk backward compatibility
        return this.#model.setSelectedLocation(arguments[0], arguments[1]);
      } else {
        throw new Error('Format lokasi tidak valid');
      }
    } catch (error) {
      console.error("Error setting location:", error);
      throw error;
    }
  }

  getSelectedLocation() {
    return this.#model.getSelectedLocation();
  }

  // Fungsi untuk mendapatkan status validasi realtime
  getValidationStatus(description, photo) {
    const location = this.#model.getSelectedLocation();
    return this.#model.getValidationStatus(description, photo, location);
  }

  // Fungsi untuk mendapatkan foto yang sedang dipilih
  getSelectedPhoto() {
    return this.#model.getSelectedPhoto();
  }

  // Fungsi untuk menghapus foto yang dipilih
  clearSelectedPhoto() {
    try {
      this.#model.clearSelectedPhoto();
      return true;
    } catch (error) {
      console.error("Error clearing photo:", error);
      return false;
    }
  }

  // Fungsi untuk menghapus lokasi yang dipilih
  clearSelectedLocation() {
    this.#model.clearSelectedLocation();
  }

  // Fungsi untuk reset seluruh form
  resetForm() {
    this.#model.resetStoryData();
    this.#view.resetFormUI();
  }

  // Fungsi navigasi
  navigateToStories() {
    window.location.hash = "#/stories";
  }

  navigateToLogin() {
    window.location.hash = "#/login";
  }

  // Fungsi untuk mendapatkan stream kamera yang aktif
  getCameraStream() {
    return this.#model.getCameraStream();
  }

  // Fungsi untuk validasi file secara standalone
  validateImageFile(file) {
    try {
      const validation = this.#model.validateStoryData('dummy description', file);
      if (!validation.isValid) {
        const photoErrors = validation.errors.filter(error => 
          error.includes('foto') || error.includes('Format') || error.includes('Ukuran')
        );
        if (photoErrors.length > 0) {
          throw new Error(photoErrors.join(', '));
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Fungsi untuk mendapatkan preview URL dari foto
  getPhotoPreviewURL(photo) {
    if (!photo || !(photo instanceof File)) {
      return null;
    }
    
    try {
      return URL.createObjectURL(photo);
    } catch (error) {
      console.error("Error creating preview URL:", error);
      return null;
    }
  }

  // Fungsi untuk cleanup URL object
  revokePhotoPreviewURL(url) {
    if (url && typeof url === 'string') {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error revoking URL:", error);
      }
    }
  }

  // Fungsi untuk mendapatkan informasi file foto
  getPhotoFileInfo(photo) {
    if (!photo || !(photo instanceof File)) {
      return null;
    }

    const sizeInMB = (photo.size / (1024 * 1024)).toFixed(2);
    
    return {
      name: photo.name,
      size: photo.size,
      sizeFormatted: `${sizeInMB} MB`,
      type: photo.type,
      lastModified: new Date(photo.lastModified).toLocaleString()
    };
  }

  // Cleanup ketika presenter tidak digunakan lagi
  destroy() {
    // Stop camera stream jika masih aktif
    this.stopCamera();
    
    // Reset model data
    this.#model.resetStoryData();
    
    // Clear references
    this.#view = null;
    this.#model = null;
  }
}

export default addStoryPresenter;