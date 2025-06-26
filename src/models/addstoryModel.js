import StoryAPI from "../scripts/data/api";

class storyModel {
  constructor() {
    this.currentStory = null;
    this.selectedLocation = null;
    this.selectedPhoto = null;
    this.cameraStream = null;
  }

  // Validasi data cerita
  validateStoryData(description, photo, location = null) {
    const errors = [];

    // Validasi deskripsi
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Deskripsi cerita harus diisi');
    } else if (description.trim().length < 10) {
      errors.push('Deskripsi cerita minimal 10 karakter');
    } else if (description.trim().length > 1000) {
      errors.push('Deskripsi cerita maksimal 1000 karakter');
    }

    // Validasi foto
    if (!photo) {
      errors.push('Foto harus dipilih');
    } else if (!(photo instanceof File)) {
      errors.push('Format foto tidak valid');
    } else {
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(photo.type.toLowerCase())) {
        errors.push('Format foto harus JPG, PNG, atau GIF');
      }

      // Validasi ukuran file (1MB = 1024 * 1024 bytes)
      const maxSize = 1024 * 1024; // 1MB
      if (photo.size > maxSize) {
        errors.push('Ukuran foto maksimal 1MB');
      }

      // Validasi nama file
      if (!photo.name || photo.name.trim().length === 0) {
        errors.push('Nama file foto tidak valid');
      }
    }

    // Validasi lokasi (opsional, tapi jika ada harus valid)
    if (location) {
      if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        errors.push('Koordinat lokasi tidak valid');
      } else {
        // Validasi range koordinat
        if (location.lat < -90 || location.lat > 90) {
          errors.push('Latitude harus antara -90 dan 90');
        }
        if (location.lng < -180 || location.lng > 180) {
          errors.push('Longitude harus antara -180 dan 180');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Fungsi untuk menyimpan cerita
  async saveStory(description, photo, location = null) {
    try {
      // Validasi data sebelum mengirim
      const validation = this.validateStoryData(description, photo, location);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Ambil token dari localStorage
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan. Silakan login kembali.');
      }

      // Siapkan data untuk dikirim
      const storyData = {
        description: description.trim(),
        photo: photo
      };

      // Tambahkan koordinat jika ada
      if (location && location.lat && location.lng) {
        storyData.lat = location.lat;
        storyData.lon = location.lng;
      }

      // Kirim data ke API
      const response = await StoryAPI.addStory(storyData, token);
      
      if (response.error) {
        throw new Error(response.message || 'Gagal menyimpan cerita');
      }

      // Simpan data cerita yang berhasil ditambahkan
      this.currentStory = {
        id: response.data?.id || Date.now(),
        description: description.trim(),
        photo: photo,
        location: location,
        createdAt: new Date().toISOString(),
        ...response.data
      };

      return {
        success: true,
        data: this.currentStory,
        message: 'Cerita berhasil ditambahkan'
      };

    } catch (error) {
      console.error('Error saving story:', error);
      
      // Handle different types of errors
      let errorMessage = error.message;
      
      if (error.message.includes('Token') || error.message.includes('401')) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Permintaan timeout. Coba lagi nanti.';
      }

      return {
        success: false,
        error: errorMessage,
        originalError: error
      };
    }
  }

  // Fungsi untuk mengelola lokasi yang dipilih
  setSelectedLocation(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Koordinat lokasi harus berupa angka');
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude harus antara -90 dan 90');
    }

    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude harus antara -180 dan 180');
    }

    this.selectedLocation = {
      lat: parseFloat(latitude.toFixed(6)),
      lng: parseFloat(longitude.toFixed(6))
    };

    return this.selectedLocation;
  }

  getSelectedLocation() {
    return this.selectedLocation;
  }

  clearSelectedLocation() {
    this.selectedLocation = null;
  }

  // Fungsi untuk mengelola foto yang dipilih
  setSelectedPhoto(photo) {
    if (!photo || !(photo instanceof File)) {
      throw new Error('File foto tidak valid');
    }

    const validation = this.validateStoryData('dummy description', photo);
    if (!validation.isValid) {
      const photoErrors = validation.errors.filter(error => 
        error.includes('foto') || error.includes('Format') || error.includes('Ukuran')
      );
      if (photoErrors.length > 0) {
        throw new Error(photoErrors.join(', '));
      }
    }

    this.selectedPhoto = photo;
    return this.selectedPhoto;
  }

  getSelectedPhoto() {
    return this.selectedPhoto;
  }

  clearSelectedPhoto() {
    this.selectedPhoto = null;
  }

  // Fungsi untuk mengelola stream kamera
  setCameraStream(stream) {
    // Stop existing stream if any
    this.stopCameraStream();
    this.cameraStream = stream;
  }

  getCameraStream() {
    return this.cameraStream;
  }

  stopCameraStream() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  // Fungsi untuk membuat foto dari canvas
  async createPhotoFromCanvas(canvas, quality = 0.9) {
    return new Promise((resolve, reject) => {
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        return reject(new Error('Canvas tidak valid'));
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Gagal membuat foto dari canvas'));
          }

          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(file);
        },
        'image/jpeg',
        quality
      );
    });
  }

  // Fungsi untuk mendapatkan token autentikasi
  getAuthToken() {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  // Fungsi untuk reset semua data
  resetStoryData() {
    this.currentStory = null;
    this.selectedLocation = null;
    this.selectedPhoto = null;
    this.stopCameraStream();
  }

  // Fungsi untuk mendapatkan status validasi realtime
  getValidationStatus(description, photo, location) {
    const validation = this.validateStoryData(description, photo, location);
    
    return {
      overall: validation.isValid,
      description: {
        valid: description && description.trim().length >= 10 && description.trim().length <= 1000,
        message: !description || description.trim().length === 0 
          ? 'Deskripsi belum diisi'
          : description.trim().length < 10
          ? 'Deskripsi minimal 10 karakter'
          : description.trim().length > 1000
          ? 'Deskripsi maksimal 1000 karakter'
          : '✓ Deskripsi valid'
      },
      photo: {
        valid: photo && photo instanceof File && photo.size <= 1024 * 1024,
        message: !photo 
          ? 'Belum ada foto'
          : !(photo instanceof File)
          ? 'Format foto tidak valid'
          : photo.size > 1024 * 1024
          ? 'Ukuran foto terlalu besar'
          : '✓ Foto valid'
      },
      location: {
        valid: !location || (location && typeof location.lat === 'number' && typeof location.lng === 'number'),
        message: !location 
          ? 'Lokasi belum dipilih (opsional)'
          : typeof location.lat !== 'number' || typeof location.lng !== 'number'
          ? 'Koordinat lokasi tidak valid'
          : '✓ Lokasi valid'
      }
    };
  }
}

export default storyModel;