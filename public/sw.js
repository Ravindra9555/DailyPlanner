self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('message', (event) => {
  console.log('SW: Received message', event.data);
  const { type, task, dateKey } = event.data;
  if (type === 'scheduleNotification') {
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const notificationTime = new Date(dateKey);
    notificationTime.setHours(hours, minutes, 0, 0);
    if (notificationTime > new Date()) {
      const timeUntilNotification = notificationTime.getTime() - Date.now();
      console.log(`SW: Scheduling ${task.title} in ${timeUntilNotification} ms`);
      setTimeout(() => {
        console.log(`SW: Firing notification for ${task.title}`);
        self.registration.showNotification('Task Reminder', {
          body: `It's time for: ${task.title}`,
          icon: '/android-icon-192x192.png',
        });
      }, timeUntilNotification);
    } else {
      console.log(`SW: Notification time ${notificationTime} is in the past, skipping`);
    }
  }
});