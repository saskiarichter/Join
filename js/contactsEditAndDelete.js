
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

    sortContactsByNameAndRender(); 

    let dialog = document.getElementById('contactsRightSectionShowProfil');
    dialog.classList.remove('slide-in');

    if (nameInput.length === 0) {
        document.getElementById('contactList').innerHTML = '';
    } else {
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
                <img class="joinLogoDialog" src="./img/Capa 2.png">
                <div class="dialogLeftInnerDiv">
                    <h1 class="HeadlineDialog">Edit contact</h1>
                </div>
            </div>
            <div class="dialogRight">
                <div class="dialogCloseDiv">
                <img onclick="closeContactDialog()" class="closeResponsiveButton" src="./img/closeResponsive.png">
                </div>
                <div class="dialogProfilPictureDiv">
                    <div class="circleProfilPicShowEdit" style="background-color: ${nextColor}">${initials}</div>
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