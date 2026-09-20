const CACHE="foldrone-play-v0.4.9-welcome-tone";
const CORE=["./","./index.html","./styles.css","./app.js","./manifest.webmanifest","./header-logo-new.png","./foldrone-play-mark.png","./foldrone-welcome-tone.wav"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("foldrone-play-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;let u=new URL(e.request.url);if(u.origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){let x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x)).catch(()=>{})}return r}).catch(()=>caches.match("./index.html"))));});
