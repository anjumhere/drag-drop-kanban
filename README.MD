# 📋 KANBAN Board

A lightweight, drag-and-drop Kanban board built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

🔗 **Live Demo:** [anjumhere.github.io/drag-drop-kanban](https://anjumhere.github.io/drag-drop-kanban/)  
📁 **Repository:** [github.com/anjumhere/drag-drop-kanban](https://github.com/anjumhere/drag-drop-kanban)  
🧪 **More Projects:** [Core JavaScript Projects](https://github.com/anjumhere/Core-Javascript-Projects-) — A collection of projects focused on strengthening JavaScript fundamentals

---

## ✨ Features

- 🖱️ **Drag & Drop** — Move tasks between columns with smooth hover glow effects
- ➕ **Task Creation** — Add tasks with a title and description via a clean modal
- ✏️ **Task Editing** — Edit any task's title and description after creation
- 🗑️ **Task Deletion** — Remove tasks instantly with the delete button
- 🔍 **Debounced Search** — Highlights matching tasks across all columns after you stop typing
- 🔢 **Live Task Counter** — Each column shows a live count, updates on every action
- 📱 **Fully Responsive** — Mobile-friendly layout with tab switcher for columns
- ✨ **Smooth Transitions** — CSS transitions on drag hover, task creation, and search highlights
- 🎨 **Dark Theme UI** — Clean dark interface with accent colors per column
- ⌨️ **Keyboard Shortcuts** — `Enter` to submit, `Escape` to close modal

---

## 🗂️ Columns

| Column      | Color     | Description                         |
| ----------- | --------- | ----------------------------------- |
| TO DO       | 🔵 Blue   | Tasks that haven't been started yet |
| IN PROGRESS | 🟡 Yellow | Tasks currently being worked on     |
| DONE        | 🟢 Green  | Completed tasks                     |

---

## Screenshot

<img src="images/Screenshot 2026-02-22 151210.png">

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/anjumhere/drag-drop-kanban.git
cd drag-drop-kanban
```

### 2. Open in browser

No build step required. Just open `index.html` directly in your browser:

```bash
open index.html
```

Or use the **Live Server** extension in VS Code for hot reloading.

---

## 📁 Project Structure

```
drag-drop-kanban/
├── index.html       # Main HTML structure and layout
├── style.css        # All styles, CSS variables, animations, and responsive breakpoints
└── index.js         # All JavaScript logic
```

---

## 🧠 How It Works

### Safe DOM Access with `DOMContentLoaded`

All JavaScript runs inside a `DOMContentLoaded` listener. This guarantees the HTML is fully parsed before any element is queried — preventing `Cannot read properties of null` errors that occur when scripts run before the DOM is ready.

```js
document.addEventListener("DOMContentLoaded", () => {
  // All code lives here — the DOM is guaranteed to exist
});
```

---

### Task Creation

Clicking **+ New Task** opens a modal where you enter a title and description. On submit, the task is dynamically built with `createElement` and appended to the **TO DO** column. Each task gets Edit and Delete buttons wired up at creation time.

```js
function createTaskElement(title, description, id) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.draggable = true;
  task.dataset.id = id;
  // builds heading, paragraph, action buttons
  // returns completed element
}
```

---

### Task Editing ✏️

The same modal used for creating tasks handles editing too. Clicking **Edit Task** on any card pre-fills the modal with that task's current content. An `editMode` flag on the submit button tells it whether to create a new task or save changes to an existing one.

```js
// The submit button checks a flag to decide its behavior
addTaskBtn.addEventListener("click", () => {
  if (addTaskBtn.dataset.editMode === "true") {
    saveEditedTask(); // update existing card in place
  } else {
    addNewTask(); // create a new card
  }
});
```

> **Why not recreate the task element on edit?**  
> Updating `.textContent` directly on the existing element is more efficient and avoids re-attaching event listeners. The card stays in its column, at its position — only the text changes.

---

### Drag & Drop

Each column listens for five drag events: `dragstart`, `dragenter`, `dragleave`, `dragover`, and `drop`.

- **`dragstart`** — stores the dragged task element in `dragItem`
- **`dragenter`** — adds a `hover-over` glow class to the target column
- **`dragleave`** — removes the glow **only** when truly leaving the column, not when crossing child elements, using `element.contains(e.relatedTarget)`
- **`dragover`** — calls `e.preventDefault()` to allow the drop event to fire
- **`drop`** — appends `dragItem` into the target column's `.column-body`

```js
// The key fix for child element flickering during drag
column.addEventListener("dragleave", (e) => {
  if (!column.contains(e.relatedTarget)) {
    column.classList.remove("hover-over");
  }
});
```

Event delegation is used for `dragstart` and `dragend` on the `document` — since tasks are created dynamically, this avoids needing to attach listeners to elements that don't exist yet.

---

### Search with Debouncing

The search uses **debouncing** — it waits 400ms after the user stops typing before scanning the DOM. This avoids unnecessary queries on every keystroke. Matching tasks get a `highlight` class that adds a glowing teal border, which removes itself after 2.5 seconds.

```js
searchTimeout = setTimeout(() => {
  document.querySelectorAll(".task").forEach((task) => {
    const title = task.querySelector(".title")?.textContent.toLowerCase() || "";
    const desc =
      task.querySelector(".paragraph")?.textContent.toLowerCase() || "";

    if (title.includes(searchValue) || desc.includes(searchValue)) {
      task.classList.add("highlight");
      setTimeout(() => task.classList.remove("highlight"), 2500);
    }
  });
}, 400);
```

---

### Live Task Counter

`updateTaskCounters()` runs after every add, delete, drag, or edit event. It uses `querySelectorAll(".task")` on each column, which works on dynamically created elements since they're part of the DOM once appended.

```js
function updateTaskCounters() {
  todoColumn.querySelector(".count").textContent =
    todoColumn.querySelectorAll(".task").length;
  progressColumn.querySelector(".count").textContent =
    progressColumn.querySelectorAll(".task").length;
  doneColumn.querySelector(".count").textContent =
    doneColumn.querySelectorAll(".task").length;
}
```

---

### Responsive Layout 📱

On screens **≤ 900px** (tablet), the header wraps and the search bar moves to its own row. On screens **≤ 600px** (mobile), the three columns collapse into a single-column view with tab buttons to switch between them.

```css
/* Mobile: hide all columns, show only the active one */
@media (max-width: 600px) {
  .column {
    display: none;
  }
  .column.active-column {
    display: flex;
  }
}
```

JavaScript adds/removes the `active-column` class based on which tab button is clicked.

---

### CSS Transitions

Transitions are placed on the **base element**, not on the hover/active class. This is critical — if the transition is only on the modifier class, it gets removed along with the class and the exit animation snaps instantly.

```css
.task {
  transition:
    0.2s ease-in-out,
    border-color 0.5s ease-in-out,
    box-shadow 0.5s ease-in-out;
}
```

---

## 🛠️ Tech Stack

| Technology         | Usage                                                       |
| ------------------ | ----------------------------------------------------------- |
| HTML5              | Structure, semantic markup, drag-and-drop attributes        |
| CSS3               | Styling, CSS variables, flexbox, transitions, media queries |
| Vanilla JavaScript | DOM manipulation, event listeners, drag-and-drop logic      |
| Google Fonts       | Montserrat, Chakra Petch, Fira Code                         |
| Font Awesome       | Icons                                                       |

---

## 🔮 Planned Features

- [ ] **Local Storage** — persist tasks after page refresh
- [ ] **Task Priority** — low / medium / high badges
- [ ] **Drag to Reorder** — reorder tasks within the same column
- [ ] **Animations** — smooth slide-in on add, slide-out on delete

---

## ✅ Changelog

### v2.0.0

- ✏️ Added **Edit Task** feature — edit title and description after creation
- 📱 Added **responsive layout** with mobile tab switcher
- ⌨️ Added keyboard shortcuts: `Enter` to submit, `Escape` to close modal
- 🐛 Fixed null errors by wrapping all JS in `DOMContentLoaded`
- 🐛 Fixed modal conflict bug where the edit and create flows shared state incorrectly
- 💬 Added beginner-friendly comments throughout all three files

---

## 👨‍💻 Author

**Anjum**  
GitHub: [@anjumhere](https://github.com/anjumhere)

> Want to see more vanilla JS projects? Check out [Core JavaScript Projects](https://github.com/anjumhere/Core-Javascript-Projects-) — a collection built to strengthen JavaScript fundamentals from the ground up.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
