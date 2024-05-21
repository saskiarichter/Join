/**
 * @file summary.js is the JavaScript file for the summary.html page.
 *
 */
async function initSummary() {
    await includeHTML();
    await loadDataLogin();
    summaryBg();
    updateGreeting();
    displayUsername();
    displayUserInitials();
    showContent();
    handleGreetingMobile();
    //onloadTasks();
    await getTasksAndProcess();
}


/**
 * highlight the summary link in the sidebar
 */
function summaryBg() {
    document.getElementById('summary').classList.add("bgfocus");
}

/**
 * Determines the appropriate greeting based on the current time of day.
 * @returns {string} The greeting message according to the time of day.
 */
function updateGreeting() {
    let currentTime = new Date();
    let currentHour = currentTime.getHours();

    if (currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    document.getElementById("daytimeGreeting").innerText = greeting;
    document.getElementById("daytimeGreetingMobile").innerText = greeting
    }

/**
 * get the Username from the session storage and display it in the welcome message
 */
function displayUsername() {
    // Den Benutzernamen aus der Session abrufen
    let username = sessionStorage.getItem('loggedInUser');
    let greetingName = document.getElementById('nameGreeting');
    let greetingNameMobile = document.getElementById('nameGreetingMobile');

        
    // Setze den Benutzernamen in das HTML-Element ein
    greetingName.innerText = username;
    greetingNameMobile.innerText = username;
}

/**
 * show initials from username
 */
function displayUserInitials() {
    // Den Benutzernamen aus der Session abrufen
    let username = sessionStorage.getItem('loggedInUser');
    let userInitials = document.getElementById('userInitials');

    if (username) {
        // Den Anfangsbuchstaben des Benutzernamens extrahieren
        let initials = username.charAt(0).toUpperCase();
        userInitials.innerText = initials;
    } else {
        // Falls kein Benutzer angemeldet ist, zeigen Sie ein Standardzeichen an
        userInitials.innerText = "G";
    }
}

/**
 * this function shows the main content after 1500 ms
 */
function showContent() {
    setTimeout(function() {
        const content = document.getElementById('content');
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
    }, 1500);
}

/**
 * this function hides the greeting after 1500 ms in the responsive view
 */
function handleGreetingMobile() {
    if (window.innerWidth <= 850) {
        setTimeout(function() {
            document.getElementById('greeting-mobile').style.display = 'none';
        }, 1500);
    } else {
        document.getElementById('greeting-mobile').style.display = 'none';
    }
}

/**
 * allocate the tasks to the respective categories
 */
let todo = 0;
let inProgress = 0;
let awaitFeedback = 0;
let done = 0;
let taskInBoard = 0;
let urgendTask = 0;
let dates = [];

async function getTasksAndProcess() {
    await getTask();
    countTasks();
    getUrgendTask(tasks);
    dates.push(tasks);
    taskInBoard = todo + inProgress + awaitFeedback + done;
    allocateTasks();
    const earliestDate = getEarliestDate(tasks);
    allocateEarliestDate(earliestDate);
}

/**
 * get the tasks from firebase
 */

async function getTask() {
    try {
        let response = await fetch(BASE_URL + "tasks.json");
        let tasksData = await response.json();

        if (tasksData) {
            tasks = Object.keys(tasksData).map(key => tasksData[key]);
        } else {
            tasks = [];
        }
    } catch (error) {
        console.error('Error loading tasks:', error.message);
        tasks = [];
    }
}

/**
 * allocate the earliest date of the urgent task
 */

function allocateEarliestDate(earliestDate) {
    if (earliestDate) {
        const options = {year: "numeric", month: "long", day: "numeric"};
        document.getElementById("summaryUrgentTaskNextDate").innerHTML =
            earliestDate.toLocaleDateString("en-US", options);
        document.getElementById("summaryUrgentTaskInfo").innerHTML =
            "Upcoming Deadline";
    } else {
        document.getElementById("summaryUrgentTaskNextDate").innerHTML =
            "No urgent deadlines";
        document.getElementById("summaryUrgentTaskInfo").innerHTML =
            "Upcoming Deadline";
    }
}

/**
 * allocate the tasks to the respective categories
 */
function allocateTasks() {
    document.getElementById("summaryTodoInfoCounter").innerHTML = todo;
    document.getElementById("summaryDoneInfoCounter").innerHTML = done;
    document.getElementById("tasksInBoardNum").innerHTML = taskInBoard;
    document.getElementById("taskInProgressNum").innerHTML = inProgress;
    document.getElementById("awaitingFeedbackNum").innerHTML = awaitFeedback;
}

/**
 * count the tasks in the respective categories
 */
function countTasks() {
    for (i = 0; i < tasks.length; i++) {
        const cat = tasks[i];
        let phase = cat["phases"];
        if (phase == "To Do") {
            todo++;
        } else if (phase == "In progress") {
            inProgress++;
        } else if (phase == "Await feedback") {
            awaitFeedback++;
        } else if (phase == "Done") {
            done++;
        }
    }
}

/**
 * count the urgent tasks from the task array
 */
function getUrgendTask(tasks) {
    const taskCount = tasks.filter((t) => t.prio === "Urgent");
    document.getElementById("summaryUrgentTaskCount").innerHTML =
        taskCount.length;
}

/**
 * check valid date and return the earliest date of the urgent tasks
 */
function getEarliestDate(tasks) {
    const urgentTasks = tasks.filter((t) => t.prio === "Urgent");
    if (urgentTasks.length > 0) {
        const earliestDate = new Date(
            Math.min(
                ...urgentTasks.map((t) => {
                    const taskDate = new Date(t.date);
                    if (
                        Object.prototype.toString.call(taskDate) ===
                            "[object Date]" &&
                        !isNaN(taskDate)
                    ) {
                        return taskDate;
                    } else {
                        console.error("Ungültiges Datum gefunden:", t.date);
                        return NaN;
                    }
                })
            )
        );
        return earliestDate;
    }
    return null;
}