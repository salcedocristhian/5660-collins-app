/* 5660 Collins — safe offline shell for Board 3D + Resident Notices */
const STATIC='5660-board-plus-resident-v8-contacts-shell';
const DATA='5660-board-plus-resident-v8-contacts-data';
const CORE=['./','./index.html','./resident-updates.html','./assets/app.css','./assets/app.js','./assets/condo-logo.png','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(STATIC).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('5660-')&&![STATIC,DATA].includes(k)).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/data/notices.json')){
  event.respondWith(fetch(req,{cache:'no-store'}).then(resp=>{if(resp.ok){const clone=resp.clone();event.waitUntil(caches.open(DATA).then(c=>c.put('./data/notices.json',clone)))}return resp}).catch(async()=>await caches.match('./data/notices.json')||Response.error()));return;
 }
 if(req.mode==='navigate'){
  event.respondWith(fetch(req,{cache:'no-store'}).then(resp=>{if(resp.ok){const clone=resp.clone();event.waitUntil(caches.open(STATIC).then(c=>c.put(req,clone)))}return resp}).catch(async()=>await caches.match(req)||await caches.match('./index.html')||Response.error()));return;
 }
 event.respondWith(caches.match(req,{ignoreSearch:true}).then(cached=>cached||fetch(req).then(resp=>{if(resp.ok){const clone=resp.clone();event.waitUntil(caches.open(STATIC).then(c=>c.put(req,clone)))}return resp})));
});
