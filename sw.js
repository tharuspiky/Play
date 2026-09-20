const CACHE="foldrone-play-v0.3-complete";
const ASSETS=["./","./index.html","./styles.css","./v03.js","./manifest.webmanifest","./foldrone-play-logo.svg","./foldrone-studio-logo.svg","./foldrone-play-192.png","./foldrone-play-512.png","./foldrone-studio-192.png","./foldrone-studio-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match("./index.html"))))});
