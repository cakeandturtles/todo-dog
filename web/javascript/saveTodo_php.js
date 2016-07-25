function save_todo_php(selector, validator, todo_text, callback) {
    todo_text = todo_text.split("&").join("aanndd");
    todo_text = todo_text.split("=").join("eeqquuaallss");
    xmlHttpRequest("php/save_todo.php", "selector=" + selector + "&validator=" + validator + "&todo_text=" + todo_text, function (responseText) {
        if (responseText.indexOf("writing=Ok") != -1) {
            callback(true, "todo successfully saved!");
        }
        else if (responseText.indexOf("auth=Bad") != -1) {
            callback(false, "authentication failed.");
        }
        else {
            callback(false, responseText);
        }
    });
}
function load_username_todo_php(selector, validator, callback) {
    xmlHttpRequest("php/load_username_todo.php", "selector=" + selector + "&validator=" + validator, function (responseText) {
        if (responseText.indexOf("auth=Ok") != -1) {
            var username = getPHPResponseVar(responseText, "username");
            var todo_text = getPHPResponseVar(responseText, "todo_text", false);
            todo_text = todo_text.split("aanndd").join("&");
            todo_text = todo_text.split("eeqquuaallss").join("=");
            var todos = todoFromString(todo_text);
            callback(username, todoFromString(todo_text), "todo loaded!");
        }
        else if (responseText.indexOf("auth=Bad") != -1) {
            callback(null, loadFromLocalStorage(""), "authentication failed");
        }
        else {
            callback(null, loadFromLocalStorage(""), responseText);
        }
    });
}
