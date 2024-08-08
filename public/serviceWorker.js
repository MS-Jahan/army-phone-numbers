// src/serviceWorker.js
import { precacheAndRoute } from 'workbox-precaching';

// Configure the service worker to cache the app's assets
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('fetch', event => {
  // Add custom offline handling logic here
  // For example, you can cache API responses or serve a fallback page
});