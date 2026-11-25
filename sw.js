/* EcoData Arena PWA 2.5 — atualização mediante aprovação, offline sem apagar dados locais */
'use strict';
const CACHE_NAME='ecodata-arena-shell-v3.6.0';
const APP_SHELL=[
  './','./index.html','./manifest.webmanifest','./eco-world.js','./pwa.css','./pwa.js','./version.json',
  './icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png',
  './icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./assets/map-forest.webp','./assets/map-factory.webp','./assets/robot-atlas.webp'
];
const base=new URL(self.registration.scope);
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));
  // Em atualizações, não ativar automaticamente enquanto o jogo está aberto.
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(n=>n.startsWith('ecodata-arena-shell-')&&n!==CACHE_NAME).map(n=>caches.delete(n)));
    await self.clients.claim();
  })());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
  if(url.pathname.endsWith('/version.json')){
    event.respondWith(fetch(request).catch(async()=>{
      const cache=await caches.open(CACHE_NAME);
      return await cache.match('./version.json')||Response.error();
    }));
    return;
  }
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put('./index.html',response.clone());}
        return response;
      }catch(err){
        const cache=await caches.open(CACHE_NAME);
        return await cache.match('./index.html')||await cache.match('./')||Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    if(cached)return cached;
    try{
      const response=await fetch(request);
      if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone());}
      return response;
    }catch(err){return Response.error();}
  })());
});
