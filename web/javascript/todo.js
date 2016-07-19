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
            var text_dom = findTodoTextByIndex(index);
            var text = dom.value;
            todos[index].text = text;
            text_dom.innerHTML = text;
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
