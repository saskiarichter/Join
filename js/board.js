function init(){
  initInclude();
}

function openAddTask(){
  let content =  document.getElementById('addTask');
  content.classList.remove('hidden');
  let overlay = document.getElementsByClassName('overlay')[0];
  overlay.classList.remove('hidden');
}

function closeMe(){
   let content =  document.getElementById('addTask');
   content.classList.add('hidden');
   let overlay = document.getElementsByClassName('overlay')[0];
   overlay.classList.add('hidden');
}