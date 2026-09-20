const $ = (s) => document.querySelector(s);
const dropZone = $('#dropZone'), mediaHost = $('#mediaHost'), fileInput = $('#fileInput'), emptyState = $('#emptyState'), dropOverlay = $('#dropOverlay');
const seek = $('#seek'), currentTime = $('#currentTime'), duration = $('#duration'), playButton = $('#playButton'), volume = $('#volume'), muteButton = $('#muteButton');
const capability = $('#capability'), toast = $('#toast');
let media = null, objectUrl = null, currentFile = null;

const IMAGE_EXT = /\.(jpg|jpeg|png|webp|avif|gif|tif|tiff)$/i;
const AUDIO_EXT = /\.(mp3|flac|wav|aac|m4a|alac|ogg|opus)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|avi|mkv|mpeg|mpg|ts|m2ts)$/i;
const fmt = t => { if (!Number.isFinite(t)) return '00:00'; const h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=Math.floor(t%60); return h ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; };
function showToast(message){ toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove('show'),3200); }
function kind(file){ const t=(file.type||'').toLowerCase(), n=file.name||''; if(t.startsWith('image/')||IMAGE_EXT.test(n)) return 'image'; if(t.startsWith('audio/')||AUDIO_EXT.test(n)) return 'audio'; if(t.startsWith('video/')||VIDEO_EXT.test(n)) return 'video'; return 'unknown'; }
function browserCanPlay(file, k){ if(k==='image') return true; const probe=document.createElement(k); if(!probe.canPlayType) return false; const type=file.type||''; return type ? !!probe.canPlayType(type) : false; }
function bindMedia(el){
  media=el; media.controls=false; media.playsInline=true;
  if(el.tagName==='VIDEO' || el.tagName==='AUDIO'){
    el.addEventListener('play',()=>playButton.textContent='Ⅱ'); el.addEventListener('pause',()=>playButton.textContent='▶');
    el.addEventListener('timeupdate',()=>{currentTime.textContent=fmt(el.currentTime); if(Number.isFinite(el.duration)) seek.value=(el.currentTime/el.duration)*100;});
    el.addEventListener('loadedmetadata',()=>{duration.textContent=fmt(el.duration);});
    el.addEventListener('error',()=>{ capability.textContent='Playback capability unavailable'; showToast('This browser cannot decode this media. Native Foldrone Media Core will handle broader formats.'); });
  } else { playButton.disabled=true; seek.disabled=true; duration.textContent='IMAGE'; capability.textContent='Image Media • Ready'; }
}
function openFile(file){
  if(!file) return; currentFile=file; const k=kind(file);
  if(k==='unknown'){showToast('Foldrone Play could not identify this media type.'); return;}
  if(objectUrl) URL.revokeObjectURL(objectUrl); objectUrl=URL.createObjectURL(file);
  mediaHost.innerHTML=''; const el=document.createElement(k==='image'?'img':k); el.className='active-media'; el.src=objectUrl; if(k==='video'){el.preload='metadata'; el.playsInline=true;} if(k==='audio'){el.preload='metadata';}
  bindMedia(el); mediaHost.appendChild(el); emptyState.style.display='none'; capability.textContent=`${k[0].toUpperCase()+k.slice(1)} • Local`; $('#mediaBadge').textContent=k.toUpperCase();
  if(k==='video'||k==='audio') el.play().catch(()=>{}); else showToast(`${file.name} opened locally`);
}
function togglePlay(){if(!media||media.tagName==='IMG') return; media.paused?media.play():media.pause();}
$('#openButton').onclick=()=>fileInput.click(); $('#openPrimary').onclick=()=>fileInput.click(); fileInput.onchange=e=>openFile(e.target.files[0]);
playButton.onclick=togglePlay; mediaHost.onclick=e=>{if(e.target===media) togglePlay();};
seek.oninput=()=>{if(media && Number.isFinite(media.duration)) media.currentTime=(seek.value/100)*media.duration};
volume.oninput=()=>{if(media&&'volume' in media) media.volume=Number(volume.value)};
muteButton.onclick=()=>{if(media&&'muted' in media){media.muted=!media.muted; muteButton.textContent=media.muted?'🔇':'🔊';}};
$('#backButton').onclick=()=>{if(media&&'currentTime' in media)media.currentTime=Math.max(0,media.currentTime-10)};
$('#forwardButton').onclick=()=>{if(media&&'currentTime' in media)media.currentTime=Math.min(media.duration||Infinity,media.currentTime+10)};
$('#speedButton').onclick=()=>{if(!media||!('playbackRate' in media))return; const speeds=[1,1.25,1.5,1.75,2,.75], i=speeds.indexOf(media.playbackRate); media.playbackRate=speeds[(i+1)%speeds.length]; $('#speedButton').textContent=`${media.playbackRate}×`;};
$('#fullscreenButton').onclick=()=>{if(dropZone.requestFullscreen)dropZone.requestFullscreen();else if(media?.webkitEnterFullscreen)media.webkitEnterFullscreen();};
$('#pipButton').onclick=async()=>{try{if(media?.requestPictureInPicture)await media.requestPictureInPicture();else showToast('Picture-in-picture is not available for this media/browser.');}catch{showToast('Picture-in-picture is unavailable here.');}};
$('#subtitleButton').onclick=()=>showToast('Subtitle ingestion is the next Media Core module. SRT/VTT/ASS are part of the roadmap.');
$('#searchButton').onclick=()=>showToast('Semantic media search is reserved for Foldra intelligence.');
$('#foldraButton').onclick=()=>{$('#foldraPanel').classList.add('open');$('#foldraPanel').setAttribute('aria-hidden','false')}; $('#closeFoldra').onclick=()=>{$('#foldraPanel').classList.remove('open');$('#foldraPanel').setAttribute('aria-hidden','true')};
$('#foldraSend').onclick=()=>showToast('Foldra intelligence is scaffolded here and can be connected to local or cloud AI later.');
['dragenter','dragover'].forEach(e=>dropZone.addEventListener(e,ev=>{ev.preventDefault();dropOverlay.classList.add('show')})); ['dragleave','drop'].forEach(e=>dropZone.addEventListener(e,ev=>{ev.preventDefault();dropOverlay.classList.remove('show')})); dropZone.addEventListener('drop',ev=>openFile(ev.dataTransfer.files[0]));
window.addEventListener('beforeunload',()=>objectUrl&&URL.revokeObjectURL(objectUrl));
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
const capabilityManifest={schema:1,product:'foldrone-play',version:'0.2.0',engine:'browser',features:['local-file-playback','video','audio','image','seek','pip','fullscreen','drag-drop','mobile-file-picker','foldra-entry'],future:['signed-capability-updates','native-media-core','semantic-index','subtitle-engine','ai-enhancement']}; console.info(capabilityManifest);
