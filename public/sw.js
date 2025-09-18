// public/sw.js
self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Message';
  const message = data.message || 'You have a new message';
  const icon = data.icon || '/icon-192x192.png';

  const notificationPromise = self.registration.showNotification(title, {
    body: message,
    icon: icon,
    badge: '/badge-72x72.png',
    tag: 'chat-message',
    requireInteraction: true,
    data: {
      url: data.url || '/'
    }
  });

  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});