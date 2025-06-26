import addStoryPresenter from "../../presenters/addstoryPresenter";
import MapHelper from "../../scripts/utils/map";

class addStoryPage {
  #presenter = null;
  #map = null;

  constructor() {
    this.#presenter = new addStoryPresenter(this);
  }

  async render() {
    return `
      <section class="add-story container">
        <h1 id="main-content" class="add-story__title">
         Tambahkan Cerita Baru
        </h1>
        
        <form id="addStoryForm" class="add-story__form">
          <div class="form-group">
  
            <!-- Lokasi -->
            <div class="form-group">
              <label for="location">
                <i class="fas fa-map-marker-alt"></i> Pilih Lokasi <span class="required">*</span>
              </label>
              <div id="map" class="add-story__map"></div>
              <p class="map-help">
                <i class="fas fa-info-circle"></i> Klik peta untuk menentukan lokasi Anda
              </p>
              <div id="coordinateDisplay" class="coordinate-display" style="display: none;">
                <i class="fas fa-map-pin"></i> 
                Latitude: <span id="latitudeValue">-</span>, 
                Longitude: <span id="longitudeValue">-</span>
              </div>
              <small id="locationStatus" class="form-help"></small>
            </div>
  
            <!-- Deskripsi Cerita -->
            <label for="description">
              <i class="fas fa-pencil-alt"></i> Ceritakan Pengalaman Anda <span class="required">*</span>
            </label>
            <textarea 
              id="description" 
              name="description" 
              required 
              placeholder="Ceritakan momen spesial yang ingin Anda bagi..."
            ></textarea>
            <small id="descriptionStatus" class="form-help"></small>
          </div>
  
          <!-- Unggah Foto -->
          <div class="form-group">
            <label for="photo">
              <i class="fas fa-camera"></i> Unggah Foto <span class="required">*</span>
            </label>
            <div class="photo-input-container">
              <div class="camera-container">
                <video id="cameraPreview" class="camera-preview" autoplay playsinline style="display: none;"></video>
                <canvas id="photoCanvas" class="photo-canvas" style="display: none;"></canvas>
              </div>
              
              <!-- Tombol Kamera -->
              <div class="camera-buttons">
                <button type="button" id="startCamera" class="camera-button">
                  <i class="fas fa-camera"></i> Aktifkan Kamera
                </button>
                <button type="button" id="closeCamera" class="camera-button camera-button--danger" style="display: none;">
                  <i class="fas fa-times"></i> Tutup Kamera
                </button>
                <button type="button" id="capturePhoto" class="camera-button" style="display: none;">
                  <i class="fas fa-camera"></i> Ambil Foto
                </button>
                <button type="button" id="retakePhoto" class="camera-button" style="display: none;">
                  <i class="fas fa-redo"></i> Ambil Ulang
                </button>
              </div>
              
              <!-- Pilih File Foto -->
              <div class="upload-divider">atau</div>
              <div class="upload-container">
                <div class="file-input-wrapper">
                  <label for="photo" class="upload-button">
                    <i class="fas fa-upload"></i> Pilih Foto
                  </label>
                  <input 
                    type="file" 
                    id="photo" 
                    name="photo" 
                    accept="image/*" 
                    class="file-input"
                  >
                </div>
                <p class="file-help">Format yang diterima: JPG, PNG, GIF (maks. 1MB)</p>
                <small id="photoStatus" class="form-help"></small>
                
                <!-- Preview Foto -->
                <div id="imagePreview" class="image-preview" style="display: none;">
                  <img id="previewImage" class="preview-image">
                  <button type="button" id="removeImage" class="camera-button camera-button--danger">&times;</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tombol Kirim -->
          <button type="submit" class="submit-button">
            <i class="fas fa-paper-plane"></i> Kirim Cerita Anda
          </button>
  
          <p class="required-note">
            <span class="required">*</span> Kolom ini wajib diisi
          </p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Ambil elemen-elemen form dan UI
    const formElement = document.getElementById("addStoryForm");
    const videoPreview = document.getElementById("cameraPreview");
    const canvasElement = document.getElementById("photoCanvas");
    const btnStartCamera = document.getElementById("startCamera");
    const btnStopCamera = document.getElementById("closeCamera");
    const btnCapture = document.getElementById("capturePhoto");
    const btnRetake = document.getElementById("retakePhoto");
    const inputFile = document.getElementById("photo");
    const previewContainer = document.getElementById("imagePreview");
    const imgPreview = document.getElementById("previewImage");
    const btnRemoveImage = document.getElementById("removeImage");
    const mapBox = document.getElementById("map");

    // Koordinat dan status UI
    const coordInfo = document.getElementById("coordinateDisplay");
    const latText = document.getElementById("latitudeValue");
    const lngText = document.getElementById("longitudeValue");

    const descStatus = document.getElementById("descriptionStatus");
    const photoStatus = document.getElementById("photoStatus");
    const locStatus = document.getElementById("locationStatus");

    // Variabel penampung file foto
    let currentPhoto = null;

    // Debug log sederhana
    console.info("Memuat elemen-elemen form dan tampilan...");

    // Inisialisasi peta dengan mode interaktif
    this.#map = MapHelper.initMap(mapBox, true);

    // Fungsi untuk memperbarui indikator status input
    const refreshStatus = () => {
      const descValue = document.getElementById("description").value.trim();

      // Status deskripsi
      if (descValue.length === 0) {
        descStatus.textContent = "Deskripsi belum diisi";
        descStatus.className = "form-help text-warning";
      } else if (descValue.length < 10) {
        descStatus.textContent = "Deskripsi minimal 10 karakter";
        descStatus.className = "form-help text-warning";
      } else {
        descStatus.textContent = "✓ Deskripsi tersedia";
        descStatus.className = "form-help text-success";
      }

      // Status foto
      if (!currentPhoto) {
        photoStatus.textContent = "Belum ada foto";
        photoStatus.className = "form-help text-warning";
      } else {
        photoStatus.textContent = "✓ Foto terpilih";
        photoStatus.className = "form-help text-success";
      }

      // Status lokasi
      if (!this.#presenter.getSelectedLocation()) {
        locStatus.textContent = "Belum ada lokasi dipilih";
        locStatus.className = "form-help text-warning";
      } else {
        locStatus.textContent = "✓ Lokasi telah dipilih";
        locStatus.className = "form-help text-success";
      }
    };

    refreshStatus();

    // Event untuk input deskripsi
    document
      .getElementById("description")
      .addEventListener("input", refreshStatus);

    // Mulai kamera
    btnStartCamera.addEventListener("click", async () => {
      try {
        const stream = await this.#presenter.startCamera();
        if (!stream) throw new Error("Kamera tidak tersedia");

        videoPreview.srcObject = stream;
        await videoPreview.play();

        // Tampilkan kontrol kamera
        videoPreview.style.display = "block";
        btnStartCamera.style.display = "none";
        btnStopCamera.style.display = "block";
        btnCapture.style.display = "block";
      } catch (err) {
        console.error("Kamera gagal dimulai:", err);
        alert("Kamera tidak dapat diakses. Periksa izin atau perangkat.");
      }
    });

    // Stop kamera
    btnStopCamera.addEventListener("click", async () => {
      await this.#presenter.stopCamera();
      videoPreview.srcObject = null;
      videoPreview.style.display = "none";
      btnStopCamera.style.display = "none";
      btnCapture.style.display = "none";
      btnStartCamera.style.display = "block";
    });

    // Ambil foto dari kamera - DIPERBAIKI
    btnCapture.addEventListener("click", async () => {
      try {
        if (!videoPreview.srcObject) throw new Error("Kamera belum aktif");

        // Sesuaikan ukuran kanvas
        canvasElement.width = videoPreview.videoWidth;
        canvasElement.height = videoPreview.videoHeight;

        const context = canvasElement.getContext("2d");
        context.drawImage(
          videoPreview,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // Konversi hasil ke File
        currentPhoto = await new Promise((resolve, reject) => {
          canvasElement.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Gagal ambil foto"));

              const file = new File([blob], "photo.jpg", {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(file);
            },
            "image/jpeg",
            0.9
          );
        });

        // Validasi dan set foto di presenter
        this.#presenter.validateImage(currentPhoto);
        this.#presenter.setPhotoFromFile(currentPhoto);
        
        imgPreview.src = URL.createObjectURL(currentPhoto);
        previewContainer.style.display = "inline-block";

        // Ubah tampilan UI
        videoPreview.style.display = "none";
        canvasElement.style.display = "block";
        btnCapture.style.display = "none";
        btnStopCamera.style.display = "none";
        btnRetake.style.display = "block";

        await this.#presenter.stopCamera();
        refreshStatus();
      } catch (err) {
        console.error("Kesalahan ambil foto:", err);
        alert("Foto gagal diambil: " + err.message);
      }
    });

    // Ulang foto
    btnRetake.addEventListener("click", async () => {
      try {
        const stream = await this.#presenter.startCamera();
        videoPreview.srcObject = stream;
        await videoPreview.play();

        // Reset tampilan
        videoPreview.style.display = "block";
        canvasElement.style.display = "none";
        previewContainer.style.display = "none";
        btnCapture.style.display = "block";
        btnStopCamera.style.display = "block";
        btnRetake.style.display = "none";

        currentPhoto = null;
        this.#presenter.clearSelectedPhoto();
        refreshStatus();
      } catch (err) {
        alert("Tidak bisa memulai ulang kamera.");
      }
    });

    // Upload manual dari file - DIPERBAIKI
    inputFile.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        this.#presenter.validateImage(file);
        this.#presenter.setPhotoFromFile(file);
        currentPhoto = file;

        imgPreview.src = URL.createObjectURL(file);
        previewContainer.style.display = "inline-block";

        await this.#presenter.stopCamera();

        videoPreview.style.display = "none";
        canvasElement.style.display = "none";
        btnCapture.style.display = "none";
        btnStopCamera.style.display = "none";
        btnRetake.style.display = "none";
        btnStartCamera.style.display = "block";

        refreshStatus();
      } catch (err) {
        alert("File tidak valid: " + err.message);
        inputFile.value = "";
      }
    });

    // Hapus gambar yang dipilih - DIPERBAIKI
    btnRemoveImage.addEventListener("click", () => {
      currentPhoto = null;
      this.#presenter.clearSelectedPhoto();
      inputFile.value = "";
      previewContainer.style.display = "none";
      refreshStatus();
    });

    // Event untuk pemilihan lokasi peta
    mapBox.addEventListener("locationselected", (event) => {
      const { lat, lng } = event.detail;
      latText.textContent = lat.toFixed(6);
      lngText.textContent = lng.toFixed(6);
      coordInfo.style.display = "block";

      this.#presenter.setSelectedLocation({ lat, lng });
      refreshStatus();
    });

    // Submit form cerita - DIPERBAIKI
    formElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btnSubmit = formElement.querySelector('button[type="submit"]');
      
      try {
        // Validasi sebelum submit
        const storyText = document.getElementById("description").value.trim();
        const selectedLocation = this.#presenter.getSelectedLocation();
        
        if (!storyText || storyText.length < 10) {
          alert("Deskripsi minimal 10 karakter");
          return;
        }
        
        if (!currentPhoto) {
          alert("Foto harus dipilih");
          return;
        }

        // Set loading state
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

        // Kirim data menggunakan presenter
        await this.#presenter.addStory(storyText, currentPhoto);
      } catch (err) {
        console.error("Gagal mengirim cerita:", err);
        alert("Terjadi kesalahan saat mengirim cerita: " + err.message);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Cerita Anda';
      }
    });
  }

  // Method untuk mengatur loading state tombol submit
  setSubmitButtonLoading(isLoading) {
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      if (isLoading) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Cerita Anda';
      }
    }
  }

  // Method untuk reset tampilan form
  resetFormUI() {
    // Reset form
    const form = document.getElementById('addStoryForm');
    if (form) {
      form.reset();
    }

    // Reset preview gambar
    const previewContainer = document.getElementById('imagePreview');
    if (previewContainer) {
      previewContainer.style.display = 'none';
    }

    // Reset tampilan kamera
    const videoPreview = document.getElementById('cameraPreview');
    const canvasElement = document.getElementById('photoCanvas');
    const btnStartCamera = document.getElementById('startCamera');
    const btnStopCamera = document.getElementById('closeCamera');
    const btnCapture = document.getElementById('capturePhoto');
    const btnRetake = document.getElementById('retakePhoto');

    if (videoPreview) {
      videoPreview.style.display = 'none';
      videoPreview.srcObject = null;
    }
    if (canvasElement) {
      canvasElement.style.display = 'none';
    }
    if (btnStartCamera) btnStartCamera.style.display = 'block';
    if (btnStopCamera) btnStopCamera.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'none';
    if (btnRetake) btnRetake.style.display = 'none';

    // Reset koordinat
    const coordInfo = document.getElementById('coordinateDisplay');
    if (coordInfo) {
      coordInfo.style.display = 'none';
    }

    // Reset status
    const descStatus = document.getElementById('descriptionStatus');
    const photoStatus = document.getElementById('photoStatus');
    const locStatus = document.getElementById('locationStatus');

    if (descStatus) {
      descStatus.textContent = 'Deskripsi belum diisi';
      descStatus.className = 'form-help text-warning';
    }
    if (photoStatus) {
      photoStatus.textContent = 'Belum ada foto';
      photoStatus.className = 'form-help text-warning';
    }
    if (locStatus) {
      locStatus.textContent = 'Belum ada lokasi dipilih';
      locStatus.className = 'form-help text-warning';
    }
  }
}

export default addStoryPage;