const CACHE_NAME = 'my-app-cache-v3';
const urlsToCache = [
	'/',
	'/MicroByte/index.html',
	'/MicroByte/script.js',
	'/MicroByte/style.css',
	'/MicroByte/icon.png',
	'/MicroByte/bg.png',
	'/MicroByte/app.webmanifest'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(urlsToCache))
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => response || fetch(event.request))
	);
});
