// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-0.1.3";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache HTML, CSS, JavaScript, and PNG files
workbox.routing.registerRoute(
  ({ request }) => {
    return (
      request.destination === 'document' ||
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image'
    ) && request.url.match(/\.(html|css|js|png)$/i);
  },
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);