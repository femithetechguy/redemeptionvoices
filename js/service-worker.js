const CACHE_NAME = 'redemption-voices-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const assets = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.json',
    '/offline.html',
    'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js',
    'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js',
    'https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css'
];

// Cache size limit
const limitCacheSize = (cacheName, size) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(cacheName, size));
            }
        });
    });
};

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching shell assets');
                return cache.addAll(assets);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
                .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cacheRes => {
                return cacheRes || fetch(event.request).then(fetchRes => {
                    return caches.open(DYNAMIC_CACHE).then(cache => {
                        if (!/^https?:$/i.test(new URL(event.request.url).protocol)) return fetchRes;
                        cache.put(event.request.url, fetchRes.clone());
                        limitCacheSize(DYNAMIC_CACHE, 15);
                        return fetchRes;
                    });
                });
            }).catch(() => {
                if (event.request.url.indexOf('.html') > -1) {
                    return caches.match('/offline.html');
                }
            })
    );
});