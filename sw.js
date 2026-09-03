const CACHE_NAME = 'aquele-abraco-v5.4.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          // Se achar um cache com nome antigo, deleta sem dó
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// CÉREBRO DO CACHE DINÂMICO (Salva a IA e o modelo offline)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Se já tem salvo no celular, responde na mesma hora (Fricção Zero)
      if (cachedResponse) return cachedResponse;

      // 2. Se não tem, busca na internet
      return fetch(event.request).then((networkResponse) => {
        // Valida se a resposta da internet é boa pra não salvar erro no cache
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
          return networkResponse;
        }

        // 3. Faz um clone do arquivo baixado e guarda no bolso pro futuro
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // 4. Se a internet cair e não tiver cache, força a abertura do index
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Listener de atualização silenciosa (Aquele aviso que aparece na tela do app)
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
