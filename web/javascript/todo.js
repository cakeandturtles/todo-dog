var todo_prompt_dom;
var todo_list_dom;
var todos = [];
function flatpickr(selector, options) {
    if (options === void 0) { options = undefined; }
}
;
function main() {
    todos = loadTodo();
    todo_list_dom = document.getElementById("todo_list");
    todo_prompt_dom = document.getElementById("todo-textbox-index--1");
    todo_prompt_dom.onkeydown = function (e) { todoPromptKeyDown(e, todo_prompt_dom); };
    todo_prompt_dom.onpaste = function (e) { todoPromptPaste(e, todo_prompt_dom); };
    todo_prompt_dom.focus();
    todo_prompt_dom['todo-index'] = -1;
    flatpickr('.flatpickr');
    createTodoListFromItems(todos, false);
}
window.onload = main;
function getPrevIndex(index_text) {
    var indices = index_text.split("_");
    var i = indices.length - 1;
    var index = parseInt(indices[i]);
    if (index > 0)
        indices[i] = "" + (index - 1);
    else {
        indices.splice(i, 1);
    }
    if (indices.length == 0)
        return "-1";
    return indicesToIndexText(indices);
}
function indicesToIndexText(indices) {
    var index_text = "";
    for (var i = 0; i < indices.length; i++) {
        if (i > 0)
            index_text += "_";
        index_text += indices[i];
    }
    return index_text;
}
function deleteTodo(index_text) {
    var indices = index_text.split("_");
    var todo = new TodoItem("", false);
    todo.subtasks = todos;
    var prev_todo = todo;
    var index = -1;
    for (var i = 0; i < indices.length; i++) {
        index = parseInt(indices[i]);
        prev_todo = todo;
        todo = todo.subtasks[index];
    }
    if (index > -1) {
        if (prev_todo.subtasks == todos)
            todos.splice(index, 1);
        else
            prev_todo.subtasks.splice(index, 1);
        createTodoListFromItems(todos);
    }
}
var TodoItem = (function () {
    function TodoItem(text, checked) {
        this.text = text;
        this.checked = checked;
        this.subtasks = [];
    }
    TodoItem.fromString = function (todo_string) {
        var checked = todo_string[1] == "x";
        todo_string = todo_string.slice(6, todo_string.length);
        var text = todo_string;
        var todo = new TodoItem(text, checked);
        return todo;
    };
    TodoItem.prototype.createString = function () {
        var todo_string = "[";
        if (this.checked)
            todo_string += "x";
        else
            todo_string += " ";
        todo_string += "] - ";
        todo_string += this.text;
        return todo_string;
    };
    return TodoItem;
}());
function addTodoItem(text, index, duedate) {
    todos.splice(index, 0, new TodoItem(text, false));
}
function findTodoTextByIndex(index) {
    return document.getElementById("todo-text-index-" + index);
}
function findTodoTextboxByIndex(index) {
    return document.getElementById("todo-textbox-index-" + index);
}
function createTodoListFromItems(todos, save_list) {
    if (save_list === void 0) { save_list = true; }
    todo_list_dom.innerHTML = "";
    for (var i = 0; i < todos.length; i++) {
        createTodoItem(todos[i], "" + i, 0);
    }
    if (save_list)
        saveTodo(todos);
}
function createTodoItem(todo, index, indent) {
    var todo_item_dom = document.createElement("div");
    var check = document.createElement("input");
    check.type = 'checkbox';
    check.checked = todo.checked;
    check.className = "todo-check";
    check.id = "todo-check-index-" + index;
    check['todo-index'] = index;
    check.onclick = function (e) { todoCheckClick(e, this); }.bind(check);
    var text = document.createElement("span");
    text.innerHTML = todo.text;
    if (todo.checked)
        text.className = "todo-text-checked";
    else
        text.className = "todo-text";
    text.id = "todo-text-index-" + index;
    text['todo-index'] = index;
    text.onclick = function (e) { todoTextClick(e, this); }.bind(text);
    var textbox = document.createElement("input");
    textbox.type = "textbox";
    textbox.value = todo.text;
    textbox.className = "todo-textbox";
    textbox.onkeydown = function (e) { todoTextboxKeyDown(e, this); }.bind(textbox);
    textbox.onpaste = function (e) { todoTextboxPaste(e, this); }.bind(textbox);
    textbox.onblur = function (e) { todoTextboxBlur(e, this); }.bind(textbox);
    textbox.id = "todo-textbox-index-" + index;
    textbox['todo-index'] = index;
    textbox.placeholder = "write a todo";
    textbox.style.display = "none";
    check.style.marginLeft = (indent * 8) + "px";
    todo_item_dom.appendChild(check);
    todo_item_dom.appendChild(document.createTextNode(" "));
    todo_item_dom.appendChild(text);
    todo_item_dom.appendChild(textbox);
    todo_list_dom.appendChild(todo_item_dom);
    for (var i = 0; i < todo.subtasks.length; i++) {
        createTodoItem(todo.subtasks[i], index + "_" + i, indent + 4);
    }
}
