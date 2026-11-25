/* EcoData Arena 3.7 — versão única e atualização automática. */
'use strict';
const CACHE_NAME='ecodata-arena-shell-v3.7.0';
const SHELL=[
 './','./index.html','./manifest.webmanifest','./version.json',
 './eco-world.js','./pwa.css','./pwa.js',
 './icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png',
 './icons/icon-maskable-512.png','./icons/apple-touch-icon.png',
 './assets/map-forest.webp','./assets/map-factory.webp','./assets/robot-atlas.webp'
];
const base=new URL(self.registration.scope);
const CORE=new Set(['','index.html','version.json','pwa.js','pwa.css','eco-world.js','manifest.webmanifest']);
async function fromNetwork(req,key){
 const cache=await caches.open(CACHE_NAME);
 try{
  const response=await fetch(req,{cache:'no-cache'});
  if(!response.ok)throw Error('HTTP '+response.status);
  await cache.put(key,response.clone());
  return response;
 }catch(err){
  const result=await cache.match(key);
  return result||Response.error();
 }
}
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(SHELL);
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('ecodata-arena-shell-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));
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
 // Toda navegação consulta o servidor; offline usa a página salva.
 if(request.mode==='navigate'){
  event.respondWith(fromNetwork(request,'./index.html'));
  return;
 }
 const file=url.pathname.slice(base.pathname.length);
 if(CORE.has(file)){
   event.respondWith(fromNetwork(request,'./'+file));
   return;
 }
 // Artes pesadas continuam em cache, sem redownload a cada quadro.
 event.respondWith((async()=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone())}
  return response;
 })());
});