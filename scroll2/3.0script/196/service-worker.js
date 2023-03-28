const cacheName = 'models-cache-v1';
const assetsToCache = [
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/PI1.gltf",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/DW.gltf",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/V49.gltf",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/Awwward.glb",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/ISA.gltf",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/MallardSTD.glb",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/&ClaretSTD.glb",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/S992.glb",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/Halo.gltf",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/MC.glb",
  "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/IKAC.glb",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      }).catch(() => {
        return caches.match('offline.html');
      })
    );
  });