// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open('cache-v1').then(function (cache) {
//             return cache.addAll([
//                 '/',
//                 '/index',
//                 '/_img/logo.png'
//             ]);
//         })
//     );
// });
self.addEventListener('fetch', function (event) {
    console.log('fetchpwa')
    let req = new Request(event.request, {
        headers: { "foo": "bar" }
    });
    event.respondWith(fetch(req));
});


// self.addEventListener('fetch', function (event) {
//     // event.respondWith(
//     //     caches.match(event.request).then(function (response) {
//     //         return response || fetch(event.request);
//     //     })
//     // );
// });
