import './styles.css';
import { todoController } from './todo-CRUD.js';
import { projectCreator } from './projects.js';
import { initDOM } from './dom.js';

let projects = [];
let currentProject = null;

function createDefaultProject() {
  const defaultProject = projectCreator('Inbox');
  projects.push(defaultProject);
  currentProject = defaultProject;
}

function createNewProject(title) {
  const project = projectCreator(title);
  projects.push(project);
  currentProject = project;
  return project;
}

function addTodoToActiveProject({ title, descriptions, date, note, isDone = false }) {
  if (!currentProject) {
    console.error('There is no Project !');
    return;
  }
  const todo = todoController.create({ title, descriptions, date, note, isDone });
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
    console.error('Project not found!');
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
  });

  console.log('All Projects :', projects);
  console.log('Todos :', getActiveProjectTodos());

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
