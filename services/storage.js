// LocalStorage wrapper for users and current user
export function loadUsers() {
  try {
    const raw = localStorage.getItem('matchiq_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('loadUsers parse error', e);
    return [];
  }
}

export function saveUsers(users) {
  try { localStorage.setItem('matchiq_users', JSON.stringify(users)); } catch (e) { console.error('saveUsers error', e); }
}

export function saveCurrent(user) {
  try { localStorage.setItem('matchiq_current', JSON.stringify(user)); } catch (e) { console.error('saveCurrent error', e); }
}

export function loadCurrent() {
  try { const raw = localStorage.getItem('matchiq_current'); return raw ? JSON.parse(raw) : null; } catch (e) { console.error('loadCurrent parse error', e); return null; }
}

export function clearStorage() {
  try { localStorage.removeItem('matchiq_users'); localStorage.removeItem('matchiq_current'); } catch (e) { console.error('clear storage', e); }
}
