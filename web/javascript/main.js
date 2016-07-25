function flatpickr(selector, options) {
    if (options === void 0) { options = undefined; }
}
;
var USERNAME = null;
function main() {
    loadTodo(function (username, todo_list, result_text) {
        todos = todo_list;
        USERNAME = username;
        initApp();
        if (USERNAME !== null)
            initProfileOption();
    });
}
window.onload = main;
function initApp() {
    todo_list_dom = document.getElementById("todo_list");
    todo_prompt_dom = document.getElementById("todo-textbox-index--1");
    todo_prompt_dom.onkeydown = function (e) { todoPromptKeyDown(e, todo_prompt_dom); };
    todo_prompt_dom.onpaste = function (e) { todoPromptPaste(e, todo_prompt_dom); };
    todo_prompt_dom.focus();
    todo_prompt_dom['todo-index'] = -1;
    document.getElementById("login").onclick = loginDomClick;
    flatpickr('.flatpickr');
    createTodoListFromItems(todos, false);
}
