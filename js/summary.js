/**
 * @file summary.js is the JavaScript file for the summary.html page.
 *
 */
async function initSummary() {
    await includeHTML();
    await loadData();
    summaryBg();
    updateGreeting();
    displayUsername();
    displayUserInitials();
    
    setTimeout(function() {
        document.getElementById('content').style.display = 'flex';
        document.getElementById('content').style.flexDirection = 'column';
    }, 2000);

    if (window.innerWidth <= 850) {
        setTimeout(function() {
            document.getElementById('greeting-mobile').style.display = 'none';
        }, 2000);
    } else {
        document.getElementById('greeting-mobile').style.display = 'none';
    }
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


function hideContentForTwoSeconds() {
    document.getElementById('content').style.display = 'none';
    setTimeout(function() {
        document.getElementById('content').style.display = 'block';
    }, 2000);
}
