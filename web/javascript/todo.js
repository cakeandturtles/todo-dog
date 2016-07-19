var todo_prompt_dom;
var todo_list_dom;
var todos = [];
function main() {
    todo_list_dom = document.getElementById("todo_list");
    todo_prompt_dom = document.getElementById("todo-textbox-index--1");
    todo_prompt_dom.onkeypress = function (e) { todoPromptKeyPress(e, todo_prompt_dom); };
    todo_prompt_dom.onpaste = function (e) { todoPromptPaste(e, todo_prompt_dom); };
    todo_prompt_dom.focus();
    todo_prompt_dom['todo-index'] = -1;
}
window.onload = main;
window.onclick = function (e) {
    try {
        var active = document.activeElement;
        var className = active.className;
        if (className != "todo-textbox") {
            todo_prompt_dom.focus();
        }
    }
    catch (err) {
        todo_prompt_dom.focus();
    }
};
window.onkeydown = function (e) {
    if (e.keyCode == 33) {
        todoFirstTextbox(e);
    }
    if (e.keyCode == 34) {
        todoLastTextbox(e);
    }
    if ((e.keyCode == 9 && !e.shiftKey) || e.keyCode == 40) {
        e.preventDefault();
        todoNextTextbox(e);
    }
    if ((e.keyCode == 9 && e.shiftKey) || e.keyCode == 38) {
        e.preventDefault();
        todoPrevTextbox(e);
    }
};
var TODO_NEW = 13;
var TODO_DEL = 8;
function todoPromptKeyPress(e, dom) {
    if (e.keyCode == TODO_NEW && dom.value != "") {
        addTodoItem(dom.value, 0);
        dom.value = "";
        createTodoListFromItems(todos);
    }
}
function todoPromptPaste(e, dom) {
    try {
        var clipboard_data = e.clipboardData || window['clipboardData'];
        var pasted_text = clipboard_data.getData('Text');
        var lines = pasted_text.split("\n");
        for (var i = lines.length - 1; i >= 0; i--) {
            addTodoItem(lines[i], 0);
        }
        createTodoListFromItems(todos);
        return false;
    }
    catch (err) {
        console.log(err);
        return true;
    }
}
function todoTextboxKeyPress(e, dom) {
    var index = parseInt(dom['todo-index']);
    todos[index].text = dom.value;
    function deleteMe(index) {
        if (index > -1) {
            todos.splice(index, 1);
            createTodoListFromItems(todos);
            var prev_dom = findTodoTextboxByIndex(index - 1);
            prev_dom.focus();
        }
    }
    if (e.keyCode == TODO_DEL && dom.value == "") {
        deleteMe(index);
    }
    else if (e.keyCode == TODO_NEW) {
        if (dom.value != "") {
            todoTextboxBlur(null, dom);
            todo_prompt_dom.focus();
        }
        else {
            deleteMe(index);
        }
    }
}
function todoTextboxPaste(e, dom) {
}
function todoTextboxBlur(e, dom) {
    var index = parseInt(dom['todo-index']);
    var text_dom = findTodoTextByIndex(index);
    var text = dom.value;
    todos[index].text = text;
    text_dom.innerHTML = text;
    dom.style.display = "none";
    text_dom.style.display = "inline-block";
}
function todoTextClick(e, dom) {
    var index = parseInt(dom['todo-index']);
    var textbox = findTodoTextboxByIndex(index);
    dom.style.display = "none";
    textbox.style.display = "inline-block";
    textbox.focus();
    textbox.select();
}
function todoNextTextbox(e) {
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    var next = findTodoTextByIndex(index + 1);
    if (next != null && next != undefined) {
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        todoTextClick(e, next);
    }
    else {
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        todo_prompt_dom.focus();
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
        if (index - 1 > -1)
            todoTextClick(e, prev);
        else {
            todo_prompt_dom.focus();
            todo_prompt_dom.select();
        }
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
var TodoItem = (function () {
    function TodoItem(text, checked) {
        this.text = text;
        this.checked = checked;
    }
    return TodoItem;
}());
function addTodoItem(text, index) {
    todos.splice(index, 0, new TodoItem(text, false));
}
function findTodoTextByIndex(index) {
    return document.getElementById("todo-text-index-" + index);
}
function findTodoTextboxByIndex(index) {
    return document.getElementById("todo-textbox-index-" + index);
}
function createTodoListFromItems(todos) {
    todo_list_dom.innerHTML = "";
    for (var i = 0; i < todos.length; i++) {
        var todo_item_dom = document.createElement("div");
        var check = document.createElement("input");
        check.type = 'checkbox';
        check.checked = todos[i].checked;
        check.className = "todo-check";
        check.id = "todo-check-index-" + i;
        var text = document.createElement("span");
        text.innerHTML = todos[i].text;
        text.className = "todo-text";
        text.id = "todo-text-index-" + i;
        text['todo-index'] = i;
        text.onclick = function (e) { todoTextClick(e, this); }.bind(text);
        var textbox = document.createElement("input");
        textbox.type = "textbox";
        textbox.value = todos[i].text;
        textbox.className = "todo-textbox";
        textbox.onkeypress = function (e) { todoTextboxKeyPress(e, this); }.bind(textbox);
        textbox.onpaste = function (e) { todoTextboxPaste(e, this); }.bind(textbox);
        textbox.onblur = function (e) { todoTextboxBlur(e, this); }.bind(textbox);
        textbox.id = "todo-textbox-index-" + i;
        textbox['todo-index'] = i;
        textbox.placeholder = "write a todo";
        textbox.style.display = "none";
        todo_item_dom.appendChild(check);
        todo_item_dom.appendChild(document.createTextNode(" "));
        todo_item_dom.appendChild(text);
        todo_item_dom.appendChild(textbox);
        todo_list_dom.appendChild(todo_item_dom);
    }
}
