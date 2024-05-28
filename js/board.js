let subtask = [];
let user = [];
tasks = [];
prioBtn = "";
let prioIcon ="";
let prioText = "";
let selectedEditContacts = [];
let editContactsSearch = [];

async function initBoard() {
  await initInclude();
  displayUserInitials();
  loadTasksBoard();
  updateHTML();
  renderEditContacts('addTask-contacts-container');
}

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

function openEditContacts(){
  let container = document.getElementById('input-assigned-edit-section');
  let contacts = document.getElementById('addTask-contacts-container-edit');
  let img = document.getElementById('dropdown-img-contacts-edit');

  window.addEventListener('click', function (e) {
    if (container.contains(e.target)) {
      openDropdown(contacts, img);
      hideSelectedEditContacts();
    } else {
      closeDropdown(contacts, img);
      showSelectedEditContacts();
    }
  });
}

/**
 * opens/closes contacts & shows/hides selected contacts
 * --> with click on child element
 * 
 * @param {*} event 
 */

function openCloseEditContacts(event) {
  event.stopPropagation();
  let container = document.getElementById('addTask-contacts-container-edit');
  let img = document.getElementById('dropdown-img-contacts-edit');
  if (container.classList.contains('d-none')) {
      openDropdown(container, img);
      hideSelectedEditContacts();
  } else {
      closeDropdown(container, img);
      showSelectedEditContacts();
  }
};

/**
 * adds and removes hover style when selecting contact in contact list
 * 
 * @param {number} i - position of contact in contacts array
 */
function selectEditContact(i) {
  let container = document.getElementById(`contact-edit-container${i}`);
  let contactName = contacts[i]['name'];
  let contactColor = contacts[i]['color'];
  let indexSelected = selectedEditContacts.findIndex(contact => contact.name === contactName);
  if (contacts[i]['selected'] === true) {
      selectedEditContacts.splice(indexSelected, 1);
      contacts.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': false });
      container.classList.remove('contact-container-edit-focus');
  } else {
      selectedEditContacts.push({ 'name': contactName, 'color': contactColor, 'selected': true });
      contacts.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
      container.classList.add('contact-container-edit-focus');
  }
}

/**
 * renders selected Contacts
 */
function showSelectedEditContacts() {
  let container = document.getElementById('user-content-edit-letter');
  container.classList.remove('d-none');
  container.innerHTML = '';
  for (let i = 0; i < selectedEditContacts.length; i++) {
      let contact = selectedEditContacts[i];
      let name = contact['name'];
      let initials = getInitials(name); // from contacts.js
      let color = selectedEditContacts[i]['color'];
      container.innerHTML += `
      <span style="background-color: ${color}" class="circleName">${initials}</span>
      `;
  }
}
/**
 * hides selected contacts
 */


function hideSelectedEditContacts() {
  let container = document.getElementById('selectedContacts-edit');
  container.classList.add('d-none');
}
/**
* searches for contacts
*/


function searchEditContacts() {
  let search = document.getElementById('addTask-edit-assigned').value.toLowerCase();
  editContactsSearch = [];
  if (search.length > 0) {
      for (let i = 0; i < contacts.length; i++) {
          findEditContacts(i, search);
      }
      showEditContactResults();
  } else {
      renderEditContacts();
  }
}

/**
 * push found contacts to editContactsSearch
 * 
 * @param {number} i - position of contact in contacts array
 * @param {*} search - value of search input
 */


function findEditContacts(i, search){
  let contactName = contacts[i]['name'];
  let contactSelected = contacts[i]['selected'];
  let contactColor = contacts[i]['color'];
  if (contactName.toLowerCase().includes(search)) {
      editContactsSearch.push({ 'name': contactName, 'color': contactColor, 'selected': contactSelected });
  }
}

/**
 * shows results of search
 */


function showEditContactResults() {
  let container = document.getElementById('addTask-contacts-container-edit');
  container.innerHTML = '';
  for (let i = 0; i < editContactsSearch.length; i++) {
      const contact = editContactsSearch[i];
      let name = contact['name'];
      let initials = getInitials(name); // from contacts.js
      let color = contact['color'];
      container.innerHTML += templateEditContactSearch(i, name, initials, color);
      if (contact['selected'] === true) {
          document.getElementById(`contact-edit-container${i}`).classList.add('contact-container-edit-focus');
      } else {
          document.getElementById(`contact-edit-container${i}`).classList.remove('contact-container-edit-focus');
      }
  }
}

/**
 * returns HTML of single contact while search
 * 
 * @param {number} i - position in contacts json
 * @param {string} name - name of contact
 * @param {string} initials - initials of contact
 * @returns 
 */


function templateEditContactSearch(i, name, initials, color) {
  return `
  <div id="contact-edit-container${i}" onclick="selectEditContactSearch(${i})" class="contact-container" tabindex="1">
      <div class="contact-container-name">
          <span style="background-color: ${color}" id="contactEditInitals${i}" class="circleName">${initials}</span>
          <span id="contactName${i}">${name}</span>
      </div>
      <div class="contact-container-check"></div>
  </div> 
`;
}


/**
 * adds and removes contact and hover style when selecting contact in search list
 * 
 * @param {number} i - position of contact in contactsSearch array
 */


function selectEditContactSearch(i) {
  let contactSelected = editContactsSearch[i]['selected'];
  if (contactSelected === true) {
      removeEditContactSearch(i);
  } else {
      addEditContactSearch(i);
  }
}

/**
 * adds contact and hover style when selecting contact in search list
 * 
 * @param {number} i - position of contact in contactsSearch array 
 */


function addEditContactSearch(i) {
  let container = document.getElementById(`contact-edit-container${i}`);
  let contactName = editContactsSearch[i]['name'];
  let contactColor = editContactsSearch[i]['color'];
  let index = contacts.findIndex(contact => contact.name === contactName);
  selectedEditContacts.push({ 'name': contactName,  'color': contactColor, 'selected': true });
  contacts.splice(index, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
  editContactsSearch.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
  container.classList.add('contact-container-edit-focus');
}

/**
 * removes contact and hover style when selecting contact in search list
 * 
 * @param {number} i - position of contact in contactsSearch array 
 */


function removeEditContactSearch(i) {
  let container = document.getElementById(`contact-edit-container${i}`);
  let contactName = editContactsSearch[i]['name'];
  let contactColor = editContactsSearch[i]['color'];
  let index = contacts.findIndex(contact => contact.name === contactName);
  let indexSelected = selectedEditContacts.findIndex(contact => contact.name === contactName);
  selectedEditContacts.splice(indexSelected, 1);
  contacts.splice(index, 1, { 'name': contactName, 'color': contactColor, 'selected': false });
  editContactsSearch.splice(i, 1, { 'name': contactName, 'color': contactColor, 'selected': true });
  container.classList.remove('contact-container-edit-focus');
}


 /**  ******Board******* */
/** To open the AddTask with addTask Button */


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
    prioIcon ='/img/PrioAltaWhite.svg';
    prioBtn ="/img/PrioAltaRed.svg";
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
    prioIcon = '/img/PrioMediaWhite.svg';
    prioBtn = '/img/PrioMediaOrange.svg';
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
    prioIcon = '/img/PrioBajaWhite.svg';
    prioBtn = '/img/PrioBajaGreen.svg';
    changeIconOfLow();
  });
}


function changeIconOfUrgent(){
  let urgent = document.getElementById('urgentImg');
  urgent.src = prioIcon;
  let medium = document.getElementById('mediumImg');
  medium.src = '/img/PrioMediaOrange.svg';
  let low = document.getElementById('lowImg');
  low.src = '/img/PrioBajaGreen.svg';
}


function changeIconOfMedium(){
  let medium = document.getElementById('mediumImg');
  medium.src = prioIcon;
  let urgent = document.getElementById('urgentImg');
  urgent.src = '/img/PrioAltaRed.svg';
  let low = document.getElementById('lowImg');
  low.src = '/img/PrioBajaGreen.svg';
}


function changeIconOfLow(){
  let low = document.getElementById('lowImg');
  low.src = prioIcon;
  let medium = document.getElementById('mediumImg');
  medium.src = '/img/PrioMediaOrange.svg';
  let urgent = document.getElementById('urgentImg');
  urgent.src = '/img/PrioAltaRed.svg';
}

/** to change the color of the Category tilte after add */


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


function changeColorOfCategoryTitleShow(taskIndex){
    let content = document.getElementById(`card-category-title-show${taskIndex}`);
    let category = tasks[taskIndex]["category"];
    if (category.includes("User Story")) {
      content.classList.add("blue");
    } else if (category.includes("Technical Task")){
      content.classList.add("green");
    }
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


function showTask(taskIndex) {
  let showContent = document.getElementById("showTask");
  showContent.classList.remove("hidden");
  let overlay = document.getElementsByClassName("overlay")[0];
  overlay.classList.remove("hidden");
  showContent.innerHTML = "";
  showContent.innerHTML += `
  <div class="category-show-content">
    <div id="card-category-title-show${taskIndex}">${tasks[taskIndex]["category"]}</div>
    <div class="closeImg" onclick="closeMe()"></div>
  </div>
  <div class="title-description-content">
    <div class="title-content-show"><h2 class="show-card-title">${tasks[taskIndex]["title"]}</h2></div>
    <p class="show-card-description">${tasks[taskIndex]["description"]}</p>
  </div>
  <div class="dueDate-content"><div class="dueDateText-content">Due date:</div>${convertDate(
    tasks[taskIndex]["date"])}</div>
  <div class="priority-content">
    <div class="prioText">Priority:</div>
    <div class="prio-icon-text-content">${tasks[taskIndex]["prio"]} <img src="${tasks[taskIndex]["prioIcon"]}" alt=""></div>
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
    <div class="show-delete-content" onclick="deleteTask(${taskIndex})">
      <i class="fa fa-trash-o" style="font-size:24px"></i>
      <button>Delete</button>
    </div>
    <div class="show-line-content"></div>
      <div class="show-edit-content" onclick="openEdit(${taskIndex})">
        <i class="fa fa-edit" style="font-size:24px"></i>
        <button>Edit</button>
      </div>
  </div> 
  `;
  changeColorOfCategoryTitleShow(taskIndex);
  contactsShowLetterRender(taskIndex);
  contactsShowNameRender(taskIndex);
  subtasksShowRender(taskIndex);
  let dialog = document.querySelector('.showTask');
  dialog.classList.remove('slide-in'); 
  setTimeout(() => {
      dialog.classList.add('slide-in');
  }, 50);
  heightOfShowTaskAdjust();
}

function heightOfShowTaskAdjust(){
  let showContent = document.getElementById('showTask');
  if(showContent.scrollHeight > 650){
    showContent.style.height = 'auto';
  }else{
    showContent.style.maxHeight = '650px';
  }
}


function subtasksShowRender(taskIndex){
  let content = document.getElementById('subtask-show');
  content.innerHTML ='';
  for(let subtaskIndex = 0;  subtaskIndex < tasks[taskIndex]['subtasks'].length; subtaskIndex++){
    content.innerHTML += `<div class="checkbox-show-content"><input type="checkbox" onclick="UpdateProgress(${taskIndex})" checked id="checkbox${subtaskIndex}">
    <label class="subtask-show-text">${tasks[taskIndex]['subtasks'][subtaskIndex]}</label></div>`;
  }
}


function UpdateProgress(taskIndex){
  let checkedCount = 0;
  for(let j = 0; j < tasks[taskIndex]["subtasks"].length; j++){
    let checkbox  = document.getElementById(`checkbox${j}`);
    if (checkbox.checked){
      checkedCount++;
    }
    let progress = document.getElementById(`progressBar${taskIndex}`);
    let numberOfSubtask = document.getElementsByClassName('numberOfSubtask')[taskIndex];
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


function contactsShowLetterRender(taskIndex){
    let content = document.getElementById('user-show-letter');
    for(let j = 0; j < tasks[taskIndex]['contacts'].length; j++){
      let letter = tasks[taskIndex]['contacts'][j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0);
      }
      content.innerHTML += `<div class="user-task-content-show" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
    }
}


function contactsShowNameRender(taskIndex){
  let content = document.getElementById('user-show-name');
  for(let j = 0; j < tasks[taskIndex]['contacts'].length; j++){
    content.innerHTML += `<div class="user-show-name">${tasks[taskIndex]['contacts'][j]['name']}</div>`;
  }
}

/** to edit the Task */


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
  renderEditContacts('addTask-contacts-container-edit');  //
  let content = document.getElementsByClassName(`input-edit-subtask`)[0];
  content.innerHTML =`      
  <input id="addTask-edit-subtasks${taskIndex}" class="inputfield" type="text"
  placeholder="Add new subtask" maxlength="26" autocomplete="off" onclick="openEditSubtaskIcons()"/>
  <div id="addTask-subtasks-edit-icons" class="subtasks-icon d-none">
    <img  src="/img/closeVectorBlack.svg" alt="Delete" onclick="closeEditSubtaskIcons()">
    <div class="parting-line subtasks-icon-line"></div>
    <img id="add-subtask-button" src="/img/done.svg" alt="confirm" onclick="addEditSubtasks(${taskIndex})">
  </div>
  <img src="/img/subtasks.svg" class="plus-icon-edit-subtasks" id="plus-edit-icon" onclick="openEditSubtaskIcons()"/>`;
}


function contactsEditRender(taskIndex){
  let content = document.getElementsByClassName('user-content-edit-letter')[0];
  content.innerHTML ='';
    for(let j = 0; j < tasks[taskIndex]['contacts'].length; j++){
      let letter = tasks[taskIndex]['contacts'][j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0);
      }
      content.innerHTML += `<div class="user-task-content" style="background-color:${tasks[taskIndex]['contacts'][j]['color']};">${result}</div>`;
    }
}


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
        <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="/img/delete.svg" alt="delete">
        <div class="parting-line subtasks-icon-line"></div>
        <img onclick="confirmEdit(${taskIndex}, ${j})" src="/img/done.svg" alt="confirm">
      </div>
    </div>

    <div id="subtasks-icon${j}" class="subtasks-icon subtasks-icon-hidden">
      <img onclick="editBoardSubtask(${j})" src="/img/edit.svg" alt="edit">
      <div class="parting-line subtasks-icon-line"></div>
      <img onclick="deleteEditBoardSubtask(${taskIndex}, ${j})" src="/img/delete.svg" alt="delete">
    </div>
  </div> `
    ;
  }
}

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


function editBoardSubtask(taskIndex){
  document.getElementById(`edit-input-board-content${taskIndex}`).classList.remove('hidden');
  document.getElementById(`checkbox-edit-content${taskIndex}`).classList.add('hidden');
  document.getElementById(`subtasks-icon${taskIndex}`).classList.add('hidden');
  let subtaskInput = document.getElementById(`editInputBoard${taskIndex}`).value;
  let labelOfSubtask = document.getElementById(`subtask-edit-text${taskIndex}`);
  labelOfSubtask.innerHTML = subtaskInput;
}


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


function openEditSubtaskIcons(){
  document.getElementById('addTask-subtasks-edit-icons').classList.remove('d-none');
  document.getElementById('plus-edit-icon').classList.add('d-none');
}


function closeEditSubtaskIcons(){
  document.getElementById('addTask-subtasks-edit-icons').classList.add('d-none');
  document.getElementById('plus-edit-icon').classList.remove('d-none');
}


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
            <img onclick="editBoardSubtask(${taskIndex})" src="/img/edit.svg" alt="Bearbeiten">
            <div class="parting-line subtasks-icon-line"></div>
            <img onclick="deleteEditBoardSubtask(${taskIndex})" src="/img/delete.svg" alt="Delete">
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


function activeButton(taskIndex){
  if (tasks[taskIndex]["prio"] === "Low") {
    document.getElementsByClassName("low-edit-button")[0].classList.add("active");
    prioIcon = '/img/PrioBajaWhite.svg';
    changeIconOfLow();
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");;
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else if (tasks[taskIndex]["prio"] === "Urgent") {
    document.getElementsByClassName("urgent-edit-button")[0].classList.add("active");
    prioIcon ='/img/PrioAltaWhite.svg';
    changeIconOfUrgent();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("medium-edit-button")[0].classList.remove("active");
  } else {
    document.getElementsByClassName("medium-edit-button")[0].classList.add("active");
    prioIcon = '/img/PrioMediaWhite.svg';
    changeIconOfMedium();
    document.getElementsByClassName("low-edit-button")[0].classList.remove("active");
    document.getElementsByClassName("urgent-edit-button")[0].classList.remove("active");
  }
}

/** to Save the Task after processing */


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

/**Drag and Drop  and Render  HTML*/

let currentDraggedElement;


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


function contactsRender(){
  for(let i = 0; i < tasks.length; i++){
    let maxConatcts = 3;
    let content = document.getElementById(`newDiv${i}`);
    for(let j = 0; j < Math.min(tasks[i]['contacts'].length, maxConatcts); j++){
      let letter = tasks[i]['contacts'][j]['name'].split(" ");
      let result = "";
      for(let name = 0; name < letter.length; name++){
        result += letter[name].charAt(0);
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
     <p class="card-subtasks-text"><span class="numberOfSubtask">${element["subtasks"].length}/2</span> Subtasks</p>
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