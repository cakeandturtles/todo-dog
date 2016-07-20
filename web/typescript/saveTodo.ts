function saveTodo(todos: Array<TodoItem>){
    if (typeof(Storage) !== undefined){
        //Code for localstorage/sessionstorage
        saveToLocalStorage(todos);
    }else{
        //Sorry! no web storage support...
    }
}

function loadTodo(): Array<TodoItem>{
    if (typeof(Storage) !== undefined){
        //Code for localstorage/sessionstorage
        return loadFromLocalStorage();
    }else{
        //Sorry! no web storage support...
    }
}

//local storage
function saveToLocalStorage(todos: Array<TodoItem>){
    try{
        localStorage.setItem("num_todos", todos.length.toString());
        for (var i = 0; i < todos.length; i++){
            localStorage.setItem("todo-"+i, todos[i].createString());
        }
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}
function loadFromLocalStorage(){
    var todos: Array<TodoItem> = [];
    try{
        var num_todos: Number = parseInt(localStorage.getItem("num_todos"));
        for (var i = 0; i < num_todos; i++){
            var todo_string = localStorage.getItem("todo-"+i);
            todos.push(TodoItem.fromString(todo_string));
        }
    }catch(err){
        console.log(err);
    }
    return todos;
}
