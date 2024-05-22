/**
 * Stores contact names.
 */
let nameInput = [];

/**
 * Stores contact emails.
 */
let emailInput = [];

/**
 * Stores contact phone numbers.
 */
let phoneNumbersInput = [];

/**
 * Index for cycling through the color array.
 */
let colorIndex = 0;
let contactIds = [];

/**
 * Array of colors for contact profile pictures.
 */
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

/**
 * Opens the dialog to add a new contact.
 */
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

/**
 * Closes the dialog for adding or editing a contact.
 */
function closeContactDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

/**
 * HTML template for adding a new contact.
 */
function HTMLTemplateNewContact() {
    return `    
<form onsubmit="createNewContact(); return false;">
    <div class="dialogNewContactInnerDiv">
        <div class="dialogLeft">
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

/**
 * Creates a new contact and adds it to the list.
 * Also attempts to save the contact to Firebase.
 */
/**
 * Creates a new contact and adds it to the list.
 * Also attempts to save the contact to Firebase.
 */
async function createNewContact() {
    let name = document.getElementById('inputName').value;
    let mail = document.getElementById('inputMail').value;
    let phone = document.getElementById('inputPhone').value;

    try {
        const newContactId = await createNewContactInFirebase(name, mail, phone); // Get the ID from Firebase

        nameInput.push(name);
        emailInput.push(mail);
        phoneNumbersInput.push(phone);
        contactIds.push(newContactId.toString()); 

        sortContactsByNameAndRender();

        const nextColor = getNextColor();
        showFullContact(newContactId.toString(), nextColor);

        setTimeout(() => {
            location.reload();
        }, 10); 
    } catch (error) {
        console.error('Failed to create contact in Firebase:', error.message);
    } finally {
        closeContactDialog();
    }
}


/**
 * Opens the dialog to edit an existing contact.
 */
/**
 * Opens the dialog to edit an existing contact.
 */
function editContact(id, nextColor) {
    console.log('Edit Contact ID:', id);
    console.log('Next Color:', nextColor);

    const index = contactIds.indexOf(id);
    if (index === -1) {
        console.error('Contact ID not found:', id);
        return;
    }

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


/**
 * HTML template for editing a contact.
 */
function HTMLTemplateEditContact(index, nextColor, newContactId) {
    let name = nameInput[index];
    let email = emailInput[index];
    let phone = phoneNumbersInput[index];
    let initials = getInitials(name);

    return `    
        <form onsubmit="saveEditContact(${index}, '${nextColor}'); return false;">
            <div class="dialogNewContactInnerDiv">
                <div class="dialogLeft">
                    <img class="joinLogoDialog" src="./img/Capa 2.png">
                    <div class="dialogLeftInnerDiv">
                        <h1 class="HeadlineDialog">Edit contact</h1>
                        <div class="dialogLine"></div>
                    </div>
                </div>
                <div class="dialogRight">
                    <div class="dialogCloseDiv">
                        <img onclick="closeContactDialog()" class="closeIcon" src="./img/Close.png">
                    </div>
                    <div class="dialogProfilPictureDiv">
                        <div class="circleProfilPicShowEdit" style="background-color: ${nextColor}">${initials}</div>
                        <div class="dialogAddData">
                            <div class="dialogInputfield">
                                <div class="dialogInputfieldDiv">
                                    <input id="inputName" value="${name}" required>
                                    <img class="dialogIcons" src="./img/person.png">
                                </div>
                                <div class="dialogInputfieldDiv">
                                    <input id="inputMail" value="${email}" type="email" pattern=".+@.+" required>
                                    <img class="dialogIcons" src="./img/mail.png">
                                </div>
                                <div class="dialogInputfieldDiv">
                                    <input id="inputPhone" value="${phone}" type="tel" class="no-spinners" required>
                                    <img class="dialogIcons" src="./img/call.png">
                                </div>
                            </div>
                            <div class="dialogButtonDiv">
                                <button type="button" onclick="closeContactDialog()" class="cancelButtonEdit">Cancel</button>
                                <button type="submit" class="createContactButton">Save<img src="./img/check.png"></button>
                            </div>
                        </div> 
                    </div>
                </div>  
            </div>
        </form>
    `;
}

/**
 * Saves the edited contact information.
 */
async function saveEditContact(index, nextColor) {
    let changedName = document.getElementById('inputName').value;
    let changedMail = document.getElementById('inputMail').value;
    let changedPhone = document.getElementById('inputPhone').value;

    const id = contactIds[index];

    nameInput[index] = changedName;
    emailInput[index] = changedMail;
    phoneNumbersInput[index] = changedPhone;

    await updateContactInFirebase(id, changedName, changedMail, changedPhone);

    closeContactDialog();
    showFullContact(id, nextColor);
    renderEditContact(index, nextColor);
}

/**
 * Sorts contacts by name and renders them into the contact list.
 * Ensures all input arrays have the same length by padding with empty strings.
 */
function sortContactsByNameAndRender() {
    padInputArrays();
    const contacts = createContactsArray();
    sortContacts(contacts);
    updateInputArrays(contacts);
    renderSortedContacts();
}

/**
 * Pads nameInput, emailInput, and phoneNumbersInput arrays to have the same length.
 */
function padInputArrays() {
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
}

/**
 * Creates an array of contact objects from the input arrays.
 * Each contact object contains name, email, phoneNumber, and id properties.
 * @returns {Array<Object>} An array of contact objects.
 */
function createContactsArray() {
    return nameInput.map((name, index) => ({
        name,
        email: emailInput[index],
        phoneNumber: phoneNumbersInput[index],
        id: contactIds[index]
    }));
}

/**
 * Sorts an array of contact objects by the name property.
 */
function sortContacts(contacts) {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Updates input arrays with sorted contact data.
 */
function updateInputArrays(contacts) {
    nameInput = contacts.map(contact => contact.name);
    emailInput = contacts.map(contact => contact.email);
    phoneNumbersInput = contacts.map(contact => contact.phoneNumber);
    contactIds = contacts.map(contact => contact.id);
}

/**
 * Renders sorted contacts into the contact list.
 * Displays contacts grouped by the initial letter of their names.
 */
function renderSortedContacts() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    let currentInitial = '';
    nameInput.forEach((name, index) => {
        const email = emailInput[index];
        const phoneNumber = phoneNumbersInput[index];

        const initial = name.charAt(0).toUpperCase();
        if (initial !== currentInitial) {
            renderInitialHeader(contactList, initial);
            currentInitial = initial;
        }

        renderContact(contactList, name, email, phoneNumber, contactIds[index]); 
    });
}

/**
 * Renders the initial letter header in the contact list.
 */
function renderInitialHeader(contactList, initial) {
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('letter');
    letterDiv.textContent = initial;
    contactList.appendChild(letterDiv);

    const lineDiv = document.createElement('div');
    lineDiv.classList.add('lineLeftSection');
    contactList.appendChild(lineDiv);
}

/**
 * Renders a single contact into the contact list.
 */
function renderContact(contactList, name, email, phoneNumber, id) {
    const contactDiv = document.createElement('div');
    const nextColor = getNextColor(); // Holen Sie die nächste Farbe
    contactDiv.classList.add('contactListInner');
    contactDiv.innerHTML = renderHTMLcreateNewContact(name, email, phoneNumber, id, nextColor);
    contactList.appendChild(contactDiv);

    contactDiv.addEventListener('click', function () {
        showFullContact(id, nextColor);
    });
}

/**
 * Returns the initials from a given name.
 */
function getInitials(name) {
    if (!name || typeof name !== 'string') return ""; 
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}

/**
 * Renders the HTML for a new contact.
 */
function renderHTMLcreateNewContact(name, email, phoneNumber, id, nextColor) {
    let initials = getInitials(name);

    return `
    <div onclick="showFullContact('${id}', '${nextColor}')" id="contactListInner${id}" class="contactListInner">
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

/**
 * Returns the next color from the color array.
 */
function getNextColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    return colors[colorIndex];
}

/**
 * Changes the background color of the clicked contact.
 */
function changeBackgroundColor(clickedElement) {
    const previouslyClickedElement = document.querySelector('.contactListInnerDiv.clicked');

    if (previouslyClickedElement) {
        previouslyClickedElement.classList.remove('clicked');
        previouslyClickedElement.querySelector('.nameProfil').classList.remove('color-white');
    }

    clickedElement.classList.add('clicked');
    clickedElement.querySelector('.nameProfil').classList.add('color-white');
}

/**
 * Displays the full contact information in the right section.
 */
function showFullContact(id, nextColor) {
    const index = contactIds.indexOf(id);
    if (index === -1) {
        console.error('Contact ID not found:', id);
        return;
    }

    let content = document.getElementById('contactsRightSectionShowProfil');
    let dialog = document.querySelector('.contactsRightSectionShowProfil');

    dialog.classList.remove('slide-in');
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 50);

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
                    <p onclick="editContact('${id}', '${nextColor}')" class="profilEdit">Edit
                        <img class="logoRightSection" src="./img/edit.svg">
                    </p>
                    <p onclick="deleteContact('${id}')" class="profilDelete">Delete
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
                    <img src="./img/more_vert.png" onclick="togglePopup()">
                    <div id="popup" class="popup">
                        <p onclick="editContact('${id}', '${nextColor}')" class="profilEdit"><img class="logoRightSection" src="./img/edit.svg">Edit</p>
                        <p onclick="deleteContact('${id}')" class="profilDelete"><img class="logoRightSection" src="./img/delete.png">Delete</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    showFullContactResponsive();
}


/**
 * Displays the full contact information in a responsive manner.
 */
function showFullContactResponsive() {
    let dialog = document.querySelector('.contactsRightSideMainDiv');
    dialog.classList.remove('slide-in'); 
    setTimeout(() => {
        dialog.classList.add('slide-in');
    }, 50); 
}

/**
 * Deletes a contact from the list and Firebase.
 */
async function deleteContact(id) {
    try {
        const index = contactIds.indexOf(id);
        if (index === -1) {
            console.error(`Contact with ID ${id} not found.`);
            return;
        }

        await deleteContactFromFirebase(id);

        nameInput.splice(index, 1);
        emailInput.splice(index, 1);
        phoneNumbersInput.splice(index, 1);
        contactIds.splice(index, 1);

        sortContactsByNameAndRender();
    } catch (error) {
        console.error('Failed to delete contact from Firebase:', error.message);
    }
}

/**
 * Renders the edited contact in the contact list.
 */
function renderEditContact(index, nextColor) {
    let editedContactHTML = renderHTMLcreateNewContact(nameInput[index], emailInput[index], phoneNumbersInput[index], contactIds[index], nextColor);
    let contactListItem = document.getElementById(`contactListInner${contactIds[index]}`);
    if (contactListItem) {
        contactListItem.innerHTML = editedContactHTML;
    } else {
        console.error(`Element with ID contactListInner${contactIds[index]} not found.`);
    }
}

/**
 * Saves the contact information to local storage.
 */
function safeContact() {
    let ContactsNamesAsText = JSON.stringify(nameInput);
    localStorage.setItem('names', ContactsNamesAsText);

    let emailsAsText = JSON.stringify(emailInput);
    localStorage.setItem('mails', emailsAsText);

    let phoneNumbersAsText = JSON.stringify(phoneNumbersInput);
    localStorage.setItem('phoneNumbers', phoneNumbersAsText);
}

/**
 * Loads contacts from a given path and renders them into the contact list.
 * The default path is "/contacts".
 */
async function loadContacts(path = "/contacts") {
    resetInputs();
    const contactsData = await fetchContactsData(path);

    if (!contactsData) {
        console.log("No contact data found.");
        return { names: [], emails: [], phoneNumbers: [] };
    }

    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    processContacts(contactsData, contactList);
}

/**
 * Resets the input arrays for names, emails, and phone numbers.
 */
function resetInputs() {
    nameInput = [];
    emailInput = [];
    phoneNumbersInput = [];
    contactIds = [];
}

/**
 * Fetches contacts data from a given path.
 * Returns a promise that resolves to the contacts data as a JSON object.
 */
async function fetchContactsData(path) {
    const response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

/**
 * Processes and renders contacts data into the contact list.
 * Iterates through the contacts data and processes each contact.
 */
function processContacts(contactsData, contactList) {
    for (const id in contactsData) {
        if (contactsData.hasOwnProperty(id)) {
            processContact(contactsData[id], contactList, id);
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
        const { name, email, nummer } = contact;
        const nextColor = getNextColor();
        const contactHTML = renderHTMLcreateNewContact(name, email, nummer, id, nextColor);
        contactList.insertAdjacentHTML('beforeend', contactHTML);

        nameInput.push(name);
        emailInput.push(email);
        phoneNumbersInput.push(nummer);
        contactIds.push(id); 
    }
}

/**
 * Navigates back in a responsive layout.
 */
function goBackResponsive() {
    const element = document.getElementById('contactsRightSideMainDivId');
    if (element) {
        element.classList.remove('slide-in');
    } else {
        console.error('Element with ID contactsRightSideMainDiv not found.');
    }
}

function togglePopup() {
    const popup = document.getElementById('popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}
