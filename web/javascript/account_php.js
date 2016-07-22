function login_php(username, password, callback) {
    xmlHttpRequest("php/loginUser.php", "username=" + username + "&password=" + password, function (responseText) {
        if (responseText.indexOf("login=Ok") != -1) {
            callback(true, "successfully logged in!");
        }
        else if (responseText.indexOf("login=Bad") != -1) {
            callback(false, "incorrect username/password");
        }
        else {
            callback(false, responseText);
        }
    });
}
function signup_php(username, password, callback) {
    xmlHttpRequest("php/checkUser.php", "username=" + username, function (responseText) {
        if (responseText.indexOf("username=Exists") != -1) {
            callback(false, "username already exists!");
        }
        else if (responseText.indexOf("username=Ok") != -1) {
            xmlHttpRequest("php/createUser.php", "username=" + username + "&password=" + password, function (responseText2) {
                if (responseText2.indexOf("writing=Ok") != -1) {
                    callback(true, "account successfully created");
                }
                else {
                    callback(false, responseText2);
                }
            });
        }
        else {
            callback(false, responseText);
        }
    });
}
function xmlHttpRequest(url, params, callback) {
    var xmlhttp;
    if (window['XMLHttpRequest']) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}
