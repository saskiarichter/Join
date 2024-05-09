let allTasks = [];
let subtask = [];
let user = [];
let prioBtn = "";
let prioText = "";


function init() {
  initInclude();
  load();
  render();
  renderOfSubtask();
}


function openAddTask() {
  let content = document.getElementById('addTask');
  content.classList.remove('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.remove('hidden');
  renderOfSubtask();
}


function closeMe() {
  let content = document.getElementById('addTask');
  let showContent = document.getElementById('showTask');
  let editContent = document.getElementById('addTask-edit');
  showContent.classList.add('hidden');
  content.classList.add('hidden');
  editContent.classList.add('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.add('hidden');
}

/** active Button for addTask + */
function activebButton() {
  let urgent_button = document.getElementsByClassName('urgent-button')[0];
  let medium_button = document.getElementsByClassName('medium-button')[0];
  let low_button = document.getElementsByClassName('low-button')[0];
  let lastClick = null;

  urgent_button.addEventListener('click', function () {
    if (lastClick) {
      lastClick.classList.remove('active');
    }
    urgent_button.classList.add('active');
    lastClick = urgent_button;
  });

  medium_button.addEventListener('click', function () {
    if (lastClick) {
      lastClick.classList.remove('active');
    }
    medium_button.classList.add('active');
    lastClick = medium_button;
  });

  low_button.addEventListener('click', function () {
    if (lastClick) {
      lastClick.classList.remove('active');
    }
    low_button.classList.add('active');
    lastClick = low_button;
  });
}

activebButton();

function activeEditButton(){
  let urgentEditbutton = document.getElementsByClassName('urgent-edit-button')[0];
  let mediumEditbutton = document.getElementsByClassName('medium-edit-button')[0];
  let lowEditbutton = document.getElementsByClassName('low-edit-button')[0];
  let lastClick = null;

  urgentEditbutton.addEventListener('click', function () {
    if (lastClick) {
      lastClick.classList.remove('active');
    }
    urgentEditbutton.classList.add('active');
    lastClick = urgentEditbutton;
  });

  mediumEditbutton.addEventListener('click', function () {
    if (lastClick) {
      lastClick.classList.remove('active');
    }
    mediumEditbutton.classList.add('active');
    lastClick = mediumEditbutton;
  });

  lowEditbutton.addEventListener('click', function () {
    if (lastClick) {
      lastClick.classList.remove('active');
    }
    lowEditbutton.classList.add('active');
    lastClick = lowEditbutton;
  });
}


function addTask() {
  let title = document.getElementById("addTask-title").value;
  let description = document.getElementById("addTask-description").value;
  let user = document.getElementById("addTask-assigned").value;
  let date = document.getElementById("addTask-dueDate").value;
  let category = document.getElementById("addTask-category").value;
  if (title.trim() === '' || date.trim() === '') {
    document.getElementById('required-title').classList.remove('hidden');
    document.getElementsByClassName('required-text')[1].classList.remove('hidden');
    return;
  } else {
    allTasks.push({
      titles: title,
      descriptions: description,
      assignedTos: user,
      dates: date,
      categorys: category,
      subtasks: [],
      prio: prioBtn,
      prioTexts: prioText
    });
  }
  save();
  firstLetters();
  render();
  closeMe();
}


function changeColorOfCategoryTitle() {
  for (let i = 0; i < allTasks.length; i++) {
    let content = document.getElementsByClassName('card-category-title')[i];
    let category = allTasks[i]["categorys"];
    if (category.includes("User Story")) {
      content.classList.add('blue');
    } else if (category.includes('Technical Task')) {
      content.classList.add('green');
    }
  }
}


async function save() {
  await setItem('alltasks', JSON.stringify(allTasks));
  await setItem('user', JSON.stringify(user));
  await setItem('subtask', JSON.stringify(subtask));
}


async function load() {
  try {
    allTasks = JSON.parse(await getItem('alltasks'));
    user = JSON.parse(await getItem('user'));
    subtask = JSON.parse(await getItem('subtask'));
    render();
  } catch (e) {
    console.error('Loading error:', e);
  }

}


function styleOfNoTask() {
  let newTaskToDo = document.getElementById('newTask-toDo');
  newTaskToDo.classList.remove('transparent');
  let content = document.createElement('p');
  content.textContent = 'No tasks to do';
  newTaskToDo.appendChild(content);
}


function noTaskTransparent() {
  document.getElementById('newTask-toDo').classList.add('transparent');
}


function renderOfSubtask() {
  for (let i = 0; i < subtask.length; i++) {
    let list = document.getElementById('newSubtask');
    list.innerHTML = '';
    list.innerHTML += `<div class="inner-newSubtask"><li>${subtask[i]}</li><div onclick="deleteSubtask(${i})">X</div></div>`;
    list.classList.remove('hidden');
  }
}


function urgentbtn() {
  prioBtn = "./img/PrioAltaRed.png";
  prioText = "Urgent";
  setItem('urgentIcon', prioBtn);
  setItem('urgentText', prioText);
}


function mediumbtn() {
  prioBtn = "./img/PrioMediaOrange.png";
  prioText = "Medium";
  setItem('mediumIcon', prioBtn);
  setItem('mediumText', prioText);
}


function lowbtn() {
  prioBtn = "./img/PrioBajaGreen.png";
  prioText = "Low"
  setItem('lowIcon', prioBtn);
  setItem('lowText', prioText);
}


/** addSubtaskToAllTask(j) not finish yet */

function addSubtaskToAllTask(j) {
  if (subtask.length === 1) {
    allTasks[j]['subtasks'].push(subtask[0]);
    subtask.splice(j, 1);
  } else if (subtask.length === 2) {
    allTasks[j]['subtasks'].push(subtask[0]);
    allTasks[j]['subtasks'].push(subtask[1]);
    subtask.splice(j, 2);
  }
}

/** addSubtaskToAllTask(j) not finish yet */

function render() {
  let content = document.getElementById('newTask-toDo');
  content.innerHTML = '';
  if (allTasks.length == 0) {
    styleOfNoTask();
  } else {
    noTaskTransparent();
    for (let i = 0; i < allTasks.length; i++) {
      let progressvalue;
      if (allTasks[i]["subtasks"].length === 0) {
        progressvalue = "50";
      } else if (allTasks[i]["subtasks"].length > 1) {
        progressvalue = "100";
      }
      addSubtaskToAllTask(i);
      content.innerHTML += `
      <div id="cardId${i}" onclick="showTask(${i})">
      <div class="card">
       <div class="card-category-title">${allTasks[i]["categorys"]}</div>
       <div class="title-description-content">
         <h2 class="card-title">${allTasks[i]["titles"]}</h2>
         <p class="card-description">${allTasks[i]["descriptions"]}</p>
       </div>
       <div class="progress-bar-content">
         <progress value="${progressvalue}" max="100" id="progressBar"></progress>
         <p class="card-subtasks-text"><span class="numberOfSubtask">${allTasks[i]['subtasks'].length}</span>/2 Subtasks</p>
        </div>
        <div class="card-user-content">
          <div class="user-inner-container">${user[i]}</div>
          <img src="${allTasks[i]['prio']}" alt="">
        </div>
      </div>
      </div>
      `;
    }
    changeColorOfCategoryTitle();
    renderOfSubtask();
  }
}


function firstLetters() {
  let userValue = document.getElementById('addTask-assigned');
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
  document.addEventListener('click', function (event) {
    if (!e.contains(event.target)) {
      e.style.borderColor = "#D1D1D1";
    }
  });
}

let count = 0;


function addSubtask() {
  let subtaskValue = document.getElementById('addTask-subtasks');
  let list = document.getElementById('newSubtask');
  if (subtaskValue.value.trim() === '') {
    return;
  } else if (count < 2) {
    count++;
    list.innerHTML = '';
    subtask.push(subtaskValue.value);
    subtaskValue.value = '';
    for (let i = 0; i < subtask.length; i++) {
      list.innerHTML += `<div class="inner-newSubtask"><li>${subtask[i]}</li><div onclick="deleteSubtask(${i})">X</div></div>`;
    }
  }
  list.classList.remove('hidden');
}


function deleteSubtask(i) {
  document.getElementsByClassName('inner-newSubtask')[i].innerHTML = '';
  subtask.splice(i, 1);
  count--;
  if (count < 0) {
    count = 0;
  }
}


function deleteTask(i) {
  allTasks.splice(i, 1);
  user.splice(i, 1);
  subtask.splice(i, 1);
  save();
  render();
  renderOfSubtask();
  closeMe();
}


function searchTask() {
  let search = document.getElementById('search-input').value.toLowerCase();
  for (let i = 0; i < allTasks.length; i++) {
    let TaskCard = document.getElementById(`cardId${i}`);
    const title = allTasks[i]['titles'].toLowerCase();
    const description = allTasks[i]['descriptions'].toLowerCase();
    if (TaskCard) {
      if (title.includes(search) || description.includes(search)) {
        TaskCard.style.display = 'block';
      } else {
        TaskCard.style.display = 'none';
      }
    }
    else {
      console.log("Task Card not Found");
    }
  }
}


function convertDate(date) {
  let datePart = date.split('-');
  let newDate = datePart[2] + '/' + datePart[1] + '/' + datePart[0];
  return newDate;
}


function showTask(i) {
  let showContent = document.getElementById('showTask');
  showContent.classList.remove('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.remove('hidden');
  showContent.innerHTML = '';
  showContent.innerHTML += `
  <div class="card-category-title">${allTasks[i]["categorys"]}</div>
  <div class="title-description-content">
    <h2 class="show-card-title">${allTasks[i]["titles"]}</h2>
    <p class="show-card-description">${allTasks[i]["descriptions"]}</p>
  </div>
  <div class="dueDate-content"><div class="dueDateText-content">Due date:</div>  ${convertDate(allTasks[i]['dates'])}</div>
  <div class="priority-content">
    <div class="prioText">Priority:</div>
    <div class="prio-icon-text-content">${allTasks[i]['prioTexts']} <img src="${allTasks[i]['prio']}" alt=""></div>
  </div>
  <div class="show-assignedTo-content">
    <div class="assignedToText">Assigned To:</div>
    <div class="show-user-content">
      <div class="user-inner-container">${user[i]}</div>
      <div>${allTasks[i]['assignedTos']}</div>
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
  changeColorOfCategoryTitle();/** ???????? */
}

function openEdit(i){
  let showContent = document.getElementById('showTask');
  showContent.classList.add('hidden');
  let editConten = document.getElementById('addTask-edit');
  editConten.classList.remove('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.remove('hidden');
  activeEditButton();
  let title = document.getElementById('addTask-edit-title');
  let hiddenInput = document.getElementById('hiddenInput');
  let description = document.getElementById('addTask-edit-description');
  let assignedTo = document.getElementById('addTask-edit-assigned');
  let dates = document.getElementById('addTask-edit-dueDate');
  let category = document.getElementById('addTask-edit-category');
  title.value = allTasks[i]["titles"];
  hiddenInput.value = allTasks[i]["titles"];
  description.value = allTasks[i]["descriptions"];
  assignedTo.value = allTasks[i]["assignedTos"];
  dates.value =  allTasks[i]["dates"];
  category.value = allTasks[i]['categorys'];
  if(allTasks[i]["prioTexts"] === "Low"){
    document.getElementsByClassName('low-edit-button')[0].classList.add('active');
    document.getElementsByClassName('urgent-edit-button')[0].classList.remove('active');
    document.getElementsByClassName('medium-edit-button')[0].classList.remove('active');
  }else if(allTasks[i]['prioTexts'] === 'Urgent'){
    document.getElementsByClassName('urgent-edit-button')[0].classList.add('active');
    document.getElementsByClassName('low-edit-button')[0].classList.remove('active');
    document.getElementsByClassName('medium-edit-button')[0].classList.remove('active');
  }else{
    document.getElementsByClassName('medium-edit-button')[0].classList.add('active');
    document.getElementsByClassName('low-edit-button')[0].classList.remove('active');
    document.getElementsByClassName('urgent-edit-button')[0].classList.remove('active');
  }
}

function saveEditTask(){
  debugger
  let title = document.getElementById('addTask-edit-title').value;
  let hiddenInput = document.getElementById('hiddenInput').value;
  let description = document.getElementById('addTask-edit-description').value;
  let user = document.getElementById('addTask-edit-assigned').value;
  let date = document.getElementById('addTask-edit-dueDate').value;
  let category = document.getElementById('addTask-edit-category').value;
  if (title.trim() === '' || date.trim() === '') {
    return;
  } else {
    for (let i = 0; i < allTasks.length; i++){
      if(allTasks[i].titles === hiddenInput){
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
  render();
  closeMe();
}