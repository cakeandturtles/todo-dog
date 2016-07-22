//dummy lib functions (will be loaded through index)
function flatpickr(selector, options = undefined){};

function main(){
    //try to load the todos!
    todos = loadTodo();

    todo_list_dom = document.getElementById("todo_list");

    todo_prompt_dom = <HTMLInputElement>document.getElementById("todo-textbox-index--1");
    todo_prompt_dom.onkeydown = function(e){ todoPromptKeyDown(e, todo_prompt_dom); };
    todo_prompt_dom.onpaste = function(e){ todoPromptPaste(e, todo_prompt_dom); };
    todo_prompt_dom.focus();
    todo_prompt_dom['todo-index'] = -1;

    //initialize button click events
    document.getElementById("login").onclick = loginDomClick;

    //initialize flatpickr??
    flatpickr('.flatpickr');

    //generate the list!
    createTodoListFromItems(todos, false);
}
window.onload = main;
