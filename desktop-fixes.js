/* EcoData Arena 3.20 — encaixe universal sem cortes ou deformação. */
(()=>{
 'use strict';
 const canvas=document.querySelector('#gameCanvas');
 const container=document.querySelector('#arenaContainer');
 const view=document.querySelector('#view-game');
 if(!canvas||!container||!view)return;
 let pending=false,last='',observing=true;
 function clear(){
  if(canvas.classList.contains('eco-desktop-fitted'))canvas.classList.remove('eco-desktop-fitted');
  canvas.style.removeProperty('--eco-fit-width');
  canvas.style.removeProperty('--eco-fit-height');
  last='';
 }
 function fit(){
  pending=false;
  const active=view.classList.contains('active')&&document.body.classList.contains('game-focus');
  if(!active){clear();return}
  const box=container.getBoundingClientRect();
  const maxW=Math.floor(box.width-2),maxH=Math.floor(box.height-2);
  if(maxW<25||maxH<25)return;
  const nativeW=canvas.width||1000,nativeH=canvas.height||460;
  const ratio=nativeW/nativeH;
  const width=Math.max(1,Math.floor(Math.min(maxW,maxH*ratio)));
  const height=Math.max(1,Math.floor(width/ratio));
  const next=width+'x'+height;
  if(next===last&&canvas.classList.contains('eco-desktop-fitted'))return;
  last=next;
  canvas.style.setProperty('--eco-fit-width',width+'px');
  canvas.style.setProperty('--eco-fit-height',height+'px');
  canvas.classList.add('eco-desktop-fitted');
 }
 function schedule(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(fit);
 }
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe(container);
 if('MutationObserver' in window)new MutationObserver(schedule).observe(view,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('orientationchange',schedule,{passive:true});
 document.addEventListener('fullscreenchange',schedule);
 document.addEventListener('visibilitychange',()=>{
  document.documentElement.classList.toggle('eco-tab-hidden',document.hidden);
  if(!document.hidden)schedule();
 });
 schedule();
})();
