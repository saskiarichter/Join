async function initSummary() {
    await includeHTML();
    summaryBg();
    updateGreeting();
    displayUsername();
    displayUserInitials();
    await loadData();
}


function summaryBg() {
    document.getElementById('summary').classList.add("bgfocus");
}


// Funktion zur Bestimmung der Tageszeit und Aktualisierung der Begrüßung
function updateGreeting() {
    let currentTime = new Date();
    let currentHour = currentTime.getHours();

    if (currentHour < 12) {
        greeting = "Good morning,";
    } else if (currentHour < 18) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }

    document.getElementById("daytimeGreeting").innerText = greeting;
    }


function displayUsername() {
    // Den Benutzernamen aus der Session abrufen
    let username = sessionStorage.getItem('loggedInUser');
    let greetingName = document.getElementById('nameGreeting');
        
    // Setze den Benutzernamen in das HTML-Element ein
    greetingName.innerText = username || "Guest";
}


// Funktion, um den Benutzernamen auf der Seite anzuzeigen
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