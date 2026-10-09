// Simple prototype logic for CleverCupid
import { sampleUsers, findMatches } from './services/matching.js';
import { saveUsers, loadUsers, saveCurrent, loadCurrent } from './services/storage.js';
import { initAuth } from './ui/auth.js';
import { initChat } from './ui/chat.js';
import { renderIQ, iqQuestions } from './services/iq.js';
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startCamera = document.getElementById('startCamera');
const capturePhoto = document.getElementById('capturePhoto');
const photoPreview = document.getElementById('photoPreview');
// Registration camera elements
const regVideo = document.getElementById('regVideo');
const regCanvas = document.getElementById('regCanvas');
const regStartCam = document.getElementById('regStartCam');
const regCapture = document.getElementById('regCapture');
const regPhotos = document.getElementById('regPhotos');

let stream;
let capturedDataUrl = null;
let regStream;
let regPhotosArr = [];

startCamera.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
    capturePhoto.disabled = false;
  } catch (e) {
    alert('Cannot access camera: ' + e.message);
  }
});

capturePhoto.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  capturedDataUrl = canvas.toDataURL('image/png');
  photoPreview.innerHTML = `<img src="${capturedDataUrl}" alt="photo" />`;
});

// Registration camera handlers
if (regStartCam) regStartCam.addEventListener('click', async () => {
  try {
    regStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    regVideo.srcObject = regStream;
    regCapture.disabled = false;
  } catch (e) { alert('Cannot access camera: '+e.message); }
});
if (regCapture) regCapture.addEventListener('click', ()=>{
  regCanvas.width = regVideo.videoWidth; regCanvas.height = regVideo.videoHeight;
  const ctx = regCanvas.getContext('2d'); ctx.drawImage(regVideo,0,0);
  const d = regCanvas.toDataURL('image/png');
  if (regPhotosArr.length < 5) { regPhotosArr.push(d); renderRegPhotos(); }
});
function renderRegPhotos(){ regPhotos.innerHTML=''; regPhotosArr.forEach((p,i)=>{ const img = document.createElement('img'); img.src=p; img.className='reg-photo'; regPhotos.appendChild(img); }); }

// IQ quiz generation (uses questions from services/iq.js)
const iqForm = document.getElementById('iqForm');
const submitIQ = document.getElementById('submitIQ');
const iqResult = document.getElementById('iqResult');

// renderIQ from services will be used to populate the form
renderIQ('iqForm');

// Render IQ to a given container (used for registration step)
// (moved to services/iq.js)

submitIQ.addEventListener('click', () => {
  let score = 0;
  iqQuestions.forEach((qs, idx) => {
    const val = iqForm.querySelector(`input[name=q${idx}]:checked`);
    if (val && parseInt(val.value) === qs.c) score++;
  });
  // crude IQ mapping — store and display to the current user (not shown to matches)
  const iq = 80 + score * 8 + Math.floor(Math.random()*6);
  iqResult.textContent = `Your estimated IQ: ${iq} (score ${score}/${iqQuestions.length})`;
  iqResult.dataset.iq = iq;
});

// Attractiveness: compute from photo only (simple heuristic)
const attrForm = document.getElementById('attrForm');
const submitAttr = document.getElementById('submitAttr');
const attrResult = document.getElementById('attrResult');

function computePhotoAttractiveness(dataUrl) {
  return new Promise((resolve) => {
    if (!dataUrl) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img,0,0);
      const d = ctx.getImageData(0,0,c.width,c.height).data;
      let sum=0; for(let i=0;i<d.length;i+=4) sum += (d[i]+d[i+1]+d[i+2])/3;
      const avg = sum / (d.length/4);
      const photoScore = Math.max(1, Math.min(10, Math.round((avg/255)*10)));
      resolve(photoScore);
    };
    img.src = dataUrl;
  });
}

submitAttr.addEventListener('click', async () => {
  if (!capturedDataUrl) { alert('Please capture a photo first.'); return; }
  attrResult.textContent = 'Computing attractiveness from photo...';
  const photoScore = await computePhotoAttractiveness(capturedDataUrl);
  if (photoScore == null) { attrResult.textContent = 'Unable to compute attractiveness.'; return; }
  // Store only a level (1-10) privately in the DOM dataset; do not display exact value
  attrResult.textContent = `Your attractiveness level: ${photoScore} (private)`;
  attrResult.dataset.attr = photoScore;
});

// sampleUsers is now provided by services/matching.js

const findMatchesBtn = document.getElementById('findMatches');
const matchesEl = document.getElementById('matches');
const swipeView = document.getElementById('swipeView');
const swipeProfile = document.getElementById('swipeProfile');
const swipeLeft = document.getElementById('swipeLeft');
const swipeRight = document.getElementById('swipeRight');
const backToHome = document.getElementById('backToHome');
const navSwipe = document.getElementById('navSwipe');
const navChats = document.getElementById('navChats');
const navHome = document.getElementById('navHome');
const chatView = document.getElementById('chatView');
const matchListEl = document.getElementById('matchList');
const chatWindow = document.getElementById('chatWindow');
const toggleForce = document.getElementById('toggleForce');
// Landing / auth elements
const landing = document.getElementById('landing');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const login = document.getElementById('login');
const doLogin = document.getElementById('doLogin');
const cancelLogin = document.getElementById('cancelLogin');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const register = document.getElementById('register');
const regNext1 = document.getElementById('regNext1');
const regUser = document.getElementById('regUser');
const regPass = document.getElementById('regPass');
const regStep1 = document.getElementById('regStep1');
const regStep2 = document.getElementById('regStep2');
const regStep3 = document.getElementById('regStep3');
const regNext2 = document.getElementById('regNext2');
const regNext3 = document.getElementById('regNext3');
const regIQForm = document.getElementById('regIQForm');
const regBio = document.getElementById('regBio');
const regNext3Btn = document.getElementById('regNext3');
const regFinish = document.getElementById('regFinish');
const regBioText = document.getElementById('regBioText');
const cancelReg = document.getElementById('cancelReg');

function getFilters() {
  const ageMin = Number(document.getElementById('ageMin').value);
  const ageMax = Number(document.getElementById('ageMax').value);
  const maxDist = Number(document.getElementById('maxDist').value);
  return { ageMin, ageMax, maxDist };
}

findMatchesBtn.addEventListener('click', () => {
  const iq = Number(iqResult.dataset.iq);
  const attr = Number(attrResult.dataset.attr);
  if (!iq || !attr) { alert('Please complete IQ and attractiveness steps.'); return; }
  const f = getFilters();
  // combine registered users (local) with sample users
  const local = loadUsers();
  const pool = sampleUsers.concat(local.map((u, i)=>({ ...u, id:1000+i })));
  const matches = findMatches(pool, iq, attr, f);
  renderMatches(matches);
  // prepare swipe queue from matches
  window.currentSwipeQueue = matches.slice();
});

// Landing / auth handlers
// initialize auth UI
initAuth();
initChat();

function renderMatches(list) {
  matchesEl.innerHTML = '';
  if (!list.length) { matchesEl.textContent = 'No matches found.'; return; }
  list.forEach(u=>{
    const d = document.createElement('div'); d.className='item';
    // do not reveal other users' IQ or attractiveness levels; show age and distance only
    d.textContent = `${u.name} — age ${u.age}, ${u.dist} km away`;
    matchesEl.appendChild(d);
  });
}

// Navigation handlers
navSwipe.addEventListener('click', ()=>{ document.querySelector('.container').classList.add('hidden'); swipeView.classList.remove('hidden'); loadNextSwipe(); });
navHome.addEventListener('click', ()=>{ document.querySelector('.container').classList.remove('hidden'); swipeView.classList.add('hidden'); chatView.classList.add('hidden'); });
navChats.addEventListener('click', ()=>{ document.querySelector('.container').classList.add('hidden'); chatView.classList.remove('hidden'); swipeView.classList.add('hidden'); renderMatchList(); });
backToHome.addEventListener('click', ()=>{ navHome.click(); });

function loadNextSwipe(){
  const q = window.currentSwipeQueue || [];
  if (!q.length) { swipeProfile.innerHTML = '<p>No more candidates. Go back to Home.</p>'; return; }
  const u = q[0];
  // show attractiveness photo if available, otherwise placeholder
  const imgSrc = (u.photos && u.photos[0]) ? u.photos[0] : `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(u.name)}`;
  const bioText = u.bio || 'No bio available.';
  swipeProfile.innerHTML = `<img src="${imgSrc}" alt="${u.name}" /><h3>${u.name}, ${u.age}</h3><p>Distance: ${u.dist} km</p><p>Bio: ${bioText}</p>`;
}

swipeLeft.addEventListener('click', ()=>{
  // remove current
  const q = window.currentSwipeQueue || []; if (!q.length) return; q.shift(); loadNextSwipe();
});

swipeRight.addEventListener('click', ()=>{
  const q = window.currentSwipeQueue || []; if (!q.length) return; const u = q.shift();
  // register like; by default simulate reciprocal right randomly
  u.likedMe = Math.random() < 0.4;
  // if test toggle is enabled, force reciprocal likes for this session only
  if (window.forceReciprocal) u.likedMe = true;
  if (u.likedMe) {
    // create a match (use matchesList to avoid collision with DOM id 'matches')
    window.matchesList = window.matchesList || [];
    window.matchesList.push(u);
    alert(`It's a match with ${u.name}! Opening chat...`);
    // open chats and the chat with this user
    navChats.click();
    // ensure match list rendered then open chat
    setTimeout(()=>{ openChat(u); renderMatchList(); }, 100);
  }
  loadNextSwipe();
});

// Simple in-memory chat history per user id
window.chatHistory = window.chatHistory || {};

// Test-only toggle: force reciprocal likes for this session. Default: off.
window.forceReciprocal = false;
if (toggleForce) {
  toggleForce.textContent = 'Force reciprocal likes (test only)';
  toggleForce.addEventListener('click', () => {
    window.forceReciprocal = !window.forceReciprocal;
    toggleForce.textContent = window.forceReciprocal ? 'Force reciprocal likes: ON' : 'Force reciprocal likes (test only)';
  });
}

// Chat rendering
function renderMatchList(){
  matchListEl.innerHTML = '';
  (window.matchesList||[]).forEach(m => {
    const b = document.createElement('button'); b.textContent = m.name; b.onclick = ()=>openChat(m); matchListEl.appendChild(b);
  });
}

function openChat(u){
  chatWindow.innerHTML = `<h3>Chat with ${u.name}</h3><div id="messages"></div><div><input id="msgInput"><button id="sendMsg">Send</button></div>`;
  const msgEl = document.getElementById('messages');
  // render existing history
  const hist = window.chatHistory[u.id] || [];
  hist.forEach(m => { const p = document.createElement('div'); p.textContent = m; msgEl.appendChild(p); });
  document.getElementById('sendMsg').addEventListener('click', ()=>{
    const t = document.getElementById('msgInput').value; if(!t) return; const mEl = document.getElementById('messages'); const p = document.createElement('div'); p.textContent = 'You: '+t; mEl.appendChild(p);
    // persist in-memory
    window.chatHistory[u.id] = window.chatHistory[u.id] || [];
    window.chatHistory[u.id].push('You: '+t);
    document.getElementById('msgInput').value='';
  });
}

document.getElementById('backFromChat').addEventListener('click', ()=>{ navHome.click(); });

// UI bindings for sliders
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
const ageLabel = document.getElementById('ageRangeLabel');
const maxDist = document.getElementById('maxDist');
const distLabel = document.getElementById('distLabel');

function updateAgeLabel(){ ageLabel.textContent = `${ageMin.value}–${ageMax.value}` }
ageMin.addEventListener('input', updateAgeLabel); ageMax.addEventListener('input', updateAgeLabel);
maxDist.addEventListener('input', ()=>distLabel.textContent = maxDist.value);

// Initialization: if a user is logged in, pre-fill their IQ/attractiveness,
// initialize a default swipe queue and open the swipe view.
(async function initApp(){
  try {
    const current = loadCurrent();
    // default swipe pool includes sample users + registered local users
    const local = loadUsers();
    const pool = sampleUsers.concat(local.map((u, i)=>({ ...u, id:1000+i })));
    window.currentSwipeQueue = pool.slice();

    if (current) {
      // pre-fill IQ for the current user (visible only to them)
      if (current.iq) {
        iqResult.textContent = `Your estimated IQ: ${current.iq}`;
        iqResult.dataset.iq = current.iq;
      }
      // compute attractiveness from their saved first photo (if present)
      if (current.photos && current.photos[0]) {
        attrResult.textContent = 'Computing attractiveness from your saved photo...';
        const score = await computePhotoAttractiveness(current.photos[0]);
        if (score != null) {
          attrResult.textContent = `Your attractiveness level: ${score} (private)`;
          attrResult.dataset.attr = score;
        }
      }
      // open swipe view as the default home for logged-in users
      document.querySelector('.container').classList.add('hidden');
      swipeView.classList.remove('hidden');
      chatView.classList.add('hidden');
      loadNextSwipe();
    }
  } catch (e) {
    console.error('Init error', e);
  }
})();
