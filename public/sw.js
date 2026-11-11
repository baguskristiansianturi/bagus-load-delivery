// PLUITS intentionally uses network-first delivery without a persistent app-shell cache.
// On activation, remove caches created by older releases so obsolete screens cannot reappear.
const CACHE_PREFIX = 'pluits-shell-';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith(CACHE_PREFIX)).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Do not intercept requests: HTML and hashed Vite assets always come from the current deployment.
