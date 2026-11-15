const captions=['花彩戀曲｜為秋天取一個名字，讓花替它落款。','水的留白｜同一片天空，在水裡又溫柔了一次。','林間行距｜路在腳邊延伸，光從枝葉間落下。','水岸微光｜風景有了倒影，日子有了回聲。','花田全景｜花向遠方開，心也跟著寬了。','小小相遇｜偶然一個停步，也能讓回憶多一點笑意。','天光下的舞台｜花海之外，還有一方為相聚搭起的風景。'];
const box=document.querySelector('#lightbox'),large=document.querySelector('#large-photo'),caption=document.querySelector('#large-caption');let current=0;
function show(i){current=(i+captions.length)%captions.length;large.src=`assets/photo-${String(current+1).padStart(2,'0')}.jpg`;large.alt=captions[current];caption.textContent=`${current+1} / ${captions.length}　${captions[current]}`;}
document.querySelectorAll('.photo').forEach(b=>b.addEventListener('click',()=>{show(Number(b.dataset.index));box.showModal();document.body.classList.add('viewing')}));
document.querySelector('.hero-picture').insertAdjacentHTML('beforeend','<button class="hero-zoom" aria-label="放大水岸微光照片" style="position:absolute;right:24px;bottom:24px;border:1px solid #ffffff88;background:#253e3377;color:white;padding:9px 12px;cursor:zoom-in">＋ 放大</button>');document.querySelector('.hero-zoom').onclick=()=>{show(3);box.showModal();document.body.classList.add('viewing')};
function close(){box.close()}box.querySelector('.close').onclick=close;box.querySelector('.prev').onclick=()=>show(current-1);box.querySelector('.next').onclick=()=>show(current+1);box.addEventListener('close',()=>document.body.classList.remove('viewing'));box.addEventListener('click',e=>{if(e.target===box)close()});box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(current-1)}if(e.key==='ArrowRight'){e.preventDefault();show(current+1)}});let startX=null;box.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX},{passive:true});box.addEventListener('touchend',e=>{if(startX!==null){let delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>60)show(current+(delta<0?1:-1));startX=null}},{passive:true});

// Fixed Taiwan Mandarin male recording; only one audio source may play.
const films=[...document.querySelectorAll('video')],poemAudio=document.querySelector('#poem-audio');
const poemLines=[...document.querySelectorAll('#poem-lines p')];
const poemPlay=document.querySelector('#poem-play'),poemPause=document.querySelector('#poem-pause'),poemStop=document.querySelector('#poem-stop'),poemRate=document.querySelector('#poem-rate'),poemStatus=document.querySelector('#poem-status');
let poemTimings=[];
fetch('assets/poem-taiwan-male.json').then(r=>{if(!r.ok)throw Error('timings');return r.json()}).then(data=>{poemTimings=data}).catch(()=>{});
function updatePoemControls(){const playing=!poemAudio.paused;poemPlay.disabled=playing;poemPause.disabled=poemAudio.currentTime===0&&poemAudio.paused;poemStop.disabled=poemAudio.currentTime===0&&poemAudio.paused;poemPause.textContent=playing?'暫停':'繼續';}
function clearPoemLine(){poemLines.forEach(p=>p.classList.remove('reading'));}
function playPoem(){films.forEach(f=>f.pause());poemAudio.playbackRate=Number(poemRate.value);poemAudio.play().catch(()=>{poemStatus.textContent='音檔暫時無法播放，請重新整理後再試。';updatePoemControls()});}
films.forEach(f=>f.addEventListener('play',()=>{films.forEach(other=>{if(other!==f)other.pause()});if(!poemAudio.paused){poemAudio.pause();poemStatus.textContent='影片播放中，詩朗讀已暫停。';}}));
poemAudio.addEventListener('play',()=>{films.forEach(f=>f.pause());poemStatus.textContent='台灣國語男聲朗讀中……';updatePoemControls()});
poemAudio.addEventListener('pause',updatePoemControls);
poemAudio.addEventListener('timeupdate',()=>{const index=poemTimings.findIndex(t=>poemAudio.currentTime>=t.start&&poemAudio.currentTime<t.end);poemLines.forEach((p,i)=>p.classList.toggle('reading',i===index));if(index>=0&&!poemAudio.paused)poemStatus.textContent=`台灣國語男聲 · 正在朗讀 ${index+1} / 8`;});
poemAudio.addEventListener('ended',()=>{poemAudio.currentTime=0;clearPoemLine();updatePoemControls();poemStatus.textContent='朗讀完畢。把同行留在詩裡，也留在心裡。';});
poemAudio.addEventListener('error',()=>{poemStatus.textContent='音檔載入失敗，請重新整理後再試。';updatePoemControls()});
poemPlay.addEventListener('click',playPoem);
poemPause.addEventListener('click',()=>{if(poemAudio.paused)playPoem();else{poemAudio.pause();poemStatus.textContent='朗讀已暫停。';}});
poemStop.addEventListener('click',()=>{poemAudio.pause();poemAudio.currentTime=0;clearPoemLine();updatePoemControls();poemStatus.textContent='朗讀已停止。';});
poemRate.addEventListener('change',()=>{poemAudio.playbackRate=Number(poemRate.value)});
window.addEventListener('pagehide',()=>{poemAudio.pause();films.forEach(f=>f.pause())});
