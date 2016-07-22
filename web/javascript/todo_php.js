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
function load_todo_php(selector, validator) {
    xmlHttpRequest("php/load_todo.php", "selector=" + selector + "&validator=" + validator, function (responseText) {
        var todo_text = "";
        todo_text = todo_text.split("aanndd").join("&");
        todo_text = todo_text.split("eeqquuaallss").join("=");
    });
}
