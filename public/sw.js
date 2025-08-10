// Service Worker para optimizar el caching
const CACHE_NAME = 'tusecreto-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/tusecreto.png',
  '/tusecreto-negro.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})
