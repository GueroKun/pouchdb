const STATIC_CACHE = 'app-shell-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

const paginas = [
  '/',
  '/index.html',
  '/app.js',
  '/register.js'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(paginas))
  );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (paginas.includes(url.pathname)) {
        event.respondWith(caches.match(request));
        return;
    }
});
