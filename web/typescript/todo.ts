var todo_prompt_dom:HTMLInputElement;
var todo_list_dom;
var todos = [];
function main(){
    todo_list_dom = document.getElementById("todo_list");

    todo_prompt_dom = <HTMLInputElement>document.getElementById("todo-textbox-index--1");
    todo_prompt_dom.onkeypress = function(e){ todoPromptKeyPress(e, todo_prompt_dom); };
    todo_prompt_dom.onpaste = function(e){ todoPromptPaste(e, todo_prompt_dom); };
    todo_prompt_dom.focus();
    todo_prompt_dom['todo-index'] = -1;
}
window.onload = main;

window.onclick = function(e){
    try{
        var active = document.activeElement;
        var className = active.className;
        if (className != "todo-textbox"){
            todo_prompt_dom.focus();
        }
    }catch(err){
        //refocus the prompt
        todo_prompt_dom.focus();
    }
}
window.onkeydown = function(e){
    //page up
    if (e.keyCode == 33){
        todoFirstTextbox(e);
    }
    if (e.keyCode == 34){
        todoLastTextbox(e);
    }

    //tab or down arrow
    if ((e.keyCode == 9 && !e.shiftKey) || e.keyCode == 40){
        e.preventDefault();
        todoNextTextbox(e);
    }

    //shift+tab or up arrow
    if ((e.keyCode == 9 && e.shiftKey) || e.keyCode == 38){
        e.preventDefault();
        todoPrevTextbox(e);
    }
}

var TODO_NEW = 13; //enter
var TODO_DEL = 8; //backspace

function todoPromptKeyPress(e, dom){
    //enter key when input not empty (add new item!!)
    if (e.keyCode == TODO_NEW && dom.value != ""){
        addTodoItem(dom.value, 0);
        dom.value = "";

        //regenerate todo list
        createTodoListFromItems(todos);
    }
}

function todoPromptPaste(e, dom){
    try{
        var clipboard_data = e.clipboardData || window['clipboardData'];
        var pasted_text = clipboard_data.getData('Text');

        var lines = pasted_text.split("\n");
        //in reverse order add items
        for (var i = lines.length-1; i >= 0; i--){
            addTodoItem(lines[i], 0);
        }

        createTodoListFromItems(todos);
        return false;
    }catch(err){
        console.log(err);
        return true;
    }
}

function todoTextboxKeyPress(e, dom){
    var index = parseInt(dom['todo-index']);
    todos[index].text = dom.value;

    function deleteMe(index){
        if (index > -1){
            todos.splice(index, 1);
            //regenerate todo list
            createTodoListFromItems(todos);

            //focus previous todo
            var prev_dom = findTodoTextboxByIndex(index-1);
            prev_dom.focus();
        }
    }

    //backspace key when input empty (delete item!!)
    if (e.keyCode == TODO_DEL && dom.value == ""){
        deleteMe(index);
    }
    //pressing enter
    else if (e.keyCode == TODO_NEW){
        //there actually is text!!
        if (dom.value != ""){
            todoTextboxBlur(null, dom);
            //refocus the prompt (manually because otherwise is only done on window click)
            todo_prompt_dom.focus();
        }else{
            deleteMe(index);
        }
    }
}

function todoTextboxPaste(e, dom){
}

function todoTextboxBlur(e, dom){
    var index = parseInt(dom['todo-index']);
    var text_dom = findTodoTextByIndex(index);

    //remember the changed value
    var text = dom.value;
    todos[index].text = text;
    text_dom.innerHTML = text;

    //hide the textbox
    dom.style.display = "none";
    //show the text
    text_dom.style.display = "inline-block";
}

function todoTextClick(e, dom){
    var index = parseInt(dom['todo-index']);
    var textbox = findTodoTextboxByIndex(index);

    dom.style.display = "none";
    textbox.style.display = "inline-block";
    //not sure if this is redundant
    textbox.focus();
    //select all text for easy replacing/deleting??
    textbox.select();
}

function todoNextTextbox(e){
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);

    var next = findTodoTextByIndex(index+1);
    //move on to the next textbox!
    if (next != null && next != undefined){
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        todoTextClick(e, next);
    }
    //move back to the prompt!
    else{
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        //again, not sure if redundant
        todo_prompt_dom.focus();
        todo_prompt_dom.select();
    }
}

function todoPrevTextbox(e){
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);

    var prev = findTodoTextByIndex(index-1);
    if (index-1 == -1) prev = todo_prompt_dom;

    //move on to the prev textbox!
    if (prev != null && prev != undefined){
        if (index > -1)
            todoTextboxBlur(e, activeElement);
        if (index-1 > -1)
            todoTextClick(e, prev);
        else{
            //again, not sure if redundant
            todo_prompt_dom.focus();
            todo_prompt_dom.select();
        }
    }
    //move back to the last element!
    else{
        if (index > -1)
            todoTextboxBlur(e, activeElement);

        var last_elem = findTodoTextByIndex(todos.length-1);
        todoTextClick(e, last_elem);
    }
}

function todoFirstTextbox(e){
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    if (index != -1)
        todoTextboxBlur(e, activeElement);
    //again not sure if redundant
    todo_prompt_dom.focus();
    todo_prompt_dom.select();
}
function todoLastTextbox(e){
    var activeElement = document.activeElement;
    var index = parseInt(activeElement['todo-index']);
    if (index != -1)
        todoTextboxBlur(e, activeElement);
    var last_elem = findTodoTextByIndex(todos.length-1);
    todoTextClick(e, last_elem);
}

/////////////////////////////////////////////////////////
class TodoItem{
    public constructor(public text:string, public checked:boolean){}
}

function addTodoItem(text: string, index: number){
    todos.splice(index, 0, new TodoItem(text, false));
}

function findTodoTextByIndex(index: Number){
    return document.getElementById("todo-text-index-"+index);
}

function findTodoTextboxByIndex(index: Number){
    return <HTMLInputElement>document.getElementById("todo-textbox-index-"+index);
}

function createTodoListFromItems(todos:Array<TodoItem>){
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
        textbox.onkeypress = function(e){ todoTextboxKeyPress(e, this); }.bind(textbox);
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
}
