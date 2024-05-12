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
    if (!name.match(/^[a-zA-Z]+$/)) {
        msgbox.innerHTML = "Name can only contain letters";
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


async function login() {
    let email = document.getElementById('email-login').value;
    let password = document.getElementById('password-login').value;
    let rememberMeChecked = document.getElementById('loginCheckBoxRememberMe').checked;
    let msgbox = document.getElementById('msgbox');

    // Überprüfe, ob die Benutzereingaben mit den im Array befindlichen Benutzerdaten übereinstimmen
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        sessionStorage.setItem('loggedInUser', user.name);
        localStorage.setItem('lastLoggedInEmail', email); // Speichere die E-Mail-Adresse im Local Storage
        localStorage.setItem('lastLoggedInPassword', password); // Speichere das Passwort im Local Storage
        localStorage.setItem('rememberMeChecked', rememberMeChecked); // Speichere den Status der Checkbox im Local Storage

        alert("Login successful!"); // Hinweis: Du kannst diesen Hinweis durch eine Weiterleitung ersetzen

        window.location.href = "summary.html"; // Weiterleitung zur summary.html-Seite
    } else {
        msgbox.innerHTML = "Keine gültige Email oder Passwort eingetragen";
    }
}


function logout() {
    let logout = document.getElementById('hLogout');
    logout.addEventListener("click", returnToHome()) 
}


// Füllt die Inputfelder mit den zuletzt eingeloggten Anmeldeinformationen aus dem Local Storage
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