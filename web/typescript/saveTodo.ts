function saveTodo(todos: Array<TodoItem>, callback){
    var selector_validator = getCredentials();
    if (selector_validator !== undefined && selector_validator !== null){
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];
        save_todo_php(selector, validator, todoToString(todos), callback);
    }else{
        localStorageFallback(callback);
    }

    function localStorageFallback(callback){
        if (typeof(Storage) !== undefined){
            //Code for localstorage/sessionstorage
            saveToLocalStorage(todos, "");
            callback(false, "saved to local storage, not logged in");
        }else{
            //Sorry! no web storage support...
            alert('need to add cookie support. email cakeandturtles@gmail.com');
        }
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

//to string
function todoToString(todos: Array<TodoItem>, indent: number = 0){
    var todo_text = "";
    for (var i = 0; i < todos.length; i++){
        for (var j = 0; j < indent; j++){
            todo_text += " ";
        }
        todo_text += todos[i].createString();
        todo_text += todoToString(todos[i].subtasks, indent + 4);
    }
    return todo_text;
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
