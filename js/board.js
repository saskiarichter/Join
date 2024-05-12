let allTasks = [];
let subtask = [];
let user = [];
let prioBtn = "";
let prioText = "";

function init() {
  initInclude();
  load();
  loadDataBoard("/allTasks");
  updateHTML();
  renderOfSubtask();
}
/** To open the AddTask with addTask Button */

function openAddTask() {
  let content = document.getElementById("addTask");
  content.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  renderOfSubtask();
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
}

/** active Button for addTask + */

function activebButton() {
  let urgent_button = document.getElementsByClassName("urgent-button")[0];
  let medium_button = document.getElementsByClassName("medium-button")[0];
  let low_button = document.getElementsByClassName("low-button")[0];
  let lastClick = null;

  urgent_button.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgent_button.classList.add("active");
    lastClick = urgent_button;
  });

  medium_button.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    medium_button.classList.add("active");
    lastClick = medium_button;
  });

  low_button.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    low_button.classList.add("active");
    lastClick = low_button;
  });
}

activebButton();

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
  });

  mediumEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.add("active");
    lowEditbutton.classList.remove("active");
    lastClick = mediumEditbutton;
  });

  lowEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.add("active");
    lastClick = lowEditbutton;
  });
}

/** to add the Task  */

let id = 0;

function addTask() {
  let title = document.getElementById("addTask-title").value;
  let description = document.getElementById("addTask-description").value;
  let user = document.getElementById("addTask-assigned").value;
  let date = document.getElementById("addTask-dueDate").value;
  let category = document.getElementById("addTask-category").value;
  let phase = document.getElementById("addTask-phase").value;
  if (title.trim() === "" || date.trim() === "" || phase.trim() === "Select the phase"
  ) {
    removeHidden();
    return;
  } else {
    allTasks.push({
      ID: id,
      titles: title,
      descriptions: description,
      assignedTos: user,
      dates: date,
      categorys: category,
      subtasks: [],
      prio: prioBtn,
      prioTexts: prioText,
      phases: phase,
    });
  }
  id++;
  save();
  firstLetters();
 /* postDataBoard("/allTasks",allTasks);*/
  updateHTML();
  sortingTheIdOfTasks();
  closeMe();
}

function removeHidden(){
    document.getElementById("required-title").classList.remove("hidden");
    document.getElementById("required-date").classList.remove("hidden");
    document.getElementsByClassName("required-text")[1].classList.remove("hidden");
    document.getElementById("required-phase").classList.remove("hidden");
}

/** to change the color of the Category tilte after add */

function changeColorOfCategoryTitle() {
  for (let i = 0; i < allTasks.length; i++) {
    let content = document.getElementsByClassName("card-category-title")[i];
    let category = allTasks[i]["categorys"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")) {
      content.classList.add("green");
    }
  }
}

function changeColorOfCategoryTitleShow(i){
    let content = document.getElementById(`card-category-title-show${i}`);
    let category = allTasks[i]["categorys"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")){
      content.classList.add("green");
    }
}

async function save() {
  await setItem("alltasks", JSON.stringify(allTasks));
  await setItem("user", JSON.stringify(user));
  await setItem("subtask", JSON.stringify(subtask));
}

async function load() {
  try {
    allTasks = JSON.parse(await getItem("alltasks"));
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

function renderOfSubtask() {
  for (let i = 0; i < subtask.length; i++) {
    let list = document.getElementById("newSubtask");
    list.innerHTML = "";
    list.innerHTML += `<div class="inner-newSubtask"><li>${subtask[i]}</li><div onclick="deleteSubtask(${i})">X</div></div>`;
    list.classList.remove("hidden");
  }
}

function urgentbtn() {
  prioBtn = "./img/PrioAltaRed.png";
  prioText = "Urgent";
  setItem("urgentIcon", prioBtn);
  setItem("urgentText", prioText);
}

function mediumbtn() {
  prioBtn = "./img/PrioMediaOrange.png";
  prioText = "Medium";
  setItem("mediumIcon", prioBtn);
  setItem("mediumText", prioText);
}

function lowbtn() {
  prioBtn = "./img/PrioBajaGreen.png";
  prioText = "Low";
  setItem("lowIcon", prioBtn);
  setItem("lowText", prioText);
}

/** addSubtaskToAllTask(j) not finish yet */

function addSubtaskToAllTask(j) {
  if (subtask.length === 1) {
    allTasks[j]["subtasks"].push(subtask[0]);
    subtask.splice(j, 1);
  } else if (subtask.length === 2) {
    allTasks[j]["subtasks"].push(subtask[0]);
    allTasks[j]["subtasks"].push(subtask[1]);
    subtask.splice(j, 2);
  }
}

let count = 0;

function addSubtask() {
  let subtaskValue = document.getElementById("addTask-subtasks");
  let list = document.getElementById("newSubtask");
  if (subtaskValue.value.trim() === "") {
    return;
  } else if (count < 2) {
    count++;
    list.innerHTML = "";
    subtask.push(subtaskValue.value);
    subtaskValue.value = "";
    for (let i = 0; i < subtask.length; i++) {
      list.innerHTML += `<div class="inner-newSubtask"><li>${subtask[i]}</li><div onclick="deleteSubtask(${i})">X</div></div>`;
    }
  }
  list.classList.remove("hidden");
}

function deleteSubtask(i) {
  document.getElementsByClassName("inner-newSubtask")[i].innerHTML = "";
  subtask.splice(i, 1);
  count--;
  if (count < 0) {
    count = 0;
  }
}

/** addSubtaskToAllTask(j) not finish yet */

/** to Take the first letter of the user contect */

function firstLetters() {
  let userValue = document.getElementById("addTask-assigned");
  let letter = userValue.value.split(" ");
  let firstNameLetter = letter[0][0];
  let lastNameLetter = letter[1][0];
  let result = firstNameLetter + lastNameLetter;
  user.push(result);
  save();
}

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
  allTasks.splice(i, 1);
  user.splice(i, 1);
  subtask.splice(i, 1);
  sortingTheIdOfTasks();
  if (allTasks.length === 0) {
    id = 0;
  }
  save();
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  renderOfSubtask();
  closeMe();
}

/** to search the Task  */

function searchTask() {
  let search = document.getElementById("search-input").value.toLowerCase();
  for (let i = 0; i < allTasks.length; i++) {
    let TaskCard = document.getElementById(`cardId${i}`);
    const title = allTasks[i]["titles"].toLowerCase();
    const description = allTasks[i]["descriptions"].toLowerCase();
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

function showTask(i) {
  let showContent = document.getElementById("showTask");
  showContent.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  showContent.innerHTML = "";
  showContent.innerHTML += `
  <div id="card-category-title-show${i}">${allTasks[i]["categorys"]}</div>
  <div class="title-description-content">
    <div class="title-content-show"><h2 class="show-card-title">${allTasks[i]["titles"]}</h2></div>
    <p class="show-card-description">${allTasks[i]["descriptions"]}</p>
  </div>
  <div class="dueDate-content"><div class="dueDateText-content">Due date:</div>  ${convertDate(
    allTasks[i]["dates"]
  )}</div>
  <div class="priority-content">
    <div class="prioText">Priority:</div>
    <div class="prio-icon-text-content">${allTasks[i]["prioTexts"]} <img src="${
    allTasks[i]["prio"]
  }" alt=""></div>
  </div>
  <div class="show-assignedTo-content">
    <div class="assignedToText">Assigned To:</div>
    <div class="show-user-content">
      <div class="user-inner-container">${user[i]}</div>
      <div>${allTasks[i]["assignedTos"]}</div>
      </div>
  </div>
  <div>Subtasks</div>
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
  changeColorOfCategoryTitleShow(i) /** ???????? */
}

/** to edit the Task */

function openEdit(i) {
  let showContent = document.getElementById("showTask");
  showContent.classList.add("hidden");
  let editConten = document.getElementById("addTask-edit");
  editConten.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  let title = document.getElementById("addTask-edit-title");
  let hiddenInput = document.getElementById("hiddenInput");
  let description = document.getElementById("addTask-edit-description");
  let assignedTo = document.getElementById("addTask-edit-assigned");
  let dates = document.getElementById("addTask-edit-dueDate");
  let category = document.getElementById("addTask-edit-category");
  title.value = allTasks[i]["titles"];
  hiddenInput.value = allTasks[i]["titles"];
  description.value = allTasks[i]["descriptions"];
  assignedTo.value = allTasks[i]["assignedTos"];
  dates.value = allTasks[i]["dates"];
  category.value = allTasks[i]["categorys"];
  if (allTasks[i]["prioTexts"] === "Low") {
    document.getElementsByClassName("low-edit-button")[0].classList.add("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (allTasks[i]["prioTexts"] === "Urgent") {
    document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else {
    document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
  }
  activeEditButton();
}

/** to Save the Task after processing */

function saveEditTask() {
  let title = document.getElementById("addTask-edit-title").value;
  let hiddenInput = document.getElementById("hiddenInput").value;
  let description = document.getElementById("addTask-edit-description").value;
  let user = document.getElementById("addTask-edit-assigned").value;
  let date = document.getElementById("addTask-edit-dueDate").value;
  let category = document.getElementById("addTask-edit-category").value;
  if (title.trim() === "" || date.trim() === "") {
    return;
  } else {
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].titles === hiddenInput) {
        allTasks[i].titles = title;
        allTasks[i].descriptions = description;
        allTasks[i].assignedTos = user;
        allTasks[i].dates = date;
        allTasks[i].categorys = category;
        allTasks[i].prio = prioBtn;
        allTasks[i].prioTexts = prioText;
        break;
      }
    }
  }
  save();
  updateHTML();
  closeMe();
}

/**Drag and Drop  and Render  HTML*/

let currentDraggedElement;

function updateHTML() {
  let toDo = allTasks.filter((t) => t["phases"] == "To Do");
  let toDoConetnt = document.getElementById("newTask-toDo");
  toDoConetnt.innerHTML = "";

    for (let index = 0; index < toDo.length; index++) {
      const element = toDo[index];
      document.getElementById("newTask-toDo").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskToDo(); 
    }

    let inProgress = allTasks.filter((t) => t["phases"] == "In progress");
    let inProgressContent = document.getElementById("newTask-inProgress");
    inProgressContent.innerHTML = "";

    for (let index = 0; index < inProgress.length; index++) {
      const element = inProgress[index];
      document.getElementById("newTask-inProgress").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskInProgress();
    }

    let await = allTasks.filter((t) => t["phases"] == "Await feedback");
    document.getElementById("newTask-await").innerHTML = "";
    for (let index = 0; index < await.length; index++) {
      const element = await[index];
      document.getElementById("newTask-await").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskAwaitFeedback(); 
    }
    let done = allTasks.filter((t) => t["phases"] == "Done");
    document.getElementById("newTask-done").innerHTML = "";
    for (let index = 0; index < done.length; index++) {
      const element = done[index];
      document.getElementById("newTask-done").innerHTML += genereteAllTasksHTML(element);
      styleOfNoTaskDone(); 
    }
    changeColorOfCategoryTitle();
    sortingTheIdOfTasks();
    renderOfSubtask();
}

function sortingTheIdOfTasks(){
  allTasks = allTasks.map((element, index) => ({
    ...element,
    ID: index
  }));
}

function startDragging(id) {
  currentDraggedElement = id;
}

function genereteAllTasksHTML(element) {
  return ` <div id ="cardId${element["ID"]}" draggable="true" ondragstart="startDragging(${element["ID"]})"  onclick="showTask(${element["ID"]})">
  <div class="card">
   <div class="card-category-title">${element["categorys"]}</div>
   <div class="title-description-content">
     <h2 class="card-title">${element["titles"]}</h2>
     <p class="card-description">${element["descriptions"]}</p>
   </div>
   <div class="progress-bar-content">
     <progress value="" max="100" id="progressBar"></progress>
     <p class="card-subtasks-text"><span class="numberOfSubtask">${element["subtasks"].length}</span>/2 Subtasks</p>
    </div>
    <div class="card-user-content">
      <div class="user-inner-container">${user[element["ID"]]}</div>
      <img src="${element["prio"]}" alt="">
    </div>
  </div>
  </div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  allTasks[currentDraggedElement]["phases"] = category;
  updateHTML();
  styleOfNoTaskToDo();
  styleOfNoTaskInProgress();
  styleOfNoTaskAwaitFeedback();
  styleOfNoTaskDone();
  sortingTheIdOfTasks(); 
  save();
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