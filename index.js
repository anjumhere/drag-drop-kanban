const search = document.getElementById("search");
const toggleModal = document.getElementById("toggle-modal");
const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");
const column = document.querySelectorAll(".column");
const columnBody = document.querySelector(".column-body");
const modal = document.querySelector(".modal");
const modalInput = document.getElementById("modal-input");
const modalDetails = document.getElementById("modal-details");
const closeModal = document.getElementById("close-modal");
const addTaskBtn = document.getElementById("add-task");

function addTask() {
  let task = document.createElement("div");
  task.classList.add("task");
  task.draggable = true;
  let taskHeading = document.createElement("h2");
  taskHeading.textContent = "Title";
  let paragraph = document.createElement("p");
  paragraph.textContent = "Description";
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
  columnBody.appendChild(task);
  task.appendChild(taskHeading);
  task.appendChild(paragraph);
  task.appendChild(taskActions);
  taskActions.appendChild(editBtn);
  taskActions.appendChild(deleteBtn);

  // givig content to todo item
  const data = getModalData();
  taskHeading.textContent = data.title;
  paragraph.textContent = data.description;
}
toggleModal.addEventListener("click", () => {
  modal.classList.add("hide");
});
closeModal.addEventListener("click", () => {
  modal.classList.remove("hide");
});

function getModalData() {
  return {
    title: modalInput.value,
    description: modalDetails.value,
  };
}

addTaskBtn.addEventListener("click", () => {
  addTask();
  modal.classList.remove("hide");
  modalDetails.textContent = "";
  modalInput.textContent = "";
});
