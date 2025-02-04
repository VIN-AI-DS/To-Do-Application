const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items"); // Fixed reference
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || []; // Shortened init check

function CreateToDoItems() {
    if (todoValue.value.trim() === "") {
        setAlertMessage("Please enter your to-do text!");
        todoValue.focus();
        return;
    }

    if (todo.some(item => item.item === todoValue.value.trim())) {
        setAlertMessage("This item is already in the list!");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = `<div title="Double Click to Mark as Done" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
                    <div>
                        <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />
                        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
                    </div>`;
    listItems.appendChild(li);

    todo.push({ item: todoValue.value, status: false });
    setLocalStorage();
    
    todoValue.value = "";
    setAlertMessage("To-do item added successfully!");
}

function ReadToDoItems() {
    listItems.innerHTML = ""; // Clear list before adding
    todo.forEach(element => {
        let li = document.createElement("li");
        let style = element.status ? "style='text-decoration: line-through'" : "";
        
        li.innerHTML = `<div ${style} title="Double Click to Mark as Done" ondblclick="CompletedToDoItems(this)">
                        ${element.item} ${element.status ? '<img class="todo-controls" src="images/check-mark.png" />' : ""}
                        </div>
                        <div>
                            ${element.status ? "" : '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />'}
                            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
                        </div>`;
        listItems.appendChild(li);
    });
}

function UpdateToDoItems(e) {
    let updateText = e.closest("li").querySelector("div").innerText.trim();
    todoValue.value = updateText;
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "images/refresh.png");
    todoValue.focus();
}

function UpdateOnSelectionItems() {
    let updateText = document.querySelector(".edit").closest("li").querySelector("div");
    
    if (todo.some(item => item.item === todoValue.value.trim())) {
        setAlertMessage("This item already exists!");
        return;
    }

    todo.forEach(element => {
        if (element.item === updateText.innerText.trim()) {
            element.item = todoValue.value;
        }
    });

    setLocalStorage();
    updateText.innerText = todoValue.value;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "images/plus.png");
    todoValue.value = "";
    setAlertMessage("To-do item updated successfully!");
}

function DeleteToDoItems(e) {
    let deleteValue = e.closest("li").querySelector("div").innerText.trim();

    if (confirm(`Are you sure you want to delete "${deleteValue}"?`)) {
        e.closest("li").remove();
        todo = todo.filter(item => item.item !== deleteValue);
        setLocalStorage();
    }
}

function CompletedToDoItems(e) {
    let itemText = e.innerText.trim();
    let item = todo.find(element => element.item === itemText);

    if (item) {
        item.status = true;
        setLocalStorage();
        e.style.textDecoration = "line-through";
        e.innerHTML += '<img class="todo-controls" src="images/check-mark.png" />';
        e.closest("li").querySelector(".edit")?.remove();
        setAlertMessage("To-do item marked as completed!");
    }
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
    todoAlert.innerText = message;
    todoAlert.style.display = "block";
    setTimeout(() => {
        todoAlert.style.display = "none";
    }, 2000);
}

// Load existing to-do items on page load
document.addEventListener("DOMContentLoaded", ReadToDoItems);
