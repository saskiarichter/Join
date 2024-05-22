let users = [ 
    {
    'name': 'Onur',    
    'email': 'onur@test.de',
    'password': 'test123' 
    },
    {
    'name': 'Alex',    
    'email': 'alex@test.de',
    'password': 'alex123' 
    }
];


/**
 * Changes the form into the signup form
 */
function changeForm() {
    document.querySelector('.signUpMobile').classList.add("d-none");
    document.getElementById('signUpContainer').innerHTML = "";
    let form = document.getElementById('form');
    form.classList.add("formSignUp");
    let checkboxSignUp = document.getElementById('checkboxSignUp');
    checkboxSignUp.classList.add("loginCheckboxSignUp");

    form.innerHTML = getFormContent();
}


/**
 * HTML-Template for function changeForm()
 */
function getFormContent() {
    return `
        <form onsubmit="return false;">
            <div class="formHeadline">
                <div class="headline">
                    <img onclick="returnToHome()" class="vector" src="/img/Vector.png">
                    <h1 class="formHeadlineTextSignUp">Sign up</h1>
                </div>            
                <div class="formHeadlineBorder"></div>
            </div>    
            <div class="mailPassword">
                <div>
                    <input class="inputNameSignUp" type="text" placeholder="Name" required id="name">
                </div>    
                <div>
                    <input class="inputMailSignUp" type="email" placeholder="Email" required id="email">
                </div>
                <div>
                    <input class="inputPasswordSignUp" type="password" placeholder="Password" required id="password">
                </div>
                <div>
                    <input class="inputPasswordSignUp" type="password" placeholder="Confirm Password" required id="password-confirm">
                </div>
                
                <div class="notification">
                    <p id="msgbox-signup"><p>
                </div>  
                <div class="loginCheckboxSignUp">
                    <input type="checkbox" class="loginCheckBoxRememberMe" id="loginCheckBoxRememberMe">
                    <label for="loginCheckBoxRememberMe" class="loginCheckBoxRememberMeLabel"></label>
                    <p class="privacy-text">I accept the <a class="policeLink" onclick="redirectToPrivacyPoliceSignup()">Privacy Police</a></label>
                </div>
                <div class="buttons">
                    <button class="buttonLogin" onclick="addUser()">Sign up</button>
                </div>
            </div>
        </form> 
    `;
}


/**
 * this function is for the logout
 */
async function addUser() {
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let passwordConfirm = document.getElementById('password-confirm').value.trim();
    let msgbox = document.getElementById('msgbox-signup');

    // Überprüfen, ob Passwort und Passwortbestätigung übereinstimmen
    if (password !== passwordConfirm) {
        msgbox.innerHTML = "Your passwords don't match";
        return;
    }

    // Überprüfen, ob die Checkbox aktiviert ist
    if (!document.getElementById('loginCheckBoxRememberMe').checked) {
        msgbox.innerHTML = "Please accept the Privacy Policy";
        return;
    }
    
    // Regulärer Ausdruck für erlaubte Zeichen in Name, E-Mail und Passwort
    const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    // Überprüfen, ob Name gültig ist
    if (!name.match(/^[a-zA-Z\s]+$/)) {
        msgbox.innerHTML = "Name can only contain letters and spaces";
        return;
    }
    // Überprüfen, ob E-Mail gültig ist
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        msgbox.innerHTML = "Invalid email address";
        return;
    }

    // Überprüfen, ob das Passwort gültig ist
    if (!password.match(allowedCharacters)) {
        msgbox.innerHTML = "Password can only contain letters, numbers, and certain special characters";
        return;
    }

    // Überprüfen, ob die E-Mail bereits existiert
    if (users.some(user => user.email === email)) {
        msgbox.innerHTML = "Email already exists";
        return;
    }

    // Überprüfen, ob das Passwort bereits existiert
    if (users.some(user => user.password === password)) {
        msgbox.innerHTML = "Password already exists";
        return;
    }

    // Benutzer zum Array hinzufügen
    users.push({name: name, email: email, password: password});

    // Daten in Firebase speichern
    await postData("users", {name: name, email: email, password: password});

    window.location.href = 'index.html?msg=You have successfully registered';

    // Eingabefelder leeren
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('password-confirm').value = "";
}


/**
 * this function is for the login
 */
async function login() {
    let email = document.getElementById('email-login').value;
    let password = document.getElementById('password-login').value;
    let rememberMeChecked = document.getElementById('loginCheckBoxRememberMe').checked;
    let msgbox = document.getElementById('msgbox');

    handleLogin(email, password, rememberMeChecked, msgbox);
}


/**
 * The handleLogin function checks the user input and performs the actions required for login
 */
function handleLogin(email, password, rememberMeChecked, msgbox) {
    const user = users.find(user => user.email === email && user.password === password);    // Überprüfe, ob die Benutzereingaben mit den im Array befindlichen Benutzerdaten übereinstimmen

    if (user) {
        sessionStorage.setItem('loggedInUser', user.name);
        localStorage.setItem('lastLoggedInEmail', email); // Speichere die E-Mail-Adresse im Local Storage
        localStorage.setItem('lastLoggedInPassword', password); // Speichere das Passwort im Local Storage
        localStorage.setItem('rememberMeChecked', rememberMeChecked); // Speichere den Status der Checkbox im Local Storage

        alert("Login successful!");
        window.location.href = "summary.html"; // Weiterleitung zur summary.html-Seite
    } else {
        msgbox.innerHTML = "Keine gültige Email oder Passwort eingetragen";
    }
}


/**
 * this function is for the logout
 */
function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = "index.html";
}


/**
 * Fills the input fields with the last logged-in credentials from the local storage
 */
function fillRemembereInputs() {
    const lastLoggedInEmail = localStorage.getItem('lastLoggedInEmail');
    const lastLoggedInPassword = localStorage.getItem('lastLoggedInPassword');
    const rememberMeChecked = localStorage.getItem('rememberMeChecked');

    if (lastLoggedInEmail && lastLoggedInPassword && rememberMeChecked === 'true') {
        document.getElementById('email-login').value = lastLoggedInEmail;
        document.getElementById('password-login').value = lastLoggedInPassword;
        document.getElementById('loginCheckBoxRememberMe').checked = true; // Stelle sicher, dass die Checkbox aktiviert ist
    }
}


/**
 * Changes the animation image in the responsive view
 */
function changeImage() {
    // Prüfen, ob Bildschirmbreite kleiner oder gleich 720px ist
    if (window.innerWidth <= 720) {
        document.getElementById('logo').style.display="none";
        document.getElementById('logo2').style.display="block";
        // Wenn ja, ändere das Bild nach 800 Millisekunden
        setTimeout(function(){
            document.getElementById('logo2').style.display="none";
        }, 1200) 
        document.getElementById('logo').style.display="block";}
    }