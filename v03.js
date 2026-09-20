
(()=> {
const q=s=>document.querySelector(s);
const stage=q('#dropZone'),host=q('#mediaHost'),input=q('#fileInput'),empty=q('#emptyState'),toast=q('#toast'),cap=q('#capability');
let media=null,url=null,files=[],subUrls=[],ctx=null,src=null,gain=null,comp=null,boost=1,rec=null,recChunks=[],recStream=null;

const css=document.createElement('style');
css.textContent=[
'.brand{gap:0!important}.brand-name{display:none!important}.play-mark{display:none!important}',
'.foldrone-v3-brand{width:176px;height:48px;object-fit:contain;display:block}',
'.mode-v3{display:flex;gap:3px;padding:3px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(255,255,255,.035);margin-left:12px}',
'.mode-v3 button{border:0;background:transparent;color:#7f8795;border-radius:9px;padding:7px 11px;font-size:11px}.mode-v3 .active{background:rgba(255,255,255,.1);color:#fff}',
'.welcome-v3{position:absolute;left:24px;top:24px;z-index:7;max-width:410px;padding:17px 19px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(9,11,15,.64);backdrop-filter:blur(22px);box-shadow:0 20px 70px rgba(0,0,0,.28);transition:.3s}.welcome-v3.hide{opacity:0;transform:translateY(-8px);pointer-events:none}',
'.wk{font-size:9px;letter-spacing:.22em;color:#788291}.wt{font-size:24px;font-weight:750;letter-spacing:-.03em;margin-top:7px}.ws{color:#b9c0cc;margin-top:4px}.wo{border:0;background:transparent;color:#5bcfff;padding:8px 0 0;font-size:11px;cursor:pointer}',
'.load-v3{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;align-items:center;gap:9px;padding:10px 14px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:rgba(8,10,14,.75);backdrop-filter:blur(18px);z-index:8;color:#dce2ec;font-size:11px}.load-v3.show{display:flex}.ring-v3{width:15px;height:15px;border:2px solid rgba(255,255,255,.18);border-top-color:#fff;border-radius:50%;animation:foldroneSpin .8s linear infinite}@keyframes foldroneSpin{to{transform:rotate(360deg)}}',
'.active-media{background:#000!important}.media-host video.active-media{width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center!important;min-width:0!important;min-height:0!important;display:block!important}',
'.cast-v3{position:absolute;left:50%;bottom:84px;transform:translate(-50%,14px);opacity:0;pointer-events:none;display:flex;align-items:center;gap:8px;padding:9px 14px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(15,18,24,.84);backdrop-filter:blur(22px);box-shadow:0 15px 50px rgba(0,0,0,.35);font-size:11px;z-index:15;transition:.28s}.cast-v3.show{opacity:1;transform:translate(-50%,0);pointer-events:auto}',
'.studio-v3{position:absolute;right:18px;top:82px;bottom:72px;width:min(390px,calc(100vw - 36px));padding:18px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:rgba(13,15,20,.94);backdrop-filter:blur(28px);box-shadow:0 25px 80px rgba(0,0,0,.55);transform:translateX(120%);transition:.3s;z-index:25;color:#fff}.studio-v3.open{transform:translateX(0)}.sv-head{display:flex;justify-content:space-between;align-items:center}.sv-head strong{display:block;font-size:17px}.sv-head span{display:block;font-size:11px;color:#858c99;margin-top:2px}.sv-close{width:32px;height:32px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.04);color:#fff;font-size:20px}.sv-card{margin-top:22px;padding:21px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.035)}.sv-icon{font-size:32px}.sv-card h2{margin:12px 0 5px;font-size:21px}.sv-card p{margin:0;color:#929aa8;font-size:12px;line-height:1.55}.sv-meter{height:6px;margin:18px 0;background:rgba(255,255,255,.06);border-radius:999px;overflow:hidden}.sv-meter i{display:block;width:4%;height:100%;background:linear-gradient(90deg,#39c8ff,#7d4cff,#e657ff)}.sv-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sv-record,.sv-download{padding:11px 14px;border:0;border-radius:12px;background:#eef3ff;color:#080a0e;font-weight:650;text-decoration:none;font-size:12px}.sv-download{background:rgba(255,255,255,.08);color:#fff}.sv-audio{width:100%;margin-top:14px}.sv-note{position:absolute;left:18px;right:18px;bottom:18px;color:#747c89;font-size:11px;line-height:1.5}',
'@media(max-width:800px){.foldrone-v3-brand{width:145px;height:42px}.welcome-v3{left:12px;right:12px;top:12px;max-width:none}.cast-v3{bottom:104px}.studio-v3{top:68px;bottom:56px;right:8px;width:calc(100vw - 16px)}}',
'@media(max-width:650px){.foldrone-v3-brand{width:132px;height:39px}.mode-v3{display:none}.welcome-v3 .wt{font-size:20px}.welcome-v3 .ws{font-size:12px}}'
].join('');
document.head.appendChild(css);

const brand=q('.brand');
if(brand){
  brand.innerHTML='<img class="foldrone-v3-brand" src="./foldrone-play-logo.svg" alt="Foldrone Play">';
  const modes=document.createElement('div');
  modes.className='mode-v3';
  modes.innerHTML='<button class="active" id="v3PlayMode">Play</button><button id="v3StudioMode">Studio</button>';
  brand.appendChild(modes);
}

const welcome=document.createElement('div');
welcome.className='welcome-v3';
welcome.innerHTML='<div class="wk">FOLDRONE PLAY</div><div class="wt" id="v3WelcomeTitle"></div><div class="ws" id="v3WelcomeSub"></div><button class="wo" id="v3Weather">Personalize with local weather</button>';
stage.appendChild(welcome);

const load=document.createElement('div');
load.className='load-v3';
load.innerHTML='<span class="ring-v3"></span><span id="v3LoadText">Preparing media…</span>';
stage.appendChild(load);

const capsule=document.createElement('div');
capsule.className='cast-v3';
capsule.innerHTML='<span>📺</span><span id="v3CastText">Play on a device</span><span>›</span>';
stage.appendChild(capsule);

const studio=document.createElement('aside');
studio.className='studio-v3';
studio.innerHTML='<div class="sv-head"><div><strong>Foldrone Studio</strong><span>Voice capture • Creator workspace</span></div><button class="sv-close" id="v3StudioClose">×</button></div><div class="sv-card"><div class="sv-icon">🎙️</div><h2>Record your voice</h2><p>Capture a local voice recording. Nothing leaves the browser unless you export it.</p><div class="sv-meter"><i id="v3Meter"></i></div><div class="sv-row"><button class="sv-record" id="v3Record">Start Recording</button><a class="sv-download" id="v3Download" hidden>Export Recording</a></div><audio class="sv-audio" id="v3Preview" controls hidden></audio></div><div class="sv-note">Studio is built on the same Media Core. Voice, BGM, captions and multi-track creation can grow here without changing Play.</div>';
stage.appendChild(studio);

function setLoad(on,text){load.classList.toggle('show',!!on);if(text)q('#v3LoadText').textContent=text}
function greeting(weather){
  const h=new Date().getHours();
  const g=h<5?'Good Night 🌙':h<12?'Good Morning ☀️':h<17?'Good Afternoon 🌤️':h<20?'Good Evening 🌆':'Good Night 🌙';
  q('#v3WelcomeTitle').textContent=weather?g.replace(/[🌙☀️🌤️🌆]$/,'')+' '+weather.emoji:g;
  q('#v3WelcomeSub').textContent=weather?weather.text+'. How about a coffee and a movie? ☕🎬':'How about a coffee and a movie? ☕🎬';
}
greeting();

async function useWeather(){
  if(!navigator.geolocation){toastMsg('Location is unavailable here.');return}
  navigator.geolocation.getCurrentPosition(async p=>{
    try{
      const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+p.coords.latitude+'&longitude='+p.coords.longitude+'&current=temperature_2m,weather_code&timezone=auto');
      const d=await r.json(),c=d.current.weather_code;
      const w=c===0?['☀️','Clear outside']:c<=3?['🌤️','A little change in the sky']:c<=67?['🌧️','Rain outside']:c<=82?['🌦️','Showers outside']:['⛈️','Stormy weather outside'];
      localStorage.setItem('foldrone-weather-optin','1');greeting({emoji:w[0],text:w[1]});q('#v3Weather').textContent='Weather context enabled';toastMsg('Weather context enabled.');
    }catch(e){toastMsg('Weather is unavailable right now.')}
  },()=>toastMsg('Weather context needs location permission.'),{enableHighAccuracy:false,timeout:7000,maximumAge:900000});
}
q('#v3Weather').onclick=useWeather;q('#weatherButton').onclick=useWeather;
try{navigator.permissions?.query({name:'geolocation'}).then(p=>{if(p.state==='granted'&&localStorage.getItem('foldrone-weather-optin')==='1')useWeather()}).catch(()=>{})}catch(e){}

function toastMsg(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(toastMsg.t);toastMsg.t=setTimeout(()=>toast.classList.remove('show'),3200)}
function getKind(f){const n=f.name||'',t=(f.type||'').toLowerCase();if(t.startsWith('video/')||/\.(mp4|webm|mov|m4v|avi|mkv|mpeg|mpg|ts|m2ts)$/i.test(n))return'video';if(t.startsWith('audio/')||/\.(mp3|flac|wav|aac|m4a|alac|ogg|opus)$/i.test(n))return'audio';if(t.startsWith('image/')||/\.(jpg|jpeg|png|webp|avif|gif|tif|tiff)$/i.test(n))return'image';if(/\.(srt|vtt|ass|ssa)$/i.test(n))return'sub';return'unknown'}
function base(n){return n.replace(/\.[^.]+$/,'').replace(/\.(en|si|ta|es|fr|de|ja|ko|zh|hi|ar|ru|it|pt)$/i,'').toLowerCase()}
function srtVtt(t){return'WEBVTT\n\n'+t.replace(/^\uFEFF/,'').replace(/\r/g,'').replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,'$1.$2').replace(/^\d+\n(?=\d{2}:\d{2}:\d{2}\.\d{3})/gm,'')}
async function addSub(f){
  if(/\.(ass|ssa)$/i.test(f.name)){toastMsg('ASS/SSA detected. Native Media Core will render these formats.');return}
  const txt=await f.text(),v=/\.vtt$/i.test(f.name)?txt:srtVtt(txt),u=URL.createObjectURL(new Blob([v],{type:'text/vtt'}));subUrls.push(u);
  const tr=document.createElement('track');tr.kind='subtitles';tr.label=(f.name.match(/\.([a-z]{2,3})\.(?:srt|vtt)$/i)||[])[1]?.toUpperCase()||'Subtitles';tr.srclang='en';tr.src=u;tr.default=true;media.appendChild(tr);
  setTimeout(()=>{[...media.textTracks].forEach(x=>x.mode='showing');q('#subtitleButton').textContent='CC ✓'},60)
}
async function findSubs(fs,m){const b=base(m.name);for(const f of fs.filter(x=>getKind(x)==='sub'))if(base(f.name)===b||f.name.toLowerCase().startsWith(b+'.'))await addSub(f)}

function audioGraph(){
  if(!media||!('playbackRate'in media)||(window.AudioContext===undefined&&window.webkitAudioContext===undefined))return;
  try{
    ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();
    if(!src){src=ctx.createMediaElementSource(media);gain=ctx.createGain();comp=ctx.createDynamicsCompressor();comp.threshold.value=-8;comp.knee.value=18;comp.ratio.value=8;comp.attack.value=.003;comp.release.value=.22;src.connect(gain).connect(comp).connect(ctx.destination)}
    if(ctx.state==='suspended')ctx.resume();
    gain.gain.setTargetAtTime(Number(q('#volume').value)*boost,ctx.currentTime,.02);
  }catch(e){}
}
function openMedia(f,fs){
  if(!f)return;
  const k=getKind(f);if(!['video','audio','image'].includes(k)){toastMsg('Select a video, audio or image file.');return}
  files=fs&&fs.length?fs:[f];if(url)URL.revokeObjectURL(url);subUrls.forEach(u=>URL.revokeObjectURL(u));subUrls=[];
  host.innerHTML='';url=URL.createObjectURL(f);media=document.createElement(k==='image'?'img':k);media.className='active-media';media.src=url;
  if(k==='video'){
    media.preload='metadata';media.playsInline=true;media.setAttribute('playsinline','');media.setAttribute('webkit-playsinline','');
    media.addEventListener('loadstart',()=>setLoad(true,'Preparing video…'),{once:true});
    media.addEventListener('loadedmetadata',()=>{q('#duration').textContent=fmt(media.duration);if(media.videoWidth)media.style.aspectRatio=media.videoWidth+'/'+media.videoHeight;setLoad(false)});
    media.addEventListener('waiting',()=>setLoad(true,'Buffering…'));media.addEventListener('playing',()=>setLoad(false));
    media.addEventListener('error',()=>{setLoad(false);toastMsg('This browser cannot decode this media. Native Foldrone Media Core will expand codec coverage.')});
  }else if(k==='audio'){media.preload='metadata';media.addEventListener('loadedmetadata',()=>{q('#duration').textContent=fmt(media.duration);setLoad(false)})}
  host.appendChild(media);empty.style.display='none';welcome.classList.add('hide');q('#mediaBadge').textContent=k.toUpperCase();cap.textContent=k[0].toUpperCase()+k.slice(1)+' • Local';q('#playButton').disabled=k==='image';q('#seek').disabled=k==='image';
  media.addEventListener('play',()=>q('#playButton').textContent='Ⅱ');media.addEventListener('pause',()=>q('#playButton').textContent='▶');media.addEventListener('timeupdate',()=>{q('#currentTime').textContent=fmt(media.currentTime);if(Number.isFinite(media.duration))q('#seek').value=media.currentTime/media.duration*100});
  if(k==='video'||k==='audio'){media.play().catch(()=>toastMsg('Media ready. Tap Play to start.'));if(k==='video')findSubs(files,f)}
  if(media.webkitShowPlaybackTargetPicker)q('#castButton').style.display='inline-flex';
  q('#playButton').onclick=()=>togglePlay();
  q('#muteButton').onclick=()=>{media.muted=!media.muted;q('#muteButton').textContent=media.muted?'🔇':'🔊'};
}
function togglePlay(){if(!media||media.tagName==='IMG')return;if(media.paused){media.preload='auto';audioGraph();media.play().catch(()=>toastMsg('Tap Play again to start this media.'))}else media.pause()}
function fmt(t){if(!Number.isFinite(t))return'00:00';const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=Math.floor(t%60);return h?String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'):String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
input.onchange=e=>{const fs=[...e.target.files],m=fs.find(x=>['video','audio','image'].includes(getKind(x)));if(m)openMedia(m,fs)};
q('#openButton').onclick=()=>input.click();q('#openPrimary').onclick=()=>input.click();
q('#boostButton').onclick=()=>{const a=[1,1.25,1.5,2,2.5,3],i=a.indexOf(boost);boost=a[(i+1)%a.length];q('#boostButton').textContent='Boost '+Math.round(boost*100)+'%';audioGraph();toastMsg('Audio boost '+Math.round(boost*100)+'%')};
q('#volume').oninput=()=>{if(gain)gain.gain.setTargetAtTime(Number(q('#volume').value)*boost,ctx.currentTime,.02);else if(media)media.volume=Number(q('#volume').value)};
q('#subtitleButton').onclick=()=>{if(!media||media.tagName!=='VIDEO'){toastMsg('CC is available for video.');return}if(!media.textTracks.length){toastMsg('Select the video together with its .srt or .vtt file for automatic CC loading.');return}const on=[...media.textTracks].some(t=>t.mode==='showing');[...media.textTracks].forEach(t=>t.mode=on?'disabled':'showing');q('#subtitleButton').textContent=on?'CC':'CC ✓'};
q('#castButton').onclick=()=>cast();capsule.onclick=()=>cast();
function showCast(t){q('#v3CastText').textContent=t;capsule.classList.add('show');clearTimeout(showCast.t);showCast.t=setTimeout(()=>capsule.classList.remove('show'),7000)}
function cast(){
  if(media?.webkitShowPlaybackTargetPicker){media.webkitShowPlaybackTargetPicker();return}
  if(window.cast?.framework){try{cast.framework.CastContext.getInstance().requestSession().then(()=>toastMsg('Cast connected. Local browser files need a Foldrone receiver for direct local-network playback.')).catch(()=>toastMsg('No Cast device selected.'));return}catch(e){}}
  toastMsg('No compatible casting target is available here yet.')
}
function castInit(){if(!window.cast?.framework)return;try{cast.framework.CastContext.getInstance().setOptions({receiverApplicationId:chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,autoJoinPolicy:chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED});q('#castButton').style.display='inline-flex'}catch(e){}}
function loadCast(){window.__onGCastApiAvailable=ok=>{window.__foldroneCastAvailable=ok;if(ok)castInit()};const s=document.createElement('script');s.src='https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';document.head.appendChild(s)}
loadCast();

q('#foldraButton').onclick=()=>{q('#foldraPanel').classList.add('open');q('#foldraPanel').setAttribute('aria-hidden','false')};q('#closeFoldra').onclick=()=>{q('#foldraPanel').classList.remove('open');q('#foldraPanel').setAttribute('aria-hidden','true')};
q('#v3PlayMode').onclick=()=>{q('#v3PlayMode').classList.add('active');q('#v3StudioMode').classList.remove('active');studio.classList.remove('open')};
q('#v3StudioMode').onclick=()=>{q('#v3StudioMode').classList.add('active');q('#v3PlayMode').classList.remove('active');studio.classList.add('open')};q('#v3StudioClose').onclick=()=>{studio.classList.remove('open');q('#v3StudioMode').classList.remove('active');q('#v3PlayMode').classList.add('active')};

q('#v3Record').onclick=async()=>{
  if(rec?.state==='recording'){rec.stop();return}
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toastMsg('Voice recording is unavailable in this browser.');return}
  try{
    recStream=await navigator.mediaDevices.getUserMedia({audio:true});recChunks=[];
    const mt=['audio/mp4','audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(x=>MediaRecorder.isTypeSupported?.(x))||'';
    rec=new MediaRecorder(recStream,mt?{mimeType:mt}:undefined);
    rec.ondataavailable=e=>{if(e.data.size)recChunks.push(e.data)};
    rec.onstop=()=>{recStream.getTracks().forEach(t=>t.stop());const type=recChunks[0]?.type||'audio/webm',blob=new Blob(recChunks,{type}),u=URL.createObjectURL(blob);q('#v3Preview').src=u;q('#v3Preview').hidden=false;const a=q('#v3Download');a.href=u;a.download='foldrone-voice-'+Date.now()+(type.includes('mp4')?'.m4a':'.webm');a.hidden=false;q('#v3Record').textContent='Start Recording';q('#v3Meter').style.width='4%';toastMsg('Voice recording ready.')};
    rec.start();q('#v3Record').textContent='Stop Recording';toastMsg('Recording started.')
  }catch(e){toastMsg('Microphone access was not granted or is unavailable.')}
};

const style=window.matchMedia?.('(prefers-color-scheme:dark)');
const ambient=()=>{const h=new Date().getHours();document.body.dataset.ambient=h>=6&&h<17?'day':h>=17&&h<20?'dusk':'night'};
ambient();setInterval(ambient,60000);
window.addEventListener('beforeunload',()=>{if(url)URL.revokeObjectURL(url);subUrls.forEach(u=>URL.revokeObjectURL(u));recStream?.getTracks().forEach(t=>t.stop())});
console.info({product:'foldrone-play',version:'0.3.0',features:['adaptive-ui','responsive-video','auto-srt-vtt','audio-boost','weather-context','cast-routing','studio-voice-recording']});
})();
