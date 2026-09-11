const cameras=['FORWARD','RIGHT','REAR','LEFT'];let current=0;const nameEl=document.getElementById('cameraName');const buttons=[...document.querySelectorAll('[data-camera]')];const feed=document.getElementById('feed');const placeholder=document.getElementById('placeholder');const status=document.getElementById('status');
function setCamera(i){current=(i+cameras.length)%cameras.length;nameEl.textContent=cameras[current];buttons.forEach((b,n)=>b.classList.toggle('active',n===current));status.textContent='Checks';}
buttons.forEach((b,i)=>b.addEventListener('click',()=>setCamera(i)));
let x0=null,y0=null;addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY});addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0,dy=e.clientY-y0;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))setCamera(current+(dx<0?1:-1));x0=y0=null});
// Reset to FORWARD whenever the page/session becomes visible again.
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setCamera(0)});addEventListener('pageshow',()=>setCamera(0));
document.getElementById('testVideo').addEventListener('click',async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:true,audio:false});feed.srcObject=s;feed.style.display='block';placeholder.style.display='none';status.textContent='Video active'}catch(e){status.textContent='Camera unavailable'}});
setCamera(0);