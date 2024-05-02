let nameInput = [];
let emailInput = [];
let phoneNumbersInput = [];

function addNewContact() {
    document.getElementById('overlay').style.display = 'block'; // Overlay anzeigen
    document.getElementById('dialogNewContactDiv').classList.remove('d-none');
    document.getElementById('dialogNewContactDiv').innerHTML = HTMLTemplateNewContact();
}

function closeContactDialog() {
    document.getElementById('overlay').style.display = 'none'; // Overlay ausblenden
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

function HTMLTemplateNewContact(){
    return `    
<div class="dialogNewContactInnerDiv">
    <div class="dialogLeft">
        <img class="joinLogoDialog" src="./img/Capa 2.png">
        <div class="dialogLeftInnerDiv">
            <h1 class="HeadlineDialog">Add contact</h1>
            <p class="subheadingDialog">Tasks are better with a team!</p>
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
                        <input id="inputName" placeholder="Name">
                        <img class="dialogIcons" src="./img/person.png">
                    </div>
                    <div class="dialogInputfieldDiv">
                        <input id="inputMail"  type="email" placeholder="Email" pattern=".+@.+" required>
                        <img class="dialogIcons" src="./img/mail.png">
                    </div>
                    <div class="dialogInputfieldDiv">
                        <input id="inputPhone" type="number" placeholder="Phone" class="no-spinners">
                        <img class="dialogIcons" src="./img/call.png">
                    </div>
                </div>
                <div class="dialogButtonDiv">
                    <button onclick="closeContactDialog()" class="cancelButton">Cancel</button>
                    <button onclick="createNewContact()" class="createContactButton">Create contact<img src="./img/check.png"></button>
                </div>
            </div> 
        </div>
    </div>  
</div>

    `;
}

function editContact(index){
    document.getElementById('overlay').style.display = 'block'; // Overlay anzeigen
    document.getElementById('dialogNewContactDiv').classList.remove('d-none');
    document.getElementById('dialogNewContactDiv').innerHTML = HTMLTemplateEditContact(index); // Index übergeben
}

function HTMLTemplateEditContact(index){
    let name = nameInput[index];
    let email = emailInput[index];
    let phone = phoneNumbersInput[index];

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
            <img class="dialogProfilPicture" src="./img/Group 13.png">
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
                    <button onclick="saveEditContact(${index})" class="createContactButton">Save<img src="./img/check.png"></button>
                </div>
            </div> 
        </div>
    </div>  
</div>
    `;
}


function createNewContact(){
    let name = document.getElementById('inputName').value;
    let mail = document.getElementById('inputMail').value;
    let phone = document.getElementById('inputPhone').value;

    document.getElementById('inputName').value = '';
    document.getElementById('inputMail').value = '';
    document.getElementById('inputPhone').value = '';

    nameInput.push(name);
    emailInput.push(mail);
    phoneNumbersInput.push(phone);

    let index = nameInput.length - 1; // Index des neuen Kontakts

    let newContactDiv = document.createElement('div');
    newContactDiv.classList.add('contactList');
    newContactDiv.innerHTML = renderHTMLcreateNewContact(name, mail, phone, index);
    document.getElementById('contactList').appendChild(newContactDiv);

    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

function renderHTMLcreateNewContact(name, email, phoneNumber, index){
    return `
    <div onclick="showFullContact(${index})" id="contactListInner${index}" class="contactListInner">
    <div class="circleProfilPic">CS</div>
    <div class="nameAndEmail">
        <p class="nameProfil">${name}</p>
        <p class="emailAdress">${email}</p>
    </div>
    </div>
    `;
    
}

function showFullContact(index){
    let content = document.getElementById('contactsRightSectionShowProfil');
    content.innerHTML = '';

        let name = nameInput[index];
        let email = emailInput[index];
        let phone = phoneNumbersInput[index];

        content.innerHTML = `
        <div class="contactsRightSectionShowProfilInner">
        <div class="circleProfilPicShow">AM</div>
        <div class="proilNameAndEdit">
            <p class="nameProfilShow">${name}</p>
                <div class="proilNameAndEditInner">
                    <p onclick="editContact(${index})" class="profilEdit">Edit</p>
                    <img class="logoRightSection" src="./img/edit.png">
                    <p onclick="deleteContact(${index})" class="profilDelete">Delete</p>
                    <img class="logoRightSection" src="./img/delete.png">
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

function saveEditContact(index) {
    let changedName = document.getElementById('inputName').value;
    let changedMail = document.getElementById('inputMail').value;
    let changedPhone = document.getElementById('inputPhone').value;

    nameInput[index] = changedName;
    emailInput[index] = changedMail;
    phoneNumbersInput[index] = changedPhone;

    closeContactDialog();
    showFullContact(index);
    renderEditContact(index);
}

function renderEditContact(index) {
    let editedContactHTML = renderHTMLcreateNewContact(nameInput[index], emailInput[index], phoneNumbersInput[index], index);
    let contactListItem = document.getElementById(`contactListInner${index}`);
    if (contactListItem) {
        contactListItem.innerHTML = editedContactHTML;
    } else {
        console.error(`Element with ID contactListInner${index} not found.`);
    }
}

function deleteContact(index) {
    if (index >= 0 && index < nameInput.length) {
        nameInput.splice(index, 1);
        emailInput.splice(index, 1);
        phoneNumbersInput.splice(index, 1);

        let contactListItem = document.getElementById(`contactListInner${index}`);
        if (contactListItem) {
            contactListItem.remove();
            
        } else {
            console.error(`Element with ID contactListInner${index} not found.`);
        }
    } else {
        console.error(`Invalid index ${index}`);
    }
    let content = document.getElementById('contactsRightSectionShowProfil');
    content.innerHTML = '';
}
