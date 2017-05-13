var cacheFiles = [
  './',
  './index.html',
  './js/index.js',
  './style/index.css',
  './assets/icon144.png'
]
var cacheName = '2048-by-js-' + 'V1.0'
self.addEventListener('install', function (event) {
  // console.log('ServiceWorker is installing')
  event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        // console.log('open cache')
        return cache.addAll(cacheFiles)
                    .then(function () {
                      self.skipWaiting()
                    })
      })
  )
})

self.addEventListener('activate', function (e) {
  // console.log('ServiceWorker Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          // console.log('ServiceWorker Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  // console.log('ServiceWorker fetching')
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return response || fetch(event.request)
      })
  )
})
