(function(){
  const config=window.COLLINS_PUSH_CONFIG||{};
  const root=document.createElement('div');root.id='collins-push-control';
  root.style.cssText='position:fixed;right:16px;bottom:90px;z-index:90;font:inherit';
  const btn=document.createElement('button');btn.type='button';btn.textContent='Enable Notifications';
  btn.style.cssText='border:1px solid #cbd9d0;background:#fff;color:#174b3c;padding:11px 14px;border-radius:24px;box-shadow:0 3px 12px #0002;font-size:12px;font-weight:700;cursor:pointer';
  root.appendChild(btn);
  document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(root));
  if(!config.appId){root.style.display='none';return;}
  window.OneSignalDeferred=window.OneSignalDeferred||[];
  window.OneSignalDeferred.push(async function(OneSignal){
    try{
      await OneSignal.init({appId:config.appId,serviceWorkerPath:'OneSignalSDKWorker.js',serviceWorkerParam:{scope:'/5660-collins-app/'},allowLocalhostAsSecureOrigin:false});
      if(!OneSignal.Notifications.isPushSupported()){btn.textContent='Notifications unavailable';btn.disabled=true;return;}
      const refresh=()=>{btn.textContent=OneSignal.Notifications.permission?'Notifications Enabled':'Enable Notifications';};
      refresh();
      btn.addEventListener('click',async()=>{try{await OneSignal.Notifications.requestPermission();refresh();}catch(e){console.warn('Push permission error',e);}});
    }catch(e){console.warn('Push initialization error',e);btn.textContent='Notifications unavailable';btn.disabled=true;}
  });
})();
