let subtask = [];
let user = [];
tasks = [];
prioBtn = "";
let prioIcon ="";
let prioText = "";


/**
 * loads navBar, header, arrays from firebase & renders contacts
 */
async function initBoard() {
  await initInclude();
  displayUserInitials();
  loadTasksBoard();
  updateHTML();
  renderEditContacts('addTask-contacts-container-edit');
  renderContacts('addTask-contacts-container');
  BoardBg();
  chooseMedium();
}


/**
 * loads Contacts
 */
function renderEditContacts(contactContainer) {
  let container = document.getElementById(`${contactContainer}`);
  container.innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
      let name = contacts[i]['name'];
      let initials = getInitials(name); // from contacts.js
      let color = contacts[i]['color'];
      container.innerHTML += templateEditContact(i, name, initials, color);
      if (contacts[i]['selected'] === true) {
          document.getElementById(`contact-edit-container${i}`).classList.add('contact-container-edit-focus');
      } else {
          document.getElementById(`contact-edit-container${i}`).classList.remove('contact-container-edit-focus');
      }
  }
}


/**
 * returns HTML of single contact
 * 
 * @param {number} i - position in contacts json
 * @param {string} name - name of contact
 * @param {string} initials - initials of contact
 * @param {string} color - color of contact
 * @returns 
 */
function templateEditContact(i, name, initials, color) {
  return `
  <div id="contact-edit-container${i}" onclick="selectEditContact(${i})" class="contact-container" tabindex="1">
      <div class="contact-container-name">
          <span style="background-color: ${color}" id="contactEditInitals${i}" class="circleName">${initials}</span>
          <span id="contactName${i}">${name}</span>
      </div>
      <div class="contact-container-check"></div>
  </div> 
`;
}


/**
 *  To open the AddTask with addTask Button 
*/
function openAddTask() {
  let content = document.getElementById("addTask");
  content.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  let dialog = document.querySelector('.addTaskBoard');
  dialog.classList.remove('slide-in'); 
  setTimeout(() => {
      dialog.classList.add('slide-in');
  }, 50);
}


/**
 *  to close the Task or the addTask section
*/
function closeMe() {
  let content = document.getElementById("addTask");
  let showContent = document.getElementById("showTask");
  let editContent = document.getElementById("addTask-edit");
  showContent.classList.add("hidden");
  content.classList.add("hidden");
  editContent.classList.add("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.add("hidden");
  updateHTML();
  contacts = [];
  selectedEditContacts = [];
  loadData();
}


/** 
 * to change the color of the Category tilte after add 
*/
function changeColorOfCategoryTitle() {
  for (let i = 0; i < tasks.length; i++) {
    let content = document.getElementById(`cardCategoryTitle${i}`);
    let category = tasks[i]["category"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")) {
      content.classList.add("green");
    }
  }
}


/**
 * Deletes the Task at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited.
 */
function deleteTask(taskIndex) {
  tasks.splice(taskIndex,1);
  for (let j = 0; j < tasks.length; j++){
    tasks[j].ID = j;
  }
  putData("/tasks", tasks);
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  closeMe();
}


/** 
 * to search the Task 
*/
function searchTask() {
  let search = document.getElementById("search-input").value.toLowerCase();
  for (let i = 0; i < tasks.length; i++) {
    let TaskCard = document.getElementById(`cardId${i}`);
    const title = tasks[i]["title"].toLowerCase();
    const description = tasks[i]["description"].toLowerCase();
    if (TaskCard) {
      if (title.includes(search) || description.includes(search)) {
        TaskCard.style.display = "block";
      } else {
        TaskCard.style.display = "none";
      }
    } else {
      console.log("Task Card not Found");
    }
  }
}


/**
 * Converts a date object or date string to a desired format.
 * @param {Date|string} date - The date to be converted, either as a Date object or a date string.
 * @returns {string} The converted date as a string.
*/
function convertDate(date) {
  let datePart = date.split("-");
  let newDate = datePart[2] + "/" + datePart[1] + "/" + datePart[0];
  return newDate;
}


let currentDraggedElement;

/**
 *  to generate the Task in right position toDo - inProgress - await - done
*/
 function updateHTML() {
  let toDo = tasks.filter((t) => t["phases"] == "To Do");
  let toDoConetnt = document.getElementById("newTask-toDo");
  toDoConetnt.innerHTML = "";

    for (let index = 0; index < toDo.length; index++) {
      const element = toDo[index];
      document.getElementById("newTask-toDo").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskToDo();
    }

    let inProgress = tasks.filter((t) => t["phases"] == "In progress");
    let inProgressContent = document.getElementById("newTask-inProgress");
    inProgressContent.innerHTML = "";

    for (let index = 0; index < inProgress.length; index++) {
      const element = inProgress[index];
      document.getElementById("newTask-inProgress").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskInProgress();
    }

    let await = tasks.filter((t) => t["phases"] == "Await feedback");
    document.getElementById("newTask-await").innerHTML = "";
    for (let index = 0; index < await.length; index++) {
      const element = await[index];
      document.getElementById("newTask-await").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskAwaitFeedback(); 
    }
    let done = tasks.filter((t) => t["phases"] == "Done");
    document.getElementById("newTask-done").innerHTML = "";
    for (let index = 0; index < done.length; index++) {
      const element = done[index];
      document.getElementById("newTask-done").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskDone(); 
    }
    changeColorOfCategoryTitle();
    contactsRender();
}


/**
 * 
 * @param {string} id - id of Taskcard
*/
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * change the value of the progress at the specified index in the task list.
 * @param {number} taskIndex - position of the Task accroding to Subtasks
 * @returns 
*/
function valueOfProgressBar(taskIndex){
  let value;
    if(tasks[taskIndex]["subtasks"].length === 0){
      value = 0;
    }else if(tasks[taskIndex]["subtasks"].length === 1){
      value = 50;
    }else{
      value = 100;
    }
    return value;
}


/**
 * to render the Contacts 
*/
function contactsRender(){
  for(let i = 0; i < tasks.length; i++){
    let maxConatcts = 3;
    let content = document.getElementById(`newDiv${i}`);
    for(let j = 0; j < Math.min(tasks[i]['contacts'].length, maxConatcts); j++){
      let letter = tasks[i]['contacts'][j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0).toUpperCase();
      }
      content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[i]['contacts'][j]['color']};">${result}</div>`;
    }
    if(tasks[i]["contacts"].length > maxConatcts){
      let additionalContacts = tasks[i]["contacts"].length - maxConatcts;
      let numberOfContacts = document.getElementById(`plus-number-contacts${i}`);
      numberOfContacts.innerHTML ="";
      numberOfContacts.innerHTML =`+${additionalContacts}`;
    }
  }
}


/**
 * to load the Tasks
 * @param {*} element 
 * @returns 
*/
 function genereteAllTasksHTML(element) {
  return ` <div id ="cardId${element["ID"]}" draggable="true" ondragstart="startDragging(${element["ID"]})"  onclick="showTask(${element["ID"]})">
  <div class="card">
   <div id="cardCategoryTitle${element["ID"]}" class="card-category-title">${element["category"]}</div>
   <div class="title-description-content">
     <h2 class="card-title">${element["title"]}</h2>
     <p class="card-description">${element["description"]}</p>
   </div>
   <div class="progress-bar-content">
     <progress value="${valueOfProgressBar(element["ID"])}" max="100" id="progressBar${element["ID"]}"></progress>
     <p class="card-subtasks-text"><span id="numberOfSubtask${element["ID"]}" class="numberOfSubtask">${element["subtasks"].length}/2</span> Subtasks</p>
    </div>
    <div class="card-user-content">
      <div class="user-container-board">
        <div class="user-inner-container" id="newDiv${element['ID']}"></div>
        <div class="number-of-contacts" id = "plus-number-contacts${element['ID']}"></div>
      </div>
      <img src="${element["prioIcon"]}" alt="">
    </div>
  </div>
  </div>`;
}


/**
 * Erlaubt das Ablegen eines Elements durch Verhindern des Standardverhaltens beim Drag-and-Drop.
 * @param {Event} ev - Das dragover-Ereignisobjekt.
*/
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Moves the Task to the specified phase.
 * @param {string} phase - The target phase of the Task.
*/
function moveTo(phase) {
  tasks[currentDraggedElement]["phases"] = phase;
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  styleOfNoTaskDone(); 
  putData("/tasks", tasks);
}


/**
 * to change the style of no Task to do in toDo-section if there no Tasks more
*/
function styleOfNoTaskToDo() {
  let toDoConetnt = document.getElementById("newTask-toDo");
  if(toDoConetnt.childElementCount > 0){
    document.getElementById('noTask-toDo').classList.add('hidden');
  }else{
    document.getElementById('noTask-toDo').classList.remove('hidden');
  }
}


/**
 * to change the style of no Task to do in Progress-section if there no Tasks more
*/
function styleOfNoTaskInProgress(){
  let inProgressContent = document.getElementById("newTask-inProgress");
  if(inProgressContent.childElementCount > 0){
    document.getElementById('noTask-inProgress').classList.add('hidden');
  }else{
    document.getElementById('noTask-inProgress').classList.remove('hidden');
  }
}


/**
 * to change the style of no Task to do in await-section if there no Tasks more
*/
function styleOfNoTaskAwaitFeedback(){
  let inProgressContent = document.getElementById("newTask-await");
  if(inProgressContent.childElementCount > 0){
    document.getElementById('noTask-await').classList.add('hidden');
  }else{
    document.getElementById('noTask-await').classList.remove('hidden');
  }
}


/**
 * to change the style of no Task to do in done-section if there no Tasks more
*/
function styleOfNoTaskDone(){
  let inProgressContent = document.getElementById("newTask-done");
  if(inProgressContent.childElementCount > 0){
    document.getElementById('noTask-done').classList.add('hidden');
  }else{
    document.getElementById('noTask-done').classList.remove('hidden');
  }
}


/**
 * Checks the screen width and navigates to addTask.html if the width is 1075 pixels.
*/
function checkwidthForAddTask(){
    window.location.href = '../html/addTask.html';
}

/**
 * Checks the screen width and navigates to addTask.html if the width is 1075 pixels.
*/
function updateButtonOnClick(){
  let plusbutton = document.getElementsByClassName('plus-btn');
  if(plusbutton.length > 0){
    if(window.innerWidth <= 1075){
      for(let i = 0; i < plusbutton.length; i++){
        plusbutton[i].setAttribute('onclick', "window.location.href = './addTask.html'");
      }
    }else{
      for(let i = 0; i < plusbutton.length; i++){
      plusbutton[i].setAttribute('onclick', 'openAddTask()');
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () =>{
  updateButtonOnClick();
  window.addEventListener('resize', updateButtonOnClick)
});


/**
 * Adds bgcolor on current Page in the NavBar 
*/
function BoardBg() {
  document.getElementById('board').classList.add("bgfocus");
}