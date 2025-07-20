// DOM‑rendering and simple UI helpers

export function renderNotes(notes, { onEdit, onDelete }) {
  const list = document.getElementById('notesList');
  list.innerHTML = '';
  notes.forEach(n => {
    const li = document.createElement('li');
    li.dataset.id = n._id;
    li.innerHTML = `
      <div>
        <strong>${n.title}</strong>
        <p>${n.content}</p>
      </div>
      <div>
        <button class="edit-btn">Edit</button>
        <button class="del-btn">Delete</button>
      </div>
    `;
    li.querySelector('.edit-btn').onclick = () => onEdit(n._id);
    li.querySelector('.del-btn').onclick = () => onDelete(n._id);
    list.appendChild(li);
  });
}

export function openEditModal(note) {
  document.getElementById('editTitle').value       = note.title;
  document.getElementById('editDescription').value = note.content;
  document.getElementById('noteId').value          = note._id;
  document.querySelector('.editNoteModal').style.display = 'block';
}

export function closeEditModal() {
  document.querySelector('.editNoteModal').style.display = 'none';
}

export function validateLength(el, min, max) {
  const len = el.value.trim().length;
  if (len < min || (max != null && len > max)) {
    throw new Error(
      `Field must be at least ${min} characters` +
      (max ? ` and at most ${max}` : '')
    );
  }
}

export function showNotification(msg) {
  alert(msg);
}
