async function initSummary() {
    await includeHTML();
    summaryBg();
    updateGreeting();
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
