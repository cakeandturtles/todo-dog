function saveTodo(todos) {
    if (typeof (Storage) !== undefined) {
        saveToLocalStorage(todos, "");
    }
    else {
    }
}
function loadTodo() {
    if (typeof (Storage) !== undefined) {
        return loadFromLocalStorage("");
    }
    else {
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
