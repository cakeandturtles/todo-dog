function upDownSelectors(e) {
    if (e.keyCode == 33) {
        todoFirstTextbox(e);
    }
    if (e.keyCode == 34) {
        todoLastTextbox(e);
    }
    if (e.keyCode == 40) {
        e.preventDefault();
        todoNextTextbox(e);
    }
    if (e.keyCode == 38) {
        e.preventDefault();
        todoPrevTextbox(e);
    }
}
function todoNextTextbox(e) {
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    var next = findTodoTextByIndex(index + 1);
    if (next != null && next != undefined) {
        if (index > -1)
            todoTextboxBlur(null, activeElement);
        next = findTodoTextByIndex(index + 1);
        todoTextClick(null, next);
    }
    else {
        if (index > -1)
            todoTextboxBlur(null, activeElement);
        todo_prompt_dom.select();
    }
}
function todoPrevTextbox(e) {
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    var prev = findTodoTextByIndex(index - 1);
    if (index - 1 == -1)
        prev = todo_prompt_dom;
    if (prev != null && prev != undefined) {
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        if (index - 1 > -1) {
            prev = findTodoTextByIndex(index - 1);
            todoTextClick(e, prev);
        }
        else
            todo_prompt_dom.select();
    }
    else {
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        var last_elem = findTodoTextByIndex(todos.length - 1);
        todoTextClick(e, last_elem);
    }
}
function todoFirstTextbox(e) {
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    if (index != -1)
        todoTextboxBlur(e, activeElement);
    todo_prompt_dom.focus();
    todo_prompt_dom.select();
}
function todoLastTextbox(e) {
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    if (index != -1)
        todoTextboxBlur(e, activeElement);
    var last_elem = findTodoTextByIndex(todos.length - 1);
    todoTextClick(e, last_elem);
}
