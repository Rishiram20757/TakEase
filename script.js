// script.js
document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todoList');
    // Repeat for notesList and eventsList

    makeListSortable(todoList);
    // Repeat for notesList and eventsList

    // Load tasks from local storage
    loadTasks('todo');
    // Repeat for notes and events
});

function makeListSortable(list) {
    new Sortable(list, {
        animation: 150,
        ghostClass: 'ghost',
        onEnd: function(evt) {
            updateLocalStorage();
        }
    });
}

function addTask(section) {
    const inputElement = document.getElementById(`${section}Input`);
    const inputValue = inputElement.value.trim();
    if (inputValue === '') {
        alert('Please enter a task!');
        return;
    }
    const dueDate = document.getElementById(`${section}DueDateInput`).value;
    const priorityLevel = document.getElementById(`${section}PriorityLevelInput`).value;
    const labels = document.getElementById(`${section}LabelInput`).value.split(',').map(label => label.trim());
    
    const listElement = document.getElementById(`${section}List`);
    const listItem = document.createElement('li');
    listItem.textContent = inputValue;
    listItem.dataset.dueDate = dueDate;
    listItem.dataset.priorityLevel = priorityLevel;
    listItem.dataset.labels = labels.join(',');
    listItem.addEventListener('click', function() {
        toggleTaskCompletion(section, Array.from(listElement.children).indexOf(this));
    });
    listItem.addEventListener('dblclick', function() {
        removeTask(section, Array.from(listElement.children).indexOf(this));
    });
    listElement.appendChild(listItem);
    inputElement.value = '';
    updateLocalStorage();
}

function loadTasks(section) {
    const savedTasks = JSON.parse(localStorage.getItem(`${section}Tasks`)) || [];
    const listElement = document.getElementById(`${section}List`);
    savedTasks.forEach(task => {
        const [taskText, dueDate, priorityLevel, labelsStr] = task.split('|');
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        listItem.dataset.dueDate = dueDate;
        listItem.dataset.priorityLevel = priorityLevel;
        listItem.dataset.labels = labelsStr;
        listItem.addEventListener('click', function() {
            toggleTaskCompletion(section, Array.from(listElement.children).indexOf(this));
        });
        listItem.addEventListener('dblclick', function() {
            removeTask(section, Array.from(listElement.children).indexOf(this));
        });
        listElement.appendChild(listItem);
    });
}

function updateLocalStorage() {
    const todoTasks = Array.from(document.querySelectorAll('#todoList li')).map(li => {
        return `${li.textContent}|${li.dataset.dueDate}|${li.dataset.priorityLevel}|${li.dataset.labels}`;
    });
    localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
    // Repeat for notes and events
}

function toggleTaskCompletion(section, index) {
    const listElement = document.getElementById(`${section}List`);
    const taskItem = listElement.children[index];
    taskItem.classList.toggle('completed');
    updateLocalStorage();
}

function removeTask(section, index) {
    const listElement = document.getElementById(`${section}List`);
    listElement.children[index].remove();
    updateLocalStorage();
}

// Undo functionality
let deletedTasks = [];
function undoDeletion() {
    if (deletedTasks.length > 0) {
        const { section, task } = deletedTasks.pop();
        const listElement = document.getElementById(`${section}List`);
        const listItem = document.createElement('li');
        listItem.textContent = task;
        listItem.addEventListener('click', function() {
            toggleTaskCompletion(section, Array.from(listElement.children).indexOf(this));
        });
        listItem.addEventListener('dblclick', function() {
            removeTask(section, Array.from(listElement.children).indexOf(this));
        });
        listElement.appendChild(listItem);
        updateLocalStorage();
    }
}
