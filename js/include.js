async function initInclude() {
    await includeHTML();
    await loadData();
    //displayUserInitials();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function toggleMenu() {
    let dropdownMenu = document.querySelector('.headerLogoutButton .dropdownMenu');
    dropdownMenu.classList.toggle('d-none');
}


function returnToHome() {
    window.location.href = "./../index.html";
}

function redirectToHelp() {
    window.location.href = "./../html/help.html";
}

function redirectToSummary() {
    window.location.href = "./../html/summary.html";
}

function redirectToAddTask() {
    window.location.href = "./../html/addTask.html";
}

function redirectToBoard() {
    window.location.href = "./../html/board.html";
}

function redirectToContact() {
    window.location.href = "./../html/contacts.html";
}

function redirectToLegalNotice() {
    window.location.href = "./../html/legalNotice.html";
}

function redirectToPrivacyPolice() {
    window.location.href = "./../html/privacyPolice.html";
}

function redirectToPrivacyPoliceSignup() {
    window.open("./../html/privacyPoliceSignup.html", "_blank");
}

function redirectToLegalNoticeSignup() {
    window.open("./../html/legalNoticeSignup.html", "_blank");
}


async function initHelp() {
    await includeHTML();
    await loadData();
    displayUserInitials();
}