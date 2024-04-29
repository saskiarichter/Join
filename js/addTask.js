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
 * Removes red color from Title input 
 */
function titleRequired() {
    document.getElementById('addTask-title').classList.remove('empty');
    document.getElementById('required-title').classList.add('transparent');
}

/**
 * 
 * Removes red color from DueDate input
 */
function dueDateRequired() {
    document.getElementById('addTask-dueDate').classList.remove('empty');
    document.getElementById('required-date').classList.add('transparent');
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
 * checks if required inputs are filled out 
 */
function checkInput() {
    let ids = ['addTask-title', 'addTask-dueDate', 'addTask-category'];
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        let element = document.getElementById(`${id}`);
        if (element.value === '') {
            element.classList.add('empty');
            document.getElementById('required-title').classList.remove('transparent');
            document.getElementById('required-date').classList.remove('transparent');
        } else {
            createTask();
            emptyInput();
        }
    }
}

/**
 * 
 * empties all inputfields 
 */
function emptyInput() {
    document.getElementById('addTask-title').value = '';
    document.getElementById('addTask-description').value = '';
    document.getElementById('addTask-assigned').value = '';
    document.getElementById('addTask-dueDate').value = '';
    document.getElementById('addTask-category').value = '';
    document.getElementById('addTask-subtasks').value = '';
}

function createTask() {

}
