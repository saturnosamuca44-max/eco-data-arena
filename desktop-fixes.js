/* EcoData Arena 3.18 — ajuste geométrico do canvas sem modificar física/colisões. */
(()=>{
 'use strict';
 const canvas=document.querySelector('#gameCanvas');
 const frame=document.querySelector('#arenaContainer');
 const screen=document.querySelector('#view-game');
 if(!canvas||!frame||!screen)return;
 const desktop=window.matchMedia('(min-width:800px) and (pointer:fine)');
 let scheduled=false,previous='';
 function clear(){
   if(!canvas.classList.contains('eco-desktop-fitted'))return;
   canvas.classList.remove('eco-desktop-fitted');
   canvas.style.removeProperty('--eco-fit-width');
   canvas.style.removeProperty('--eco-fit-height');
   previous='';
 }
 function fit(){
   scheduled=false;
   if(!desktop.matches||!screen.classList.contains('active')||!document.body.classList.contains('game-focus')){
     clear();return;
   }
   const box=frame.getBoundingClientRect();
   if(box.width<10||box.height<10)return;
   const nativeWidth=canvas.width||1000,nativeHeight=canvas.height||460;
   const ratio=nativeWidth/nativeHeight;
   // Inscrever o maior retângulo possível, sem cortar ou deslocar o cenário.
   const w=Math.max(1,Math.floor(Math.min(box.width,box.height*ratio)));
   const h=Math.max(1,Math.floor(w/ratio));
   const signature=w+'x'+h;
   if(signature===previous&&canvas.classList.contains('eco-desktop-fitted'))return;
   previous=signature;
   canvas.style.setProperty('--eco-fit-width',w+'px');
   canvas.style.setProperty('--eco-fit-height',h+'px');
   canvas.classList.add('eco-desktop-fitted');
 }
 function schedule(){
   if(scheduled)return;
   scheduled=true;
   requestAnimationFrame(fit);
 }
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe(frame);
 if('MutationObserver' in window)new MutationObserver(schedule).observe(screen,{attributes:true,attributeFilter:['class']});
 desktop.addEventListener?.('change',schedule);
 for(const type of ['resize','orientationchange'])window.addEventListener(type,schedule,{passive:true});
 document.addEventListener('fullscreenchange',schedule);
 document.addEventListener('visibilitychange',()=>{
   document.documentElement.classList.toggle('eco-tab-hidden',document.hidden);
   if(!document.hidden)schedule();
 });
 schedule();
})();
