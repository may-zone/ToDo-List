import {addTodo} from "./todo-factory.js";
import {projCreator} from "./projects.js";

export function save(state) {
  localStorage.setItem("todo-app", JSON.stringify(state));
}

export function load() {
  const json = localStorage.getItem("todo-app");
  if (!json) return null;

  try {
    const parsed = JSON.parse(json);

    parsed.projects = parsed.projects.map(p => ({
      ...p,
      todos: p.todos.map(t => createTodo(t.title, t.description, t.dueDate, t.priority, t.completed))
    }));

    return parsed;

  } catch (e) {
    console.error("Error parsing saved data:", e);
    return null;
  }
}