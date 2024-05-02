let allTasks = [];
let subtask = [];
let user = [];

function init() {
  initInclude();
  load();
  render();
}

function openAddTask() {
  let content = document.getElementById('addTask');
  content.classList.remove('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.remove('hidden');
}

function closeMe() {
  let content = document.getElementById('addTask');
  content.classList.add('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.add('hidden');
}

function activebButton(){
  let urgent_button = document.getElementsByClassName('urgent-button')[0];
  let medium_button = document.getElementsByClassName('medium-button')[0];
  let low_button = document.getElementsByClassName('low-button')[0];
  let lastClick = null;

  urgent_button.addEventListener('click', function(){
    if(lastClick){
      lastClick.classList.remove('active');
    }
    urgent_button.classList.add('active');
    lastClick = urgent_button;
  });

  medium_button.addEventListener('click', function(){
    if(lastClick){
      lastClick.classList.remove('active');
    }
    medium_button.classList.add('active');
    lastClick = medium_button;
  });

  low_button.addEventListener('click', function(){
    if(lastClick){
      lastClick.classList.remove('active');
    }
    low_button.classList.add('active');
    lastClick = low_button;
  });
}

activebButton();

function addTask() {
  let title = document.getElementById("addTask-title").value;
  let description = document.getElementById("addTask-description").value;
  let user = document.getElementById("addTask-assigned").value;
  let date = document.getElementById("addTask-dueDate").value;
  let category = document.getElementById("addTask-category").value;
  let subtask = document.getElementById("addTask-subtasks").value;
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
      subtasks: subtask
    });
  }
  save();
  firstLetters();
  render();
  closeMe();
}

function changeColorOfCategoryTitle(){
  for( let i = 0; i < allTasks.length; i++){
    let content = document.getElementsByClassName('card-category-title')[i];
    let category = allTasks[i]["categorys"];
    if (category.includes("User Story")){
      content.classList.add('blue');
    }else if(category.includes('Technical Task')){
      content.classList.add('green');
    }
  }
}

async function save() {
  await setItem('alltasks', JSON.stringify(allTasks));
  await setItem('user', JSON.stringify(user));
}

async function load() {
  try {
    allTasks = JSON.parse(await getItem('alltasks'));
    user = JSON.parse(await getItem('user'));
    render();
  } catch (e) {
    console.error('Loading error:', e);
  }

}

function styleOfNoTask(){
  let newTaskToDo = document.getElementById('newTask-toDo');
  newTaskToDo.classList.remove('transparent');
  let content = document.createElement('p');
  content.textContent ='No tasks to do';
  newTaskToDo.appendChild(content);
}

function noTaskTransparent(){
  document.getElementById('newTask-toDo').classList.add('transparent');
}

/*function progressBar(){
  for(let i = 0; i < subtask.length; i++){
    let content = document.getElementsByClassName('progress-bar')[i];
    content.innerHTML ="";
    if (subtask.length == 1){
      content.style.width="50%";
    }else if(subtask.length >=2){
      content.style.width="20px";
    }else{
      content.style.width="0%";
    }
  }
  save();
  render();
}

progressBar();*/

function render() {
  let content = document.getElementById('newTask-toDo');
  content.innerHTML = '';
  if(allTasks.length == 0){
    styleOfNoTask();
  }else{
    noTaskTransparent();
    for (let i = 0; i < allTasks.length; i++) {
      content.innerHTML += `
      <div class="card">
        <div class="card-category-title">${allTasks[i]["categorys"]}</div>
        <div class="title-description-content">
          <h2 class="card-title">${allTasks[i]["titles"]}</h2>
          <p class="card-description">${allTasks[i]["descriptions"]}</p>
        </div>
        <div class="progress-bar-content">
          <div class= "inner-progress-bar-content">
            <div class="progress-bar" id="progress-bar"></div>
          </div>
          <p class="card-subtasks-text"><span>0</span>/2 Subtasks</p>
        </div>
        <div class="card-user-content">
          <div class="user-inner-container">${user[i]}</div>
          <img src="" alt="">
          <button onclick="deleteTask(${i})">delete</button>
        </div>
      </div>
      `;
    }
    changeColorOfCategoryTitle();
  }
}


function firstLetters(){
  let userValue = document.getElementById('addTask-assigned');
  let letter = userValue.value.split(" ");
  let firstNameLetter =letter[0][0];
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
  }else if (count < 2) {
    count++;
    list.innerHTML ='';
    subtask.push(subtaskValue.value);
    subtaskValue.value = '';
    for(let i =0; i <subtask.length; i++){
      list.innerHTML += `<div class="inner-newSubtask"><li>${subtask[i]}</li><div onclick="deleteSubtask(${i})">X</div></div>`;
    }
  }
  list.classList.remove('hidden');
}

function deleteSubtask(i) {
  document.getElementsByClassName('inner-newSubtask')[i].innerHTML ='';
  subtask.splice(i,1);
  count--;
  if (count < 0) {
    count = 0;
  }
}

function deleteTask(i){
  allTasks.splice(i,1);
  user.splice(i,1);
  subtask.splice(i,1);
  save();
  render();
}