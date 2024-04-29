async function init(){
    await includeHTML();
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

function addNewContact() {
    document.getElementById('overlay').style.display = 'block'; // Overlay anzeigen
    document.getElementById('dialogNewContactDiv').classList.remove('d-none');
    document.getElementById('dialogNewContactDiv').innerHTML = HTMLTemplateNewContact();
}

function closeNewContact() {
    document.getElementById('overlay').style.display = 'none'; // Overlay ausblenden
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

function HTMLTemplateNewContact(){
    return `    
    <div class=dialogNewContactInnerDiv>
    <div class="dialogLeft">
        <img class="joinLogoDialog" src="./img/Capa 2.png">
        <div class="dialogLeftInnerDiv">
            <h1 class="HeadlineDialog">Add contact</h1>
            <p class="subheadingDialog">Tasks are better with a team!<p>
        </div>
    </div>
    <div class="dialogRight">
    <div class="dialogCloseDiv">
        <img onclick="closeNewContact()" class="closeIcon" src="./img/Close.png">
    </div>
    <div class="dialogProfilPictureDiv">
        <img class="dialogProfilPicture" src="./img/Group 13.png">
        <div class="dialogAddData">
            <div class="dialogInputfield">
                <div class="dialogInputfieldDiv">
                <input placeholder="Name">
                <img class="dialogIcons" src="./img/person.png">
            </div>
            <div class="dialogInputfieldDiv">
                <input type="email" placeholder="Email" pattern=".+@.+" required>
                <img class="dialogIcons" src="./img/mail.png">
            </div>
            <div class="dialogInputfieldDiv">
                <input type="number" placeholder="Phone" class="no-spinners">
                <img class="dialogIcons" src="./img/call.png">
            </div>
        </div>
        <div class="dialogButtonDiv">
            <button onclick="closeNewContact()" class="cancelButton">Cancel</button>
            <button class="createContactButton">Create contact<img src="./img/check.png"></button>
        </div>
    </div> 
    </div>  
    </div>`;
}

