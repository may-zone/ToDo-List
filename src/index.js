import './styles.css';
import { todoController } from './todo-CRUD.js';
import { projCreator } from './projects.js';
import { initDOM } from './dom.js';
import { saveState, loadState } from './storage.js';
import userIcon from './images/avatar.svg'
import settings from './images/settings.svg'
import logout from './images/logout.svg'
import project from './images/project.svg'


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
  persistState();
  return project;
}

function addTodoToActiveProject({ title, descriptions, date, note, priority = 'normal', isDone = false }) {
  if (!currentProject) {
    return;
  }
  const todo = todoController.create({ title, descriptions, date, note, priority, isDone });
  currentProject.addTodo(todo);
  persistState();
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
  persistState();
}

function deleteTodoFromActiveProject(todoId) {
  if (!currentProject) return;
  currentProject.removeTodo(todoId);
  persistState();
}

function toggleTodoDone(todoId) {
  const todos = getActiveProjectTodos();
  const todo = todos.find((t) => t.id === todoId);
  if (todo && typeof todo.toggleDone === 'function') {
    todo.toggleDone();
    persistState();
  }
}

function persistState() {
  saveState(projects, currentProject ? currentProject.id : null);
}

function hydrateFromStorage() {
  const saved = loadState();
  if (!saved) return false;
  try {
    projects = saved.projects.map((projectData) => {
      const projectInstance = projCreator(projectData.title, { id: projectData.id });
      (projectData.todos || []).forEach((todoData) => {
        const todo = todoController.create({
          title: todoData.title,
          descriptions: todoData.descriptions,
          date: todoData.date,
          note: todoData.note,
          priority: todoData.priority,
          isDone: todoData.isDone,
          id: todoData.id,
        });
        projectInstance.addTodo(todo);
      });
      return projectInstance;
    });
    currentProject = projects.find((proj) => proj.id === saved.currentProjectId) || projects[0] || null;
    return projects.length > 0;
  } catch (error) {
    console.error('Failed to hydrate projects', error);
    projects = [];
    currentProject = null;
    return false;
  }
}

function init() {
  const restored = hydrateFromStorage();
  if (!restored) {
    createDefaultProject();
    addTodoToActiveProject({
      title: 'Go Fuck YourSelf',
      descriptions: 'because im angry right now !',
      date: 'every day',
      note: 'just kidding',
      priority: 'high',
    });
    persistState();
  }

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

const userBtn = document.querySelector('.user-btn');
const img = document.createElement('img');
img.src = userIcon;
img.alt = "User icon";

userBtn.appendChild(img);

function appendIconToElement(selector, iconSrc, altText, iconClass = 'sidebar-action-icon') {
  const element = document.querySelector(selector);
  if (!element) return;
  const icon = document.createElement('img');
  icon.src = iconSrc;
  icon.alt = altText;
  icon.classList.add(iconClass);

  const label = document.createElement('span');
  label.textContent = element.textContent.trim();

  element.textContent = '';
  element.appendChild(icon);
  element.appendChild(label);
}

appendIconToElement('[data-sidebar-title]', project, 'Projects icon', 'sidebar-title-icon');
appendIconToElement('[data-sidebar-settings]', settings, 'Settings icon');
appendIconToElement('[data-sidebar-logout]', logout, 'Logout icon');
