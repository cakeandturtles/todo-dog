var TODO_NEW = 13;
var TODO_DEL = 8;
var TODO_ESC = 27;
function todoPromptKeyDown(e, dom) {
    if (e.keyCode == TODO_NEW && dom.value != "") {
        addTodoItem(dom.value, 0, null);
        dom.value = "";
        createTodoListFromItems(todos);
    }
    else {
    }
    upDownSelectors(e);
}
function todoPromptPaste(e, dom) {
    try {
        var clipboard_data = e.clipboardData || window['clipboardData'];
        var pasted_text = clipboard_data.getData('Text');
        var lines = pasted_text.split("\n");
        for (var i = lines.length - 1; i >= 0; i--) {
            addTodoItem(lines[i], 0, null);
        }
        createTodoListFromItems(todos);
        return false;
    }
    catch (err) {
        console.log(err);
        return true;
    }
}
function todoTextboxKeyDown(e, dom) {
    var index = parseInt(dom['todo-index']);
    todos[index].text = dom.value;
    if (e.keyCode == TODO_NEW) {
        if (dom.value != "") {
            todoTextboxBlur(null, dom);
        }
        else {
            deleteTodo(index);
            todo_prompt_dom.select();
            return;
        }
    }
    if (e.keyCode == TODO_DEL) {
        if (dom['value'] === "") {
            var index_str = dom['todo-index'];
            if (index_str !== undefined && index_str !== null) {
                var index = parseInt(index_str);
                deleteTodo(index);
                if (index > 0) {
                    createTodoListFromItems(todos);
                    window.setTimeout(function () {
                        todoTextClick(null, findTodoTextByIndex(index - 1));
                    }, 100);
                }
                else {
                    todo_prompt_dom.select();
                }
                return;
            }
        }
    }
    if (e.keyCode == TODO_ESC) {
        todo_prompt_dom.select();
    }
    var text = dom.value;
    todos[index].text = text;
    upDownSelectors(e);
}
function todoTextboxPaste(e, dom) {
}
function todoTextboxBlur(e, dom) {
    createTodoListFromItems(todos);
}
function todoTextClick(e, dom) {
    var index = parseInt(dom['todo-index']);
    var textbox = findTodoTextboxByIndex(index);
    dom.style.display = "none";
    textbox.style.display = "inline-block";
    textbox.value = todos[index].text;
    textbox.select();
}
function tryRegainFocus() {
    try {
        var active = document.activeElement;
        var className = active.className;
        if (className.indexOf("todo") < 0) {
            todo_prompt_dom.focus();
        }
    }
    catch (err) {
        todo_prompt_dom.focus();
    }
}
