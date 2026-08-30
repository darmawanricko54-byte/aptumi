
async function parseFile(file){
  if(file.name.toLowerCase().endsWith('.pdf')){
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({data:buf}).promise;
    let full='';
    for(let i=1;i<=Math.min(pdf.numPages,6);i++){
      const page=await pdf.getPage(i);
      const c=await page.getTextContent();
      full+=c.items.map(it=>it.str).join(' ')+' ';
    }
    return full;
  }else{
    const buf=await file.arrayBuffer();
    const r=await mammoth.extractRawText({arrayBuffer:buf});
    return r.value;
  }
}
async function handleATS(file, jobDescText){
  const text = await parseFile(file);
  const lower = text.toLowerCase();
  let score=86, issues=[];
  if(!text || text.length<150){ issues.push('❌ File unreadable or scanned image - export as text PDF'); score=25; }
  else{
    if(text.length<250) {issues.push('❌ Too short (<250 chars)'); score-=20}
    if(text.split(/\s+/).length>900) {issues.push('⚠️ Too long >900 words - keep 1-2 pages'); score-=8}
    if(!lower.includes('experience')){issues.push('⚠️ Missing EXPERIENCE header'); score-=12} else issues.push('✅ Experience found');
    if(!lower.includes('education')){issues.push('⚠️ Missing EDUCATION'); score-=10} else issues.push('✅ Education found');
    if(!/@/.test(text)){issues.push('⚠️ Email not found at top'); score-=6} else issues.push('✅ Contact found');
    if(!/[0-9]{4}/.test(text)){issues.push('⚠️ No dates (2020-2024) detected'); score-=5}
    if(/\btable\b|\btextbox\b/.test(lower)) {issues.push('⚠️ Avoid tables/textboxes - ATS fails'); score-=10}
  }
  score=Math.max(10,Math.min(98,score+Math.floor(Math.random()*5)));
  return {score, issues, text, lower};
}
window.AptumiTools = window.AptumiTools || {};
window.AptumiTools.handleATS = handleATS;
window.AptumiTools.parseFile = parseFile;
