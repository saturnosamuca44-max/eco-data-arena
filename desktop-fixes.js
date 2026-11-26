/* EcoData Arena 3.21 — lógica única de layout, sem redimensionamentos em conflito. */
(()=>{
 'use strict';
 const view=document.querySelector('#view-game');
 const canvas=document.querySelector('#gameCanvas');
 const arena=document.querySelector('#arenaContainer');
 if(!view||!canvas||!arena)return;
 const fine=window.matchMedia('(min-width:800px) and (pointer:fine)');
 const RATIO=1000/460;
 let scheduled=false,lastLayout='';
 function resetOldFit(){
  canvas.classList.remove('eco-desktop-fitted');
  canvas.style.removeProperty('--eco-fit-width');
  canvas.style.removeProperty('--eco-fit-height');
 }
 function applyLayout(){
  scheduled=false;
  const active=view.classList.contains('active')&&document.body.classList.contains('game-focus');
  if(!active){
   lastLayout='';
   view.classList.remove('eco-desktop-stage','eco-mobile-stage');
   resetOldFit();
   return;
  }
  const map=arena.dataset.map==='forest'?'forest':'technology';
  if(view.dataset.arenaMap!==map)view.dataset.arenaMap=map;
  const isDesktop=fine.matches;
  const mobileLand=window.matchMedia('(orientation:landscape) and (pointer:coarse), (orientation:landscape) and (max-width:799px)').matches;
  view.classList.toggle('eco-desktop-stage',isDesktop);
  view.classList.toggle('eco-mobile-stage',!isDesktop&&mobileLand);
  if(isDesktop){
   resetOldFit();
   // Em telas de notebook 16:9, a arena mantém quase exatamente a proporção 1000×460.
   // HUD e pergunta usam a faixa superior, mas não diminuem nem cortam o cenário.
   const viewportW=Math.max(1,document.documentElement.clientWidth||window.innerWidth);
   const viewportH=Math.max(1,window.innerHeight||document.documentElement.clientHeight);
   const idealTop=viewportH-viewportW/RATIO;
   const minTop=Math.max(105,Math.min(160,viewportH*.14));
   const maxTop=Math.max(minTop,Math.min(238,viewportH*.27));
   const top=Math.max(minTop,Math.min(maxTop,idealTop));
   const narrow=viewportW/viewportH<1.63;
   const sig=Math.round(top)+'|'+narrow+'|'+map;
   if(sig!==lastLayout){
    lastLayout=sig;
    view.style.setProperty('--eco-stage-top',Math.round(top)+'px');
    view.classList.toggle('eco-narrow-screen',narrow);
   }
   return;
  }
  // Em paisagem o desenho cobre toda a arena e os controles ficam sobre a parte inferior.
  if(mobileLand){resetOldFit();view.style.removeProperty('--eco-stage-top');lastLayout='';return}
  // Em retrato preservamos a escala proporcional da arena sem distorcer os personagens.
  view.classList.remove('eco-narrow-screen');
  view.style.removeProperty('--eco-stage-top');
  lastLayout='';
  const box=arena.getBoundingClientRect();
  if(box.width<25||box.height<25)return;
  const fitW=Math.floor(Math.min(box.width-2,(box.height-2)*RATIO));
  const fitH=Math.floor(fitW/RATIO);
  if(fitW<=0||fitH<=0)return;
  canvas.style.setProperty('--eco-fit-width',fitW+'px');
  canvas.style.setProperty('--eco-fit-height',fitH+'px');
  canvas.classList.add('eco-desktop-fitted');
 }
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(applyLayout);
 }
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe(arena);
 if('MutationObserver' in window){
  new MutationObserver(schedule).observe(view,{attributes:true,attributeFilter:['class']});
  new MutationObserver(schedule).observe(arena,{attributes:true,attributeFilter:['data-map']});
 }
 if(fine.addEventListener)fine.addEventListener('change',schedule);
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('orientationchange',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 document.addEventListener('fullscreenchange',schedule);
 document.addEventListener('visibilitychange',()=>{
  document.documentElement.classList.toggle('eco-tab-hidden',document.hidden);
  if(!document.hidden)schedule();
 });
 schedule();
})();
