function changeForm() {
    document.querySelector('.signUpMobile').classList.add("d-none");
    document.getElementById('signUpContainer').innerHTML = "";
    let form = document.getElementById('form');
    form.classList.add("formSignUp");
    let checkboxSignUp = document.getElementById('checkboxSignUp');
    checkboxSignUp.classList.add("loginCheckboxSignUp");

    form.innerHTML = `
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
                                <p class="privacy-text">I accept the <a class="policeLink" href"#">Privacy Police</a></label>
                            </div>
                            <div class="buttons">
                                <button class="buttonLogin" onclick="addUser()">Sign up</button>
                            </div>
                        </div>
                    </form> 
    `;
}


function toggleMenu() {
    let dropdownMenu = document.querySelector('.headerLogoutButton .dropdownMenu');
    dropdownMenu.classList.toggle('d-none');
}

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


























