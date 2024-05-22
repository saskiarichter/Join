let subtask = [];
let user = [];
tasks = [];
prioBtn = "";
let prioText = "";

async function initBoard() {
  await initInclude();
  load();
  loadTasks();
  loadDataBoard("/tasks");
  updateHTML();
}
/** To open the AddTask with addTask Button */

function openAddTask() {
  let content = document.getElementById("addTask");
  content.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  renderContacts();
}

/** to close the Task or the addTask section*/

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
}


/** active Edit Button for Task */

function activeEditButton() {
  let urgentEditbutton =
    document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton =
    document.getElementsByClassName("medium-edit-button")[0];
  let lowEditbutton = document.getElementsByClassName("low-edit-button")[0];
  let lastClick = null;

  urgentEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.add("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.remove("active");
    lastClick = urgentEditbutton;
    prioText ='Urgent'
    prioBtn ='./img/PrioAltaRed.svg';
  });

  mediumEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.add("active");
    lowEditbutton.classList.remove("active");
    lastClick = mediumEditbutton;
    prioText = 'Medium'
    prioBtn= './img/PrioMediaOrange.svg'
  });

  lowEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.add("active");
    lastClick = lowEditbutton;
    prioText = 'Low'
    prioBtn = './img/PrioBajaGreen.svg'
  });
}

/** to add the Task  */

function removeHidden(){
    document.getElementById("required-title").classList.remove("hidden");
    document.getElementById("required-date").classList.remove("hidden");
    document.getElementsByClassName("required-text")[1].classList.remove("hidden");
    document.getElementById("required-phase").classList.remove("hidden");
}

/** to change the color of the Category tilte after add */

function changeColorOfCategoryTitle() {
  for (let i = 0; i < tasks.length; i++) {
    let content = document.getElementsByClassName("card-category-title")[i];
    let category = tasks[i]["category"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")) {
      content.classList.add("green");
    }
  }
}

function changeColorOfCategoryTitleShow(i){
    let content = document.getElementById(`card-category-title-show${i}`);
    let category = tasks[i]["category"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")){
      content.classList.add("green");
    }
}

async function save() {
  await setItem("tasks", JSON.stringify(tasks));
  await setItem("user", JSON.stringify(user));
  await setItem("subtask", JSON.stringify(subtask));
}

async function load() {
  try {
    allTasks = JSON.parse(await getItem("tasks"));
    user = JSON.parse(await getItem("user"));
    subtask = JSON.parse(await getItem("subtask"));
    updateHTML();
  } catch (e) {
    console.error("Loading error:", e);
  }
}

function noTaskTransparent() {
  document.getElementById("newTask-toDo").classList.add("transparent");
}

/** to Take the first letter of the user contect */
/*
function firstLetters() {
  let userValue = document.getElementById("addTask-assigned");
  let letter = userValue.value.split(" ");
  let firstNameLetter = letter[0][0];
  let lastNameLetter = letter[1][0];
  let result = firstNameLetter + lastNameLetter;
  user.push(result);
  save();
}*/

function setFocus(e) {
  e.style.borderColor = "#29ABE2";
  e.focus();
  document.addEventListener("click", function (event) {
    if (!e.contains(event.target)) {
      e.style.borderColor = "#D1D1D1";
    }
  });
}

/** to delete the Task */

function deleteTask(i) {
  tasks.splice(i,1);
  for (let j = 0; j < tasks.length; j++){
    tasks[j].ID = j;
  }
  putData("/tasks", tasks);
  save();
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  closeMe();
}

/** to search the Task  */

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

/** to convert the Date */

function convertDate(date) {
  let datePart = date.split("-");
  let newDate = datePart[2] + "/" + datePart[1] + "/" + datePart[0];
  return newDate;
}

/** to open the Task */

function renderOfContects(num){
  let contact = document.getElementById(`contacts-content-letter${num}`);
  contact.innerHTML ='';
  for(let i = 0; i< tasks[num].length; i++){
    contact.innerHTML =`${tasks[num]['contacts'][i]['initials']}`;
  }
}


/** to open the Task */


function showTask(i) {
  let showContent = document.getElementById("showTask");
  showContent.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  showContent.innerHTML = "";
  showContent.innerHTML += `
  <div class="category-show-content">
    <div id="card-category-title-show${i}">${tasks[i]["category"]}</div>
    <div class="closeImg" onclick="closeMe()"></div>
  </div>
  <div class="title-description-content">
    <div class="title-content-show"><h2 class="show-card-title">${tasks[i]["title"]}</h2></div>
    <p class="show-card-description">${tasks[i]["description"]}</p>
  </div>
  <div class="dueDate-content"><div class="dueDateText-content">Due date:</div>  ${convertDate(
    tasks[i]["date"]
  )}</div>
  <div class="priority-content">
    <div class="prioText">Priority:</div>
    <div class="prio-icon-text-content">${tasks[i]["prio"]} <img src="${
    tasks[i]["prioIcon"]
  }" alt=""></div>
  </div>
  <div class="show-assignedTo-content">
    <div class="assignedToText">Assigned To:</div>
    <div class="show-user-content">
      <div class="user-task-show-content" id="user-show-letter"></div>
      <div class="user-show-content" id="user-show-name"></div>
    </div>
  </div>
  <div>Subtasks</div>
  <div id="subtask-show"></div>
  <div class="show-btn-content">
    <div class="show-delete-content" onclick="deleteTask(${i})">
      <i class="fa fa-trash-o" style="font-size:24px"></i>
      <button>Delete</button>
    </div>
    <div class="show-line-content"></div>
      <div class="show-edit-content" onclick="openEdit(${i})">
        <i class="fa fa-edit" style="font-size:24px"></i>
        <button>Edit</button>
      </div>
  </div> 
  `;
  changeColorOfCategoryTitleShow(i);
  contactsShowLetterRender(i);
  contactsShowNameRender(i);
  subtasksShowRender(i);
  getColorOfContactsShow();
}

function getColorOfContactsShow(){
  let content = document.querySelectorAll('.user-task-content-show');
  content.forEach(function(div){
    div.style.backgroundColor = colorRandom();
  });
}

function subtasksShowRender(i){
  let content = document.getElementById('subtask-show');
  content.innerHTML ='';
  for(let j = 0;  j < tasks[i]['subtasks'].length; j++){
    content.innerHTML += `<div class="checkbox-show-content"><input type="checkbox" onclick="UpdateProgress(${i})" checked id="checkbox${j}">
    <label class="subtask-show-text">${tasks[i]['subtasks'][j]}</label></div>`;
  }
}

function UpdateProgress(i){
  let checkedCount = 0;
  for(let j = 0; j < tasks[i]["subtasks"].length; j++){
    let checkbox  = document.getElementById(`checkbox${j}`);
    if (checkbox.checked){
      checkedCount++;
    }

    let progress = document.getElementById(`progressBar${i}`);
    let numberOfSubtask = document.getElementsByClassName('numberOfSubtask')[i];
    numberOfSubtask.innerHTML ='';
    if(checkedCount > 1){
      progress.value = 100;
      numberOfSubtask.textContent = '2/2';
    }else if(checkedCount === 1){
      progress.value = 50;
      numberOfSubtask.textContent = '1/2';
    }else{
      progress.value = 0;
      numberOfSubtask.textContent = '0/2';
    }
  }
}


function contactsShowLetterRender(i){
    let content = document.getElementById('user-show-letter');
    for(let j = 0; j < tasks[i]['contacts'].length; j++){
      content.innerHTML += `<div class="user-task-content-show">${tasks[i]['contacts'][j]['initials']}</div>`;
    }
}

function contactsShowNameRender(i){
  let content = document.getElementById('user-show-name');
  for(let j = 0; j < tasks[i]['contacts'].length; j++){
    content.innerHTML += `<div class="user-show-name">${tasks[i]['contacts'][j]['name']}</div>`;
  }
}

/** to edit the Task */

function renderOfUserEdit(){
  let content = document.getElementById('selectedContacts');
    content.innerHTML =`<div>3</div>`;
    content.style.color='red';

}

function openEdit(i) {
  renderOfUserEdit();
  let showContent = document.getElementById("showTask");
  showContent.classList.add("hidden");
  let editConten = document.getElementById("addTask-edit");
  editConten.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  let title = document.getElementById("addTask-edit-title");
  let hiddenInput = document.getElementById("hiddenInput");
  let description = document.getElementById("addTask-edit-description");
  let assignedTo = document.getElementById("addTask-assigned");
  let dates = document.getElementById("task-edit-Date");
  let subtasks = document.getElementById('newSubtask');
  title.value = tasks[i]["title"];
  hiddenInput.value = tasks[i]["title"];
  description.value = tasks[i]["description"];
  assignedTo.value = tasks[i]["contacts"][i];
  dates.value = tasks[i]["date"];
  subtasks.innerHTML =`${tasks[i]['subtasks'][i]}`;
  activeButton(i);
  activeEditButton();
  subtasksEditRender(i);
  contactsEditRender(i);
  getColorOfContacts();
}


function contactsEditRender(i){
  let content = document.getElementsByClassName('user-content-edit-letter')[0];
  content.innerHTML ='';
    for(let j = 0; j < tasks[i]['contacts'].length; j++){
      content.innerHTML += `<div class="user-task-content">${tasks[i]['contacts'][j]['initials']}</div>`;
    }
}

function subtasksEditRender(i){
  let content = document.getElementById('newSubtask');
  content.innerHTML ='';
  for(let j = 0;  j < tasks[i]['subtasks'].length; j++){
    content.innerHTML += `<div class="checkbox-show-content"><input type="checkbox" checked id="checkSub${j}">
    <label class="subtask-show-text">${tasks[i]['subtasks'][j]}</label></div>`;
  }
}

function activeButton(i){
  if (tasks[i]["prio"] === "Low") {
    document.getElementsByClassName("low-edit-button")[0].classList.add("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (tasks[i]["prio"] === "Urgent") {
    document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else {
    document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
  }
}

/** to Save the Task after processing */

function saveEditTask() {
  let title = document.getElementById("addTask-edit-title").value;
  let hiddenInput = document.getElementById("hiddenInput").value;
  let description = document.getElementById("addTask-edit-description").value;
  /*let user = document.getElementById("addTask-assigned").value;*/
  let date = document.getElementById("task-edit-Date").value;
  if (title.trim() === "" || date.trim() === "") {
    return;
  } else {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title === hiddenInput) {
        tasks[i].title = title;
        tasks[i].description = description;
        /*tasks[i]['contacts'][i] = user;*/
        tasks[i].date = date;
        tasks[i].prioIcon = prioBtn;
        tasks[i].prio = prioText;
        break;
      }
    }
  }
  putData("/tasks", tasks);
  save();
  updateHTML();
  closeMe();
}

/**Drag and Drop  and Render  HTML*/

let currentDraggedElement;

 function updateHTML() {
  let toDo = tasks.filter((t) => t["phases"] == "To Do");
  let toDoConetnt = document.getElementById("newTask-toDo");
  toDoConetnt.innerHTML = "";

    for (let index = 0; index < toDo.length; index++) {
      const element = toDo[index];
      document.getElementById("newTask-toDo").innerHTML +=  genereteAllTasksHTML(element);
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
    getColorOfContacts();
}

function startDragging(id) {
  currentDraggedElement = id;
}

function valueOfProgressBar(i){
  let value;
  if(tasks[i]["subtasks"].length === 0){
    value = 0;
  }else if(tasks[i]["subtasks"].length === 1){
    value = 50;
  }else{
    value = 100;
  }
  return value;
}

let usedColor =[];

function contactsRender(){
  for(let i = 0; i < tasks.length; i++){
    let content = document.getElementsByClassName('user-inner-container')[i];
    for(let j = 0; j < tasks[i]['contacts'].length; j++){
      content.innerHTML += `<div class="user-task-content">${tasks[i]['contacts'][j]['initials']}</div>`;
    }
  }
}

function colorRandom(){
  let color = '#';
  let isUnique = false;
  while(!isUnique){
    color = '#';
    for(let i = 0; i < 3; i++){
      let hex = Math.floor(Math.random() * 128).toString(16);
      color += hex.length == 1 ? '0' + hex: hex; 
    }
    if(!usedColor.includes(color)){
      isUnique = true;
      usedColor.push(color);
    }
  }
  return color
}

function getColorOfContacts(){
  let content = document.querySelectorAll('.user-task-content');
  content.forEach(function(div){
    div.style.backgroundColor = colorRandom();
  });
}

 function genereteAllTasksHTML(element) {
  return ` <div id ="cardId${element["ID"]}" draggable="true" ondragstart="startDragging(${element["ID"]})"  onclick="showTask(${element["ID"]})">
  <div class="card">
   <div class="card-category-title">${element["category"]}</div>
   <div class="title-description-content">
     <h2 class="card-title">${element["title"]}</h2>
     <p class="card-description">${element["description"]}</p>
   </div>
   <div class="progress-bar-content">
     <progress value="${valueOfProgressBar(element["ID"])}" max="100" id="progressBar${element["ID"]}"></progress>
     <p class="card-subtasks-text"><span class="numberOfSubtask">${element["subtasks"].length}/2</span> Subtasks</p>
    </div>
    <div class="card-user-content">
      <div class="user-inner-container" id="newDiv${element['ID']}"></div>
      <img src="${element["prioIcon"]}" alt="">
    </div>
  </div>
  </div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(phase) {
  tasks[currentDraggedElement]["phases"] = phase;
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  styleOfNoTaskDone(); 
  putData("/tasks", tasks);
}

function styleOfNoTaskToDo() {
  let toDoConetnt = document.getElementById("newTask-toDo");
  if(toDoConetnt.childElementCount > 0){
    document.getElementById('noTask-toDo').classList.add('hidden');
  }else{
    document.getElementById('noTask-toDo').classList.remove('hidden');
  }
}

function styleOfNoTaskInProgress(){
  let inProgressContent = document.getElementById("newTask-inProgress");
  if(inProgressContent.childElementCount > 0){
    document.getElementById('noTask-inProgress').classList.add('hidden');
  }else{
    document.getElementById('noTask-inProgress').classList.remove('hidden');
  }
}

function styleOfNoTaskAwaitFeedback(){
  let inProgressContent = document.getElementById("newTask-await");
  if(inProgressContent.childElementCount > 0){
    document.getElementById('noTask-await').classList.add('hidden');
  }else{
    document.getElementById('noTask-await').classList.remove('hidden');
  }
}

function styleOfNoTaskDone(){
  let inProgressContent = document.getElementById("newTask-done");
  if(inProgressContent.childElementCount > 0){
    document.getElementById('noTask-done').classList.add('hidden');
  }else{
    document.getElementById('noTask-done').classList.remove('hidden');
  }
}

function checkwidthForAddTask(){
    window.location.href = '/html/addTask.html';

}