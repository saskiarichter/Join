/**
 * Initializes the application.
 * Calls the functions to initialize the inclusion, load contacts, set background menu, and display user initials.
 */
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
let loadedColors = [];

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

/**
 * Displays the dialog to add a new contact.
 * Reveals the overlay and dialog, and sets the HTML content for the new contact form.
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
}

/**
 * Returns the HTML template for adding a new contact.
 */
function HTMLTemplateNewContact() {
    return `    
<form onsubmit="createNewContact(); return false;">
    <div class="dialogNewContactInnerDiv">
        <div class="dialogLeft">
        <img onclick="closeContactDialog()" class="closeResponsiveButton" src="/img/closeResponsive.png">
            <img class="joinLogoDialog" src="/img/Capa 2.png">
            <div class="dialogLeftInnerDiv">
                <h1 class="HeadlineDialog">Add contact</h1>
                <p class="subheadingDialog">Tasks are better with a team!</p>
                <div class="dialogLine"></div>
            </div>
        </div>
        <div class="dialogRight">
            <div class="dialogCloseDiv">
                <img onclick="closeContactDialog()" class="closeIcon" src="/img/Close.png">
            </div>
            <div class="dialogProfilPictureDiv">
                <img class="dialogProfilPicture" src="/img/Group 13.png">
                <div class="dialogAddData">
                    <div class="dialogInputfield">
                        <div class="dialogInputfieldDiv">
                            <input id="inputName" placeholder="Name" required>
                            <img class="dialogIcons" src="/img/person.png">
                        </div>
                        <div class="dialogInputfieldDiv">
                            <input id="inputMail" type="email" placeholder="Email" pattern=".+@.+" required>
                            <img class="dialogIcons" src="/img/mail.png">
                        </div>
                        <div class="dialogInputfieldDiv">
                            <input id="inputPhone" type="number" placeholder="Phone" class="no-spinners" required>
                            <img class="dialogIcons" src="/img/call.png">
                        </div>
                    </div> 
                    <div class="dialogButtonDiv">
                        <button type="button" onclick="closeContactDialog()" class="cancelButton">Cancel<img src="/img/close.png"></button>
                        <button type="submit" class="createContactButton">Create contact<img src="/img/check.png"></button>
                    </div>
                </div> 
            </div>
        </div>  
    </div>
</form>
    `;
}

/**
 * Creates a new contact.
 * Retrieves input values, generates the next color, and resets the input fields.
 * Adds the new contact details to the corresponding arrays and hides the dialog.
 * Creates the new contact in Firebase, updates the contact ID array, sorts and renders the contacts.
 */
async function createNewContact(){
    let name = document.getElementById('inputName').value;
    let mail = document.getElementById('inputMail').value;
    let phone = document.getElementById('inputPhone').value;
    const nextColor = getNextColor();

    document.getElementById('inputName').value = '';
    document.getElementById('inputMail').value = '';
    document.getElementById('inputPhone').value = '';

    nameInput.push(name);
    emailInput.push(mail);
    phoneNumbersInput.push(phone);
    loadedColors.push(nextColor);

    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
    const newContactId = await createNewContactInFirebase(name, mail, phone, nextColor); 
    contactIds.push(newContactId);
    sortContactsByNameAndRender();
}

/**
 * Sorts the contacts by name.
 * Reorders the name, email, phone number, color, and ID arrays based on the sorted names.
 */
function sortContactsByNameAndRender() {
    const sortedIndices = [...nameInput.keys()].sort((a, b) => nameInput[a].localeCompare(nameInput[b]));

    const sortedNames = sortedIndices.map(i => nameInput[i]);
    const sortedEmails = sortedIndices.map(i => emailInput[i]);
    const sortedPhoneNumbers = sortedIndices.map(i => phoneNumbersInput[i]);
    const sortedColors = sortedIndices.map(i => loadedColors[i]);
    const sortedIds = sortedIndices.map(i => contactIds[i]);

    nameInput.length = 0;
    emailInput.length = 0;
    phoneNumbersInput.length = 0;
    loadedColors.length = 0;
    contactIds.length = 0;

    nameInput.push(...sortedNames);
    emailInput.push(...sortedEmails);
    phoneNumbersInput.push(...sortedPhoneNumbers);
    loadedColors.push(...sortedColors);
    contactIds.push(...sortedIds);

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
        contactDiv.innerHTML = renderHTMLLeftContactSide(name, emailInput[index], phoneNumbersInput[index], index, loadedColors[index]);
        contactList.appendChild(contactDiv);
    });
}

/**
 * Closes the contact dialog.
 * Hides the overlay and the dialog.
 */
function closeContactDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

/**
 * Returns the HTML for a contact item.
 */
function renderHTMLLeftContactSide(name, email, phoneNumber, index, nextColor){
    let initials = getInitials(name);

    return `
    <div onclick="showFullContact(${index}, '${nextColor}')" id="contactListInner${index}" class="contactListInner">
    <div class="contactListInnerDiv" id="contactListInnerDiv${index}" onclick="changeBackgroundColor(this); showFullContactResponsive(${index});">
    <div class="circleProfilPic" style="background-color: ${nextColor}">${initials}</div>
    <div class="nameAndEmail">
        <p id="nameProfil${index}" class="nameProfil">${name}</p>
        <p class="emailAdress">${email}</p>
    </div>
    </div>
    `;
}

/**
 * Changes the background color of the clicked contact element.
 * Adds a clicked class and changes the name text color to white.
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
 * Gets the initials from a name.
 */
function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join(' ');
}

/**
 * Returns the next color from the colors array.
 * Increments the color index for the next call.
 */
function getNextColor() {
    colorIndex = colorIndex % colors.length;  
    const color = colors[colorIndex]; 
    colorIndex++;  
    return color;  
}

/**
 * Shows the full contact details.
 * Updates the right section with the contact details and reveals the dialog.
 */
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
    content.innerHTML = HTMLTemplateShowFullContact(name, email, phone, initials, nextColor, index, id);
} 

/**
 * Returns the HTML template for displaying full contact details.
 */
function HTMLTemplateShowFullContact(name, email, phone, initials, nextColor, index, id){
    return `
    <div onclick="showFullContactResponsive()" id="contactsRightSectionShowProfilInner" class="contactsRightSectionShowProfilInner">
        <div class="circleProfilPicShow" style="background-color: ${nextColor}">${initials}</div>
        <div class="proilNameAndEdit">
            <p class="nameProfilShow">${name}</p>
            <div class="proilNameAndEditInner">
                <p onclick="editContact('${index}', '${nextColor}')" class="profilEdit">Edit
                    <img class="logoRightSection" src="/img/edit.svg">
                </p>
                <p onclick="deleteContact('${index}')" class="profilDelete">Delete
                    <img class="logoRightSection" src="/img/delete.png">
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
            <img src="./img/more_vert.png" onclick="togglePopup(event)" alt="More">
                <div id="popup" class="popup">
                    <p onclick="editContact('${index}', '${nextColor}')" class="profilEdit"><img class="logoRightSection" src="/img/edit.svg">Edit</p>
                    <p onclick="deleteContact('${index}', '${id}')" class="profilDelete"><img class="logoRightSection" src="/img/delete.png">Delete</p>
                </div>
            </div>
        </div>
    </div>
`;
}

/**
 * Edits a contact.
 * Shows the dialog with the contact details prefilled for editing.
 */
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

/**
 * Returns the HTML template for editing a contact.
 */
function HTMLTemplateEditContact(index, nextColor){
    let name = nameInput[index];
    let email = emailInput[index];
    let phone = phoneNumbersInput[index];
    let initials = getInitials(name);
    
    return `    
        <div class="dialogNewContactInnerDiv">
            <div class="dialogLeft">
                <img class="joinLogoDialog" src="/img/Capa 2.png">
                <div class="dialogLeftInnerDiv">
                    <h1 class="HeadlineDialog">Edit contact</h1>
                </div>
            </div>
            <div class="dialogRight">
                <div class="dialogCloseDiv">
                <img onclick="closeContactDialog()" class="closeResponsiveButton" src="/img/closeResponsive.png">
                </div>
                <div class="dialogProfilPictureDiv">
                    <div class="circleProfilPicShowEdit" style="background-color: ${nextColor}">${initials}</div>
                    <div class="dialogAddData">
                        <div class="dialogInputfield">
                            <div class="dialogInputfieldDiv">
                                <input id="inputName" value="${name}">
                                <img class="dialogIcons" src="/img/person.png">
                            </div>
                            <div class="dialogInputfieldDiv">
                                <input id="inputMail" value="${email}" type="email" pattern=".+@.+" required>
                                <img class="dialogIcons" src="/img/mail.png">
                            </div>
                            <div class="dialogInputfieldDiv">
                                <input id="inputPhone" value="${phone}" type="number" class="no-spinners">
                                <img class="dialogIcons" src="/img/call.png">
                            </div>
                        </div>
                        <div class="dialogButtonDiv">
                            <button onclick="closeContactDialog()" class="cancelButton">Cancel</button>
                            <button onclick="saveEditContact(${index}, '${nextColor}')" class="createContactButton">Save<img src="/img/check.png"></button>
                        </div>
                    </div> 
                </div>
            </div>  
        </div>
    `;
}

/**
 * Renders the edited contact.
 * Updates the contact list with the edited contact details.
 */
function renderEditContact(index,nextColor) {
    let editedContactHTML = renderHTMLLeftContactSide(nameInput[index], emailInput[index], phoneNumbersInput[index], index, nextColor);
    let contactListItem = document.getElementById(`contactListInner${index}`);
    if (contactListItem) {
        contactListItem.innerHTML = editedContactHTML;
    } else {
        console.error(`Element with ID contactListInner${index} not found.`);
    }
}

/**
 * Saves the edited contact.
 * Updates the contact details in the arrays and Firebase, sorts and renders the contacts.
 */
async function saveEditContact(index, nextColor) {
    let changedName = document.getElementById('inputName').value;
    let changedMail = document.getElementById('inputMail').value;
    let changedPhone = document.getElementById('inputPhone').value;

    const id = contactIds[index];
    nameInput[index] = changedName;
    emailInput[index] = changedMail;
    phoneNumbersInput[index] = changedPhone;
    loadedColors[index] = nextColor;

    try {
        await updateContactInFirebase(id, changedName, changedMail, changedPhone, nextColor);
        sortContactsByNameAndRender();
    } catch (error) {
        console.error('Failed to update contact in Firebase:', error.message);
    }

    closeContactDialog();
    showFullContact(index, nextColor);
    renderEditContact(index, nextColor);
    document.getElementById('contactsRightSectionShowProfil').classList.add('d-none');
}

/**
 * Deletes a contact.
 * Removes the contact from the arrays and Firebase, and reloads the contacts.
 */
async function deleteContact(index) {
    const contactId = contactIds[index]; 

    await deleteContactBackend(`/contacts/${contactId}`);

    nameInput.splice(index, 1);
    emailInput.splice(index, 1);
    phoneNumbersInput.splice(index, 1);
    contactIds.splice(index, 1);
    loadedColors.splice(index, 1);
    let dialog = document.getElementById('contactsRightSectionShowProfil');
    dialog.classList.remove('slide-in');

    const contactsData = await fetchContactsData("/contacts");
    if (!contactsData) {
        console.error("No contact data found.");
        return;
    }

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
    await deleteContactBackend("/contacts");
    for (let i = 0; i < contacts.length; i++) {
        await createNewContactInFirebase(contacts[i].name, contacts[i].email, contacts[i].nummer, contacts[i].color, i);
    }
    await loadContacts();
}

/**
 * Resets the input arrays.
 */
function resetInputs() {
    nameInput = [];
    emailInput = [];
    phoneNumbersInput = [];
    contactIds = [];
}

/**
 * Goes back to the previous responsive view.
 * Removes the slide-in class from the right side main div.
 */
function goBackResponsive() {
    const element = document.getElementById('contactsRightSideMainDivId');
    if (element) {
        element.classList.remove('slide-in');
    } else {
        console.error('Element with ID contactsRightSideMainDiv not found.');
    }
}

/**
 * Fetches contact data from the server.
 */
async function fetchContactsData(path) {
    const response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

/**
 * Processes the contacts data and renders it into the contact list.
 * Extracts and processes up to 10 contacts, then sorts and renders them.
 */
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

        nameInput.push(name);
        emailInput.push(email);
        phoneNumbersInput.push(nummer);
        contactIds.push(id);
        loadedColors.push(color);
    }
}

/**
 * Sets the background menu for contacts.
 * Adds the background focus class to the contacts element.
 */
function contactsBgMenu() {
    document.getElementById('contacts').classList.add("bgfocus");
}

/**
 * Displays the user's initials.
 * Retrieves the logged-in user's name from session storage and displays the initial.
 */
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

/**
 * Goes back to the previous responsive view.
 * Removes the slide-in class from the right side main div.
 */
function goBackResponsive() {
    let dialog = document.querySelector('.contactsRightSideMainDiv');
    dialog.classList.remove('slide-in'); // Beispiel: Rückwärtsanimation oder andere Rückkehrlogik
    isFullContactShown = false;
    console.log("Zur vorherigen Ansicht zurückgekehrt");
}

/**
 * Toggles the popup visibility.
 * Stops event propagation and toggles the popup display style.
 */
function togglePopup(event) {
    event.stopPropagation();
    const popup = document.getElementById('popup');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.setProperty('display', 'block', 'important');
    } else {
        popup.style.setProperty('display', 'none', 'important');
    }
}

/**
 * Shows the full contact details in responsive view.
 * Adds the slide-in class to the right side main div.
 */
let isFullContactShown = false;

function showFullContactResponsive() {
    if (!isFullContactShown) {
        let dialog = document.querySelector('.contactsRightSideMainDiv');
        dialog.classList.remove('slide-in'); 
        setTimeout(() => {
            dialog.classList.add('slide-in');
        }, 50); 
        isFullContactShown = true;
    } else {
        console.log("Die Funktion showFullContactResponsive() kann erst nach dem Aufruf von goBackResponsive() erneut aufgerufen werden.");
    }
}