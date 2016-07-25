function saveTodo(todos: Array<TodoItem>, callback){
    if (typeof(callback) !== 'function')
        callback = function(){};

    var selector_validator = getCredentials();
    if (selector_validator !== ""){
        var selector_validator_arr = selector_validator.split(":");
        var selector = selector_validator_arr[0];
        var validator = selector_validator_arr[1];

        //append localStorageFallback to callback
        var new_callback = function(success, result_text){
            //saving to server failed, save to local storage,
            //pass on callback
            if (!success)
                localStorageFallback(callback);
            else{
                //saving to server was success
                //however, it's nice to have local memory anyway
                //in case authentication fails at some point?
                localStorageFallback(function(){});
                callback(success, result_text);
            }
        }

        save_todo_php(selector, validator, todoToString(todos), new_callback);
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
            callback(false, 'local storage not supported. please create an account.');
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

        //append localStorageFallback to callback
        var new_callback = function(username, todos, resultText){
            //load from server was a success
            if (username !== null){
                callback(username, todos, resultText);

            //load from server failed, fallback to local
            }else{
                localStorageFallback(callback);
            }
        }

        load_username_todo_php(selector, validator, new_callback);
    }else{
        localStorageFallback(callback);
    }

    function localStorageFallback(callback){
        if (typeof(Storage) !== undefined){
            //Code for localstorage/sessionstorage
            callback(null, loadFromLocalStorage(""), "loading from local memory");
        }else{
            //Sorry! no web storage support...
            callback(null, [], "please create an account! local memory not supported");
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
