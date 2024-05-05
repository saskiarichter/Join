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
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('password-confirm').value;

    // Überprüfen, ob Passwort und Passwortbestätigung übereinstimmen
    if (password !== passwordConfirm) {
        alert("Passwords do not match");
        return;
    }

    // Überprüfen, ob die Checkbox aktiviert ist
    if (!document.getElementById('loginCheckBoxRememberMe').checked) {
        alert("Please accept the Privacy Policy");
        return;
    }
    
    // Überprüfen, ob die E-Mail bereits existiert
    if (users.some(user => user.email === email)) {
        alert("Email already exists");
        return;
    }

    // Überprüfen, ob das Passwort bereits existiert
    if (users.some(user => user.password === password)) {
        alert("Password already exists");
        return;
    }

    // Benutzer zum Array hinzufügen
    users.push({name: name, email: email, password: password});

    // Daten in Firebase speichern
    await postData("users", {name: name, email: email, password: password});

    // Optional: Feedback geben, dass der Benutzer erfolgreich hinzugefügt wurde
    alert("User added successfully");

    window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';

    // Eingabefelder leeren
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('password-confirm').value = "";
}



async function login() {
    let email = document.getElementById('email-login').value;
    let password = document.getElementById('password-login').value;

    // Überprüfe, ob die Benutzereingaben mit den im Array befindlichen Benutzerdaten übereinstimmen
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        sessionStorage.setItem('loggedInUser', user.name);

        alert("Login successful!"); // Hinweis: Du kannst diesen Hinweis durch eine Weiterleitung ersetzen

        window.location.href = "summary.html"; // Weiterleitung zur summary.html-Seite
    } else {
        alert("Invalid email and password. Please try again.");
    }
}


function logout() {
    let logout = document.getElementById('hLogout');
    logout.addEventListener("click", returnToHome()) 
    }


