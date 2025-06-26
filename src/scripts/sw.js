// sw.js
self.addEventListener('push', (event) => {
  let data = {
    title: 'Notifikasi Baru',
    options: {
      body: 'Ada notifikasi baru untuk Anda!',
    },
    url: '/#/stories',
  };
  if (event.data) {
    try {
      const parsedData = event.data.json();
      data = {
        ...data,
        ...parsedData, 
      };
    } catch (error) {
      data.options.body = event.data.text();
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

  const title = data.title || 'Story App';

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

//handle notifikasi
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL(event.notification.data?.url || '/#/stories', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const matchingClient = clientsArr.find((client) => client.url === urlToOpen);
      if (matchingClient) return matchingClient.focus();
      return clients.openWindow(urlToOpen);
    })
  );
});
