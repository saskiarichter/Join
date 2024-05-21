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
    onloadTasks();
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