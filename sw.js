/* 5660 Collins Resident Project Line — offline fallback and updates */
const STATIC_CACHE='5660-public-shell-v1.0.0';
const DATA_CACHE='5660-public-data-v1.0.0';
const CORE=['./','./index.html','./assets/app.css','./assets/app.js','./assets/condo-logo.png','./icons/icon-192.png','./icons/icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>![STATIC_CACHE,DATA_CACHE].includes(k)).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/data/notices.json')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const c=r.clone();caches.open(DATA_CACHE).then(cache=>cache.put('./data/notices.json',c))}return r}).catch(async()=>await caches.match('./data/notices.json')||Response.error()));return;
  }
  if(e.request.mode==='navigate'||url.pathname.endsWith('/index.html')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const c=r.clone();caches.open(STATIC_CACHE).then(cache=>cache.put('./index.html',c))}return r}).catch(async()=>await caches.match('./index.html')||Response.error()));return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(STATIC_CACHE).then(cache=>cache.put(e.request,c))}return r})));
});
