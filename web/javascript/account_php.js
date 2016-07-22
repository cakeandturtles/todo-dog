function getSelectorValidator(responseText) {
    var selector_i1 = responseText.indexOf("selector=") + "selector=".length;
    var selector_i2 = responseText.indexOf(";", selector_i1 + 1);
    var selector = responseText.slice(selector_i1, selector_i2);
    var validator_i1 = responseText.indexOf("validator=") + "validator=".length;
    var validator_i2 = responseText.indexOf(";", validator_i1 + 1);
    var validator = responseText.slice(validator_i1, validator_i2);
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
