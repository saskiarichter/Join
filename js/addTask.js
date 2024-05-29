let prioBtn = "";


/**
 * loads navBar, header, arrays from firebase & renders contacts
 */
async function init() {
    await initInclude(); // from include.js
    addTaskBgMenu();
    displayUserInitials(); // from summary.js
    loadTasks(); // from storage.js
    renderContacts('addTask-contacts-container');
    chooseMedium();
}


/**
 * selects Medium Prio 
 */
function chooseMedium(){
    let button = document.getElementById('mediumButton')
    button.classList.add('mediumButton-focus');
}


/**
 * Adds bgcolor on current Page in the NavBar 
 */
function addTaskBgMenu() {
    document.getElementById('addTaskMenu').classList.add('bgfocus');
}


/**
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
 * Removes red color from Category
 */
function hideRequiredCategory() {
    document.getElementById('addTask-category').classList.remove('empty');
}


/**
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
 * changes backgroundcolor if urgent-button is selected
 */
function selectUrgent() {
    let button = document.getElementById('urgentButton');

    if (button.classList.contains('urgentButton-focus')) {
        button.classList.remove('urgentButton-focus');
    } else {
        button.classList.add('urgentButton-focus');
        document.getElementById('mediumButton').classList.remove('mediumButton-focus');
        document.getElementById('lowButton').classList.remove('lowButton-focus');
    }
}


/**
 * changes backgroundcolor if medium-button is selected
 */
function selectMedium() {
    let button = document.getElementById('mediumButton');

    if (button.classList.contains('mediumButton-focus')) {
        button.classList.remove('mediumButton-focus');
    } else {
        button.classList.add('mediumButton-focus');
        document.getElementById('urgentButton').classList.remove('urgentButton-focus');
        document.getElementById('lowButton').classList.remove('lowButton-focus');
    }
}


/**
 * changes backgroundcolor if low-button is selected
 */
function selectLow() {
    let button = document.getElementById('lowButton');

    if (button.classList.contains('lowButton-focus')) {
        button.classList.remove('lowButton-focus');
    } else {
        button.classList.add('lowButton-focus');
        document.getElementById('urgentButton').classList.remove('urgentButton-focus');
        document.getElementById('mediumButton').classList.remove('mediumButton-focus');
    }
}


/** 
 * opens and closes categories --> with click on icon & sets back placeholder 
 */
function openCategories(event) {
    event.stopPropagation();
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
 * opens/closes categories --> with click within or outside of container
 */
function openCategoriesWindow() {
    let container = document.getElementById('addTask-category');
    let categories = document.getElementById('addTask-category-container');
    let img = document.getElementById('dropdown-img-category');

    window.addEventListener('click', function (e) {
        if (container.contains(e.target)) {
            openDropdown(categories, img);
        } else {
            closeDropdown(categories, img);
        }
    });
}


/**
 * selects category and closes dropdown
 * 
 * @param {string} categoryId - id of the selected Category
 */
function selectCategory(categoryId) {
    let container = document.getElementById('addTask-category-container');
    let img = document.getElementById('dropdown-img-category');
    let category = document.getElementById(`${categoryId}`).innerHTML;
    let selectedCategory = document.getElementById('select-task-text');
    selectedCategory.innerHTML = `${category}`;
    closeDropdown(container, img);
}


/**
 * checks if required inputs are filled out 
 * creates new task & opens board page
 */
async function createTask() {
    let title = document.getElementById('taskTitle').value;
    let date = document.getElementById('taskDate').value;
    let category = document.getElementById('select-task-text').innerHTML;
    if (title !== '' && date !== '' && category !== `Select task category`) {
        document.getElementById('createTaskButton').disabled = true;
        getValues();
        await safeTask();
        showTaskAdded();
        setTimeout(redirectToBoard(), 2000); // from include.js
        clearAddTask();
    } else {
        checkInput(title, date, category)
    }
}

/**
 * gets values of inputfields
 */
function getValues() {
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('addTask-description').value;
    if (description === '') { description = '' };
    let date = document.getElementById('taskDate').value;
    let prio = getPrio();
    let category = document.getElementById('select-task-text').innerHTML;
    pushTaskElements(title, description, date, prio, category, prioBtn);
}


/**
 * checks which prio button is selected
 * 
 * @returns string - selected prio
 */
function getPrio() {
    if (document.getElementById('urgentButton').classList.contains('urgentButton-focus')) {
        prio = 'Urgent'
        prioBtn = './img/PrioAltaRed.svg'
    } else if (document.getElementById('mediumButton').classList.contains('mediumButton-focus')) {
        prio = 'Medium'
        prioBtn= './img/PrioMediaOrange.svg'
    } else if (document.getElementById('lowButton').classList.contains('lowButton-focus')) {
        prio = 'Low'
        prioBtn = './img/PrioBajaGreen.svg'
    } else {
        prio = ''
    }
    return prio
}


/**
 * pushing information to tasks array
 * 
 * @param {string} title - text of title input
 * @param {string} description - text of description input
 * @param {string} date - date of date input
 * @param {string} prio - selected urgent, medium or low button
 * @param {string} category - chosen category
 */
function pushTaskElements(title, description, date, prio, category, prioBtn) {
    if (selectedContacts.length < 1) { selectedContacts = '' };
    if (subtasks.length < 1) { subtasks = '' };
    let currentId = tasks.length;
    tasks.push({
        'title': title,
        'description': description,
        'contacts': selectedContacts,
        'date': date,
        'prio': prio,
        'category': category,
        'subtasks': subtasks,
        'phases': 'To Do',
        'ID': currentId++,
        'prioIcon': prioBtn
    })
}


/**
 * creates or updates tasks array on firebase
 */
async function safeTask() {
    if (tasks === '') {
        tasks.push({
            'ID': 0,
        })
        await postData("/tasks", tasks) // from storage.js
    } else {
        await putData("/tasks", tasks) // from storage.js
    }
}


/**
 * shows field that task is added
 */
function showTaskAdded(){
    document.getElementById('added-container').classList.remove('d-none');
}


/**
 * 
 * @param {string} title - value of title input
 * @param {string} date - value of date input
 * @param {string} category - innerHTML of category field
 */
function checkInput(title, date, category){
    checkTitle(title);
    checkDate(date);
    checkCategory(category);
}


/**
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
 * resets whole AddTask page
 */
async function clearAddTask() {
    hideRequiredInfo('addTask-title', 'required-title');
    hideRequiredInfo('addTask-dueDate', 'required-date');
    hideRequiredCategory();
    deletePrio();
    emptyInput();
    selectedContacts = [];
    subtasks = [];
    contacts = [];
    await loadData();
    renderContacts('addTask-contacts-container');
}


/**
 * resets Prio buttons
 */
function deletePrio() {
    document.getElementById('urgentButton').classList.remove('urgentButton-focus');
    document.getElementById('mediumButton').classList.remove('mediumButton-focus');
    document.getElementById('lowButton').classList.remove('lowButton-focus');
}


/**
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