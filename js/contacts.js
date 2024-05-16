let nameInput = [];
let emailInput = [];
let phoneNumbersInput = [];
let colorIndex = 0;


const colors = [
    "#FF5733",
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

    document.getElementById('overlay').addEventListener('click', function(event) {
        if (event.target === this) {
            closeContactDialog();
        }
    });
    
}

function closeContactDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('dialogNewContactDiv').classList.add('d-none');

}

function HTMLTemplateNewContact(){
    return `    
<form onsubmit="createNewContact(); return false;">
    <div class="dialogNewContactInnerDiv">
        <div class="dialogLeft">
            <img class="joinLogoDialog" src="../img/Capa 2.png">
            <div class="dialogLeftInnerDiv">
                <h1 class="HeadlineDialog">Add contact</h1>
                <p class="subheadingDialog">Tasks are better with a team!</p>
            </div>
        </div>
        <div class="dialogRight">
            <div class="dialogCloseDiv">
                <img onclick="closeContactDialog()" class="closeIcon" src="../img/Close.png">
            </div>
            <div class="dialogProfilPictureDiv">
                <img class="dialogProfilPicture" src="../img/Group 13.png">
                <div class="dialogAddData">
                    <div class="dialogInputfield">
                        <div class="dialogInputfieldDiv">
                            <input id="inputName" placeholder="Name" required>
                            <img class="dialogIcons" src="../img/person.png">
                        </div>
                        <div class="dialogInputfieldDiv">
                            <input id="inputMail" type="email" placeholder="Email" pattern=".+@.+" required>
                            <img class="dialogIcons" src="../img/mail.png">
                        </div>
                        <div class="dialogInputfieldDiv">
                            <input id="inputPhone" type="number" placeholder="Phone" class="no-spinners" required>
                            <img class="dialogIcons" src="../img/call.png">
                        </div>
                    </div>
                    <div class="dialogButtonDiv">
                        <button onclick="closeContactDialog()" class="cancelButton">Cancel<img src="../img/close.png"></button>
                        <button onclick="createNewContact()" class="createContactButton">Create contact<img src="../img/check.png"></button>
                    </div>
                </div> 
            </div>
        </div>  
    </div>
</form>
    `;
}

async function createNewContact() {
    let name = document.getElementById('inputName').value;
    let mail = document.getElementById('inputMail').value;
    let phone = document.getElementById('inputPhone').value;

    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
    
    addNewContact(); 

    nameInput.push(name);
    emailInput.push(mail);
    phoneNumbersInput.push(phone);

    try {
        await createNewContactInFirebase(name, mail, phone);
    } catch (error) {
        console.error('Failed to create contact in Firebase:', error.message);
    }

    sortContactsByNameAndRender();
    closeContactDialog();
}


function editContact(index, nextColor){
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
        <form onsubmit="saveEditContact(${index}, '${nextColor}'); return false;">
            <div class="dialogNewContactInnerDiv">
                <div class="dialogLeft">
                    <img class="joinLogoDialog" src="../img/Capa 2.png">
                    <div class="dialogLeftInnerDiv">
                        <h1 class="HeadlineDialog">Edit contact</h1>
                    </div>
                </div>
                <div class="dialogRight">
                    <div class="dialogCloseDiv">
                        <img onclick="closeContactDialog()" class="closeIcon" src="../img/Close.png">
                    </div>
                    <div class="dialogProfilPictureDiv">
                        <div class="circleProfilPicShow" style="background-color: ${nextColor}">${initials}</div>
                        <div class="dialogAddData">
                            <div class="dialogInputfield">
                                <div class="dialogInputfieldDiv">
                                    <input id="inputName" value="${name}" required>
                                    <img class="dialogIcons" src="../img/person.png">
                                </div>
                                <div class="dialogInputfieldDiv">
                                    <input id="inputMail" value="${email}" type="email" pattern=".+@.+" required>
                                    <img class="dialogIcons" src="../img/mail.png">
                                </div>
                                <div class="dialogInputfieldDiv">
                                    <input id="inputPhone" value="${phone}" type="tel" class="no-spinners" required>
                                    <img class="dialogIcons" src="../img/call.png">
                                </div>
                            </div>
                            <div class="dialogButtonDiv">
                                <button onclick="closeContactDialog()" class="cancelButton">Cancel</button>
                                <button onclick="saveEditContact(${index}, '${nextColor}')" class="createContactButton">Save<img src="../img/check.png"></button>
                            </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </form>
    `;
}

function sortContactsByNameAndRender() {
    const maxLength = Math.max(nameInput.length, emailInput.length, phoneNumbersInput.length);
    while (nameInput.length < maxLength) {
        nameInput.push('');
    }
    while (emailInput.length < maxLength) {
        emailInput.push('');
    }
    while (phoneNumbersInput.length < maxLength) {
        phoneNumbersInput.push('');
    }

    const contacts = nameInput.map((name, index) => ({
        name,
        email: emailInput[index],
        phoneNumber: phoneNumbersInput[index]
    }));

    contacts.sort((a, b) => a.name.localeCompare(b.name));
    nameInput = contacts.map(contact => contact.name);
    emailInput = contacts.map(contact => contact.email);
    phoneNumbersInput = contacts.map(contact => contact.phoneNumber);

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    let currentInitial = '';
    nameInput.forEach((name, index) => {
        const email = emailInput[index];
        const phoneNumber = phoneNumbersInput[index];

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
        contactDiv.innerHTML = renderHTMLcreateNewContact(name, email, phoneNumber, index, getNextColor());
        contactList.appendChild(contactDiv);
    });
}



function getInitials(name) {
    if (!name || typeof name !== 'string') return ""; 
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}

function renderHTMLcreateNewContact(name, email, phoneNumber, index, nextColor){
    let initials = getInitials(name);

    return `
    <div onclick="showFullContact(${index}, '${nextColor}')" id="contactListInner${index}" class="contactListInner">
    <div class="contactListInnerDiv" onclick="changeBackgroundColor(this)">
    <div class="circleProfilPic" style="background-color: ${nextColor}">${initials}</div>
    <div class="nameAndEmail">
        <p id="nameProfil" class="nameProfil">${name}</p>
        <p class="emailAdress">${email}</p>
    </div>
    </div>
    </div>
    `;
    
}

function getNextColor(){
    colorIndex = (colorIndex + 1) % colors.length;
    return colors[colorIndex];
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

function showFullContact(index, nextColor) {
    let content = document.getElementById('contactsRightSectionShowProfil');
    let dialog = document.querySelector('.contactsRightSectionShowProfil');

    dialog.classList.remove('slide-in');
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 560);

    content.innerHTML = '';

    let name = nameInput[index];
    let email = emailInput[index];
    let phone = phoneNumbersInput[index];
    let initials = getInitials(name);

    content.innerHTML = `
        <div class="contactsRightSectionShowProfilInner">
        <div class="circleProfilPicShow" style="background-color: ${nextColor}">${initials}</div>
        <div class="proilNameAndEdit">
            <p class="nameProfilShow">${name}</p>
                <div class="proilNameAndEditInner">
                    <p onclick="editContact(${index}, '${nextColor}')" class="profilEdit">Edit
                    <img class="logoRightSection" src="../img/edit.svg"></p>
                    <p onclick="deleteContact('${index}')" class="profilDelete">Delete
                    <img class="logoRightSection" src="../img/delete.png"></p>
                    </div>
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
        </div>
        `;
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
}

function renderEditContact(index,nextColor) {
    let editedContactHTML = renderHTMLcreateNewContact(nameInput[index], emailInput[index], phoneNumbersInput[index], index, nextColor);
    let contactListItem = document.getElementById(`contactListInner${index}`);
    if (contactListItem) {
        contactListItem.innerHTML = editedContactHTML;
    } else {
        console.error(`Element with ID contactListInner${index} not found.`);
    }
}

function safeContact(){
    let ContactsNamesAsText = JSON.stringify(nameInput);
    localStorage.setItem('names', ContactsNamesAsText);

    let emailsAsText = JSON.stringify(emailInput);
    localStorage.setItem('mails', emailsAsText);

    let phoneNumbersAsText = JSON.stringify(phoneNumbersInput);
    localStorage.setItem('phoneNumbers', phoneNumbersAsText);

}

async function loadContacts(path = "/contacts") {
    nameInput = [];
    emailInput = [];
    phoneNumbersInput = [];

    const response = await fetch(BASE_URL + path + ".json");
    const contactsData = await response.json();

    if (!contactsData) {
        console.log("Keine Kontaktdaten gefunden.");
        return { names: [], emails: [], phoneNumbers: [] };
    }

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    let loadedContacts = 0;

    for (const key in contactsData) {
        if (loadedContacts >= 5) {
            break;
        }

        if (contactsData.hasOwnProperty(key)) {
            const contact = contactsData[key];
            if (contact) {
                const { name, email, nummer } = contact;
                const nextColor = getNextColor();
                const contactHTML = renderHTMLcreateNewContact(name, email, nummer, loadedContacts, nextColor);
                contactList.insertAdjacentHTML('beforeend', contactHTML);

                nameInput.push(name);
                emailInput.push(email);
                phoneNumbersInput.push(nummer);

                loadedContacts++;
            }
        }
    }

    if (nameInput.length > 0 && emailInput.length > 0 && phoneNumbersInput.length > 0) {
        sortContactsByNameAndRender(); 
    }
}