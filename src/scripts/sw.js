import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// ✅ Precache App Shell
precacheAndRoute(self.__WB_MANIFEST);

// ✅ API Dicoding - semua endpoint
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new NetworkFirst({
    cacheName: 'story-api-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ✅ Semua gambar (termasuk dari story-api)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ✅ Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ✅ CDN seperti FontAwesome
registerRoute(
  ({ url }) => url.origin === 'https://cdnjs.cloudflare.com' || url.href.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'cdn-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ✅ Push Notification Handler
self.addEventListener('push', async (event) => {
  let data = {
    title: 'Notifikasi Baru',
    options: {
      body: 'Ada notifikasi baru untuk Anda!',
    },
    url: '/#/stories',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (error) {
      const fallbackBody = await event.data.text();
      data.options.body = fallbackBody;
    }
  }

  const options = {
    body: data.options?.body || 'Ada notifikasi baru!',
    icon: '/images/favicon.png',
    badge: '/images/favicon.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/#/stories',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Story App', options));
});

// ✅ Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(
    event.notification.data?.url || '/#/stories',
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const matchingClient = clientList.find((client) => client.url === urlToOpen);
      if (matchingClient) return matchingClient.focus();
      return clients.openWindow(urlToOpen);
    })
  );
});
