
async function handleKeyword(file, jobDesc){
  const {text, lower} = await (async()=>{
    const t = await AptumiTools.parseFile(file);
    return {text:t, lower:t.toLowerCase()};
  })();
  const jobWords=[...new Set(jobDesc.toLowerCase().match(/\b[a-z]{4,}\b/g)||[])].filter(w=>!['with','this','that','will','have','from'].includes(w)).slice(0,30);
  const result = jobWords.map(w=>({word:w, found: lower.includes(w)}));
  const foundCount = result.filter(r=>r.found).length;
  const matchPct = jobWords.length? Math.round(foundCount/jobWords.length*100):0;
  return {matchPct, result, text};
}
window.AptumiTools.handleKeyword=handleKeyword;
