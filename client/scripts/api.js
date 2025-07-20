// all HTTP calls to your Express /notes API
const API_URL = 'http://localhost:5002/notes';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export async function fetchNotes() {
  const res = await fetch(API_URL, { headers: getAuthHeader() });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error('Failed to fetch notes');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createNote({ title, content }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error('Failed to add note');
  return res.json();
}

export async function deleteNoteAPI(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error('Failed to delete note');
}

export async function fetchNoteById(id) {
  const res = await fetch(`${API_URL}/${id}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch note');
  return res.json();
}

export async function updateNoteAPI(id, { title, content }) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error('Failed to update note');
}
