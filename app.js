(() => {
"use strict";
const $=id=>document.getElementById(id), qsa=s=>[...document.querySelectorAll(s)];

const state={
 mode:"play",media:null,url:null,kind:null,objectURLs:new Set(),toastTimer:null,
 audioMode:"original",videoMode:"original",fitMode:"original",zoom:100,panX:0,panY:0,cc:"off",
 audioCtx:null,audioSource:null,gain:null,compressor:null,stereo:null
};

const e={
 welcome:$("welcome"),greeting:$("greeting"),studioDock:$("studioDock"),player:$("player"),mediaShell:$("mediaShell"),
 preparing:$("preparing"),stage:$("mediaStage"),empty:$("emptyStage"),video:$("video"),audio:$("audio"),image:$("image"),
 open:$("openBtn"),heroOpen:$("heroOpenBtn"),input:$("fileInput"),play:$("playBtn"),back:$("backBtn"),forward:$("forwardBtn"),
 mute:$("muteBtn"),seek:$("seek"),current:$("currentTime"),duration:$("duration"),audioMode:$("audioModeBtn"),videoMode:$("videoModeBtn"),
 cc:$("ccBtn"),fit:$("fitBtn"),pip:$("pipBtn"),fullscreen:$("fullscreenBtn"),close:$("closeBtn"),
 fitPanel:$("fitPanel"),ccPanel:$("ccPanel"),zoom:$("zoomRange"),panX:$("panXRange"),panY:$("panYRange"),
 zoomValue:$("zoomValue"),panXValue:$("panXValue"),panYValue:$("panYValue"),resetFrame:$("resetFrameBtn"),
 modeToast:$("modeToast"),modeToastIcon:$("modeToastIcon"),modeToastType:$("modeToastType"),modeToastText:$("modeToastText"),
 status:$("statusLine"),home:$("homeBtn")
};

function greeting(){
 const h=new Date().getHours();
 return h<5?"Good Night":h<12?"Good Morning":h<17?"Good Afternoon":h<21?"Good Evening":"Good Night";
}
function updateGreeting(){e.greeting.textContent=greeting()}
function showMode(type,label,icon){
 e.modeToastType.textContent=type;e.modeToastText.textContent=label;e.modeToastIcon.innerHTML=icon||"";
 e.modeToast.classList.add("show");clearTimeout(state.toastTimer);
 state.toastTimer=setTimeout(()=>e.modeToast.classList.remove("show"),1800);
}
function openPicker(){e.input.value="";e.input.click()}
function classify(f){
 const t=(f.type||"").toLowerCase(),n=f.name.toLowerCase();
 if(t.startsWith("video/")||/\.(mp4|m4v|webm|mov|ogv|avi|mkv)$/i.test(n))return"video";
 if(t.startsWith("audio/")||/\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(n))return"audio";
 if(t.startsWith("image/")||/\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)$/i.test(n))return"image";
}
function fmt(v){if(!Number.isFinite(v)||v<0)return"0:00";const s=Math.floor(v),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`:`${m}:${String(x).padStart(2,"0")}`}
function mediaEl(){return state.kind==="video"?e.video:state.kind==="audio"?e.audio:e.image}

function setMode(mode){
 state.mode=mode;qsa(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
 if(state.media){
   e.player.classList.remove("hidden"); e.player.setAttribute("aria-hidden","false");
   e.welcome.classList.add("hidden");
   e.studioDock.classList.toggle("hidden",mode!=="studio");
   e.studioDock.setAttribute("aria-hidden",String(mode!=="studio"));
   showMode("Mode",mode==="studio"?"Studio":"Play",mode==="studio"?"▥":"▶");
 }else{
   e.player.classList.add("hidden");e.studioDock.classList.add("hidden");e.welcome.classList.toggle("hidden",mode==="studio");
 }
}

function revokeURL(){if(state.url){URL.revokeObjectURL(state.url);state.objectURLs.delete(state.url);state.url=null}}
function disconnectAudio(){
 try{if(state.audioSource)state.audioSource.disconnect()}catch{}
 try{if(state.gain)state.gain.disconnect()}catch{}
 try{if(state.compressor)state.compressor.disconnect()}catch{}
 try{if(state.stereo)state.stereo.disconnect()}catch{}
 state.audioSource=state.gain=state.compressor=state.stereo=null;
}
function cleanup(){
 [e.video,e.audio].forEach(el=>{try{el.pause()}catch{};el.removeAttribute("src");try{el.load()}catch{};el.classList.add("hidden")});
 e.image.removeAttribute("src");e.image.classList.add("hidden");disconnectAudio();revokeURL();
 state.media=null;state.kind=null;state.audioMode="original";state.videoMode="original";state.fitMode="original";state.zoom=100;state.panX=0;state.panY=0;
 e.empty.classList.remove("hidden");e.preparing.classList.add("hidden");e.status.textContent="";
 e.seek.value=0;e.seek.max=0;e.current.textContent="0:00";e.duration.textContent="0:00";
 e.audioMode.innerHTML='<span class="i-sound"></span><span>Sound</span>';e.videoMode.innerHTML='<span class="i-video"></span><span>Video</span>';
 resetFrame(false);
}

function applyFrame(){
 if(!state.media||state.kind!=="video")return;
 const v=e.video;
 v.classList.remove("fit-fill","fit-screen");
 if(state.fitMode==="fill")v.classList.add("fit-fill");
 else if(state.fitMode==="fit")v.classList.add("fit-screen");
 const z=state.zoom/100;
 v.style.transform=`translate(${state.panX}%,${state.panY}%) scale(${z})`;
 e.zoomValue.textContent=`${state.zoom}%`;e.panXValue.textContent=state.panX;e.panYValue.textContent=state.panY;
}
function resetFrame(show=true){
 state.fitMode="original";state.zoom=100;state.panX=0;state.panY=0;
 e.zoom.value=100;e.panX.value=0;e.panY.value=0;
 e.video.classList.remove("fit-fill","fit-screen");e.video.style.transform="";
 qsa("[data-fit]").forEach(b=>b.classList.toggle("active",b.dataset.fit==="original"));
 if(show)showMode("Framing","Original","⌗");
}

function setupAudioGraph(){
 if(!state.media||!["video","audio"].includes(state.kind))return;
 const el=state.media;
 if(!window.AudioContext&&!window.webkitAudioContext)return false;
 const Ctx=window.AudioContext||window.webkitAudioContext;
 try{
   if(!state.audioCtx)state.audioCtx=new Ctx();
   if(!state.audioSource){
     state.audioSource=state.audioCtx.createMediaElementSource(el);
     state.gain=state.audioCtx.createGain();
     state.compressor=state.audioCtx.createDynamicsCompressor();
     state.stereo=state.audioCtx.createStereoPanner();
   }
   state.audioSource.disconnect();
   state.gain.disconnect();state.compressor.disconnect();state.stereo.disconnect();
   if(state.audioMode==="original"){el.volume=1;return true}
   state.gain.gain.value=state.audioMode==="enhanced"?1.18:state.audioMode==="cinema"?1.10:1.06;
   state.compressor.threshold.value=state.audioMode==="cinema"?-22:-18;
   state.compressor.knee.value=18;
   state.compressor.ratio.value=state.audioMode==="cinema"?3:2;
   state.compressor.attack.value=.003;
   state.compressor.release.value=.18;
   state.stereo.pan.value=state.audioMode==="spatial"?0.02:0;
   state.audioSource.connect(state.gain).connect(state.compressor).connect(state.stereo).connect(state.audioCtx.destination);
   state.audioCtx.resume().catch(()=>{});
   el.volume=1;
   return true;
 }catch{return false}
}
function cycleAudio(){
 const modes=["original","enhanced","cinema","spatial"],i=modes.indexOf(state.audioMode),next=modes[(i+1)%modes.length];
 state.audioMode=next;
 const labels={original:"Original",enhanced:"Enhanced",cinema:"Cinema",spatial:"Spatial"};
 e.audioMode.innerHTML=`<span class="i-sound"></span><span>${labels[next]}</span>`;
 if(next!=="original"){if(!setupAudioGraph())showMode("Sound",`${labels[next]} · browser limited`,"◉");else showMode("Sound",labels[next],"◉")}
 else {setupAudioGraph();showMode("Sound","Original","◉")}
}
function cycleVideo(){
 const modes=["original","natural","enhanced","ultra"],i=modes.indexOf(state.videoMode),next=modes[(i+1)%modes.length];
 state.videoMode=next;
 const labels={original:"Original",natural:"Natural",enhanced:"Enhanced",ultra:"Ultra"};
 e.videoMode.innerHTML=`<span class="i-video"></span><span>${labels[next]}</span>`;
 const filters={original:"none",natural:"contrast(1.025) saturate(1.03)",enhanced:"contrast(1.06) saturate(1.07) brightness(1.01)",ultra:"contrast(1.09) saturate(1.10) brightness(1.015)"};
 if(state.kind==="video")e.video.style.filter=filters[next];
 showMode("Video",labels[next],"◇");
}

function sync(){
 const m=state.media;if(!m||!m.duration)return;
 e.seek.max=m.duration;e.seek.value=m.currentTime;e.current.textContent=fmt(m.currentTime);e.duration.textContent=fmt(m.duration);
}
function togglePlay(){
 const m=state.media;if(!m||!("play"in m))return;
 if(m.paused)m.play().catch(()=>{});else m.pause();
}
function bind(el){
 el.addEventListener("loadedmetadata",sync);el.addEventListener("timeupdate",sync);el.addEventListener("durationchange",sync);
 el.addEventListener("play",()=>e.play.innerHTML='<span class="i-pause"></span>');
 el.addEventListener("pause",()=>e.play.innerHTML='<span class="i-play"></span>');
 el.addEventListener("ended",()=>e.play.innerHTML='<span class="i-replay"></span>');
 el.addEventListener("volumechange",()=>e.mute.innerHTML=el.muted?'<span class="i-volume-off"></span>':'<span class="i-volume"></span>');
}
bind(e.video);bind(e.audio);

function openFile(file){
 const kind=classify(file);if(!kind)return;
 cleanup();state.kind=kind;state.media=kind==="video"?e.video:kind==="audio"?e.audio:e.image;
 e.player.classList.remove("hidden");e.player.setAttribute("aria-hidden","false");e.welcome.classList.add("hidden");e.studioDock.classList.add("hidden");
 e.preparing.classList.remove("hidden");e.empty.classList.add("hidden");e.status.textContent=file.name;
 const url=URL.createObjectURL(file);state.url=url;state.objectURLs.add(url);
 if(kind==="image"){
   e.image.src=url;e.image.classList.remove("hidden");e.image.onload=()=>{e.preparing.classList.add("hidden");e.status.textContent=`${file.name} · ${e.image.naturalWidth}×${e.image.naturalHeight}`};
   return;
 }
 const m=state.media;m.src=url;m.preload="metadata";m.classList.remove("hidden");
 const ready=()=>{e.preparing.classList.add("hidden");sync();e.status.textContent=`${file.name}${kind==="video"?` · ${m.videoWidth}×${m.videoHeight}`:""}`;resetFrame(false);};
 m.addEventListener("loadedmetadata",ready,{once:true});
 m.addEventListener("error",()=>{e.preparing.classList.add("hidden");e.status.textContent="This browser could not decode this media format."},{once:true});
 try{m.load()}catch{}
}

async function togglePiP(){
 if(state.kind!=="video"){showMode("PiP","Video only","▣");return}
 try{
   if(document.pictureInPictureElement)await document.exitPictureInPicture();
   else if(document.pictureInPictureEnabled&&e.video.requestPictureInPicture)await e.video.requestPictureInPicture();
   else if(e.video.webkitSetPresentationMode)e.video.webkitSetPresentationMode(e.video.webkitPresentationMode==="picture-in-picture"?"inline":"picture-in-picture");
   else showMode("PiP","Not supported here","▣");
 }catch{showMode("PiP","Not available","▣")}
}
async function toggleFullscreen(){
 try{
   if(document.fullscreenElement)await document.exitFullscreen();
   else if(e.mediaShell.requestFullscreen)await e.mediaShell.requestFullscreen();
   else if(e.video.webkitEnterFullscreen)e.video.webkitEnterFullscreen();
   else showMode("Fullscreen","Not supported here","⛶");
 }catch{showMode("Fullscreen","Not available","⛶")}
}

function togglePanel(panel){
 [e.fitPanel,e.ccPanel].forEach(p=>{if(p!==panel)p.classList.add("hidden")});panel.classList.toggle("hidden");
}
qsa("[data-fit]").forEach(b=>b.addEventListener("click",()=>{
 const mode=b.dataset.fit;state.fitMode=mode;
 if(mode==="original")resetFrame(false);else{qsa("[data-fit]").forEach(x=>x.classList.toggle("active",x===b));applyFrame()}
 showMode("Framing",mode==="fit"?"Fit Screen":mode==="fill"?"Fill Screen":"Original","⌗");
}));
qsa("[data-cc]").forEach(b=>b.addEventListener("click",()=>{state.cc=b.dataset.cc;qsa("[data-cc]").forEach(x=>x.classList.toggle("active",x===b));togglePanel(e.ccPanel);showMode("Captions",b.textContent,"CC")}));
[e.zoom,e.panX,e.panY].forEach(x=>x.addEventListener("input",()=>{
 state.zoom=+e.zoom.value;state.panX=+e.panX.value;state.panY=+e.panY.value;applyFrame()
}));
e.resetFrame.addEventListener("click",()=>{resetFrame(true);togglePanel(e.fitPanel)});
e.fit.addEventListener("click",()=>togglePanel(e.fitPanel));e.cc.addEventListener("click",()=>togglePanel(e.ccPanel));
e.pip.addEventListener("click",togglePiP);e.fullscreen.addEventListener("click",toggleFullscreen);
e.play.addEventListener("click",togglePlay);e.back.addEventListener("click",()=>{if(state.media)state.media.currentTime=Math.max(0,state.media.currentTime-10)});
e.forward.addEventListener("click",()=>{if(state.media)state.media.currentTime=Math.min(state.media.duration||Infinity,state.media.currentTime+10)});
e.mute.addEventListener("click",()=>{if(state.media&&"muted"in state.media)state.media.muted=!state.media.muted});
e.seek.addEventListener("input",()=>{if(state.media)state.media.currentTime=+e.seek.value});
e.audioMode.addEventListener("click",cycleAudio);e.videoMode.addEventListener("click",cycleVideo);
e.close.addEventListener("click",()=>{cleanup();e.player.classList.add("hidden");e.welcome.classList.remove("hidden");state.mode="play";qsa(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode==="play"));});
e.home.addEventListener("click",()=>{if(state.media){cleanup();e.player.classList.add("hidden")}e.studioDock.classList.add("hidden");e.welcome.classList.remove("hidden");state.mode="play";qsa(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode==="play"))});
qsa(".mode").forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
[e.open,e.heroOpen].forEach(b=>b.addEventListener("click",openPicker));
e.input.addEventListener("change",()=>{const f=[...e.input.files].find(classify);if(f)openFile(f)});
document.addEventListener("dragover",ev=>{if(ev.dataTransfer?.types?.includes("Files"))ev.preventDefault()});
document.addEventListener("drop",ev=>{if(!ev.dataTransfer?.files?.length)return;ev.preventDefault();const f=[...ev.dataTransfer.files].find(classify);if(f)openFile(f)});
updateGreeting();setInterval(updateGreeting,60000);
if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
