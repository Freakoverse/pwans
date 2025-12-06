// Service Worker notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification.tag);

    // Close the notification
    event.notification.close();

    // Get the request data from notification
    const data = event.notification.data;

    // Open or focus the PWA
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUntracked: true }).then((clientList) => {
            // If a window is already open, focus it
            for (const client of clientList) {
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    return client.focus().then(() => {
                        // Send message to focus the request
                        if (data && data.requestId) {
                            client.postMessage({
                                type: 'FOCUS_REQUEST',
                                requestId: data.requestId
                            });
                        }
                    });
                }
            }
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/').then((client) => {
                    // Wait a bit for the app to load, then send focus message
                    if (client && data && data.requestId) {
                        setTimeout(() => {
                            client.postMessage({
                                type: 'FOCUS_REQUEST',
                                requestId: data.requestId
                            });
                        }, 1000);
                    }
                });
            }
        })
    );
});

console.log('[SW] Notification click handler loaded');
