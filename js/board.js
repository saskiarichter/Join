let allTasks=[];

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


function addTask() {
  let title = document.getElementById("addTask-title").value;
  let description = document.getElementById("addTask-description").value;
  let assignedTo = document.getElementById("addTask-assigned").value;
  let date = document.getElementById("addTask-dueDate").value;
  let category = document.getElementById("addTask-category").value;
  let subtask = document.getElementById("addTask-subtasks").value;
  if(title.trim() === '' || date.trim() === ''){
    document.getElementById('required-title').classList.remove('hidden');
    document.getElementsByClassName('required-text')[1].classList.remove('hidden');
    return; 
  }else{
    allTasks.push({
      titles: title,
      descriptions: description,
      assignedTos: assignedTo,
      dates: date,
      categorys: category,
      subtasks: subtask 
    });
  }
  save();
  render();
  closeMe();
}

async function save(){
  await setItem('alltasks', JSON.stringify(allTasks));
}

async function load() {
     try {
        allTasks = JSON.parse(await getItem('alltasks'));
    } catch(e){
        console.error('Loading error:', e);
    }
  
}

function render() {
  let content = document.getElementById('newTask-toDo');
  content.innerHTML = '';
  for (let i = 0; i < allTasks.length; i++) {
    content.innerHTML += `
    <div>222</div>
    <p>ich bin gerendert</p>
    `;
  }
}
