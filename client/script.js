const apiUrl = `http://localhost:5002/notes`;

async function loadNotes() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to be logged in to view notes.');
        window.location.href = 'index.html'; 
        return;
    }

    try {
        const response = await fetch(`${apiUrl}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes.');
        }

        let notes = [];
        try {
            notes = await response.json();  // Parse JSON only if response is valid
        } catch (err) {
            console.error('Error parsing JSON:', err);
            alert('Failed to load notes. Server returned invalid JSON.');
            return;
        }

        const notesList = document.getElementById('notesList');
        notesList.innerHTML = ''; // Clear current notes

        notes.forEach(note => {
            const li = document.createElement('li');
            li.dataset.id = note._id;
            li.innerHTML = `
                <div>
                    <strong>${note.title}</strong>
                    <p>${note.description}</p>
                </div>
                <div>
                    <button class="edit-btn" onclick="editNote('${note._id}')">Edit</button>
                    <button onclick="deleteNote('${note._id}')">Delete</button>
                </div>
            `;
            notesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading notes:', error);
        alert('Failed to load notes.');
    }
}



// Function to add a new note
async function addNote(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const token = localStorage.getItem('token');
    if(title.length < 5){
        alert('Title must be at least 5 characters long.');
        return;     
    }
    if(description.length < 5){
        alert('Description must be at least 5 characters long.');
        return;     
    }   

    if (!token) {
        alert('You need to be logged in to add notes.');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) {
            alert('Error adding note');
            return;
        }

        const newNote = await response.json();
        console.log('Note added:', newNote);

        const notesList = document.getElementById('notesList');
        const li = document.createElement('li');
        li.dataset.id = newNote._id;
        li.innerHTML = `
            <div>
                <strong>${newNote.title}</strong>
                <p>${newNote.description}</p>
            </div>
            <div>
                <button class="edit-btn" onclick="editNote('${newNote._id}')">Edit</button>
                <button onclick="deleteNote('${newNote._id}')">Delete</button>
            </div>
        `;
        notesList.appendChild(li);

        document.getElementById('title').value = '';
        document.getElementById('description').value = '';

        showPopupNotification('Note successfully added!', 'success');
    } catch (error) {
        console.error('Error adding note:', error);
        alert('An unexpected error occurred while adding the note.');
    }
}

// Function to delete a note
async function deleteNote(noteId) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to be logged in to delete notes.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            alert('Failed to delete note.');
            return;
        }

        const noteElement = document.querySelector(`li[data-id="${noteId}"]`);
        if (noteElement) {
            noteElement.remove();
        }

        showPopupNotification('Note successfully deleted!', 'error');
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete the note.');
    }
}

// Function to edit a note
async function editNote(noteId) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to be logged in to edit notes.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${noteId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        let note;
        try {
            note = await response.json();  // Try parsing JSON
        } catch (err) {
            console.error('Error parsing JSON for edit:', err);
            alert('Failed to load note details for editing.');
            return;
        }

        if (!response.ok) {
            alert('Failed to fetch note details for editing.');
            return;
        }

        document.getElementById('editTitle').value = note.title;
        document.getElementById('editDescription').value = note.description;
        document.getElementById('noteId').value = note._id;

        currentNote = note;

        document.querySelector('.editNoteModal').style.display = 'block';
        document.getElementById('editTitle').focus();
    } catch (error) {
        console.error('Error fetching note for edit:', error);
        alert('Failed to fetch note details.');
    }
}

const handleEditNote = async (e) => {
    e.preventDefault();
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editDescription').value;
    const noteId = document.getElementById('noteId').value;
    if(title.length < 5){
        alert('The field must be at least 5 characters.');
        return;     
    }
    if(content.length < 10){
        alert('The field must be at least 10 characters.');
        return;     
    }
    if(content.length > 1000){
        alert('The field must be less than 1000 characters.');
        return;     
    } 

    try {
        const response = await fetch(`${apiUrl}/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ title, content: content }),
        });

        if (!response.ok) {
            alert('Failed to update note.');
            return;
        }

        document.querySelector('.editNoteModal').style.display = 'none';
        loadNotes();
        showPopupNotification('Note successfully updated!', 'success');
    } catch (error) {
        console.error('Error updating note:', error);
        alert('Failed to update the note.');
    }
};

const closeEditModal = () => {
    document.querySelector('.editNoteModal').style.display = 'none';        
}
// Show notification after action (success or error)
function showPopupNotification(message, type) {
    alert(message);
    console.log(message);
}
