function saveTodo(todos: Array<TodoItem>, callback){
    if (typeof(callback) !== 'function')
        callback = function(){};

    var selector_validator = getCredentials();
    if (selector_validator !== ""){
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

function loadTodo(callback){
    if (typeof(callback) !== 'function')
        callback = function(){};

    var selector_validator = getCredentials();
    if (selector_validator !== ""){
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];
        load_username_todo_php(selector, validator, callback);
    }else{
        localStorageFallback(callback);
    }

    function localStorageFallback(callback){
        if (typeof(Storage) !== undefined){
            //Code for localstorage/sessionstorage
            callback(null, loadFromLocalStorage(""));
        }else{
            //Sorry! no web storage support...
            callback(null, []);
        }
    }
}

//to string
function todoToString(todos: Array<TodoItem>, indent: number = 0){
    var todo_text = "";
    for (var i = 0; i < todos.length; i++){
        for (var j = 0; j < indent; j++){
            todo_text += "\t";
        }
        todo_text += todos[i].createString();
        todo_text += todoToString(todos[i].subtasks, indent + 1);
        todo_text += "\n";
    }
    return todo_text;
}
//from string
function todoFromString(todo_str: string){
    var todo_lines = todo_str.split("\n");
    var todos = [];
    var prev_todo = new TodoItem("", false);
    for (var i = 0; i < todo_lines.length; i++){
        var todo_line = todo_lines[i];
        var todo = TodoItem.fromString(todo_line);
        //TODO:: currently we don't allow nested subtasks
        //but if we do, this needs to be fixed
        if (todo_line[0] == '\t'){
            prev_todo.subtasks.push(todo);
        }
        else{
            todos.push(todo);
            prev_todo = todo;
        }
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
