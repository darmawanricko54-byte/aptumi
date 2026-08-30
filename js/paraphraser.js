
function paraphraseLocal(text){
  const map={
    'very good':'excellent','helped':'supported','managed':'led','did':'executed',
    'responsible for':'owned','worked on':'delivered','good':'strong','make':'create',
    'team player':'collaborative team member focused on delivery'
  };
  let out=text;
  for(const [k,v] of Object.entries(map)){
    const re=new RegExp('\\b'+k+'\\b','gi');
    out=out.replace(re,v);
  }
  // passive -> active simple
  out=out.replace(/\bI was responsible for\b/gi,'Owned');
  return out;
}
window.AptumiTools.paraphraseLocal=paraphraseLocal;
