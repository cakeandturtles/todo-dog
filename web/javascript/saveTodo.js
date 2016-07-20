function saveTodo(todos) {
    if (typeof (Storage) !== undefined) {
        saveToLocalStorage(todos);
    }
    else {
    }
}
function loadTodo() {
    if (typeof (Storage) !== undefined) {
        return loadFromLocalStorage();
    }
    else {
    }
}
function saveToLocalStorage(todos) {
    try {
        localStorage.setItem("num_todos", todos.length.toString());
        for (var i = 0; i < todos.length; i++) {
            localStorage.setItem("todo-" + i, todos[i].createString());
        }
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}
function loadFromLocalStorage() {
    var todos = [];
    try {
        var num_todos = parseInt(localStorage.getItem("num_todos"));
        for (var i = 0; i < num_todos; i++) {
            var todo_string = localStorage.getItem("todo-" + i);
            todos.push(TodoItem.fromString(todo_string));
        }
    }
    catch (err) {
        console.log(err);
    }
    return todos;
}
