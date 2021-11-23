"use strict";

var CACHE_NAME = 'ginkobusilyesPWA-v1.0';

var contentToCache = [
    './webapp/index.html',
    './webapp/Manifest.json',
    './webapp/style.css',
    './webapp/app.js',
    './webapp/icons/icon-32.png',
    './webapp/icons/icon-64.png',
    './webapp/icons/icon-96.png',
    './webapp/icons/icon-128.png',
    './webapp/icons/favicon.ico',
    './webapp/icons/icon-168.png',
    './webapp/icons/icon-180.png',
    './webapp/icons/icon-192.png',
    './webapp/icons/icon-256.png',
    './webapp/icons/icon-512.png',
    './webapp/icons/maskable_icon.png'
];

// service worker installation
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    e.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
        console.log('[Service Worker] Caching application content & data');
        return cache.addAll(contentToCache);
    }));
});


self.addEventListener('fetch', (e) => {

    false && e.respondWith(
        caches.match(e.request).then((r) => {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r ||
                fetch(e.request).then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        console.log('[Service Worker] Caching new resource: '+e.request.url);
                        cache.put(e.request, response.clone());
                        return response;
                    });
                });
        })
    );


    if (contentToCache.some(file => e.request.url.endsWith(file.substr(2)) && !e.request.url.endsWith("app.js"))) {
        console.log('[Service Worker] Loading from cache: '+e.request.url);
        e.respondWith(caches.match(e.request));
    }
    else {
        // Stratégie network + mise en cache, ou alors cache, ou réponse par défaut
        e.respondWith(fetch(e.request)
            .then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    console.log('[Service Worker] Fetching from network and caching resource: '+e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            })
            .catch(function() {
                return caches.match(e.request).then((r) => {
                    console.log('[Service Worker] Looking for resource in cache: '+e.request.url);
                    return r;})
            })
        );
    }

});


self.addEventListener('activate', (e) => {
    e.waitUntil(
        // cleaning previous caches
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(CACHE_NAME.indexOf(key) === -1) {
                    console.log("[Service Worker] Cleaning old cache");
                    return caches.delete(key);
                }
            }));
        })
    );
});