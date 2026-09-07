/* Wasiyyah Service Worker — offline support
   Strategy: network-first for pages (so updates arrive),
   cache fallback when offline. Fonts/icons cached on first use. */

'use strict';

var CACHE = 'wasiyyah-v2';

var CORE = [
  '/index.html',
  '/wasiyyah.html',
  '/reviews.html',
  '/privacy.html',
  '/terms.html',
  '/disclaimer.html',
  '/404.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* Cache core files individually so one missing file
         does not break the whole install */
      return Promise.all(CORE.map(function (url) {
        return c.add(url).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  /* Never cache Supabase or other API calls — always live */
  if (url.hostname.indexOf('supabase.co') !== -1 ||
      url.hostname.indexOf('er-api.com') !== -1) return;

  /* Pages: network first, cache fallback (offline) */
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
    return;
  }

  /* Everything else (fonts, icons, css): cache first, then network */
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type !== 'opaque') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {});
    })
  );
});
