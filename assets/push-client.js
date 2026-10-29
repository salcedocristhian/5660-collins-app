(function(){
  const config=window.COLLINS_PUSH_CONFIG||{};
  const root=document.createElement('div');root.id='collins-push-control';
  root.style.cssText='display:flex;align-items:center;justify-content:center';
  const btn=document.createElement('button');btn.type='button';btn.setAttribute('aria-label','Enable notifications');btn.title='Enable notifications';btn.innerHTML='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 10h18c0-2-3-3-3-10M10 22h4"/></svg>';
  btn.style.cssText='width:48px;height:48px;border:0;background:#e4e9e5;color:#1f4d47;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;padding:0';
  root.appendChild(btn);
  document.addEventListener('DOMContentLoaded',()=>{const lang=document.getElementById('topAction');if(lang&&lang.parentNode){lang.parentNode.insertBefore(root,lang);}else{document.body.appendChild(root);}});
  if(!config.appId){root.style.display='none';return;}
  window.OneSignalDeferred=window.OneSignalDeferred||[];
  window.OneSignalDeferred.push(async function(OneSignal){
    try{
      await OneSignal.init({appId:config.appId,serviceWorkerPath:'OneSignalSDKWorker.js',serviceWorkerParam:{scope:'/5660-collins-app/'},allowLocalhostAsSecureOrigin:false});
      if(!OneSignal.Notifications.isPushSupported()){btn.title='Notifications unavailable';btn.setAttribute('aria-label','Notifications unavailable');btn.disabled=true;return;}
      const refresh=()=>{const on=OneSignal.Notifications.permission;btn.title=on?'Notifications Enabled':'Enable Notifications';btn.setAttribute('aria-label',btn.title);btn.style.background=on?'#d9e9df':'#e4e9e5';};
      refresh();
      btn.addEventListener('click',async()=>{try{await OneSignal.Notifications.requestPermission();refresh();}catch(e){console.warn('Push permission error',e);}});
    }catch(e){console.warn('Push initialization error',e);btn.textContent='Notifications unavailable';btn.disabled=true;}
  });
})();
