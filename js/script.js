function init() {
    includeHTML();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function changeForm() {
    document.getElementById('signUpContainer').innerHTML = "";
    let form = document.getElementById('form');
    form.classList.add("formSignUp");
    let checkboxSignUp = document.getElementById('checkboxSignUp');
    checkboxSignUp.classList.add("loginCheckboxSignUp");

    form.innerHTML = "";
    form.innerHTML = `
                        
                        <div class="formHeadline">
                            <div class="headline">
                                <img onclick="returnToHome()" class="vector" src="/img/Vector.png">
                                <h1 class="formHeadlineText">Sign up</h1>
                            </div>            
                            <div class="formHeadlineBorder"></div>
                        </div>    
                        <div class="mailPassword">
                            <div>
                                <input class="inputNameSignUp" type="text" aria-describedby="emailHelp" placeholder="Name" required>
                            </div>    
                        <div>
                            <input class="inputMailSignUp" type="email" aria-describedby="emailHelp" placeholder="Email" required>
                        </div>
                        <div>
                            <input class="inputPasswordSignUp" type="password"  placeholder="Password" required>
                        </div>
                        <div>
                            <input class="inputPasswordSignUp" type="password" placeholder="Confirm Password" required>
                        </div>
                        
                        <div class="notification"></div>  
                        <div class="loginCheckboxSignUp">
                            <input type="checkbox" class="loginCheckBoxRememberMe" id="loginCheckBoxRememberMe">
                            <label for="loginCheckBoxRememberMe" class="loginCheckBoxRememberMeLabel"></label>
                            <p for="exampleCheck1">I accept the <a class="policeLink" href"#">Privacy Police</a></label>
                        </div>
                        <div class="buttons">
                            <button class="buttonLogin" type="submit">Sign up</button>
                        </div> 
    `;
}


function returnToHome() {
    window.location.href = "index.html";
}

function redirectToHelp() {
    window.location.href = "help.html";
}











