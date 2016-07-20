var todo_prompt_dom:HTMLInputElement;
var todo_list_dom;
var todos = [];

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

    //initialize flatpickr??
    flatpickr('.flatpickr');

    //generate the list!
    createTodoListFromItems(todos, false);
}
window.onload = main;


function deleteTodo(index){
    if (index > -1){
        todos.splice(index, 1);
        //regenerate todo list
        createTodoListFromItems(todos);
    }
}

/////////////////////////////////////////////////////////
class TodoItem{
    public constructor(public text:string, public checked:boolean){}

    public static fromString(todo_string: string): TodoItem{
        var checked = todo_string[1] == "x";
        todo_string = todo_string.slice(6, todo_string.length);
        var text = todo_string;

        var todo = new TodoItem(text, checked);
        return todo;
    }

    public createString(): string{
        var todo_string = "[";
        if (this.checked)
            todo_string += "x";
        else todo_string += " ";
        todo_string += "] - ";

        todo_string += this.text;

        return todo_string;
    }
}

function addTodoItem(text: string, index: number, duedate: Date){
    todos.splice(index, 0, new TodoItem(text, false));
}

function findTodoTextByIndex(index: Number){
    return document.getElementById("todo-text-index-"+index);
}

function findTodoTextboxByIndex(index: Number){
    return <HTMLInputElement>document.getElementById("todo-textbox-index-"+index);
}

function createTodoListFromItems(todos:Array<TodoItem>, save_list: boolean = true){
    //first clear todo list dom
    todo_list_dom.innerHTML = "";

    //now regenerate list from every single todo in todos object
    for (var i = 0; i < todos.length; i++){
        var todo_item_dom = document.createElement("div");
        var check = document.createElement("input");
        check.type='checkbox';
        check.checked = todos[i].checked;
        check.className = "todo-check";
        check.id = "todo-check-index-"+i;

        var text = document.createElement("span");
        text.innerHTML = todos[i].text;
        text.className = "todo-text";
        text.id = "todo-text-index-"+i;
        text['todo-index'] = i;
        text.onclick = function(e){ todoTextClick(e, this); }.bind(text);

        var textbox = document.createElement("input");
        textbox.type="textbox";
        textbox.value = todos[i].text;
        textbox.className = "todo-textbox";
        textbox.onkeydown = function(e){ todoTextboxKeyDown(e, this); }.bind(textbox);
        textbox.onpaste = function(e){ todoTextboxPaste(e, this); }.bind(textbox);
        textbox.onblur = function(e){ todoTextboxBlur(e, this); }.bind(textbox);
        textbox.id = "todo-textbox-index-"+i;
        textbox['todo-index'] = i;
        textbox.placeholder = "write a todo";
        textbox.style.display = "none";

        todo_item_dom.appendChild(check);
        todo_item_dom.appendChild(document.createTextNode(" "));
        todo_item_dom.appendChild(text);
        todo_item_dom.appendChild(textbox);
        todo_list_dom.appendChild(todo_item_dom);
    }

    if (save_list)
        saveTodo(todos);
}
