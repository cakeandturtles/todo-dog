function initProfileOption() {
    document.getElementById("login").innerHTML = "+ profile";
    document.getElementById("login").onclick = profileDomClick;
}
function profileDomClick(e) {
    alert("todo: profile");
}
function loginDomClick(e) {
    Dialog.Alert("", "login/signup", function () { }, false);
    var login_form = document.createElement("div");
    login_form.style.width = "320px";
    var username_div = document.createElement("div");
    username_div.appendChild(document.createTextNode("username: "));
    var username_input = document.createElement("input");
    username_input.type = "textbox";
    username_input.name = "username";
    username_input.id = "username";
    username_div.appendChild(username_input);
    username_div.style.marginTop = "16px";
    username_div.style.marginBottom = "8px";
    login_form.appendChild(username_div);
    var password_div = document.createElement("div");
    password_div.appendChild(document.createTextNode("password: "));
    var password_input = document.createElement("input");
    password_input.type = "password";
    password_input.name = "password";
    password_input.id = "password";
    password_div.appendChild(password_input);
    password_div.style.marginBottom = "8px";
    login_form.appendChild(password_div);
    var confirm_password_div = document.createElement("div");
    confirm_password_div.style.display = "none";
    confirm_password_div.id = "confirm_password_div";
    confirm_password_div.appendChild(document.createTextNode(">confirm: "));
    var confirm_password_input = document.createElement("input");
    confirm_password_input.type = "password";
    confirm_password_input.name = "confirm_password";
    confirm_password_input.id = "confirm_password";
    confirm_password_input.style.marginBottom = "8px";
    confirm_password_div.appendChild(confirm_password_input);
    login_form.appendChild(confirm_password_div);
    var notification_div = document.createElement("div");
    notification_div.id = "login_notification";
    notification_div.style.marginBottom = "48px";
    notification_div.style.color = "#ff0000";
    notification_div.style.fontStyle = "italic";
    notification_div.innerHTML = " ";
    login_form.appendChild(notification_div);
    var login_button = document.createElement("div");
    login_button.innerHTML = " log in ";
    login_button.style.marginLeft = "64px";
    login_button.style.fontSize = "24px";
    login_button.id = "dialogButton";
    login_button.style.width = "96px";
    login_button.style.right = "180px";
    login_button.onclick = tryLogin;
    var signup_button = document.createElement("div");
    signup_button.innerHTML = "sign up";
    signup_button.style.marginLeft = "16px";
    signup_button.style.fontSize = "24px";
    signup_button.id = "dialogConfirm";
    signup_button.style.width = "96px";
    signup_button.style.right = "48px";
    signup_button.onclick = initiateSignup;
    login_form.appendChild(login_button);
    login_form.appendChild(signup_button);
    Dialog.AddElement(login_form);
    username_input.focus();
}
