/* EcoData Arena 3.7 — atualização automática mantendo dados locais. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const CURRENT='3.14.2';
const installButton=$('#pwaInstall'),overlay=$('#pwaDialogOverlay'),help=$('#pwaHelp'),
 installNative=$('#pwaDialogInstall'),updateBanner=$('#pwaUpdateBanner');
if(!installButton)return;
let deferredInstall=null,reg=null,refreshing=false,checking=false,pendingReload=false,lastCheck=0;
const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isLocalFile=()=>!['https:','http:'].includes(location.protocol);
const officialUrl='https://saturnosamuca44-max.github.io/eco-data-arena/';
const updateInstallUI=()=>{installButton.hidden=installed()};
const openModal=()=>{overlay.hidden=false;$('#pwaClose')?.focus()};
const closeModal=()=>{overlay.hidden=true;installButton.focus({preventScroll:true})};
$('#pwaClose')?.addEventListener('click',closeModal);
$('#pwaDialogDone')?.addEventListener('click',closeModal);
overlay?.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeModal()});
async function requestInstall(){
 if(!deferredInstall)return;
 const event=deferredInstall;deferredInstall=null;
 try{await event.prompt();await event.userChoice}catch(err){console.info('Instalação indisponível:',err)}
 closeModal();updateInstallUI();
}
function openInstall(){
 if(isLocalFile()){
   help.textContent='Você abriu uma cópia baixada (content:// ou file://). Essa cópia não instala PWA nem recebe atualizações. Toque em “ABRIR SITE OFICIAL PARA INSTALAR” e use o menu ⋮ do Chrome → “Instalar aplicativo” ou “Adicionar à tela inicial”.';
   installNative.hidden=true;
   openModal();
   return;
 }
 if(installed()){help.textContent='O EcoData Arena já está instalado neste dispositivo e verifica atualizações automaticamente.';installNative.hidden=true;openModal();return}
 if(deferredInstall){
  help.textContent='Instale o EcoData Arena para acessar o jogo e receber atualizações pela mesma URL.';
  installNative.hidden=false;openModal();return;
 }
 installNative.hidden=true;
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
 if(ios)help.textContent='No iPhone ou iPad, toque em Compartilhar e selecione “Adicionar à Tela de Início”.';
 else if(isLocalFile())help.textContent='Abra o site https://saturnosamuca44-max.github.io/eco-data-arena/ no Chrome. Um arquivo local não pode ser instalado como PWA.';
 else help.textContent='A instalação do PWA não baixa um APK. Toque no menu ⋮ do Chrome e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”. Se a instalação direta estiver disponível, o Chrome exibirá uma confirmação.';
 openModal();
}
installButton.addEventListener('click',openInstall);
installNative?.addEventListener('click',requestInstall);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;updateInstallUI()});
window.addEventListener('appinstalled',()=>{deferredInstall=null;overlay.hidden=true;updateInstallUI()});
updateInstallUI();

const status=$('#pwaCheckStatus'),bannerText=updateBanner?.querySelector('p'),badge=$('#pwaVersionBadge');
const announce=msg=>{if(status)status.textContent=msg};
const safeToRefresh=()=>{
 if(document.body.classList.contains('game-focus'))return false;
 const editor=$('#questionText');
 return !(editor?.value?.trim()&&$('#view-questions')?.classList.contains('active'));
};
const reloadOnce=()=>{
 if(refreshing||!safeToRefresh()){pendingReload=true;return}
 try{
  const last=Number(sessionStorage.getItem('ecodata-pwa-reload-at')||0);
  if(Date.now()-last<8000)return;
  sessionStorage.setItem('ecodata-pwa-reload-at',String(Date.now()));
 }catch{}
 refreshing=true;
 announce('Atualização pronta. Reabrindo o jogo sem apagar suas perguntas...');
 const url=new URL(window.location.href);
 url.searchParams.set('ecoVersion',String(Date.now()));
 window.location.replace(url.href);
};
function available(){
 if(!reg)return;
 if(reg.waiting){
   if(safeToRefresh()){
     announce('Atualização recebida. Aplicando automaticamente...');
     reg.waiting.postMessage({type:'SKIP_WAITING'});
     // Quando não há controlador anterior, o evento controllerchange pode não ocorrer.
     if(!navigator.serviceWorker.controller)setTimeout(reloadOnce,1500);
   }else{
     pendingReload=true;
     if(bannerText)bannerText.textContent='Atualização disponível. Ela será aplicada ao sair da partida.';
     if(updateBanner)updateBanner.hidden=false;
   }
 }
}
navigator.serviceWorker?.addEventListener('controllerchange',()=>{
 if(safeToRefresh())reloadOnce();
 else {pendingReload=true;announce('Atualização disponível. Ela será aplicada ao sair da partida.')}
});
const checkVersion=async(force=false)=>{
 if(checking||!navigator.onLine||document.hidden)return;
 const now=Date.now();
 if(!force&&now-lastCheck<30000)return;
 lastCheck=now;checking=true;
 try{
   reg=await navigator.serviceWorker.getRegistration('./')||
     await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
   if(reg?.waiting)available();
   reg?.addEventListener('updatefound',()=>{
     const worker=reg.installing;
     worker?.addEventListener('statechange',()=>{
       if(worker.state==='installed')available();
     });
   },{once:true});
   await reg?.update();
   if(reg?.waiting)available();
   const vURL=new URL('./version.json',window.location.href);
   vURL.searchParams.set('fresh',String(now));
   const response=await fetch(vURL.href,{cache:'no-store'});
   if(response.ok){
     const info=await response.json();
     const version=String(info.version||'');
     if(/^\d+\.\d+\.\d+$/.test(version)&&version!==CURRENT){
       // Verifica se a versão publicada é realmente mais nova.
       const cmp=(a,b)=>{const aa=a.split('.').map(Number),bb=b.split('.').map(Number);for(let j=0;j<3;j++){if(aa[j]!==bb[j])return aa[j]-bb[j]}return 0};
       if(cmp(version,CURRENT)>0){
         announce('Versão '+version+' encontrada. Atualizando...');
         if(reg?.waiting)available();
         else if(safeToRefresh())reloadOnce();
         else pendingReload=true;
       }
     }else if(force)announce('EcoData Arena '+CURRENT+' • Atualizado.');
   }
 }catch(err){
   console.warn('Verificação automática indisponível:',err);
 }finally{checking=false}
};
if('serviceWorker' in navigator&&['https:','http:'].includes(location.protocol)){
 window.addEventListener('load',()=>{checkVersion(true)},{once:true});
 window.addEventListener('focus',()=>{if(pendingReload&&safeToRefresh())reloadOnce();checkVersion()});
 window.addEventListener('online',()=>checkVersion(true));
 document.addEventListener('visibilitychange',()=>{
   if(document.hidden)return;
   if(pendingReload&&safeToRefresh())reloadOnce();
   checkVersion();
 });
 // Verificação ocasional sem trabalho contínuo durante partidas.
 setInterval(()=>{if(!document.hidden&&!document.body.classList.contains('game-focus'))checkVersion()},10*60*1000);
 if(typeof MutationObserver!=='undefined'){
  new MutationObserver(()=>{
    if(pendingReload&&safeToRefresh()){
      if(reg?.waiting)available();else reloadOnce();
    }
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
 }
}
$('#pwaUpdateLater')?.addEventListener('click',()=>{
 if(updateBanner)updateBanner.hidden=true;
});
$('#pwaUpdateNow')?.addEventListener('click',()=>{
 if(!safeToRefresh()){pendingReload=true;return}
 if(reg?.waiting)available();else checkVersion(true);
});
if(badge)badge.title='O jogo procura atualizações ao abrir, reconectar ou retomar o aplicativo';
})();