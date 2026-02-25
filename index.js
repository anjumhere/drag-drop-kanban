// wrapping everything here so the JS doesn't run before the HTML loads
// learned this the hard way — getElementById returns null if the DOM isn't ready yet
document.addEventListener("DOMContentLoaded", () => {
  // --- grabbing all the elements I need ---

  const modalInput = document.getElementById("modal-input");
  const modalDetails = document.getElementById("modal-details");
  const modalTitle = document.getElementById("modal-title");

  const toggleModalBtn = document.getElementById("toggle-modal");
  const addTaskBtn = document.getElementById("add-task");
  const closeModalBtn = document.getElementById("close-modal");

  const todoColumn = document.getElementById("todo");
  const progressColumn = document.getElementById("progress");
  const doneColumn = document.getElementById("done");

  const searchInput = document.getElementById("search");
  const modal = document.querySelector(".modal");
  const modalBg = modal ? modal.querySelector(".bg") : null;
  const tabButtons = document.querySelectorAll(".tab-btn");

  // quick sanity check during development — if something's null, I want to know immediately
  const required = {
    modal,
    modalInput,
    modalDetails,
    modalTitle,
    toggleModalBtn,
    addTaskBtn,
    closeModalBtn,
    todoColumn,
    progressColumn,
    doneColumn,
    searchInput,
  };

  for (const [name, el] of Object.entries(required)) {
    if (!el)
      console.warn(
        `couldn't find element: "${name}" — double check the id in HTML`,
      );
  }

  // --- modal open / close ---
  // the modal starts hidden (display: none in CSS)
  // adding the "open" class switches it to display: flex

  function openModal() {
    if (modal) modal.classList.add("open");
  }

  function closeModal() {
    if (modal) modal.classList.remove("open");
  }

  // called when hitting "+ New Task" — resets everything so old data doesn't bleed in
  function openForNewTask() {
    modalInput.value = "";
    modalDetails.value = "";
    modalTitle.textContent = "New Task";
    addTaskBtn.textContent = "Add Task";
    addTaskBtn.dataset.editMode = "";
    addTaskBtn._editTarget = null;
    openModal();
    setTimeout(() => modalInput.focus(), 50);
  }

  // called when hitting "Edit Task" on an existing card
  // pre-fills the same modal with that task's current content
  function openForEditTask(task) {
    const heading = task.querySelector(".title");
    const description = task.querySelector(".paragraph");

    modalInput.value = heading ? heading.textContent : "";
    modalDetails.value = description ? description.textContent : "";

    modalTitle.textContent = "Edit Task";
    addTaskBtn.textContent = "Save Changes";

    // storing the task element on the button so I can update it later on save
    // dataset only holds strings so I use a regular property for the element reference
    addTaskBtn.dataset.editMode = "true";
    addTaskBtn._editTarget = task;

    openModal();
    setTimeout(() => modalInput.focus(), 50);
  }

  if (toggleModalBtn) toggleModalBtn.addEventListener("click", openForNewTask);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

  // close if user clicks the blurred background behind the modal
  if (modalBg) modalBg.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // --- creating and editing tasks ---

  function getModalData() {
    return {
      title: modalInput.value.trim(),
      description: modalDetails.value.trim(),
    };
  }

  // flashes the title input red if someone tries to submit with nothing in it
  function showTitleError() {
    modalInput.style.borderColor = "var(--danger)";
    modalInput.focus();
    setTimeout(() => (modalInput.style.borderColor = ""), 1200);
  }

  let taskIdCounter = 0;

  // builds the task card element from scratch and returns it
  // I kept this separate from addNewTask so I can reuse it if needed later (e.g. loading from localStorage)
  function createTaskElement(title, description, id) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.draggable = true;
    task.dataset.id = id;

    const taskHeading = document.createElement("h2");
    taskHeading.classList.add("title");
    taskHeading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.classList.add("paragraph");
    paragraph.textContent = description;

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button", "btn");
    editBtn.textContent = "Edit Task";
    editBtn.addEventListener("click", () => openForEditTask(task));

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button", "btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      task.remove();
      updateTaskCounters();
    });

    task.appendChild(taskHeading);
    task.appendChild(paragraph);
    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);
    task.appendChild(taskActions);

    return task;
  }

  function addNewTask() {
    const data = getModalData();
    if (!data.title) {
      showTitleError();
      return;
    }

    taskIdCounter++;
    const task = createTaskElement(data.title, data.description, taskIdCounter);
    const todoBody = todoColumn.querySelector(".column-body");
    todoBody.appendChild(task);

    updateTaskCounters();
    closeModal();
  }

  // instead of deleting and recreating the card, I just update the text directly
  // keeps it in the same column and position, which is what you'd expect
  function saveEditedTask() {
    const data = getModalData();
    const task = addTaskBtn._editTarget;

    if (!data.title) {
      showTitleError();
      return;
    }
    if (!task) {
      closeModal();
      return;
    }

    const heading = task.querySelector(".title");
    const description = task.querySelector(".paragraph");
    if (heading) heading.textContent = data.title;
    if (description) description.textContent = data.description;

    addTaskBtn.dataset.editMode = "";
    addTaskBtn._editTarget = null;

    closeModal();
  }

  // one button, two behaviors — checks the flag to decide which path to take
  addTaskBtn.addEventListener("click", () => {
    if (addTaskBtn.dataset.editMode === "true") {
      saveEditedTask();
    } else {
      addNewTask();
    }
  });

  // small UX thing — lets you hit Enter to submit instead of reaching for the button
  modalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskBtn.click();
  });

  // --- task counters ---
  // runs after every add, delete, or drag so the badges stay accurate

  function updateTaskCounters() {
    const todoCount = todoColumn.querySelectorAll(".task").length;
    const progressCount = progressColumn.querySelectorAll(".task").length;
    const doneCount = doneColumn.querySelectorAll(".task").length;

    todoColumn.querySelector(".count").textContent = todoCount;
    progressColumn.querySelector(".count").textContent = progressCount;
    doneColumn.querySelector(".count").textContent = doneCount;

    // brief green glow when something lands in Done
    if (doneCount > 0) {
      doneColumn.querySelectorAll(".task").forEach((t) => {
        t.classList.add("green");
        setTimeout(() => t.classList.remove("green"), 1000);
      });
    }
  }

  // --- drag and drop ---

  let dragItem = null;

  function setupColumnDragDrop(column) {
    column.addEventListener("dragenter", () => {
      column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", (e) => {
      // without this check, the glow flickers every time you cross a child element
      // e.relatedTarget is where the cursor went — if it's still inside the column, ignore it
      if (!column.contains(e.relatedTarget)) {
        column.classList.remove("hover-over");
      }
    });

    // have to preventDefault here or the drop event won't fire at all
    column.addEventListener("dragover", (e) => e.preventDefault());

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      if (dragItem) {
        setTimeout(() => column.classList.remove("hover-over"), 800);
        column.querySelector(".column-body").appendChild(dragItem);
        updateTaskCounters();
      }
    });
  }

  setupColumnDragDrop(todoColumn);
  setupColumnDragDrop(progressColumn);
  setupColumnDragDrop(doneColumn);

  // using event delegation here because tasks don't exist on page load
  // attaching directly to each task on creation would also work but this is cleaner
  document.addEventListener("dragstart", (e) => {
    const task = e.target.closest(".task");
    if (task) {
      dragItem = task;
      setTimeout(() => task.classList.add("dragging"), 0);
    }
  });

  document.addEventListener("dragend", (e) => {
    const task = e.target.closest(".task");
    if (task) task.classList.remove("dragging");
    dragItem = null;
  });

  // --- search ---
  // debounced so it doesn't fire on every single keystroke
  // waits until the user pauses for 400ms before actually scanning

  let searchTimeout;

  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase().trim();

    document
      .querySelectorAll(".task")
      .forEach((t) => t.classList.remove("highlight"));

    if (!searchValue) return;

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      document.querySelectorAll(".task").forEach((task) => {
        const title =
          task.querySelector(".title")?.textContent.toLowerCase() || "";
        const desc =
          task.querySelector(".paragraph")?.textContent.toLowerCase() || "";

        if (title.includes(searchValue) || desc.includes(searchValue)) {
          task.classList.add("highlight");
          setTimeout(() => task.classList.remove("highlight"), 2500);
        }
      });
    }, 400);
  });

  // --- mobile tab switching ---
  // on small screens the columns are stacked and hidden
  // these tabs let you pick which one to show

  function showColumn(targetId) {
    document.querySelectorAll(".column").forEach((col) => {
      col.classList.remove("active-column");
    });
    const target = document.getElementById(targetId);
    if (target) target.classList.add("active-column");
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showColumn(btn.dataset.target);
    });
  });

  function initMobileView() {
    if (window.innerWidth <= 600) {
      showColumn("todo");
    }
  }

  initMobileView();

  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      document.querySelectorAll(".column").forEach((col) => {
        col.classList.remove("active-column");
      });
    } else {
      const anyActive = document.querySelector(".column.active-column");
      if (!anyActive) showColumn("todo");
    }
  });
});
