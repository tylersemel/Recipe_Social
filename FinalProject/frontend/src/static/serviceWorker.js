function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing");


const STATIC_CACHE_NAME = 'rcpcrtr-static-v1';

self.addEventListener('install', event => {
  log('install', event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll([
        '/offline',
        //CSS
        '/css/account.css',
        '/css/createAccount.css',
        '/css/createRecipe.css',
        '/css/currentAccount.css',
        '/css/editProfile.css',
        '/css/home.css',
        '/css/login.css',
        '/css/offline.css',
        '/css/recipe.css',
        '/css/recipefolders.css',
        '/css/recipes.css',
        '/css/search.css',
        '/css/settings.css',
        '/css/styles.css',
        //Images
        '/img/account-image-placeholder.png',
        '/img/recipe-image-placeholder.webp',
        '/img/recipe-placeholder-1.png',
        //Scripts
        '/js/account.js',
        '/js/apiClient.js',
        '/js/common.js',
        '/js/createAccount.js',
        '/js/createRecipe.js',
        '/js/currentAccount.js',
        '/js/editProfile.js',
        '/js/home.js',
        '/js/login.js',
        '/js/recipe.js',
        '/js/recipefolders.js',
        '/js/recipes.js',
        //External Resources
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js'
      ]).catch(error => {
        console.log(error);
      });
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('rcpcrtr-') && cacheName != STATIC_CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  //Treat API calls (to our API) differently
  if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api/v1')) {
    //If we are here, we are intercepting a call to our API
    if(event.request.method === "GET") {
      //Only intercept (and cache) GET API requests
      event.respondWith(
        fetchAndCache(event.request)
      );
    }
  }
  else {
    //If we are here, this was not a call to our API
    event.respondWith(
      fetchAndCache(event.request)
    );
  }

});


// function cacheFirst(request) {
//   return caches.match(request)
//   .then(response => {
//     //Return a response if we have one cached. Otherwise, get from the network
//     return fetchAndCache(request) || response;
//   })
//   .catch(error => {
//     return caches.match('/offline');
//   })
// }

// function cacheFirst(request) {
//   return caches.match(request)
//   .then(response => {
//     //Return a response if we have one cached. Otherwise, get from the network
//     return fetchAndCache(request) || response;
//   })
//   .catch(error => {
//     return caches.match('/offline');
//   })
// }



function fetchAndCache(request) {
  return fetch(request).then(response => {
    log("fetch completed");
    var requestUrl = new URL(request.url);
    //Cache everything except login
    if(response.ok && !requestUrl.pathname.startsWith('/login')) {
      log("response was ok");
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  }).catch(error => {
    return caches.match(request).then(response => {
      log("Match found");
      return response;
    }).catch(error => {
      log("This should send the offline html page");
      return caches.match('/offline');
    })
  });
}



self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});