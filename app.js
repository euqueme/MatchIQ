// Simple prototype logic for CleverCupid
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startCamera = document.getElementById('startCamera');
const capturePhoto = document.getElementById('capturePhoto');
const photoPreview = document.getElementById('photoPreview');

let stream;
let capturedDataUrl = null;

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

// IQ quiz generation (5 sample questions)
const iqForm = document.getElementById('iqForm');
const submitIQ = document.getElementById('submitIQ');
const iqResult = document.getElementById('iqResult');

const iqQuestions = [
  {q:'Which number completes the sequence: 2,4,8,16,?', a:['24','32','30','28'], c:1},
  {q:'If ALL BLOBS are BLOBSH, and some BLOBS are SLIM, which is possible?', a:['All BLOBSH are SLIM','Some BLOBS are not BLOBSH','All SLIM are BLOBS','None'], c:1},
  {q:'Analogies: Bird is to Fly as Fish is to:', a:['Swim','Run','Climb','Jump'], c:0},
  {q:'What is 15% of 200?', a:['25','30','35','20'], c:1},
  {q:'Which shape has 6 sides?', a:['Triangle','Square','Hexagon','Circle'], c:2}
];

function renderIQ() {
  iqForm.innerHTML = '';
  iqQuestions.forEach((qs, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${idx+1}. ${qs.q}</p>`;
    qs.a.forEach((opt, i) => {
      const id = `iq_${idx}_${i}`;
      div.innerHTML += `<label><input type="radio" name="q${idx}" value="${i}" id="${id}"> ${opt}</label><br>`;
    });
    iqForm.appendChild(div);
  });
}

renderIQ();

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

// Sample users
const sampleUsers = [];
for (let i=0;i<30;i++) {
  sampleUsers.push({
    id:i,
    name:`User ${i+1}`,
    age:18+Math.floor(Math.random()*50),
    iq:80+Math.floor(Math.random()*60),
    attr:1+Math.floor(Math.random()*10),
    dist:Math.floor(Math.random()*2000)
  });
}

const findMatchesBtn = document.getElementById('findMatches');
const matchesEl = document.getElementById('matches');

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
  const matches = sampleUsers.filter(u => {
    return u.iq >= iq-5 && u.iq <= iq+5 && u.attr >= attr-1 && u.attr <= attr+1 && u.age >= f.ageMin && u.age <= f.ageMax && u.dist <= f.maxDist;
  });
  renderMatches(matches);
});

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

// UI bindings for sliders
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
const ageLabel = document.getElementById('ageRangeLabel');
const maxDist = document.getElementById('maxDist');
const distLabel = document.getElementById('distLabel');

function updateAgeLabel(){ ageLabel.textContent = `${ageMin.value}–${ageMax.value}` }
ageMin.addEventListener('input', updateAgeLabel); ageMax.addEventListener('input', updateAgeLabel);
maxDist.addEventListener('input', ()=>distLabel.textContent = maxDist.value);
