let subtasks = [];
let selectedContacts = [];

/**
 * 
 * loads navBar and header
 */
async function init() {
    await initInclude();
    addTaskBgMenu();
}

/**
 * 
 * Adds bgcolor on current Page in the NavBar 
 */
function addTaskBgMenu() {
    document.getElementById('addTaskMenu').classList.add('bgfocus');
}

/**
 * 
 * removes red border color & hides required text info
 * 
 * @param {string} borderId - id of the container that has a red border
 * @param {string} textId - id of the container with required text
 */
function hideRequiredInfo(borderId, textId) {
    let border = document.getElementById(`${borderId}`);
    let text = document.getElementById(`${textId}`);
    border.classList.remove('empty');
    text.classList.add('transparent');
}

/**
 * 
 * Removes red color from Category
 */
function hideRequiredCategory() {
    document.getElementById('addTask-category').classList.remove('empty');
}

/**
 * 
 * opens dropdown
 * 
 * @param {object} container - dropdown container
 * @param {object} img - rotating image
 */
function openDropdown(container, img) {
    container.classList.remove('d-none');
    img.classList.add('dropdown-img-rotated');
}

/**
 * 
 * closes dropdown
 * 
 * @param {object} container - dropdown container
 * @param {object} img - rotating image
 */
function closeDropdown(container, img) {
    container.classList.add('d-none');
    img.classList.remove('dropdown-img-rotated');
}

/**
 * 
 * opens/closes contacts & shows/hides selected contacts
 */
function openContacts() {
    let container = document.getElementById('input-section-element');
    let contacts = document.getElementById('addTask-contacts-container');
    let img = document.getElementById('dropdown-img-contacts');

    window.addEventListener('click', function (e) {
        if (container.contains(e.target)) {
            openDropdown(contacts, img);
            hideSelectedContacts();
        } else {
            closeDropdown(contacts, img);
            showSelectedContacts();
        }
    });
}

function openCloseContacts() {
    let container = document.getElementById('addTask-contacts-container');
    let img = document.getElementById('dropdown-img-contacts');
    if (container.contains('d-none')) {
        openDropdown(container, img);
        hideSelectedContacts();
    } else {
        closeDropdown(container, img);
        showSelectedContacts();
    }
};

/**
 * 
 * adds and removes hover style when selecting contact
 */
function selectContact() {
    let container = document.getElementById('contact-container');
    let name = document.getElementById('contactName').innerHTML;
    let initals = document.getElementById('contactInitals').innerHTML;

    if (container.classList.contains('contact-container-focus')) {
        container.classList.remove('contact-container-focus');
        selectedContacts.splice({ 'name': name, 'initals': initals });
    } else {
        container.classList.add('contact-container-focus');
        selectedContacts.push({ 'name': name, 'initals': initals });
    }
}

/**
 * 
 * renders selected Contacts
 */
function showSelectedContacts() {
    let container = document.getElementById('selectedContacts');
    container.classList.remove('d-none');
    container.innerHTML = '';
    for (let i = 0; i < selectedContacts.length; i++) {
        const contact = selectedContacts[i];
        container.innerHTML += `
        <span class="circleName">${contact['initals']}</span>
        `;
    }
}

/**
 * 
 * hides selected contacts
 */
function hideSelectedContacts() {
    let container = document.getElementById('selectedContacts');
    container.classList.add('d-none');
}

/**
 * 
 * opens and closes categories & sets back placeholder 
 * 
 * @param {string} containerId  - id of the dropdown container
 * @param {string} imgId - id of the image that rotates
 */
function openCategories() {
    hideRequiredCategory();
    let container = document.getElementById('addTask-category-container');
    let img = document.getElementById('dropdown-img-category');
    if (container.classList.contains('d-none')) {
        openDropdown(container, img);
    } else {
        closeDropdown(container, img);
    }
    let selectedCategory = document.getElementById('select-task-text');
    selectedCategory.innerHTML = `Select task category`;
}

/**
 * 
 * selects category and closes dropdown
 * 
 * @param {string} categoryId - id of the selected Category
 */
function selectCategory(categoryId) {
    let category = document.getElementById(`${categoryId}`).innerHTML;
    let selectedCategory = document.getElementById('select-task-text');
    selectedCategory.innerHTML = `${category}`;
    openCloseDropdown('addTask-category-container', 'dropdown-img-category');
}

/**
 * 
 * changes icons of subtasks field when click inside or outside of container
 */
function openIcons() {
    let container = document.getElementById('addTask-subtasks-container');
    let icons = document.getElementById('addTask-subtasks-icons');
    let plus = document.getElementById('dropdown-img-plus');
    window.addEventListener('click', function (e) {
        if (container.contains(e.target)) {
            icons.classList.remove('d-none');
            plus.classList.add('d-none');
        } else {
            icons.classList.add('d-none');
            plus.classList.remove('d-none');
        }
    });
}

/**
 * 
 * empties subtask input
 */
function emptySubtaskInput() {
    let container = document.getElementById('addTask-subtasks');
    container.value = '';
}

/**
 * 
 * adds subtask to list 
 */
function addSubtask() {
    let subtask = document.getElementById('addTask-subtasks').value;
    if (subtask.length > 1) {
        subtasks.push(subtask);
        generateSubtasksList();
        emptySubtaskInput();
    }
}

/**
 * 
 * generates list of subtasks
 */
function generateSubtasksList() {
    let container = document.getElementById('subtasks-list');
    container.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        container.innerHTML += templateSubtaskListElement(i, subtask);
    }
}

/**
 * 
 * generates HTML of list element
 * 
 * @param {number} i - position in subtasks array
 * @param {string} subtask - name of subtask
 * @returns 
 */
function templateSubtaskListElement(i, subtask) {
    return `
    <div id="subtasks-list-element${i}" class="subtasks-list-element">
        <li ondblclick="editSubtask(${i})">${subtask}</li>
        <div class="subtasks-icon hidden">
            <img onclick="editSubtask(${i})" src="../img/edit.svg" alt="Bearbeiten">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="deleteSubtask(${i})" src="../img/delete.svg" alt="Bestätigen">
        </div>
    </div>
`;
}

/**
 * 
 * deletes one list element 
 * 
 * @param {number} i - position in subtasks array
 */
function deleteSubtask(i) {
    subtasks.splice(i, 1);
    generateSubtasksList();
}

/**
 * 
 * opens field to edit subtask
 * 
 * @param {number} i - position in subtasks array
 */
function editSubtask(i) {
    let container = document.getElementById(`subtasks-list-element${i}`);
    container.classList.add('subtask-edit-container');
    container.innerHTML = templateEditSubtask(i);
}

/**
 * 
 * generates HTML of field to edit subtask
 * 
 * @param {number} i - position in subtasks array
 * @returns 
 */
function templateEditSubtask(i) {
    return `
    <input id="newSubtask" value="${subtasks[i]}" class="inputfield subtask-edit-input" type="text">
    <div id="addTask-subtasks-icons" class="subtasks-icon">
        <img onclick="deleteSubtask(${i})" src="../img/delete.svg" alt="Löschen">
        <div class="parting-line subtasks-icon-line"></div>
        <img onclick="keepSubtask(${i})" src="../img/done.svg" alt="Bestätigen">
    </div>
    `;
}

/**
 * 
 * generates list with new Subtask & closes edit field
 * 
 * @param {number} i - position in subtasks array
 */
function keepSubtask(i) {
    let newSubtask = document.getElementById('newSubtask').value;
    if (newSubtask.length > 1) {
        subtasks.splice(i, 1, newSubtask);
        generateSubtasksList();
    }
}

/**
 * 
 * checks if required inputs are filled out 
 */
function checkInput() {
    let title = document.getElementById('taskTitle').value;
    let date = document.getElementById('taskDate').value;
    let category = document.getElementById('select-task-text').innerHTML;
    if (title !== '' && date !== '' && category !== `Select task category`) {
        emptyInput();
    } else {
        checkTitle(title);
        checkDate(date);
        checkCategory(category);
    }
}

/**
 * 
 * adds red color if title input is not filled out
 * 
 * @param {string} title - value of title input
 */
function checkTitle(title) {
    if (title === '') {
        document.getElementById('addTask-title').classList.add('empty');
        document.getElementById('required-title').classList.remove('transparent');
    }
}

/**
 * 
 * adds red color if date input is not filled out
 * 
 * @param {string} date - value of date input
 */
function checkDate(date) {
    if (date === '') {
        document.getElementById('addTask-dueDate').classList.add('empty');
        document.getElementById('required-date').classList.remove('transparent');
    }
}

/**
 * 
 * adds red color if no category is selected
 * 
 * @param {string} category - innerHTML of category field
 */
function checkCategory(category) {
    if (category === `Select task category`) {
        document.getElementById('addTask-category').classList.add('empty');
    }
}


/**
 * 
 * resets whole AddTask page
 */
function clearAddTask() {
    hideRequiredInfo('addTask-title', 'required-title');
    hideRequiredInfo('addTask-dueDate', 'required-date');
    hideRequiredCategory();
    emptyInput();
    subtasks = [];
}

/**
 * 
 * empties all inputfields 
 */
function emptyInput() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('addTask-description').value = '';
    document.getElementById('addTask-assigned').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('select-task-text').innerHTML = `Select task category`;
    document.getElementById('addTask-subtasks').value = '';
    document.getElementById('subtasks-list').innerHTML = '';
}