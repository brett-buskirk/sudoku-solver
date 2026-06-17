/*
 * Service worker: caches the app shell so the solver works offline and can be
 * installed as a PWA. Cache-first since every asset is static; bump CACHE to
 * ship updated files.
 */
const CACHE = 'sudoku-v1'

// Paths are relative to this file, so they resolve correctly when the site is
// served from a subpath (e.g. GitHub Pages at /sudoku-solver/).
const ASSETS = [
  './',
  'index.html',
  'css/sudoku.css',
  'javascript/puzzles.js',
  'javascript/sudoku.js',
  'javascript/main.js',
  'favicon.svg',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).catch(() => {
        // Offline and uncached: fall back to the app shell for navigations.
        if (request.mode === 'navigate') return caches.match('index.html')
        return Response.error()
      })
    })
  )
})
