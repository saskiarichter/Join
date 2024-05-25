async function init(){
    await initInclude();
    await loadContacts();
    contactsBgMenu();
    displayUserInitials();
}

let nameInput = [];
let emailInput = [];
let phoneNumbersInput = [];
let contactIds = [];
let colorIndex = 0;

const colors = [
    "#3380FF",
    "#1d6331",
    "#FFEA33",
    "#FF5733",
    "#7A33FF",
    "#FF33C1",
    "#33E6FF",
    "#FF33A2",
    "#33FFF1"
  ];
  

function addNewContact() {
    document.getElementById('overlay').style.display = 'block'; 
    document.getElementById('dialogNewContactDiv').classList.remove('d-none');
    document.getElementById('dialogNewContactDiv').innerHTML = HTMLTemplateNewContact();

    let dialog = document.querySelector('.dialogNewContactDiv');
    dialog.classList.remove('slide-in'); 
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 50); 
}

/**
 * HTML template for adding a new contact.
 */
function HTMLTemplateNewContact() {
    return `    
<form onsubmit="createNewContact(); return false;">
    <div class="dialogNewContactInnerDiv">
        <div class="dialogLeft">
        <img onclick="closeContactDialog()" class="closeResponsiveButton" src="./img/closeResponsive.png"
            <img class="joinLogoDialog" src="./img/Capa 2.png">
            <div class="dialogLeftInnerDiv">
                <h1 class="HeadlineDialog">Add contact</h1>
                <p class="subheadingDialog">Tasks are better with a team!</p>
                <div class="dialogLine"></div>
            </div>
        </div>
        <div class="dialogRight">
            <div class="dialogCloseDiv">
                <img onclick="closeContactDialog()" class="closeIcon" src="./img/Close.png">
            </div>
            <div class="dialogProfilPictureDiv">
                <img class="dialogProfilPicture" src="./img/Group 13.png">
                <div class="dialogAddData">
                    <div class="dialogInputfield">
                        <div class="dialogInputfieldDiv">
                            <input id="inputName" placeholder="Name" required>
                            <img class="dialogIcons" src="./img/person.png">
                        </div>
                        <div class="dialogInputfieldDiv">
                            <input id="inputMail" type="email" placeholder="Email" pattern=".+@.+" required>
                            <img class="dialogIcons" src="./img/mail.png">
                        </div>
                        <div class="dialogInputfieldDiv">
                            <input id="inputPhone" type="number" placeholder="Phone" class="no-spinners" required>
                            <img class="dialogIcons" src="./img/call.png">
                        </div>
                    </div> 
                    <div class="dialogButtonDiv">
                        <button type="button" onclick="closeContactDialog()" class="cancelButton">Cancel<img src="./img/close.png"></button>
                        <button type="submit" class="createContactButton">Create contact<img src="./img/check.png"></button>
                    </div>
                </div> 
            </div>
        </div>  
    </div>
</form>
    `;
}

async function createNewContact(){
    let name = document.getElementById('inputName').value;
    let mail = document.getElementById('inputMail').value;
    let phone = document.getElementById('inputPhone').value;
    const nextColor = getNextColor(); // Verwende die Funktion, um die nächste Farbe zu erhalten

    document.getElementById('inputName').value = '';
    document.getElementById('inputMail').value = '';
    document.getElementById('inputPhone').value = '';

    nameInput.push(name);
    emailInput.push(mail);
    phoneNumbersInput.push(phone);

    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
    const newContactId = await createNewContactInFirebase(name, mail, phone, nextColor); 
    contactIds.push(newContactId);
    sortContactsByNameAndRender();
}

function sortContactsByNameAndRender() {
    nameInput.sort((a, b) => a.localeCompare(b));
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    let currentInitial = '';
    nameInput.forEach((name, index) => {
        const initial = name.charAt(0).toUpperCase();
        if (initial !== currentInitial) {
            const letterDiv = document.createElement('div');
            letterDiv.classList.add('letter');
            letterDiv.textContent = initial;
            contactList.appendChild(letterDiv);

            const lineDiv = document.createElement('div');
            lineDiv.classList.add('lineLeftSection');
            contactList.appendChild(lineDiv);

            currentInitial = initial;
        }

        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contactListInner');
        contactDiv.innerHTML = renderHTMLLeftContactSide(name, emailInput[index], phoneNumbersInput[index], index, colors[index % colors.length]);
        contactList.appendChild(contactDiv);
    });
}


function closeContactDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

function renderHTMLLeftContactSide(name, email, phoneNumber, index, nextColor){
    let initials = getInitials(name);

    return `
    <div onclick="showFullContact(${index}, '${nextColor}')" id="contactListInner${index}" class="contactListInner">
    <div class="contactListInnerDiv" id="contactListInnerDiv${index}" onclick="changeBackgroundColor(this)">
    <div class="circleProfilPic" style="background-color: ${nextColor}">${initials}</div>
    <div class="nameAndEmail">
        <p id="nameProfil${index}" class="nameProfil">${name}</p>
        <p class="emailAdress">${email}</p>
    </div>
    </div>
    `;
}

function changeBackgroundColor(clickedElement) {
    const previouslyClickedElement = document.querySelector('.contactListInnerDiv.clicked');

    if (previouslyClickedElement) {
        previouslyClickedElement.classList.remove('clicked');
        previouslyClickedElement.querySelector('.nameProfil').classList.remove('color-white');
    }

    clickedElement.classList.add('clicked');
    clickedElement.querySelector('.nameProfil').classList.add('color-white');
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');

}

function getNextColor() {
    colorIndex = colorIndex % colors.length;  // Ensure the index wraps around correctly
    const color = colors[colorIndex];  // Get the current color
    colorIndex++;  // Increment the index
    return color;  // Return the color
}

function showFullContact(index, nextColor, id){
    let content = document.getElementById('contactsRightSectionShowProfil');
    content.innerHTML = '';
        let name = nameInput[index];
        let email = emailInput[index];
        let phone = phoneNumbersInput[index];
        let initials = getInitials(name);
        let dialog = document.getElementById('contactsRightSectionShowProfil');
    
        dialog.classList.remove('slide-in');
        setTimeout(() => {
            dialog.classList.add('slide-in');
        }, 150);
        content.innerHTML = `
        <div id="contactsRightSectionShowProfilInner" class="contactsRightSectionShowProfilInner">
            <div class="circleProfilPicShow" style="background-color: ${nextColor}">${initials}</div>
            <div class="proilNameAndEdit">
                <p class="nameProfilShow">${name}</p>
                <div class="proilNameAndEditInner">
                    <p onclick="editContact('${index}', '${nextColor}')" class="profilEdit">Edit
                        <img class="logoRightSection" src="./img/edit.svg">
                    </p>
                    <p onclick="deleteContact('${index}')" class="profilDelete">Delete
                        <img class="logoRightSection" src="./img/delete.png">
                    </p>
                </div>
            </div>
            <div class="contactInformation">
                <p>Contact Information</p>
            </div>
            <div class="contactInformationEmailAndPhone">
                <div>
                    <p class="contactInformationlHeadlineMailAndPhone">Email</p>
                    <p class="contactInformationMail">${email}</p>
                </div>
                <div>
                    <p class="contactInformationlHeadlineMailAndPhone">Phone</p>
                    <p class="contactInformationPhone">${phone}</p>
                </div>
            </div>
            <div class="editAndDeleteResponsiveDivOutside">
                <div class="editAndDeleteResponsive">
                    <img src="/img/more_vert.png" onclick="togglePopup()">
                    <div id="popup" class="popup">
                        <p onclick="editContact('${index}', '${nextColor}')" class="profilEdit"><img class="logoRightSection" src="./img/edit.svg">Edit</p>
                        <p onclick="deleteContact('${index}', '${id}')" class="profilDelete"><img class="logoRightSection" src="./img/delete.png">Delete</p>
                    </div>
                </div>
            </div>
        </div>
    `;
} 

function editContact(index, nextColor) {
    document.getElementById('overlay').style.display = 'block'; 
    document.getElementById('dialogNewContactDiv').classList.remove('d-none');
    document.getElementById('dialogNewContactDiv').innerHTML = HTMLTemplateEditContact(index, nextColor); 

    let dialog = document.querySelector('.dialogNewContactDiv');
    dialog.classList.remove('slide-in'); 
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 50); 

    document.getElementById('overlay').addEventListener('click', function(event) {
        if (event.target === this) {
            closeContactDialog();
        }
    });
}

function HTMLTemplateEditContact(index, nextColor){
    let name = nameInput[index];
    let email = emailInput[index];
    let phone = phoneNumbersInput[index];
    let initials = getInitials(name);
    
    return `    
        <div class="dialogNewContactInnerDiv">
            <div class="dialogLeft">
                <img class="joinLogoDialog" src="./img/Capa 2.png">
                <div class="dialogLeftInnerDiv">
                    <h1 class="HeadlineDialog">Edit contact</h1>
                </div>
            </div>
            <div class="dialogRight">
                <div class="dialogCloseDiv">
                    <img onclick="closeContactDialog()" class="closeIcon" src="./img/Close.png">
                </div>
                <div class="dialogProfilPictureDiv">
                    <div class="circleProfilPicShow" style="background-color: ${nextColor}">${initials}</div>
                    <div class="dialogAddData">
                        <div class="dialogInputfield">
                            <div class="dialogInputfieldDiv">
                                <input id="inputName" value="${name}">
                                <img class="dialogIcons" src="./img/person.png">
                            </div>
                            <div class="dialogInputfieldDiv">
                                <input id="inputMail" value="${email}" type="email" pattern=".+@.+" required>
                                <img class="dialogIcons" src="./img/mail.png">
                            </div>
                            <div class="dialogInputfieldDiv">
                                <input id="inputPhone" value="${phone}" type="number" class="no-spinners">
                                <img class="dialogIcons" src="./img/call.png">
                            </div>
                        </div>
                        <div class="dialogButtonDiv">
                            <button onclick="closeContactDialog()" class="cancelButton">Cancel</button>
                            <button onclick="saveEditContact(${index}, '${nextColor}')" class="createContactButton">Save<img src="./img/check.png"></button>
                        </div>
                    </div> 
                </div>
            </div>  
        </div>
    `;
}

function renderEditContact(index,nextColor) {
    let editedContactHTML = renderHTMLLeftContactSide(nameInput[index], emailInput[index], phoneNumbersInput[index], index, nextColor);
    let contactListItem = document.getElementById(`contactListInner${index}`);
    if (contactListItem) {
        contactListItem.innerHTML = editedContactHTML;
    } else {
        console.error(`Element with ID contactListInner${index} not found.`);
    }
}

function saveEditContact(index,nextColor) {
    let changedName = document.getElementById('inputName').value;
    let changedMail = document.getElementById('inputMail').value;
    let changedPhone = document.getElementById('inputPhone').value;

    nameInput[index] = changedName;
    emailInput[index] = changedMail;
    phoneNumbersInput[index] = changedPhone;

    closeContactDialog();
    showFullContact(index,nextColor);
    renderEditContact(index,nextColor);
    updateContactInFirebase();
}

async function deleteContact(index) {
    const contactId = contactIds[index]; // ID des zu löschenden Kontakts

    // Lösche den spezifischen Kontakt in Firebase
    await deleteContactBackend(`/contacts/${contactId}`);

    // Entferne den Kontakt aus den lokalen Arrays
    nameInput.splice(index, 1);
    emailInput.splice(index, 1);
    phoneNumbersInput.splice(index, 1);
    contactIds.splice(index, 1);
    let dialog = document.getElementById('contactsRightSectionShowProfil');
    dialog.classList.remove('slide-in');

    // Lade alle verbleibenden Kontakte
    const contactsData = await fetchContactsData("/contacts");

    // Überprüfen, ob contactsData gültig ist
    if (!contactsData) {
        console.error("No contact data found.");
        return;
    }

    // Neu ordnen und die Kontaktliste erstellen
    const contacts = [];
    let i = 0;
    for (let key in contactsData) {
        if (contactsData.hasOwnProperty(key)) {
            const contact = contactsData[key];
            if (contact && contact.name !== undefined && contact.email !== undefined && contact.nummer !== undefined && contact.color !== undefined) {
                contacts.push({
                    color: contact.color,
                    email: contact.email,
                    name: contact.name,
                    nummer: contact.nummer
                });
                i++;
            }
        }
    }

    // Lösche alle Kontakte in Firebase
    await deleteContactBackend("/contacts");

    // Aktualisiere Firebase mit den neu nummerierten Kontakten
    for (let i = 0; i < contacts.length; i++) {
        await createNewContactInFirebase(contacts[i].name, contacts[i].email, contacts[i].nummer, contacts[i].color, i);
    }

    // Lade die aktualisierten Kontakte in die lokale Ansicht
    await loadContacts();
}


function resetInputs() {
    nameInput = [];
    emailInput = [];
    phoneNumbersInput = [];
    contactIds = [];
}

function goBackResponsive() {
    const element = document.getElementById('contactsRightSideMainDivId');
    if (element) {
        element.classList.remove('slide-in');
    } else {
        console.error('Element with ID contactsRightSideMainDiv not found.');
    }
}

async function fetchContactsData(path) {
    const response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

function processContacts(contactsData, contactList) {
    let loadedContacts = 0;

    for (const key in contactsData) {
        if (loadedContacts >= 10) {
            break;
        }

        if (contactsData.hasOwnProperty(key)) {
            processContact(contactsData[key], contactList, key);
            loadedContacts++;
        }
    }

    if (nameInput.length > 0 && emailInput.length > 0 && phoneNumbersInput.length > 0) {
        sortContactsByNameAndRender();
    }
}

/**
 * Processes a single contact and renders it into the contact list.
 * Extracts name, email, and number from the contact data, generates HTML, and updates the input arrays.
 */

function processContact(contact, contactList, id) {
    if (contact) {
        const { name, email, nummer, color } = contact; 
        const contactHTML = renderHTMLLeftContactSide(name, email, nummer, id, color);
        contactList.insertAdjacentHTML('beforeend', contactHTML);

        nameInput.push(name);
        emailInput.push(email);
        phoneNumbersInput.push(nummer);
        contactIds.push(id);
    }
}

function contactsBgMenu() {
    document.getElementById('contacts').classList.add("bgfocus");
}

function displayUserInitials() {
    let username = sessionStorage.getItem('loggedInUser');
    let userInitials = document.getElementById('userInitials');

    if (username) {
        let initials = username.charAt(0).toUpperCase();
        userInitials.innerText = initials;
    } else {
        userInitials.innerText = "G";
    }
}