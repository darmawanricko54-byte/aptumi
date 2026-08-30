
async function removeBgWhite(file, bgColor='#ffffff'){
  const img = await new Promise((res,rej)=>{
    const url=URL.createObjectURL(file);
    const im=new Image();
    im.onload=()=>{ URL.revokeObjectURL(url); res(im); };
    im.onerror=rej;
    im.src=url;
  });
  const canvas=document.createElement('canvas');
  canvas.width=img.width; canvas.height=img.height;
  const ctx=canvas.getContext('2d');
  ctx.drawImage(img,0,0);
  const data=ctx.getImageData(0,0,canvas.width,canvas.height);
  // simple: make near-white pixels transparent
  for(let i=0;i<data.data.length;i+=4){
    const r=data.data[i], g=data.data[i+1], b=data.data[i+2];
    if(r>230 && g>230 && b>230){ data.data[i+3]=0; }
  }
  ctx.putImageData(data,0,0);
  return canvas.toDataURL('image/png');
}
window.AptumiTools.removeBgWhite=removeBgWhite;
