import './styles.css';
import { todoController } from './todo-CRUD.js';
import { projCreator } from './projects.js';
import { initDOM } from './dom.js';

let projects = [];
let currentProject = null;

function createDefaultProject() {
  const defaultProject = projCreator('Inbox');
  projects.push(defaultProject);
  currentProject = defaultProject;
}

function createNewProject(title) {
  const project = projCreator(title);
  projects.push(project);
  currentProject = project;
  return project;
}

function addTodoToActiveProject({ title, descriptions, date, note, priority = 'normal', isDone = false }) {
  if (!currentProject) {
    return;
  }
  const todo = todoController.create({ title, descriptions, date, note, priority, isDone });
  currentProject.addTodo(todo);
  return todo;
}

function getActiveProjectTodos() {
  if (!currentProject) return [];
  return currentProject.getTodos();
}

function getAllProjects() {
  return [...projects];
}

function getActiveProject() {
  return currentProject;
}

function setActiveProject(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return;
  }
  currentProject = project;
}

function deleteTodoFromActiveProject(todoId) {
  if (!currentProject) return;
  currentProject.removeTodo(todoId);
}

function toggleTodoDone(todoId) {
  const todos = getActiveProjectTodos();
  const todo = todos.find((t) => t.id === todoId);
  if (todo && typeof todo.toggleDone === 'function') {
    todo.toggleDone();
  }
}

function init() {
  createDefaultProject();

  addTodoToActiveProject({
    title: 'Go Fuck YourSelf',
    descriptions: 'because im angry right now !',
    date: 'every day',
    note: 'just kidding',
    priority: 'high',
  });

  initDOM({
    getProjects: getAllProjects,
    getActiveProject,
    getActiveProjectTodos,
    onAddProject: (title) => {
      createNewProject(title);
    },
    onChangeProject: (projectId) => {
      setActiveProject(projectId);
    },
    onAddTodo: (todoData) => {
      addTodoToActiveProject(todoData);
    },
    onToggleTodo: (todoId) => {
      toggleTodoDone(todoId);
    },
    onDeleteTodo: (todoId) => {
      deleteTodoFromActiveProject(todoId);
    },
  });
}

init();

window.app = {
  projects,
  getAllProjects,
  getActiveProject,
  getActiveProjectTodos,
  createNewProject,
  setActiveProject,
  addTodoToActiveProject,
  todoController,
};