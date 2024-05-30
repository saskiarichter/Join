/**
 * to open the edit-section at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be opened.
*/
function openEdit(taskIndex) {
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
  title.value = tasks[taskIndex]["title"];
  hiddenInput.value = tasks[taskIndex]["title"];
  description.value = tasks[taskIndex]["description"];
  assignedTo.value = tasks[taskIndex]["contacts"][taskIndex];
  dates.value = tasks[taskIndex]["date"];
  activeEditButton();
  activeButton(taskIndex);
  subtasksEditRender(taskIndex);
  contactsEditRender(taskIndex);
  renderEditContacts('addTask-contacts-container-edit');
  let content = document.getElementsByClassName(`input-edit-subtask`)[0];
  content.innerHTML =`      
  <input id="addTask-edit-subtasks${taskIndex}" class="inputfield" type="text"
  placeholder="Add new subtask" maxlength="26" autocomplete="off" onclick="openEditSubtaskIcons()"/>
  <div id="addTask-subtasks-edit-icons" class="subtasks-icon d-none">
    <img  src="./img/closeVectorBlack.svg" alt="Delete" onclick="closeEditSubtaskIcons()">
    <div class="parting-line subtasks-icon-line"></div>
    <img id="add-subtask-button" src="./img/done.svg" alt="confirm" onclick="addEditSubtasks(${taskIndex})">
  </div>
  <img src="./img/subtasks.svg" class="plus-icon-edit-subtasks" id="plus-edit-icon" onclick="openEditSubtaskIcons()"/>`;
}


/**
 * to render the contact at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be rendered.
*/
function contactsEditRender(taskIndex){
  let content = document.getElementsByClassName('user-content-edit-letter')[0];
  content.innerHTML ='';
    for(let j = 0; j < tasks[taskIndex]['contacts'].length; j++){
      let letter = tasks[taskIndex]['contacts'][j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0).toUpperCase();
      }
      content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
    }
}


/**
 * to render the Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be rendered.
*/
function subtasksEditRender(taskIndex){
  let content = document.getElementById('newSubtask');
  content.innerHTML ='';
  for(let j = 0;  j < tasks[taskIndex]['subtasks'].length; j++){
    content.innerHTML += `
  <div class="checkbox-edit-content">
    <div id="checkbox-edit-content${j}" class="checkbox-show-content">
      <input type="checkbox" checked id="checkSub${j}">
      <label id="subtask-edit-text${j}" class="subtask-show-text">${tasks[taskIndex]['subtasks'][j]}</label>
    </div>

    <div id="edit-input-board-content${j}" class=" subtasks-icon input-subtask-edit-content hidden">
      <input type ="text" class="editInputBoard" id = "editInputBoard${j}" value =${tasks[taskIndex]['subtasks'][j]}>
      <div class="edit-buttons-content">
        <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="./img/delete.svg" alt="delete">
        <div class="parting-line subtasks-icon-line"></div>
        <img onclick="confirmEdit(${taskIndex}, ${j})" src="./img/done.svg" alt="confirm">
      </div>
    </div>

    <div id="subtasks-icon${j}" class="subtasks-icon subtasks-icon-hidden">
      <img onclick="editBoardSubtask(${j})" src="./img/edit.svg" alt="edit">
      <div class="parting-line subtasks-icon-line"></div>
      <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="./img/delete.svg" alt="delete">
    </div>
  </div> `
    ;
  }
}


/**
 * to confirm the progess after adjustment of Subtasks
 * @param {number} taskIndex - The index of the task to be confirmed
 * @param {number} subtaskIndex - The index of the Subtask to be confirmed
 */
function confirmEdit(taskIndex, subtaskIndex){
  let inputSubtask = document.getElementById(`editInputBoard${subtaskIndex}`).value;
  deleteEditBoardSubtask(taskIndex, subtaskIndex);
  if(!Array.isArray(tasks[taskIndex].subtasks)){
    tasks[taskIndex].subtasks = [];
  }
  tasks[taskIndex]["subtasks"].push(inputSubtask);
  subtasksEditRender(taskIndex);
  putData("/tasks", tasks);
  inputSubtask ="";
}


/**
 * Edits the Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited
 */
function editBoardSubtask(taskIndex){
  document.getElementById(`edit-input-board-content${taskIndex}`).classList.remove('hidden');
  document.getElementById(`checkbox-edit-content${taskIndex}`).classList.add('hidden');
  document.getElementById(`subtasks-icon${taskIndex}`).classList.add('hidden');
  let subtaskInput = document.getElementById(`editInputBoard${taskIndex}`).value;
  let labelOfSubtask = document.getElementById(`subtask-edit-text${taskIndex}`);
  labelOfSubtask.innerHTML = subtaskInput;
}


/**
 * Deletes the Subtask at the specified index in the task list.
 * @param {number} taskIndex -The index of the task to be deleted.
 * @param {number} subtaskIndex - The index of the Subtask to be deleted.
*/
function deleteEditBoardSubtask(taskIndex, subtaskIndex){
  if(tasks[taskIndex]["subtasks"].length === 1){
    if(Array.isArray(tasks[taskIndex].subtasks)){
      tasks[taskIndex].subtasks = "";
    }
    subtasksEditRender(taskIndex);
  }else{
    tasks[taskIndex]["subtasks"].splice(subtaskIndex, 1);
    subtasksEditRender(taskIndex);
  }
  putData("/tasks", tasks);
}


/**
 *  to open the edit-section by click the Icon of edit-subtask 
*/
function openEditSubtaskIcons(){
  document.getElementById('addTask-subtasks-edit-icons').classList.remove('d-none');
  document.getElementById('plus-edit-icon').classList.add('d-none');
}


/**
 *  to close the edit-section by click the Icon of close-eedit-subtask 
*/
function closeEditSubtaskIcons(){
  document.getElementById('addTask-subtasks-edit-icons').classList.add('d-none');
  document.getElementById('plus-edit-icon').classList.remove('d-none');
}

/**
 * to add the Subtask at the specified index in the task list.
 * @param {number} taskIndex - The index of the task to be edited
 */
function addEditSubtasks(taskIndex){
  let inputSubtask = document.getElementById(`addTask-edit-subtasks${taskIndex}`).value;
      if(tasks[taskIndex]['subtasks'].length >= 2 || inputSubtask.trim() === ""){
        return;
      }else{
        let list = document.getElementById('newSubtask');
        list.innerHTML += `
        <div class="checkbox-edit-content">
          <div class="checkbox-show-content">
            <input type="checkbox" checked>
            <label class="subtask-show-text">${inputSubtask}</label>
          </div>
          <div class="subtasks-icon subtasks-icon-hidden">
            <img onclick="editBoardSubtask(${taskIndex})" src="./img/edit.svg" alt="Bearbeiten">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="deleteEditBoardSubtask(${taskIndex})" src="./img/delete.svg" alt="Delete">
          </div>
        </div> `;
        if(!Array.isArray(tasks[taskIndex].subtasks)){
          tasks[taskIndex].subtasks = [];
        }
        tasks[taskIndex]["subtasks"].push(inputSubtask);
        putData("/tasks", tasks);
        inputSubtask ="";
      }
}


/**
 *  to Save the Task after processing
*/
function saveEditTask() {
  let title = document.getElementById("addTask-edit-title").value;
  let hiddenInput = document.getElementById("hiddenInput").value;
  let description = document.getElementById("addTask-edit-description").value;
  let date = document.getElementById("task-edit-Date").value;
  if (title.trim() === "" || date.trim() === "") {
    return;
  } else {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title === hiddenInput) {
        tasks[i].title = title;
        tasks[i].description = description;
        tasks[i].date = date;
        tasks[i].prioIcon = prioBtn;
        tasks[i].prio = prioText;
        if(selectedEditContacts.length > 0){
          tasks[i]["contacts"].splice(0, tasks[i]["contacts"].length);
          tasks[i]["contacts"].push(...selectedEditContacts);
        }
        break;
      }
    }
  }
  putData("/tasks", tasks);
  updateHTML();
  closeMe();
}


/** 
 * active Edit Buttons for Task 
*/
function activeEditButton() {
  let urgentEditbutton = document.getElementsByClassName("urgent-edit-button")[0];
  let mediumEditbutton = document.getElementsByClassName("medium-edit-button")[0];
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
    prioIcon ='./img/PrioAltaWhite.svg';
    prioBtn ="./img/PrioAltaRed.svg";
    changeIconOfUrgent();
  });

  mediumEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.add("active");
    lowEditbutton.classList.remove("active");
    lastClick = mediumEditbutton;
    prioText = 'Medium';
    prioIcon = './img/PrioMediaWhite.svg';
    prioBtn = './img/PrioMediaOrange.svg';
    changeIconOfMedium();
  });

  lowEditbutton.addEventListener("click", function () {
    if (lastClick) {
      lastClick.classList.remove("active");
    }
    urgentEditbutton.classList.remove("active");
    mediumEditbutton.classList.remove("active");
    lowEditbutton.classList.add("active");
    lastClick = lowEditbutton;
    prioText = 'Low';
    prioIcon = './img/PrioBajaWhite.svg';
    prioBtn = './img/PrioBajaGreen.svg';
    changeIconOfLow();
  });
}


/**
 * to show the color of the button after edit click
 * @param {number} taskIndex - The index of the task to be changed
 */
function activeButton(taskIndex){
  if (tasks[taskIndex]["prio"] === "Low") {
    document.getElementsByClassName("low-edit-button")[0].classList.add("active");
    prioIcon = './img/PrioBajaWhite.svg';
    changeIconOfLow();
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");;
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (tasks[taskIndex]["prio"] === "Urgent") {
    document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
    prioIcon ='./img/PrioAltaWhite.svg';
    changeIconOfUrgent();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if(tasks[taskIndex]["prio"] === "Medium") {
    document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
    prioIcon = './img/PrioMediaWhite.svg';
    changeIconOfMedium();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
  }else{
    prio ='';
    prioBtn ='';
  }
}


/**
 * to change the color of urgent-Button
*/
function changeIconOfUrgent(){
  let urgent = document.getElementById('urgentImg');
  urgent.src = prioIcon;
  let medium = document.getElementById('mediumImg');
  medium.src = './img/PrioMediaOrange.svg';
  let low = document.getElementById('lowImg');
  low.src = './img/PrioBajaGreen.svg';
}


/**
 * to change the color of medium-Button
*/
function changeIconOfMedium(){
  let medium = document.getElementById('mediumImg');
  medium.src = prioIcon;
  let urgent = document.getElementById('urgentImg');
  urgent.src = './img/PrioAltaRed.svg';
  let low = document.getElementById('lowImg');
  low.src = './img/PrioBajaGreen.svg';
}


/**
 * to change the color of low-Button
*/
function changeIconOfLow(){
  let low = document.getElementById('lowImg');
  low.src = prioIcon;
  let medium = document.getElementById('mediumImg');
  medium.src = './img/PrioMediaOrange.svg';
  let urgent = document.getElementById('urgentImg');
  urgent.src = './img/PrioAltaRed.svg';
}