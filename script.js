const addBtn = document.getElementById('add');
const notesContainer = document.getElementById('notes');
const searchInput = document.getElementById('search');

// Load existing notes from local storage
document.addEventListener('DOMContentLoaded', loadNotes);

addBtn.addEventListener('click', () => addNewNote());

// Search functionality
searchInput.addEventListener('input', searchNotes);

function addNewNote() {
    const note = document.createElement('div');
    note.classList.add('note');
    note.innerHTML = `
        <div class="tools">
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="download"><i class="fas fa-download"></i></button>
            <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
        <input type="text" placeholder="Note Title" class="note-title" />
        <input type="file" class="note-image" accept="image/*" />
        <img class="note-img hidden" />
        <div class="main hidden"></div>
        <textarea class="hidden"></textarea>
    `;

    const editBtn = note.querySelector('.edit');
    const downloadBtn = note.querySelector('.download');
    const deleteBtn = note.querySelector('.delete');
    const titleInput = note.querySelector('.note-title');
    const imageInput = note.querySelector('.note-image');
    const imgElement = note.querySelector('.note-img');
    const main = note.querySelector('.main');
    const textArea = note.querySelector('textarea');

    deleteBtn.addEventListener('click', () => {
        note.remove();
        updateLS();
    });

    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
        textArea.focus();
    });

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);
        updateLS();
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imgElement.src = event.target.result;
                imgElement.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    downloadBtn.addEventListener('click', () => {
        const noteContent = {
            title: titleInput.value,
            content: textArea.value,
        };
        const blob = new Blob([JSON.stringify(noteContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titleInput.value || 'note'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    notesContainer.appendChild(note);
    updateLS();
}

function searchNotes() {
    const searchText = searchInput.value.toLowerCase();
    const notes = document.querySelectorAll('.note');

    notes.forEach(note => {
        const title = note.querySelector('.note-title').value.toLowerCase();
        const mainContent = note.querySelector('.main').innerText.toLowerCase();
        note.style.display = title.includes(searchText) || mainContent.includes(searchText) ? 'block' : 'none';
    });
}

function updateLS() {
    const notesArray = [];
    const notes = document.querySelectorAll('.note');
    
    notes.forEach(note => {
        const title = note.querySelector('.note-title').value;
        const content = note.querySelector('textarea').value;
        notesArray.push({ title, content });
    });

    localStorage.setItem('notes', JSON.stringify(notesArray));
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes'));
    if (notes) {
        notes.forEach(note => {
            addNewNoteWithData(note.title, note.content);
        });
    }
}

function addNewNoteWithData(title, content) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.innerHTML = `
        <div class="tools">
            <button class="edit"><i class="fas fa-edit"></i></button>
            <button class="download"><i class="fas fa-download"></i></button>
            <button class="delete"><i class="fas fa-trash-alt"></i></button>
        </div>
        <input type="text" value="${title}" class="note-title" />
        <input type="file" class="note-image" accept="image/*" />
        <img class="note-img hidden" />
        <div class="main"></div>
        <textarea class="hidden">${content}</textarea>
    `;

    const editBtn = note.querySelector('.edit');
    const downloadBtn = note.querySelector('.download');
    const deleteBtn = note.querySelector('.delete');
    const titleInput = note.querySelector('.note-title');
    const imageInput = note.querySelector('.note-image');
    const imgElement = note.querySelector('.note-img');
    const main = note.querySelector('.main');
    const textArea = note.querySelector('textarea');

    // Load content into main
    main.innerHTML = marked(content);

    deleteBtn.addEventListener('click', () => {
        note.remove();
        updateLS();
    });

    editBtn.addEventListener('click', () => {
        main.classList.toggle('hidden');
        textArea.classList.toggle('hidden');
        textArea.focus();
    });

    textArea.addEventListener('input', (e) => {
        const { value } = e.target;
        main.innerHTML = marked(value);
        updateLS();
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imgElement.src = event.target.result;
                imgElement.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    downloadBtn.addEventListener('click', () => {
        const noteContent = {
            title: titleInput.value,
            content: textArea.value,
        };
        const blob = new Blob([JSON.stringify(noteContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${titleInput.value || 'note'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    notesContainer.appendChild(note);
}
