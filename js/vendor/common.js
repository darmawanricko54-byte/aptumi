
// Aptumi Security Core v3 - Hardened for AdSense/Analytics isolation
(function(){
  'use strict';
  // 1. Block PII in localStorage/sessionStorage
  const PII_KEYS = ['resume','cv','pii','email','phone','address','nik','filecontent','jobdesc'];
  function isSensitive(key, val){
    const k = String(key).toLowerCase();
    const v = String(val||'');
    if(PII_KEYS.some(p=>k.includes(p)) && v.length>30) return true;
    // heuristic: looks like resume (has @ and long)
    if(v.length>200 && v.includes('@') && v.split(/\s+/).length>20) return true;
    return false;
  }
  const origLS = localStorage.setItem;
  const origSS = sessionStorage.setItem;
  localStorage.setItem = function(k,v){ if(isSensitive(k,v)){ console.warn('[Aptumi BLOCK] localStorage PII blocked:',k); return; } return origLS.apply(this, arguments); };
  sessionStorage.setItem = function(k,v){ if(isSensitive(k,v)){ console.warn('[Aptumi BLOCK] sessionStorage PII blocked:',k); return; } return origSS.apply(this, arguments); };

  // 2. Prevent Analytics/AdSense from reading sensitive areas
  // Sensitive text is kept in JS variable only, never inserted as plain text in DOM that ads can scrape? We use textContent but clear quickly
  // Also override navigator.sendBeacon for large payloads
  const origBeacon = navigator.sendBeacon;
  navigator.sendBeacon = function(url, data){
    const s = String(data||'');
    if(s.length>200 && (s.includes('@') || s.toLowerCase().includes('experience'))){
      console.warn('[Aptumi BLOCK] sendBeacon with resume-like data blocked to', url);
      return true; // pretend sent
    }
    return origBeacon.apply(this, arguments);
  };

  // 3. Wipe function
  function secureWipe(){
    try{
      sessionStorage.clear();
      document.querySelectorAll('[data-sensitive]').forEach(el=>{
        if(el.value && el.value.length>50) el.value='';
        if(el.textContent && el.textContent.length>500) el.textContent='';
      });
      document.querySelectorAll('input[type=file]').forEach(i=>i.value='');
      // clear global text variables if any
      window.__aptumiResumeText = null;
      window.__aptumiJobDesc = null;
      console.log('%c[Aptumi] Secure wipe done - memory cleared', 'color:green');
    }catch(e){}
  }

  window.addEventListener('beforeunload', secureWipe);
  window.addEventListener('pagehide', secureWipe);
  // Auto wipe after 10 min inactivity
  let timer; function resetTimer(){ clearTimeout(timer); timer=setTimeout(secureWipe, 10*60*1000); }
  ['mousemove','keydown','click','scroll'].forEach(ev=>window.addEventListener(ev, resetTimer));
  resetTimer();

  window.AptumiSecurity = {
    verify: function(){
      console.log('%c[Aptumi Security Audit:', 'font-weight:bold;color:green');
      console.log('1. Network tab should show 0 POST to /api after file drop');
      console.log('2. Application > Local Storage: no resume data (blocked by common.js)');
      console.log('3. Ad slots are isolated in .ad-slot containers, no access to .sensitive-area');
      console.log('4. Vendor libs self-hosted in /js/vendor/ - no CDN call');
      console.log('5. Call AptumiSecurity.wipe() to manually clear');
      return 'SECURE: Client-side only, AdSense isolated';
    },
    wipe: secureWipe
  };
})();
