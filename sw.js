// Sunday Music service worker: caches the app shell only.
// It never touches the Apps Script API (script.google.com / googleusercontent.com)
// or any cross-origin request, so sheet data is always live.
const CACHE = 'sunday-music-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/home-icon-v5.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // API, fonts: straight to network
  if (url.search && /(^|[?&])(callback|api)=/.test(url.search)) return;
  if (/\/exec\b/.test(url.pathname)) return;

  // Page itself: network first (so updates show up), cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Icons/manifest: cache first.
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
