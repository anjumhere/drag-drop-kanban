# 📋 KANBAN Board

A lightweight, drag-and-drop Kanban board built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

🔗 **Live Demo:** [anjumhere.github.io/drag-drop-kanban](https://anjumhere.github.io/drag-drop-kanban/)  
📁 **Repository:** [github.com/anjumhere/drag-drop-kanban](https://github.com/anjumhere/drag-drop-kanban)  
🧪 **More Projects:** [Core JavaScript Projects](https://github.com/anjumhere/Core-Javascript-Projects-) — A collection of projects focused on strengthening JavaScript fundamentals

---

## ✨ Features

- 🖱️ **Drag & Drop** — Move tasks between columns with smooth hover glow effects
- ➕ **Task Creation** — Add tasks with a title and description via a clean modal
- 🗑️ **Task Deletion** — Remove tasks instantly with the delete button
- 🔍 **Debounced Search** — Highlights matching tasks across all columns after you stop typing
- 🔢 **Live Task Counter** — Each column shows a live count, updates on every action
- ✨ **Smooth Transitions** — CSS transitions on drag hover and search highlight effects
- 🎨 **Dark Theme UI** — Clean dark interface with accent colors per column

---

## 🗂️ Columns

| Column      | Color     | Description                         |
| ----------- | --------- | ----------------------------------- |
| TO DO       | 🔵 Blue   | Tasks that haven't been started yet |
| IN PROGRESS | 🟡 Yellow | Tasks currently being worked on     |
| DONE        | 🟢 Green  | Completed tasks                     |

---

## Screenshot

<img src = "images/Screenshot 2026-02-22 151210.png">

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
├── style.css        # All styles, CSS variables, and animations
└── index.js         # All JavaScript logic
```

---

## 🧠 How It Works

### Task Creation

Clicking **+ New Task** opens a modal where you enter a title and description. On submit, the task is dynamically created with JavaScript and appended to the **TO DO** column. Each task gets a delete button wired up on creation.

```js
function dynamicTask() {
  let task = document.createElement("div");
  task.classList.add("task");
  task.draggable = true;
  // builds heading, paragraph, action buttons
  // appends to column body
}
```

---

### Drag & Drop

Each column listens for five drag events: `dragstart`, `dragenter`, `dragleave`, `dragover`, and `drop`.

- **`dragstart`** — stores the dragged task element in `dragItem` using `e.target`
- **`dragenter`** — adds a `hover-over` glow class to the target column
- **`dragleave`** — removes the glow **only** when truly leaving the column, not when moving over child task elements, using `element.contains(e.relatedTarget)`
- **`dragover`** — calls `e.preventDefault()` to allow the drop event to fire
- **`drop`** — finds the `.column-body` inside the target column and appends `dragItem` into it

```js
// The key fix for child element flickering
item.addEventListener("dragleave", (e) => {
  if (!item.contains(e.relatedTarget)) {
    item.classList.remove("hover-over");
  }
});
```

> **Why `e.target` not `item` in dragstart?**  
> `item` refers to the column the listener is attached to. `e.target` gives the exact element being dragged — the task card itself.

---

### Search with Debouncing

The search uses **debouncing** — it waits 500ms after the user stops typing before running. This avoids unnecessary DOM queries on every keystroke. Matching tasks get a `highlight` class that adds a glowing teal border, which automatically removes itself after 2 seconds.

```js
searchTimeout = setTimeout(() => {
  allTasks.forEach((task) => {
    let taskTitle = task.querySelector("h2").textContent.toLowerCase();
    let taskDesc = task.querySelector("p").textContent.toLowerCase();

    if (taskTitle.includes(searchValue) || taskDesc.includes(searchValue)) {
      task.classList.add("highlight");
      setTimeout(() => task.classList.remove("highlight"), 2000);
    }
  });
}, 500);
```

---

### Live Task Counter

`taskCounter()` runs after every add, delete, or drop event. It uses `querySelectorAll(".task")` on each column element, which works on dynamically created elements too since they're part of the DOM once appended.

```js
function taskCounter() {
  todo.querySelector(".count").textContent =
    todo.querySelectorAll(".task").length;
  progress.querySelector(".count").textContent =
    progress.querySelectorAll(".task").length;
  done.querySelector(".count").textContent =
    done.querySelectorAll(".task").length;
}
```

---

### CSS Transitions

Transitions are placed on the **base element**, not on the hover/active class. This is critical — if the transition is only on the class, it gets removed along with the class and the exit animation snaps instantly.

```css
.task {
  transition:
    0.2s ease-in-out,
    border-color 0.5s ease-in-out,
    box-shadow 0.5s ease-in-out;
}

.board .column {
  transition:
    border-color 0.5s ease-in-out,
    box-shadow 0.5s ease-in-out;
}
```

---

## 🛠️ Tech Stack

| Technology         | Usage                                                  |
| ------------------ | ------------------------------------------------------ |
| HTML5              | Structure and drag-and-drop attributes                 |
| CSS3               | Styling, CSS variables, transitions, flexbox           |
| Vanilla JavaScript | DOM manipulation, event listeners, drag-and-drop logic |
| Google Fonts       | Montserrat, Chakra Petch, Fira Code                    |
| Font Awesome       | Icons                                                  |

---

## 🔮 Planned Features

- [ ] **Local Storage** — persist tasks after page refresh
- [ ] **Edit Task** — edit title and description after creation
- [ ] **Task Priority** — low / medium / high badges
- [ ] **Drag to Reorder** — reorder tasks within the same column
- [ ] **Keyboard Shortcuts** — `N` to open modal, `Escape` to close
- [ ] **Animations** — smooth slide-in on add, slide-out on delete

---

## 👨‍💻 Author

**Anjum**  
GitHub: [@anjumhere](https://github.com/anjumhere)

> Want to see more vanilla JS projects? Check out [Core JavaScript Projects](https://github.com/anjumhere/Core-Javascript-Projects-) — a collection built to strengthen JavaScript fundamentals from the ground up.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
