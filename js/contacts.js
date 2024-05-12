

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

}

function closeContactDialog() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
}

function HTMLTemplateNewContact(){
    return `    
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
            <img onclick="closeContactDialog()" class="closeIcon" src="../img/close.png">
        </div>
        <div class="dialogProfilPictureDiv">
            <img class="dialogProfilPicture" src="../img/Group 13.png">
            <div class="dialogAddData">
                <div class="dialogInputfield">
                    <div class="dialogInputfieldDiv">
                        <input id="inputName" placeholder="Name">
                        <img class="dialogIcons" src="../img/person.png">
                    </div>
                    <div class="dialogInputfieldDiv">
                        <input id="inputMail"  type="email" placeholder="Email" pattern=".+@.+" required>
                        <img class="dialogIcons" src="../img/mail.png">
                    </div>
                    <div class="dialogInputfieldDiv">
                        <input id="inputPhone" type="number" placeholder="Phone" class="no-spinners">
                        <img class="dialogIcons" src="../img/call.png">
                    </div>
                </div>
                <div class="dialogButtonDiv">
                    <button onclick="closeContactDialog()" class="cancelButton">Cancel</button>
                    <button onclick="createNewContact()" class="createContactButton">Create contact<img src="../img/check.png"></button>
                </div>
            </div> 
        </div>
    </div>  
</div>

    `;
}

function editContact(index, nextColor){
    document.getElementById('overlay').style.display = 'block'; 
    document.getElementById('dialogNewContactDiv').classList.remove('d-none');
    document.getElementById('dialogNewContactDiv').innerHTML = HTMLTemplateEditContact(index, nextColor); 
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
    safeContact();

    document.getElementById('overlay').style.display = 'none'; 
    document.getElementById('dialogNewContactDiv').classList.add('d-none');
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
        contactDiv.innerHTML = renderHTMLcreateNewContact(name, emailInput[index], phoneNumbersInput[index], index, getNextColor());
        contactList.appendChild(contactDiv);
    });
}

function renderHTMLcreateNewContact(name, email, phoneNumber, index, nextColor){
    let initials = getInitials(name);

    return `
    <div onclick="showFullContact(${index}, '${nextColor}')" id="contactListInner${index}" class="contactListInner">
    <div class="circleProfilPic" style="background-color: ${nextColor}">${initials}</div>
    <div class="nameAndEmail">
        <p class="nameProfil">${name}</p>
        <p class="emailAdress">${email}</p>
    </div>
    </div>
    `;
    
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');

}

function getNextColor(){
    colorIndex = (colorIndex + 1) % colors.length;
    return colors[colorIndex];
}

function showFullContact(index, nextColor){
    let content = document.getElementById('contactsRightSectionShowProfil');
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
                    <img class="logoRightSection" src="./img/edit.svg">
                    <p onclick="editContact(${index}, '${nextColor}')" class="profilEdit">Edit</p>
                    <img class="logoRightSection" src="./img/delete.png">
                    <p onclick="deleteContact(${index})" class="profilDelete">Delete</p>
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

function safeContact(){
    let ContactsNamesAsText = JSON.stringify(nameInput);
    localStorage.setItem('names', ContactsNamesAsText);

    let emailsAsText = JSON.stringify(emailInput);
    localStorage.setItem('mails', emailsAsText);

    let phoneNumbersAsText = JSON.stringify(phoneNumbersInput);
    localStorage.setItem('phoneNumbers', phoneNumbersAsText);

}

function loadContacts(){
    let ContactsNamesAsText = localStorage.getItem('names'),
        emailsAsText = localStorage.getItem('mails'),
        phoneNumbersAsText = localStorage.getItem('phoneNumbers');

    if (ContactsNamesAsText && emailsAsText && phoneNumbersAsText ) {
        nameInput = JSON.parse(ContactsNamesAsText);
        emailInput = JSON.parse(emailsAsText);
        phoneNumbersInput = JSON.parse(phoneNumbersAsText);

    } else {
        console.log("Fehler");
    }
    
}
