"use strict";

let taskList = [];

if(localStorage.getItem("taskList") !== null){
  taskList = JSON.parse(localStorage.getItem("taskList"));
}

let editId;
let isEditTask = false;

const taskInput = document.querySelector("#txtTaskName");
const clearBtn = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

displayTasks("all");

function displayTasks(filter) {
  let ul = document.getElementById("task-list");
  ul.innerHTML = ""; // tüm elemanların tekrardan eklenmesini engeller.

  if (taskList.length == 0) {
    ul.innerHTML = "<p class='p-2 m-0'> Listeniz şu an boş.</p>";
  } else {

    for (let task of taskList) {
      let completed = task.status == "completed" ? "checked" : "";

      if (filter == task.status || filter == "all") {

          let li = `
   <li class="task list-group-item d-flex">
      <div class="form-check">
          <input type="checkbox" onclick="updateStatus(this)" id=${task.id} class="form-check-input" ${completed}>
          <label for=${task.id} class="form-check-label ${completed}" >${task.taskName}</label>
      </div>
  
      <div class="dropdown">
           <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
           <i class="fa-solid fa-ellipsis"></i>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a class="dropdown-item" onclick="deleteTask(${task.id})" href="#"><i class="fa-solid fa-trash-can"></i> Sil</a></li>
          <li><a class="dropdown-item" onclick='editTask(${task.id}, "${task.taskName}")' href="#"><i class="fa-solid fa-pen-to-square"></i> Düzenle</a></li>
          </ul>
      </div>
  </li>
          `;
          ul.insertAdjacentHTML("beforeend", li);
        }
    }
  }
}

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document
  .querySelector("#btnAddNewTask")
  .addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      document.getElementById("btnAddNewTask").click();
    }
  });

for (let span of filters) {
  span.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTasks(span.id);
  });
}

function newTask(e) {
  if (taskInput.value == "") {
    alert("Görev bilgisi boş geçilemez!");
  } else {
    if (!isEditTask) {
      // ekleme
      taskList.push({ "id": taskList.length + 1, "taskName": taskInput.value , "status" : "pending" });
    } else {
      // güncelleme
      for (let task of taskList) {
        if (task.id == editId) {
          task.taskName = taskInput.value;
        }
        isEditTask = false;
      }
    }
    taskInput.value = "";
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }

  e.preventDefault();
}

function deleteTask(id) {
  let deletedId = taskList.findIndex(function (task) {
    return task.id === id;
  });
  taskList.splice(deletedId, 1);
  displayTasks(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

clearBtn.addEventListener("click", () => {
  taskList.splice(0, taskList.length);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  displayTasks();
});

function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let status;

  if (selectedTask.checked) {
    label.classList.add("checked");
    status = "completed";
  } else {
    label.classList.remove("checked");
    status = "pending";
  }
  for (let task of taskList) {
    if (task.id == selectedTask.id) {
      task.status = status;
    }
  }
  displayTasks(document.querySelector("span.active").id)
  localStorage.setItem("taskList", JSON.stringify(taskList));
  //console.log(taskList)
}
