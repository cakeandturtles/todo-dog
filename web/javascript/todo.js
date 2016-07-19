var todo_prompt_dom;
var todo_list_dom;
var todos = [];
function main() {
    todo_list_dom = document.getElementById("todo_list");
    todo_prompt_dom = document.getElementById("item_0");
    todo_prompt_dom.onkeydown = todoPromptKeyDown;
    todo_prompt_dom.oninput = todoPromptInput;
    todo_prompt_dom.onpaste = todoPromptPaste;
    todo_prompt_dom.focus();
}
window.onload = main;
function todoPromptKeyDown(e) {
    if (e.keyCode == 13) {
        addTodoItem(todo_prompt_dom.value);
        todo_prompt_dom.value = "";
        createTodoListFromItems(todos);
    }
}
function todoPromptInput(e) { }
function todoPromptPaste(e) {
    try {
        var clipboard_data = e.clipboardData || window['clipboardData'];
        var pasted_text = clipboard_data.getData('Text');
        var lines = pasted_text.split("\n");
        for (var i = lines.length - 1; i >= 0; i--) {
            addTodoItem(lines[i]);
        }
        createTodoListFromItems(todos);
        return false;
    }
    catch (err) {
        console.log(err);
        return true;
    }
}
var TodoItem = (function () {
    function TodoItem(text, checked) {
        this.text = text;
        this.checked = checked;
    }
    return TodoItem;
}());
function addTodoItem(text) {
    todos.splice(0, 0, new TodoItem(text, false));
}
function createTodoListFromItems(todos) {
    todo_list_dom.innerHTML = "";
    for (var i = 0; i < todos.length; i++) {
        var todo_item_dom = document.createElement("div");
        var check = document.createElement("input");
        check.type = 'checkbox';
        check.checked = todos[i].checked;
        check.className = "todo-check";
        var text = document.createElement("input");
        text.type = "textbox";
        text.value = todos[i].text;
        text.className = "todo-text";
        todo_item_dom.appendChild(check);
        todo_item_dom.appendChild(document.createTextNode(" "));
        todo_item_dom.appendChild(text);
        todo_list_dom.appendChild(todo_item_dom);
    }
}
