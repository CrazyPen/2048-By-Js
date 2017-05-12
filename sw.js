/* global self, caches, fetch */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function (registration) {
    console.log('ServiceWorker registration successful with scope', registration.scope)
  }).catch(function (err) {
    console.log('ServiceWorker registration failed:', err)
  })
  var cacheFiles = [
    '/',
    '/manifest.json',
    '/index.html',
    '/js/index.js',
    '/style/index.css'
  ]
  var cacheName = '2048-by-js'
  self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(cacheName)
        .then(function (cache) {
          console.log('open cache')
          return cache.addAll(cacheFiles)
        })
    )
  })

  self.addEventListener('fetch', function (event) {
    event.responseWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response
          }
          return fetch(event.request)
        })
    )
  })
}
