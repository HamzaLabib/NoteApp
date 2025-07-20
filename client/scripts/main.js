import {
  fetchNotes,
  createNote,
  deleteNoteAPI,
  fetchNoteById,
  updateNoteAPI
} from './api.js';

import {
  renderNotes,
  openEditModal,
  closeEditModal,
  validateLength,
  showNotification
} from './ui.js';

console.log('📦 main.js loaded');

// 1) FETCH & DISPLAY NOTES
async function loadNotes() {
  console.log('🔄 loadNotes() called');
  const listEl = document.getElementById('notesList');

  try {
    const notes = await fetchNotes();
    console.log('✅ fetchNotes returned', notes);

    if (notes.length === 0) {
      listEl.innerHTML = '<li>No notes yet.</li>';
    } else {
      renderNotes(notes, { onEdit: editNote, onDelete: deleteNote });
    }
  } catch (e) {
    console.error('❌ Error in loadNotes:', e);
    listEl.innerHTML = `<li style="color:red">Error loading notes: ${e.message}</li>`;
  }
}

// 2) ADD NOTE
async function addNoteHandler(e) {
  e.preventDefault();
  const titleEl   = document.getElementById('title');
  const contentEl = document.getElementById('description');

  try {
    validateLength(titleEl, 5);
    validateLength(contentEl, 5);

    console.log('✏️  Creating note:', titleEl.value, contentEl.value);
    await createNote({ title: titleEl.value, content: contentEl.value });

    showNotification('Note added!');
    titleEl.value   = '';
    contentEl.value = '';
    loadNotes();
  } catch (err) {
    console.error('❌ Error in addNoteHandler:', err);
    alert(err.message);
  }
}

// 3) DELETE NOTE
async function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  try {
    console.log('🗑️  Deleting note:', id);
    await deleteNoteAPI(id);
    showNotification('Note deleted!');
    loadNotes();
  } catch (err) {
    console.error('❌ Error in deleteNote:', err);
    alert(err.message);
  }
}

// 4) EDIT FLOW (open modal)
async function editNote(id) {
  try {
    console.log('✏️  Fetching note for edit:', id);
    const note = await fetchNoteById(id);
    openEditModal(note);
  } catch (err) {
    console.error('❌ Error in editNote:', err);
    alert(err.message);
  }
}

// 5) SAVE EDIT
async function handleEditSubmit(e) {
  e.preventDefault();
  const titleEl   = document.getElementById('editTitle');
  const contentEl = document.getElementById('editDescription');
  const id        = document.getElementById('noteId').value;

  try {
    validateLength(titleEl, 5);
    validateLength(contentEl, 10, 1000);

    console.log('💾 Updating note:', id, titleEl.value, contentEl.value);
    await updateNoteAPI(id, {
      title:   titleEl.value,
      content: contentEl.value
    });

    showNotification('Note updated!');
    closeEditModal();
    loadNotes();
  } catch (err) {
    console.error('❌ Error in handleEditSubmit:', err);
    alert(err.message);
  }
}

// 6) EXPOSURE FOR authScript.js
window.loadNotes = loadNotes;

// 7) WIRE UP UI EVENTS
document
  .getElementById('addNoteForm')
  .addEventListener('submit', addNoteHandler);

document
  .getElementById('editNoteForm')
  .addEventListener('submit', handleEditSubmit);

document
  .getElementById('cancelEditButton')
  .addEventListener('click', closeEditModal);

// 8) INITIAL LOAD
loadNotes();
