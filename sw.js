const LOG_MSG = 'SW:';
const ROOT_PATH = "/AWP-U2-P12";
const LIMIT_ELEMENTS = 40;

const CACHES = {
    static: 'static-cache-v1.0',
    inmutable: 'inmutable-cache-v1.0',
    dynamic: 'dynamic-cache-v1.0'
};

const DEFAULT_RESPONSE = {
    'image/': "/images/image-not-found.png"
};

const ELEMENTS_CACHE = {
    [CACHES.static]: [
        DEFAULT_RESPONSE['image/'],
        //    "/js/camera.js",
        // "/images/icons/android-launchericon-48-48.png",
        // "/images/icons/android-launchericon-72-72.png",
        // "/images/icons/android-launchericon-96-96.png",
        // "/images/icons/android-launchericon-144-144.png",
        // "/images/icons/android-launchericon-192-192.png",
        // "/images/icons/android-launchericon-512-512.png",
        // "/", 
        // "/index.html",
        // "/manifest.json",

        `${ROOT_PATH}/js/camera.js`,
        `${ROOT_PATH}/images/icons/android-launchericon-48-48.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-72-72.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-96-96.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-144-144.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-192-192.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-512-512.png`,
        `${ROOT_PATH}/`, 
        `${ROOT_PATH}/index.html`,
        `${ROOT_PATH}/manifest.json`,
    ],
    [CACHES.inmutable]: [
        `https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css`,
        `https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js`,
        `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css`,
    ],
};

self.addEventListener('install', event => {
    const PROMISES = Object.keys(ELEMENTS_CACHE).map((cacheName) => {
        return caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(ELEMENTS_CACHE[cacheName]);
            });
    });
    
    event.waitUntil(Promise.all(PROMISES));
});
self.addEventListener('fetch', (event) => {
    let respFetch = onlyCache(event.request).then((element) => {
        if (element)
            return element;
        return getResponseNetwork(event.request);
    });

    return event.respondWith(respFetch);
});

self.addEventListener('activate', (event) => {
    console.log(LOG_MSG, 'Activado!');
    const promDelete = caches.keys().then((cacheNames) => {
        for (const cacheName of cacheNames) {
            for (const [shortNameCache, longNameCache] of Object.entries(CACHES)) {
                if (cacheName !== longNameCache && cacheName.includes(shortNameCache))
                    return caches.delete(cacheName);
            }
        }

        return cacheNames;
    });

    event.waitUntil(promDelete);
});

function onlyCache(req) {
    return caches.match(req);
}

function getResponseNetwork(req) {
    return fetch(req).then((respWeb) => {
        caches.open(CACHES.dynamic).then(async (cache) => {
            await cache.put(req, respWeb);
            cleanCache(CACHES.dynamic, LIMIT_ELEMENTS);
        });
        return respWeb.clone();
    }).catch((error) => {
        for (const key of Object.keys(DEFAULT_RESPONSE))
            if (req.headers.get('accept').includes(key)) 
                return onlyCache(DEFAULT_RESPONSE[key]);
    });
}


function cleanCache (cacheName, numberItems) {
    return caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            if (keys.length > numberItems) {
                cache.delete(keys[0]).then(cleanCache(cacheName, numberItems));
            }
        })
    });
}