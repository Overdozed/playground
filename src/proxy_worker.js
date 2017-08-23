var fileSystem;

self.addEventListener('install', function (event) {
  console.log("Install event: ", event);
  event.waitUntil(Promise.all([
    self.skipWaiting(),
    caches.open('v1').then(function (cache) {
      return cache.addAll([]);
    })
  ]));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  // console.log("Fetch event on url: ", event.request.url);

  // if its in /dist/, return straight from the file system
  var loc = event.request.url.indexOf("/dist/");
  if (loc != -1) {
    var path = event.request.url.slice(loc);
    if (fileSystem && fileSystem[path]) {
      event.respondWith(new Response(fileSystem[path].text));
      return;
    }
  }

  // if we're an unpkg dependency, cache it
  if (event.request.url.indexOf("https://unpkg.com") == 0) {
    event.respondWith(
      caches.match(event.request).then(function (resp) {
        // console.log(`got a match of: `, resp);
        return resp || fetch(event.request).then(function (response) {
          return caches.open('v1').then(function (cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});

self.addEventListener('message', function (event) {
  if (event.data.fileSystem) {
    fileSystem = event.data.fileSystem;
    event.ports[0].postMessage({
      error: null,
      ack: true
    });
  }
});