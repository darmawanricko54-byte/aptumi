
// Aptumi Ads - HOMEPAGE ONLY VERSION
// AdSense only loads on homepage (index.html), never on /tools/* pages
// This eliminates any risk of AdSense crawler reading resume data

(function(){
  const isToolPage = window.location.pathname.includes('/tools/');
  if(isToolPage){
    console.log('[AptumiAds] Tool page detected - AdSense BLOCKED for privacy');
    return; // DO NOT LOAD ADS ON TOOL PAGES
  }
  // Only load on homepage
  if(document.getElementById('adsense-script')) return;
  const s=document.createElement('script');
  s.id='adsense-script';
  s.async=true;
  s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8924201509923220';
  s.crossOrigin='anonymous';
  document.head.appendChild(s);
  console.log('[AptumiAds] AdSense loaded on homepage only - pub-8924201509923220');
})();
