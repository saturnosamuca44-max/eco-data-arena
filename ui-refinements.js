/* EcoData Arena 3.17 — fullscreen desktop por interação e dicas de confirmação */
(()=>{
 'use strict';
 const $=sel=>document.querySelector(sel);
 const isDesktop=()=>window.matchMedia?.('(min-width:800px) and (pointer:fine)').matches;
 // A API Fullscreen só funciona após ação do usuário: primeiro clique nos botões principais.
 $('#view-home .eco-launch-actions')?.addEventListener('click',event=>{
   if(!isDesktop()||document.fullscreenElement)return;
   if(!event.target.closest('button'))return;
   const req=document.documentElement.requestFullscreen;
   if(typeof req==='function'){
     try{Promise.resolve(req.call(document.documentElement,{navigationUI:'hide'})).catch(()=>{})}catch{}
   }
 },true);
 function syncKeys(){
  let codes=['KeyQ','KeyP'];
  try{
   const data=JSON.parse(localStorage.getItem('ecodata:confirmation-keys:1'));
   if(Array.isArray(data)&&data.length===2)codes=data;
  }catch{}
  for(let i=0;i<2;i++){
   const key=String(codes[i]||'KeyQ').replace(/^Key/,'');
   const node=$('#gameKeyHint'+(i+1));
   if(node)node.textContent='Confirmar: '+key;
  }
 }
 syncKeys();
 document.addEventListener('change',e=>{
   if(e.target?.id==='confirmKeyP1'||e.target?.id==='confirmKeyP2'){
     queueMicrotask(syncKeys);
   }
 });
 // Update when returning from settings to a game, without rebinding the game logic.
 const game=$('#view-game');
 if(game&&'MutationObserver' in window){
  new MutationObserver(()=>{if(game.classList.contains('active'))syncKeys()})
   .observe(game,{attributes:true,attributeFilter:['class']});
 }
})();
