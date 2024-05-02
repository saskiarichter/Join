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
function categoryRequired() {
    document.getElementById('addTask-category').classList.remove('empty');
}

/**
 * 
 * opens and closes dropdown field & rotates dropdown icon
 * 
 * @param {string} containerId - id of the dropdown container
 * @param {string} imgId - id of the image that rotates
 */
function openCloseDropdown(containerId, imgId) {
    let container = document.getElementById(`${containerId}`);
    let img = document.getElementById(`${imgId}`);
    if (container.classList.contains('d-none')) {
        container.classList.remove('d-none');
        img.classList.add('dropdown-img-rotated');
    } else {
        container.classList.add('d-none');
        img.classList.remove('dropdown-img-rotated');
    }
}

/**
 * 
 * adds and removes hover style when selecting contact
 */
function selectContact() {
    let container = document.getElementById('contact-container');
    if (container.classList.contains('contact-container-focus')) {
        container.classList.remove('contact-container-focus');
    } else {
        container.classList.add('contact-container-focus');
    }
}

/**
 * 
 * opens and closes categories & sets back placeholder 
 * 
 * @param {string} containerId  - id of the dropdown container
 * @param {string} imgId - id of the image that rotates
 */
function openCategorySelection(containerId, imgId) {
    categoryRequired();
    openCloseDropdown(containerId, imgId);
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
 * empties all inputfields 
 */
function emptyInput() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('addTask-description').value = '';
    document.getElementById('addTask-assigned').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('select-task-text').innerHTML = `Select task category`;
    document.getElementById('addTask-subtasks').value = '';
}