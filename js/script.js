function changeForm() {
    document.getElementById('signUpContainer').innerHTML = "";
    let form = document.getElementById('form');
    form.classList.add("formSignUp");
    let checkboxSignUp = document.getElementById('checkboxSignUp');
    checkboxSignUp.classList.add("loginCheckboxSignUp");

    form.innerHTML = "";
        form.innerHTML = `
                        <form onsubmit="addUser(); return false;">
                            <div class="formHeadline">
                                <div class="headline">
                                    <img onclick="returnToHome()" class="vector" src="/img/Vector.png">
                                    <h1 class="formHeadlineText">Sign up</h1>
                                </div>            
                                <div class="formHeadlineBorder"></div>
                            </div>    
                            <div class="mailPassword">
                                <div>
                                    <input class="inputNameSignUp" type="text" placeholder="Name" required id="name"
                                </div>    
                            <div>
                                <input class="inputMailSignUp" type="email" placeholder="Email" required id="email">
                            </div>
                            <div>
                                <input class="inputPasswordSignUp" type="password"  placeholder="Password" required id="password">
                            </div>
                            <div>
                                <input class="inputPasswordSignUp" type="password" placeholder="Confirm Password" required id="password-confirm">
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
                        </form> 
    `;
}


function toggleMenu() {
    let dropdownMenu = document.querySelector('.headerLogoutButton .dropdownMenu');
    dropdownMenu.classList.toggle('d-none');
}




















