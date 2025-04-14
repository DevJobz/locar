const CACHE_NAME = 'locar-cache-v5';
const ASSETS = [
  '/locar-mvp/',
  '/locar-mvp/index.html',
  '/locar-mvp/painel-locador.html',
  '/locar-mvp/js/auth-utils.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.log('Falha ao instalar cache:', err))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de API e SVGs inline
  if (event.request.url.includes('viacep.com.br') || 
      event.request.url.includes('nominatim.openstreetmap.org') ||
      event.request.url.includes('data:image/svg+xml')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});