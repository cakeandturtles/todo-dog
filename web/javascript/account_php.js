function getPHPResponseVar(responseText, varname, semicolon) {
    if (semicolon === void 0) { semicolon = true; }
    var i1 = responseText.indexOf(varname + "=") + varname.length + 1;
    var i2 = responseText.length;
    if (semicolon)
        i2 = responseText.indexOf(";", i1 + 1);
    return responseText.slice(i1, i2);
}
function getSelectorValidator(responseText) {
    var selector = getPHPResponseVar(responseText, "selector");
    var validator = getPHPResponseVar(responseText, "validator");
    var selector_validator = selector + ":" + validator;
    return selector_validator;
}
function login_php(username, password, callback) {
    xmlHttpRequest("php/loginUser.php", "username=" + username + "&password=" + password, function (responseText) {
        if (responseText.indexOf("login=Ok") != -1) {
            var selector_validator = getSelectorValidator(responseText);
            callback(true, "successfully logged in!", selector_validator);
        }
        else if (responseText.indexOf("login=Bad") != -1) {
            callback(false, "incorrect username/password", null);
        }
        else {
            callback(false, responseText, null);
        }
    });
}
function signup_php(username, password, callback) {
    xmlHttpRequest("php/checkUser.php", "username=" + username, function (responseText) {
        if (responseText.indexOf("username=Exists") != -1) {
            callback(false, "username already exists!", null);
        }
        else if (responseText.indexOf("username=Ok") != -1) {
            xmlHttpRequest("php/createUser.php", "username=" + username + "&password=" + password, function (responseText2) {
                if (responseText2.indexOf("writing=Ok") != -1) {
                    var selector_validator = getSelectorValidator(responseText2);
                    callback(true, "account successfully created", selector_validator);
                }
                else {
                    callback(false, responseText2, null);
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
