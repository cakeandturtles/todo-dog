function login(username, password){
    var notification_div = document.getElementById("login_notification");

    login_php(username, password, function(success, notification, selector_validator){
        notification_div.innerHTML = notification;

        if (success){
            storeCredentials(selector_validator);
            alert("what to do in case of a mismatch of todo local and server?");

            initProfileOption();
            document.getElementById("dialogConfirm").innerHTML = "OK";
            document.getElementById("dialogConfirm").onclick = Dialog.Close;
            document.getElementById("dialogButton").style.display = "none";
        }
    });
}

function signup(username, password){
    var notification_div = document.getElementById("login_notification");

    signup_php(username, password, function(success, notification, selector_validator){
        notification_div.innerHTML = notification;

        if (success){
            storeCredentials(selector_validator);
            saveTodo(todos, function(success, notification2){
                notification_div.innerHTML += "<br>" + notification2;
            });

            initProfileOption();
            document.getElementById("dialogConfirm").innerHTML = "OK";
            document.getElementById("dialogConfirm").onclick = Dialog.Close;
            document.getElementById("dialogButton").style.display = "none";
        }
    });
}

function tryLogin(e){
    var username = (<HTMLInputElement>document.getElementById("username")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;

    var notification_div = document.getElementById("login_notification");
    notification_div.innerHTML = " ";

    document.getElementById("confirm_password_div").style.display = "none";
    document.getElementById("dialogConfirm").onclick = initiateSignup;

    if (username == "" || password == ""){
        notification_div.innerHTML = "must enter username and password!";
    }
    else{
        login(username, password);
    }
}

function initiateSignup(e){
    var notification_div = document.getElementById("login_notification");
    notification_div.innerHTML = "please re-enter password";

    document.getElementById("confirm_password_div").style.display = "inline";
    document.getElementById("confirm_password").focus();
    document.getElementById("dialogConfirm").onclick = trySignup;
}

function trySignup(e){
    var username = (<HTMLInputElement>document.getElementById("username")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var confirm = (<HTMLInputElement>document.getElementById("confirm_password")).value;

    var notification_div = document.getElementById("login_notification");
    notification_div.innerHTML = " ";

    if (username == "" || password == ""){
        notification_div.innerHTML = "must enter username and password!";
    }
    else if (username.length > 64){
        notification_div.innerHTML = "username must be less than 64 characters!";
    }
    else if (password.length < 6){
        notification_div.innerHTML = "password must be at least 6 characters long!";
    }
    else if (password.length > 64){
        notification_div.innerHTML = "password must be less than 64 characters!";
    }
    else if (confirm != password){
        notification_div.innerHTML = "passwords do not match!";
    }
    else{
        signup(username, password);
    }
}
