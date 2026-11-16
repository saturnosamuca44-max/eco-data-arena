(()=>{'use strict';
  const $=s=>document.querySelector(s);
  const installButton=$('#pwaInstall'),overlay=$('#pwaDialogOverlay'),help=$('#pwaHelp'),
        installNative=$('#pwaDialogInstall'),updateBanner=$('#pwaUpdateBanner');
  if(!installButton)return;
  let deferredInstall=null,reg=null,refreshing=false;
  const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const updateInstallUI=()=>{installButton.hidden=installed()};
  const openModal=()=>{overlay.hidden=false;$('#pwaClose').focus()};
  const closeModal=()=>{overlay.hidden=true;installButton.focus({preventScroll:true})};
  $('#pwaClose').addEventListener('click',closeModal);
  $('#pwaDialogDone').addEventListener('click',closeModal);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeModal()});
  async function requestInstall(){
    if(!deferredInstall)return;
    const event=deferredInstall;deferredInstall=null;
    try{await event.prompt();await event.userChoice;}catch(err){console.info('Instalação indisponível:',err)}
    closeModal();updateInstallUI();
  }
  function openInstall(){
    if(installed()){help.textContent='O EcoData Arena já está aberto como aplicativo neste dispositivo.';installNative.hidden=true;openModal();return}
    if(deferredInstall){
      help.textContent='Instale o EcoData Arena para abrir pela tela inicial e jogar offline após o primeiro carregamento.';
      installNative.hidden=false;openModal();return;
    }
    installNative.hidden=true;
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
    if(ios)help.textContent='No iPhone ou iPad, toque em Compartilhar e selecione “Adicionar à Tela de Início”. Depois, abra o ícone EcoData Arena.';
    else if(location.protocol==='file:')help.textContent='Abra o EcoData Arena pelo endereço HTTPS do GitHub Pages para instalar o PWA e usar o modo offline.';
    else help.textContent='No Chrome ou Edge, use o menu do navegador e selecione “Instalar aplicativo” ou “Adicionar à tela inicial”. Se não aparecer, atualize a página e confira a publicação dos arquivos.';
    openModal();
  }
  installButton.addEventListener('click',openInstall);
  installNative.addEventListener('click',requestInstall);
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;updateInstallUI()});
  window.addEventListener('appinstalled',()=>{deferredInstall=null;overlay.hidden=true;updateInstallUI()});
  updateInstallUI();
  const showUpdate=()=>{if(reg?.waiting&&navigator.serviceWorker.controller)updateBanner.hidden=false};
  $('#pwaUpdateLater').addEventListener('click',()=>updateBanner.hidden=true);
  $('#pwaUpdateNow').addEventListener('click',()=>{
    if(document.body.classList.contains('game-focus'))return;
    if(reg?.waiting){refreshing=true;reg.waiting.postMessage({type:'SKIP_WAITING'});updateBanner.hidden=true}
  });
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)window.location.reload()});
    window.addEventListener('load',async()=>{
      try{
        reg=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
        showUpdate();
        reg.addEventListener('updatefound',()=>{
          const sw=reg.installing;sw?.addEventListener('statechange',()=>{if(sw.state==='installed')showUpdate()});
        });
        if(navigator.onLine)reg.update().catch(()=>{});
      }catch(err){console.warn('Modo offline indisponível:',err)}
    });
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden&&reg&&navigator.onLine){reg.update().catch(()=>{});showUpdate()}
    });
  }
})();
