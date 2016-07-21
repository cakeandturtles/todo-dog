function saveTodo(todos: Array<TodoItem>){
    if (typeof(Storage) !== undefined){
        //Code for localstorage/sessionstorage
        saveToLocalStorage(todos, "");
    }else{
        //Sorry! no web storage support...
    }
}

function loadTodo(): Array<TodoItem>{
    if (typeof(Storage) !== undefined){
        //Code for localstorage/sessionstorage
        return loadFromLocalStorage("");
    }else{
        //Sorry! no web storage support...
    }
}

//local storage
function saveToLocalStorage(todos: Array<TodoItem>, prefix: string){
    try{
        localStorage.setItem(prefix + "num_todos", todos.length.toString());
        for (var i = 0; i < todos.length; i++){
            localStorage.setItem(prefix + "todo-"+i, todos[i].createString());
            saveToLocalStorage(todos[i].subtasks, prefix + "todo-"+i);
        }
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}
function loadFromLocalStorage(prefix: string){
    var todos: Array<TodoItem> = [];
    try{
        var num_todos: Number = parseInt(localStorage.getItem(prefix + "num_todos"));
        for (var i = 0; i < num_todos; i++){
            var todo_string = localStorage.getItem(prefix + "todo-"+i);
            var todo = TodoItem.fromString(todo_string);
            todo.subtasks = loadFromLocalStorage(prefix + "todo-"+i);
            todos.push(todo);
        }
    }catch(err){
        console.log(err);
    }
    return todos;
}
