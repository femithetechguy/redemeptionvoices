const CACHE_NAME = 'redemption-voices-v1';
const assets = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js',
    'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js',
    'https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(assets))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});