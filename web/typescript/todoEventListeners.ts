var TODO_NEW = 13; //enter
var TODO_DEL = 8; //backspace
var TODO_ESC = 27;

function todoCheckClick(e, dom){
    var index = parseInt(dom['todo-index']);
    var text_dom = findTodoTextByIndex(index);
    if (dom.checked){
        text_dom.className = "todo-text-checked";
    }else{
        text_dom.className = "todo-text";
    }

    todos[index].checked = dom.checked;
    saveTodo(todos, function(success, result_text){
        //TODO??
    });
}

function todoPromptKeyDown(e, dom){
    //enter key when input not empty (add new item!!)
    if (e.keyCode == TODO_NEW && dom.value != ""){
        addTodoItem(dom.value, 0, null);
        var text = dom.value;
        dom.value = "";

        //if user put a ":" at the end... start a list!!!
        var start_subtasks = false;
        if (text[text.length-1] == ":"){
            todos[0].subtasks.push(new TodoItem("", false));
            start_subtasks = true;
        }
        //regenerate todo list
        createTodoListFromItems(todos);
        //if we're starting subtasks, focus the current subtask!
        if (start_subtasks){
            var text_dom = findTodoTextByIndex("0_0");
            todoTextClick(null, text_dom);
        }
    }
    else{
        //try to search for date/time in text!!!
    }

    upDownSelectors(e);
}

function todoPromptPaste(e, dom){
    try{
        var clipboard_data = e.clipboardData || window['clipboardData'];
        var pasted_text = clipboard_data.getData('Text');

        var lines = pasted_text.split("\n");
        //in reverse order add items
        for (var i = lines.length-1; i >= 0; i--){
            addTodoItem(lines[i], 0, null);
        }

        createTodoListFromItems(todos);
        return false;
    }catch(err){
        console.log(err);
        return true;
    }
}
function todoTextboxKeyDown(e, dom){
    //deal with subtasks
    var index_text = dom['todo-index'];
    var indices = index_text.split("_");
    //make a "fake" todo with subtasks being all todo items
    var todo = new TodoItem("", false); todo.subtasks = todos;
    var parent = todo;
    for (var i = 0; i < indices.length; i++){
        parent = todo;
        todo = todo.subtasks[parseInt(indices[i])];
    }
    //remember the changed value
    todo.text = dom.value;

    //pressing enter
    if (e.keyCode == TODO_NEW){
        //there actually is text!!
        if (dom.value != ""){
            todoTextboxBlur(null, dom);
            //if we are on a subtask list... create a new subtask!!!
            //and then select it
            if (indices.length > 1){
                parent.subtasks.push(new TodoItem("", false));
                var last_index = parseInt(indices[indices.length-1]);
                indices[indices.length-1] = ""+(last_index+1);
                createTodoListFromItems(todos);
                var new_subtask_dom = findTodoTextByIndex(indicesToIndexText(indices));
                todoTextClick(null, new_subtask_dom);
            }
        }else{
            deleteTodo(index_text);
            todo_prompt_dom.select();
            return;
        }
    }
    if (e.keyCode == TODO_DEL){
        if (dom['value'] === ""){
            deleteTodo(index_text);

            createTodoListFromItems(todos);
            console.log(index_text);
            index_text = getPrevIndex(index_text);
            console.log(index_text);
            if (index_text != "-1"){
                window.setTimeout(function(){
                    todoTextClick(null, findTodoTextByIndex(index_text));
                }, 100);
            }
            else
                todo_prompt_dom.select();

            return;
        }
    }
    if (e.keyCode == TODO_ESC){
        if (dom.value == "")
            deleteTodo(index_text);
        todo_prompt_dom.select();
    }

    //remember the changed value
    todo.text = dom.value;

    upDownSelectors(e);
}

function todoTextboxPaste(e, dom){
}

function todoTextboxBlur(e, dom){
    createTodoListFromItems(todos);
}

function todoTextClick(e, dom){
    //deal with subtasks
    var index_text = dom['todo-index'];
    var indices = index_text.split("_");
    //make a "fake" todo with subtasks being all todo items
    var todo = new TodoItem("", false); todo.subtasks = todos;
    for (var i = 0; i < indices.length; i++){
        todo = todo.subtasks[parseInt(indices[i])];
    }

    var textbox = findTodoTextboxByIndex(index_text);

    dom.style.display = "none";
    textbox.style.display = "inline-block";

    textbox.value = todo.text;

    //select all text for easy replacing/deleting??
    textbox.select();
}

function tryRegainFocus(){
    try{
        var active = document.activeElement;
        var className = active.className;
        if (className.indexOf("todo") < 0){
            todo_prompt_dom.focus();
        }
    }catch(err){
        //refocus the prompt
        todo_prompt_dom.focus();
    }
}
