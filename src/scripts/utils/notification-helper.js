// scripts/utils/notification-helper.js

import StoryAPI from "../data/api"; // Pastikan path ini benar
import CONFIG from "../config"; // Pastikan path ini benar

const NotificationHelper = {
  // Fungsi untuk mengubah VAPID key menjadi format yang benar
  _urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
  },

  // Memeriksa apakah pengguna sudah berlangganan notifikasi
  async isSubscribed() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker tidak tersedia di browser ini.');
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
},

  // Proses untuk berlangganan (subscribe)
  async subscribe() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Izin notifikasi tidak diberikan.");
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this._urlBase64ToUint8Array(CONFIG.VAPID_KEY),
      });

      console.log("✅ Berhasil subscribe di browser:", subscription.toJSON());

      // Kirim subscription ke server
      const { endpoint, keys } = subscription.toJSON();
      await StoryAPI.subscribeNotification({
        endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth,
        },
      });

      console.log("✅ Subscription berhasil dikirim ke server.");

      alert("Berhasil mengaktifkan notifikasi!");
    } catch (error) {
      console.error("❌ Gagal subscribe:", error);
      alert(`Gagal mengaktifkan notifikasi: ${error.message}`);
      throw error;
    }
  },

  // Proses untuk berhenti berlangganan (unsubscribe)
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        return; // Sudah tidak subscribe, tidak perlu melakukan apa-apa
      }

      const endpoint = subscription.endpoint;

      // Hapus dari server terlebih dahulu
      await StoryAPI.unsubscribeNotification(endpoint);
      console.log("✅ Berhasil unsubscribe dari server.");

      // Hapus dari browser
      await subscription.unsubscribe();
      console.log("✅ Berhasil unsubscribe dari browser.");

      alert("Berhasil menonaktifkan notifikasi.");
    } catch (error) {
      console.error("❌ Gagal unsubscribe:", error);
      alert(`Gagal menonaktifkan notifikasi: ${error.message}`);
      throw error;
    }
  },

  // Fungsi utama yang dipanggil oleh tombol toggle
  async toggleSubscription(buttonElement) {
    buttonElement.disabled = true; // Nonaktifkan tombol selama proses
    try {
      const subscribed = await this.isSubscribed();
      if (subscribed) {
        await this.unsubscribe();
      } else {
        await this.subscribe();
      }
    } finally {
      buttonElement.disabled = false; 
      this.updateToggleButtonUI(buttonElement);
    }
  },

  // Fungsi untuk memperbarui tampilan tombol
  async updateToggleButtonUI(buttonElement) {
    if (!buttonElement) return;

    try {
      const subscribed = await this.isSubscribed();
      if (subscribed) {
        buttonElement.innerHTML =
          '<i class="fas fa-bell-slash"></i>';
        buttonElement.classList.add("subscribed");
      } else {
        buttonElement.innerHTML =
          '<i class="fas fa-bell"></i>';
        buttonElement.classList.remove("subscribed");
      }
    } catch (error) {
      console.error("Gagal memperbarui tombol:", error);
      buttonElement.innerHTML = "Error";
      buttonElement.disabled = true;
    }
  },
};

export default NotificationHelper;
