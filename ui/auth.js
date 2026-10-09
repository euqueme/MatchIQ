import { saveUsers, loadUsers, saveCurrent } from '../services/storage.js';
import { renderIQTo, iqQuestions } from '../services/iq.js';

// Auth and Registration controller
export function initAuth() {
  const landing = document.getElementById('landing');
  const btnLogin = document.getElementById('btnLogin');
  const btnRegister = document.getElementById('btnRegister');
  const login = document.getElementById('login');
  const doLogin = document.getElementById('doLogin');
  const cancelLogin = document.getElementById('cancelLogin');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');
  const registerSimple = document.getElementById('registerSimple');
  const regEmail = document.getElementById('regEmail');
  const regName = document.getElementById('regName');
  const regSimplePass = document.getElementById('regSimplePass');
  const regSimpleFinish = document.getElementById('regSimpleFinish');
  const cancelRegBtn = document.getElementById('cancelReg');

  // handlers
  btnLogin.addEventListener('click', ()=>{ landing.classList.add('hidden'); login.classList.remove('hidden'); });
  btnRegister.addEventListener('click', ()=>{ landing.classList.add('hidden'); registerSimple.classList.remove('hidden'); });
  cancelLogin.addEventListener('click', ()=>{ login.classList.add('hidden'); landing.classList.remove('hidden'); });

  doLogin.addEventListener('click', ()=>{
    const u = loginUser.value; const p = loginPass.value; const users = loadUsers();
    const found = users.find(x=>x.username===u && x.password===p);
    if (found) { saveCurrent(found); alert('Logged in'); document.querySelector('.topnav').classList.remove('hidden'); document.getElementById('navSwipe').click(); } else alert('Invalid credentials');
  });

  regSimpleFinish.addEventListener('click', ()=>{
    if(!regEmail.value || !regName.value || !regSimplePass.value){ alert('Enter email, name & password'); return; }
    const users = loadUsers(); if (users.find(u=>u.email===regEmail.value)){ alert('Email already used'); return; }
    const userObj = { email: regEmail.value, name: regName.value, password: regSimplePass.value, iq: 100, photos: [], bio: '' };
    users.push(userObj); saveUsers(users); saveCurrent(userObj);
    alert('Registered — proceed to tests');
    registerSimple.classList.add('hidden');
    document.querySelector('.topnav').classList.remove('hidden');
    document.getElementById('steps').classList.remove('hidden');
    // navigate to steps view
    document.getElementById('navHome').click();
  });

  cancelRegBtn.addEventListener('click', ()=>{ registerSimple.classList.add('hidden'); landing.classList.remove('hidden'); });
}
