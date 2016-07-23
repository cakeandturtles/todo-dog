function saveTodo(todos, callback) {
    if (typeof (callback) !== 'function')
        callback = function () { };
    var selector_validator = getCredentials();
    if (selector_validator !== "") {
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];
        save_todo_php(selector, validator, todoToString(todos), callback);
    }
    else {
        localStorageFallback(callback);
    }
    function localStorageFallback(callback) {
        if (typeof (Storage) !== undefined) {
            saveToLocalStorage(todos, "");
            callback(false, "saved to local storage, not logged in");
        }
        else {
            alert('need to add cookie support. email cakeandturtles@gmail.com');
        }
    }
}
function loadTodo(callback) {
    if (typeof (callback) !== 'function')
        callback = function () { };
    var selector_validator = getCredentials();
    if (selector_validator !== "") {
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];
        load_username_todo_php(selector, validator, callback);
    }
    else {
        localStorageFallback(callback);
    }
    function localStorageFallback(callback) {
        if (typeof (Storage) !== undefined) {
            callback(null, loadFromLocalStorage(""));
        }
        else {
            callback(null, []);
        }
    }
}
function todoToString(todos, indent) {
    if (indent === void 0) { indent = 0; }
    var todo_text = "";
    for (var i = 0; i < todos.length; i++) {
        for (var j = 0; j < indent; j++) {
            todo_text += "\t";
        }
        todo_text += todos[i].createString();
        todo_text += todoToString(todos[i].subtasks, indent + 1);
        todo_text += "\n";
    }
    return todo_text;
}
function todoFromString(todo_str) {
    var todo_lines = todo_str.split("\n");
    var todos = [];
    var prev_todo = new TodoItem("", false);
    for (var i = 0; i < todo_lines.length; i++) {
        var todo_line = todo_lines[i];
        var todo = TodoItem.fromString(todo_line);
        if (todo_line[0] == '\t') {
            prev_todo.subtasks.push(todo);
        }
        else {
            todos.push(todo);
            prev_todo = todo;
        }
    }
}
function saveToLocalStorage(todos, prefix) {
    try {
        localStorage.setItem(prefix + "num_todos", todos.length.toString());
        for (var i = 0; i < todos.length; i++) {
            localStorage.setItem(prefix + "todo-" + i, todos[i].createString());
            saveToLocalStorage(todos[i].subtasks, prefix + "todo-" + i);
        }
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
function loadFromLocalStorage(prefix) {
    var todos = [];
    try {
        var num_todos = parseInt(localStorage.getItem(prefix + "num_todos"));
        for (var i = 0; i < num_todos; i++) {
            var todo_string = localStorage.getItem(prefix + "todo-" + i);
            var todo = TodoItem.fromString(todo_string);
            todo.subtasks = loadFromLocalStorage(prefix + "todo-" + i);
            todos.push(todo);
        }
    }
    catch (err) {
        console.log(err);
    }
    return todos;
}
