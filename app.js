(() => {
"use strict";
const $=id=>document.getElementById(id), qsa=s=>[...document.querySelectorAll(s)];
const S={media:null,url:null,kind:null,files:[],subtitles:[],audio:"original",video:"original",fit:"original",zoom:100,x:0,y:0,cc:"off",audioCtx:null,src:null,gain:null,comp:null,pan:null,toast:null,locked:false};
const e={welcome:$("welcome"),greeting:$("greeting"),player:$("player"),shell:$("mediaShell"),prep:$("preparing"),stage:$("mediaStage"),empty:$("emptyStage"),video:$("video"),audio:$("audio"),image:$("image"),open:$("openBtn"),hero:$("heroOpenBtn"),input:$("fileInput"),home:$("homeBtn"),play:$("playBtn"),back:$("backBtn"),forward:$("forwardBtn"),mute:$("muteBtn"),seek:$("seek"),cur:$("currentTime"),dur:$("duration"),sound:$("audioModeBtn"),picture:$("videoModeBtn"),close:$("closeBtn"),cc:$("ccBtn"),fit:$("fitBtn"),pip:$("pipBtn"),lock:$("lockBtn"),full:$("fullscreenBtn"),fitPanel:$("fitPanel"),ccPanel:$("ccPanel"),zoom:$("zoomRange"),x:$("panXRange"),y:$("panYRange"),zv:$("zoomValue"),xv:$("panXValue"),yv:$("panYValue"),reset:$("resetFrameBtn"),toast:$("modeToast"),toastIcon:$("modeToastIcon"),toastType:$("modeToastType"),toastText:$("modeToastText"),topActions:$("topActions"),cast:$("castCapsule"),castBtn:$("castBtn"),castText:$("castText"),ccOptions:$("ccOptions"),subFiles:$("subtitleFiles"),ccHint:$("ccHint")};

function greeting(){const h=new Date().getHours();return h<5?"Good Night":h<12?"Good Morning":h<17?"Good Afternoon":h<21?"Good Evening":"Good Night"}
e.greeting.textContent=greeting();setInterval(()=>e.greeting.textContent=greeting(),60000);

function showMode(type,text,icon){e.toastType.textContent=type;e.toastText.textContent=text;e.toastIcon.textContent=icon||"•";e.toast.classList.add("show");clearTimeout(S.toast);S.toast=setTimeout(()=>e.toast.classList.remove("show"),1800)}
function fmt(v){if(!Number.isFinite(v)||v<0)return"0:00";let s=Math.floor(v),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${String(m).padStart(2,"0")}:${String(x).padStart(2,"0")}`:`${m}:${String(x).padStart(2,"0")}`}
function kind(f){let t=(f.type||"").toLowerCase(),n=f.name.toLowerCase();if(t.startsWith("video/")||/\.(mp4|m4v|webm|mov|ogv|avi|mkv)$/i.test(n))return"video";if(t.startsWith("audio/")||/\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(n))return"audio";if(t.startsWith("image/")||/\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)$/i.test(n))return"image";if(/\.(srt|vtt|ass|ssa)$/i.test(n))return"subtitle"}
function media(){return S.kind==="video"?e.video:S.kind==="audio"?e.audio:e.image}
function clean(){[e.video,e.audio].forEach(v=>{try{v.pause()}catch{};v.removeAttribute("src");try{v.load()}catch{};v.classList.add("hidden")});e.image.removeAttribute("src");e.image.classList.add("hidden");try{S.src?.disconnect()}catch{};try{S.gain?.disconnect()}catch{};try{S.comp?.disconnect()}catch{};try{S.pan?.disconnect()}catch{};S.src=S.gain=S.comp=S.pan=null;if(S.url)URL.revokeObjectURL(S.url);S.url=null;S.media=null;S.kind=null;S.subtitles=[];e.subFiles.innerHTML="";e.empty.classList.remove("hidden");e.prep.classList.add("hidden");e.topActions.classList.add("hidden");e.cast.classList.add("hidden");resetFrame(false);e.seek.value=0;e.seek.max=0;e.cur.textContent="0:00";e.dur.textContent="0:00"}
function openPicker(){e.input.value="";e.input.click()}
function resetFrame(show=true){S.fit="original";S.zoom=100;S.x=0;S.y=0;e.zoom.value=100;e.x.value=0;e.y.value=0;e.video.classList.remove("fit-screen","fit-fill");e.video.style.transform="";qsa("[data-fit]").forEach(b=>b.classList.toggle("active",b.dataset.fit==="original"));if(show)showMode("Framing","Original","⌗")}
function applyFrame(){if(S.kind!=="video")return;e.video.classList.remove("fit-screen","fit-fill");if(S.fit==="fit")e.video.classList.add("fit-screen");if(S.fit==="fill")e.video.classList.add("fit-fill");e.video.style.transform=`translate(${S.x}%,${S.y}%) scale(${S.zoom/100})`;e.zv.textContent=`${S.zoom}%`;e.xv.textContent=S.x;e.yv.textContent=S.y}
function sync(){if(!S.media||!S.media.duration)return;e.seek.max=S.media.duration;e.seek.value=S.media.currentTime;e.cur.textContent=fmt(S.media.currentTime);e.dur.textContent=fmt(S.media.duration)}
function bind(v){v.addEventListener("loadedmetadata",sync);v.addEventListener("timeupdate",sync);v.addEventListener("durationchange",sync);v.addEventListener("play",()=>e.play.innerHTML='<span class="i-pause"></span>');v.addEventListener("pause",()=>e.play.innerHTML='<span class="i-play"></span>');v.addEventListener("ended",()=>e.play.innerHTML='<span class="i-replay"></span>');v.addEventListener("volumechange",()=>e.mute.innerHTML=v.muted?'<span class="i-volume-off"></span>':'<span class="i-volume"></span>')}
bind(e.video);bind(e.audio);

function parseSRT(text){
 text=text.replace(/\r/g,"").replace(/^\uFEFF/,"");let blocks=text.split(/\n{2,}/),out=[];
 for(let b of blocks){let lines=b.split("\n").filter(Boolean),i=lines.findIndex(x=>x.includes("-->"));if(i<0)continue;let m=lines[i].match(/(\d{1,2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{1,2}):(\d{2}):(\d{2})[,.](\d{3})/);if(!m){m=lines[i].match(/(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2})[,.](\d{3})/);if(!m)continue;out.push({a:+m[1]*60+ +m[2]+ +m[3]/1000,b:+m[4]*60+ +m[5]+ +m[6]/1000,t:lines.slice(i+1).join("\n")})}else out.push({a:+m[1]*3600+ +m[2]*60+ +m[3]+ +m[4]/1000,b:+m[5]*3600+ +m[6]*60+ +m[7]+ +m[8]/1000,t:lines.slice(i+1).join("\n")})}
 return out;
}
async function attachSubtitle(file,label){
 if(!S.media||S.kind!=="video")return;
 let cues;
 if(file.name.toLowerCase().endsWith(".vtt")){let txt=await file.text();let blob=new Blob([txt],{type:"text/vtt"});let u=URL.createObjectURL(blob);let track=document.createElement("track");track.kind="subtitles";track.label=label;track.srclang=(label||"en").slice(0,2).toLowerCase();track.src=u;track.default=true;e.video.appendChild(track);S.subtitles.push({file,label,url:u,track});track.track.mode="showing"}
 else {let cuesData=parseSRT(await file.text());let track=e.video.addTextTrack("subtitles",label,(label||"en").slice(0,2).toLowerCase());cuesData.forEach(c=>track.addCue(new VTTCue(c.a,c.b,c.t)));track.mode="showing";S.subtitles.push({file,label,track})}
 renderSubtitleFiles();S.cc=label;showMode("Captions",label,"CC")
}
function renderSubtitleFiles(){e.subFiles.innerHTML=S.subtitles.map((s,i)=>`<div class="subtitle-file"><span>${s.file.name}</span><button data-sub="${i}">On</button></div>`).join("");qsa("[data-sub]").forEach(b=>b.onclick=()=>{let s=S.subtitles[+b.dataset.sub];if(s.track)s.track.mode=s.track.mode==="showing"?"disabled":"showing"})}
function autoCC(){
 if(S.kind!=="video")return;
 let tracks=[...e.video.textTracks];if(tracks.length){let t=tracks.find(x=>x.kind==="subtitles"||x.kind==="captions");if(t){t.mode="showing";showMode("Captions","Embedded Auto","CC");return true}}
 let base=(S.files.find(f=>kind(f)==="video")?.name||"").replace(/\.[^.]+$/,"").toLowerCase();
 let candidates=S.files.filter(f=>kind(f)==="subtitle"&&f.name.toLowerCase().startsWith(base));
 if(candidates.length){let pref=candidates.find(f=>/(\.si\.|_si\.|-si\.|sinhala)/i.test(f.name))||candidates.find(f=>/(\.en\.|_en\.|english)/i.test(f.name))||candidates[0];attachSubtitle(pref,pref.name);return true}
 return false
}
function buildCCFiles(){e.subFiles.innerHTML="";let subs=S.files.filter(f=>kind(f)==="subtitle");subs.forEach(f=>{let row=document.createElement("div");row.className="subtitle-file";let span=document.createElement("span");span.textContent=f.name;let b=document.createElement("button");b.textContent="Apply";b.onclick=()=>attachSubtitle(f,f.name);row.append(span,b);e.subFiles.append(row)});if(!subs.length)e.ccHint.textContent="Auto checks embedded captions. To auto-match an external subtitle, select the video and its .srt/.vtt file together."}

function setupAudio(){
 if(!S.media||!["video","audio"].includes(S.kind))return;
 if(S.audio==="original"){try{S.src?.disconnect();S.media.volume=1}catch{};return}
 const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
 try{
  if(!S.audioCtx)S.audioCtx=new Ctx();if(!S.src)S.src=S.audioCtx.createMediaElementSource(S.media);
  S.src.disconnect();S.gain?.disconnect();S.comp?.disconnect();S.pan?.disconnect();
  S.gain=S.audioCtx.createGain();S.comp=S.audioCtx.createDynamicsCompressor();S.pan=S.audioCtx.createStereoPanner();
  const gain={enhanced:1.16,cinema:1.10,spatial:1.04}[S.audio]||1;
  S.gain.gain.value=gain;S.comp.threshold.value=S.audio==="cinema"?-22:-18;S.comp.knee.value=18;S.comp.ratio.value=S.audio==="cinema"?3:2;S.comp.attack.value=.003;S.comp.release.value=.18;S.pan.pan.value=0;
  S.src.connect(S.gain).connect(S.comp).connect(S.pan).connect(S.audioCtx.destination);S.audioCtx.resume().catch(()=>{});S.media.volume=1
 }catch{}
}
function cycleSound(){let a=["original","enhanced","cinema","spatial"],i=a.indexOf(S.audio),n=a[(i+1)%a.length];S.audio=n;let labels={original:"Original",enhanced:"Enhanced",cinema:"Cinema",spatial:"Spatial"};e.sound.querySelector("span:last-child").textContent=labels[n];setupAudio();showMode("Sound",labels[n],n==="original"?"◉":"◌")}
function cycleVideo(){let a=["original","natural","enhanced","ultra"],i=a.indexOf(S.video),n=a[(i+1)%a.length];S.video=n;let labels={original:"Original",natural:"Natural",enhanced:"Enhanced",ultra:"Ultra"};e.picture.querySelector("span:last-child").textContent=labels[n];let f={original:"none",natural:"contrast(1.025) saturate(1.03)",enhanced:"contrast(1.06) saturate(1.07) brightness(1.01)",ultra:"contrast(1.09) saturate(1.10) brightness(1.015)"};if(S.kind==="video")e.video.style.filter=f[n];showMode("Video",labels[n],"◇")}

async function fullscreen(){
 try{if(document.fullscreenElement){await document.exitFullscreen();return}if(e.shell.requestFullscreen){await e.shell.requestFullscreen();return}if(e.video.webkitEnterFullscreen){e.video.webkitEnterFullscreen();return}}catch{}showMode("Fullscreen","Browser controlled","⛶")
}
async function pip(){
 if(S.kind!=="video")return showMode("PiP","Video only","▣");
 try{
  if(document.pictureInPictureElement){await document.exitPictureInPicture();return}
  if(document.pictureInPictureEnabled&&e.video.requestPictureInPicture){await e.video.requestPictureInPicture();return}
  if(e.video.webkitSetPresentationMode){e.video.webkitSetPresentationMode(e.video.webkitPresentationMode==="picture-in-picture"?"inline":"picture-in-picture");return}
 }catch{}
 showMode("PiP","Not supported by this browser","▣")
}
async function autoLandscape(){
 if(S.kind!=="video")return;
 const landscape=innerWidth>innerHeight;
 if(!landscape)return;
 // A browser may require a user gesture for real fullscreen. Attempt it, then fall back to the immersive player shell.
 try{if(!document.fullscreenElement&&e.shell.requestFullscreen)await e.shell.requestFullscreen()}catch{}
 e.shell.classList.add("landscape-cinema");
}
async function toggleLock(){
 S.locked=!S.locked;
 if(S.locked){try{await screen.orientation?.lock?.("landscape")}catch{};e.lock.innerHTML='<span class="i-lock"></span>';showMode("Orientation","Landscape Locked","▣")}
 else{try{screen.orientation?.unlock?.()}catch{};e.lock.innerHTML='<span class="i-lock-open"></span>';showMode("Orientation","Unlocked","▣")}
}

function castAvailable(){return typeof e.video.webkitShowPlaybackTargetPicker==="function"}
function updateCast(){if(S.kind!=="video")return;e.cast.classList.toggle("hidden",!castAvailable());if(castAvailable())e.castText.textContent="Play on nearby device"}
function cast(){try{e.video.webkitShowPlaybackTargetPicker()}catch{showMode("Cast","Not available here","◔")}}
function togglePanel(p){[e.fitPanel,e.ccPanel].forEach(x=>{if(x!==p)x.classList.add("hidden")});p.classList.toggle("hidden")}

async function openFiles(files){
 let mediaFile=files.find(f=>kind(f)==="video"||kind(f)==="audio"||kind(f)==="image");if(!mediaFile)return;
 clean();S.files=files;S.kind=kind(mediaFile);S.media=S.kind==="video"?e.video:S.kind==="audio"?e.audio:e.image;
 e.player.classList.remove("hidden");e.player.setAttribute("aria-hidden","false");e.welcome.classList.add("hidden");e.prep.classList.remove("hidden");e.empty.classList.add("hidden");
 S.url=URL.createObjectURL(mediaFile);
 if(S.kind==="image"){e.image.src=S.url;e.image.classList.remove("hidden");e.image.onload=()=>e.prep.classList.add("hidden");return}
 S.media.src=S.url;S.media.classList.remove("hidden");
 S.media.addEventListener("loadedmetadata",()=>{e.prep.classList.add("hidden");e.topActions.classList.remove("hidden");sync();resetFrame(false);buildCCFiles();if(!autoCC()){}updateCast();}, {once:true});
 S.media.addEventListener("error",()=>e.prep.classList.add("hidden"),{once:true});
 S.media.load();
}
e.open.onclick=e.hero.onclick=openPicker;e.input.onchange=()=>openFiles([...e.input.files]);
e.home.onclick=()=>{clean();e.player.classList.add("hidden");e.welcome.classList.remove("hidden")};e.close.onclick=e.home.onclick;
e.play.onclick=()=>{if(!S.media)return;if(S.media.paused)S.media.play().catch(()=>{});else S.media.pause()};
e.back.onclick=()=>{if(S.media)S.media.currentTime=Math.max(0,S.media.currentTime-10)};e.forward.onclick=()=>{if(S.media)S.media.currentTime=Math.min(S.media.duration||Infinity,S.media.currentTime+10)};
e.mute.onclick=()=>{if(S.media&&"muted"in S.media)S.media.muted=!S.media.muted};e.seek.oninput=()=>{if(S.media)S.media.currentTime=+e.seek.value};
e.sound.onclick=cycleSound;e.picture.onclick=cycleVideo;e.pip.onclick=pip;e.full.onclick=fullscreen;e.lock.onclick=toggleLock;e.fit.onclick=()=>togglePanel(e.fitPanel);e.cc.onclick=()=>{togglePanel(e.ccPanel);autoCC()};
qsa("[data-fit]").forEach(b=>b.onclick=()=>{S.fit=b.dataset.fit;qsa("[data-fit]").forEach(x=>x.classList.toggle("active",x===b));applyFrame();showMode("Framing",S.fit==="fit"?"Fit Screen":S.fit==="fill"?"Fill Screen":"Original","⌗")});
[e.zoom,e.x,e.y].forEach(x=>x.oninput=()=>{S.zoom=+e.zoom.value;S.x=+e.x.value;S.y=+e.y.value;applyFrame()});e.reset.onclick=()=>{resetFrame(true);e.fitPanel.classList.add("hidden")};
qsa("[data-cc]").forEach(b=>b.onclick=()=>{qsa("[data-cc]").forEach(x=>x.classList.toggle("active",x===b));if(b.dataset.cc==="auto")autoCC();else{[...e.video.textTracks].forEach(t=>t.mode="disabled");showMode("Captions","Off","CC")}});
e.castBtn.onclick=cast;
document.addEventListener("dragover",ev=>{if(ev.dataTransfer?.types?.includes("Files"))ev.preventDefault()});document.addEventListener("drop",ev=>{if(ev.dataTransfer?.files?.length){ev.preventDefault();openFiles([...ev.dataTransfer.files])}});
addEventListener("resize",()=>{if(S.media&&S.kind==="video")autoLandscape()});addEventListener("orientationchange",()=>{if(S.media&&S.kind==="video")autoLandscape()});
addEventListener("keydown",ev=>{if(!S.media)return;if(ev.code==="Space"){ev.preventDefault();e.play.click()}if(ev.key==="f")fullscreen();if(ev.key==="p")pip()});
})()
