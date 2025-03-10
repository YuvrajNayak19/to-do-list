const addtask = document.querySelector(".b1");
const input = document.querySelector("#input");
const tasklist = document.querySelector("#list");
const themeToggle = document.querySelector("#theme");
const clear = document.querySelector("#clear");
function loadtasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTask(task.text, task.complete));
    updateProgressBar();  
}
function savetask() {
    const tasks = [];
    document.querySelectorAll("#list li").forEach(li => {
        tasks.push({
            text: li.childNodes[0].textContent.replace("X", "").trim(),
            complete: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgressBar();  
}
function addTask(taskText, isCompleted = false) {
    const li = document.createElement("li");
    li.textContent = taskText;
    li.setAttribute("draggable", "true");
    if (isCompleted) {
        li.classList.add("completed");
    }
    const delbutton = document.createElement("button");
    delbutton.textContent = "X";
    delbutton.classList.add("del");
    delbutton.addEventListener("click", function(event) {
        event.stopPropagation();
        li.classList.add("removed");
        setTimeout(() => {
            tasklist.removeChild(li);
            savetask();   
        }, 300);  
    });
    li.addEventListener("click", function() {
        li.classList.toggle("completed");
        savetask();
    });
    li.addEventListener("dblclick", function() {
        const newtask = prompt("Edit task", li.textContent.replace("X", "").trim());
        if (newtask !== "" && newtask.trim() !== "") {
            li.textContent = newtask; 
            li.appendChild(delbutton);
            savetask();
        }
    });
    li.appendChild(delbutton);
    tasklist.appendChild(li);
    setTimeout(() => {
        li.classList.add("show");
    }, 10);
    savetask();
}
addtask.addEventListener("click", function() {
    const task = input.value.trim();
    if (task !== "") {
        input.value ="";
        addTask(task);
    } else {
        alert("Please enter a task");
    }
});
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addtask.click();
        input.value ="";
        return;
  }
});
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Toggle Theme";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Toggle Theme";
    }
});
window.addEventListener("load", function() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️ Toggle Theme";
    } else {
        document.body.classList.add("light");
        themeToggle.textContent = "🌙 Toggle Theme";
    }
    loadtasks();  
});
clear.addEventListener("click", function() {
    const tasks = document.querySelectorAll("#list li");
    tasks.forEach((task, index) => {
        setTimeout(() => {
            task.classList.add("fade-out");
        }, index * 100); 
    });
    setTimeout(() => {
        tasks.forEach(task => task.remove());
        savetask();
    }, tasks.length * 100 + 300);
});
let draggedItem = null;
tasklist.addEventListener("dragstart", function(e) {
    if (e.target.tagName === "LI") {
        draggedItem = e.target;
        e.target.style.opacity = "0.5";
    }
});
tasklist.addEventListener("dragover", function(e) {
    e.preventDefault();
    const target = e.target;
    if (target.tagName === "LI") {
        tasklist.insertBefore(draggedItem, target);
    }
});
tasklist.addEventListener("dragend", function() {
    draggedItem.style.opacity = "1";
    savetask();
});

