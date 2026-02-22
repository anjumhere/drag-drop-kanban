//inputs
const search = document.getElementById("search");
const modalInput = document.getElementById("modal-input");
const modalDetails = document.getElementById("modal-details");

//buttons
const modalBtn = document.getElementById("toggle-modal");
const addTaskButton = document.getElementById("add-task");

// statuses
const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

//column
const columns = document.querySelectorAll(".column");
//todo task container
let taskContainer = document.querySelector(".column-body");
// modal
const modal = document.querySelector(".modal");
const closeModal = document.getElementById("close-modal");

//Handling Modal
modalBtn.addEventListener("click", function () {
  modal.classList.add("hide");
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("hide");
});

function modalData() {
  return {
    title: modalInput.value,
    description: modalDetails.value,
  };
}

//handling modal hovering effect

let dragItem = null;

// set dragItem on the task when dragging starts
function trackDragElement(item) {
  item.addEventListener("dragenter", (e) => {
    item.classList.add("hover-over");
  });
  item.addEventListener("dragleave", (e) => {
    if (!item.contains(e.relatedTarget)) {
      item.classList.remove("hover-over");
    }
  });
  item.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  item.addEventListener("dragstart", (e) => {
    dragItem = e.target;
  });
  item.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragItem) {
      let columnBody = item.querySelector(".column-body");
      columnBody.appendChild(dragItem);
    }
  });
}
trackDragElement(todo);
trackDragElement(progress);
trackDragElement(done);

// creating task dynamically
function dynamicTask() {
  let task = document.createElement("div");
  task.classList.add("task");
  task.draggable = true;

  let taskHeading = document.createElement("h2");

  let paragraph = document.createElement("p");

  let taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  let editBtn = document.createElement("button");
  editBtn.classList.add("edit-button");
  editBtn.classList.add("btn");
  editBtn.textContent = "Edit Task";

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("btn");

  //deleting task
  deleteBtn.addEventListener("click", () => {
    task.remove();
  });

  taskContainer.appendChild(task);
  task.appendChild(taskHeading);
  task.appendChild(paragraph);
  task.appendChild(taskActions);
  taskActions.appendChild(editBtn);
  taskActions.appendChild(deleteBtn);

  // creating task dynamically
  let data = modalData();
  taskHeading.textContent = data.title;
  paragraph.textContent = data.description;
}

//adding task
addTaskButton.addEventListener("click", () => {
  dynamicTask();
  modal.classList.remove("hide");
});
