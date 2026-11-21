const VERSION = 'caveat-red-v1.0.1-ui-restore';
const SHELL = ['./', './index.html', './manifest.webmanifest', './assets/favicon-32.png', './assets/icon-192.png', './assets/icon-512.png'];
self.addEventListener('install', (event) => event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('caveat-red-') && key !== VERSION).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (!response.ok || response.type !== 'basic') return response;
    const copy = response.clone(); caches.open(VERSION).then((cache) => cache.put(request, copy)); return response;
  }).catch(() => request.mode === 'navigate' ? caches.match('./index.html') : new Response('', { status: 504, statusText: 'Offline' }))));
});
