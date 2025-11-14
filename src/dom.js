let projectListEl;
let todoListEl;
let projectTitleEl;
let addProjectButton;
let newProjectForm;
let projectModalEl;
let closeProjectBtnEl;
let newTodoForm;
let modalBackdropEl;
let todoModalEl;
let openTodoBtnEl;
let closeTodoBtnEl;
let projectToggleBtnEl;
let projectSidebarEl;

let callbacks = {
  getProjects: () => [],
  getActiveProject: () => null,
  getActiveProjectTodos: () => [],
  onAddProject: (title) => {},
  onChangeProject: (projectId) => {},
  onDeleteProject: (projectId) => {},
  onAddTodo: (todoData) => {},
  onToggleTodo: (todoId) => {},
  onDeleteTodo: (todoId) => {},
};

function cacheDOM() {
  projectListEl = document.querySelector('[data-project-list]');
  todoListEl = document.querySelector('[data-todo-list]');
  projectTitleEl = document.querySelector('[data-project-title]');
  addProjectButton = document.querySelector('[data-add-project-button]');
  newProjectForm = document.querySelector('[data-new-project-form]');
  projectModalEl = document.querySelector('[data-project-modal]');
  closeProjectBtnEl = document.querySelector('[data-close-project-modal]');
  newTodoForm = document.querySelector('[data-new-todo-form]');
  modalBackdropEl = document.querySelector('[data-modal-backdrop]');
  todoModalEl = document.querySelector('[data-todo-modal]');
  openTodoBtnEl = document.querySelector('[data-open-todo-modal]');
  closeTodoBtnEl = document.querySelector('[data-close-todo-modal]');
  projectToggleBtnEl = document.querySelector('[data-project-toggle]');
  projectSidebarEl = document.querySelector('[data-project-sidebar]');
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function renderProjects() {
  const projects = callbacks.getProjects();
  const activeProject = callbacks.getActiveProject();

  clearElement(projectListEl);

  projects.forEach((project) => {
    const li = document.createElement('li');
    li.classList.add('project-item');
    const btn = document.createElement('button');
    btn.classList.add('project-select-btn');

    btn.textContent = project.title;
    btn.dataset.id = project.id;

    if (activeProject && project.id === activeProject.id) {
      btn.classList.add('active-project');
    }

    btn.addEventListener('click', () => {
      callbacks.onChangeProject(project.id);
      render();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add('project-delete-btn');
    deleteBtn.setAttribute('aria-label', `Delete project ${project.title}`);
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      callbacks.onDeleteProject(project.id);
      render();
    });

    li.appendChild(btn);
    li.appendChild(deleteBtn);
    projectListEl.appendChild(li);
  });
}

function createTodoRow(label, value) {
  const row = document.createElement('p');
  row.classList.add('todo-row');
  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;
  const valueSpan = document.createElement('span');
  valueSpan.textContent = value || '';
  row.appendChild(labelSpan);
  row.appendChild(valueSpan);
  return row;
}

function createTodoCard(todo) {
  const li = document.createElement('li');
  li.classList.add('todo-item');
  const priorityValue = (todo.priority || '').toLowerCase();
  let priorityClass = 'medium';
  if (priorityValue === 'low') {
    priorityClass = 'low';
  } else if (priorityValue === 'high') {
    priorityClass = 'high';
  }
  li.classList.add(`priority-${priorityClass}`);
  if (todo.isDone) {
    li.classList.add('todo-done');
  }

  const card = document.createElement('div');
  card.classList.add('todo-card');
  const cardInner = document.createElement('div');
  cardInner.classList.add('todo-card-inner');

  const frontFace = document.createElement('div');
  frontFace.classList.add('todo-card-face', 'todo-card-front');
  frontFace.setAttribute('role', 'button');
  frontFace.tabIndex = 0;
  const titleEl = document.createElement('h3');
  titleEl.classList.add('todo-title');
  titleEl.textContent = todo.title;
  frontFace.appendChild(titleEl);

  const backFace = document.createElement('div');
  backFace.classList.add('todo-card-face', 'todo-card-back');

  backFace.appendChild(createTodoRow('Due:', todo.date || 'no date'));
  if (todo.descriptions) {
    backFace.appendChild(createTodoRow('Description:', todo.descriptions));
  }
  if (todo.note) {
    backFace.appendChild(createTodoRow('Note:', todo.note));
  }
  backFace.appendChild(createTodoRow('Priority:', todo.priority || 'medium'));

  const doneRow = document.createElement('p');
  doneRow.classList.add('todo-row');
  const doneLabel = document.createElement('span');
  doneLabel.textContent = 'Done:';
  const doneWrapper = document.createElement('span');
  const doneCheckbox = document.createElement('input');
  doneCheckbox.type = 'checkbox';
  doneCheckbox.checked = todo.isDone;
  doneCheckbox.addEventListener('change', (event) => {
    event.stopPropagation();
    callbacks.onToggleTodo(todo.id);
    renderTodos();
  });
  doneWrapper.appendChild(doneCheckbox);
  doneRow.appendChild(doneLabel);
  doneRow.appendChild(doneWrapper);
  backFace.appendChild(doneRow);

  const actions = document.createElement('div');
  actions.classList.add('todo-actions');
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    callbacks.onDeleteTodo(todo.id);
    renderTodos();
  });
  actions.appendChild(deleteBtn);
  backFace.appendChild(actions);

  const toggleCard = () => {
    li.classList.toggle('is-open');
  };

  frontFace.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleCard();
  });
  frontFace.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCard();
    }
  });

  card.addEventListener('click', (event) => {
    if (!li.classList.contains('is-open')) return;
    if (event.target.closest('button, input, textarea, select')) {
      return;
    }
    li.classList.remove('is-open');
  });

  cardInner.appendChild(frontFace);
  cardInner.appendChild(backFace);
  card.appendChild(cardInner);
  li.appendChild(card);

  return li;
}

function renderTodos() {
  const todos = callbacks.getActiveProjectTodos();
  const activeProject = callbacks.getActiveProject();

  if (activeProject) {
    projectTitleEl.textContent = activeProject.title;
  } else {
    projectTitleEl.textContent = '';
  }

  clearElement(todoListEl);

  todos.forEach((todo) => {
    const card = createTodoCard(todo);
    todoListEl.appendChild(card);
  });
}

export function render() {
  renderProjects();
  renderTodos();
}

function updateBackdropVisibility() {
  if (!modalBackdropEl) return;
  const isTodoHidden = !todoModalEl || todoModalEl.classList.contains('hidden');
  const isProjectHidden = !projectModalEl || projectModalEl.classList.contains('hidden');
  if (isTodoHidden && isProjectHidden) {
    modalBackdropEl.classList.add('hidden');
  } else {
    modalBackdropEl.classList.remove('hidden');
  }
}

function openTodoModal() {
  if (todoModalEl) {
    todoModalEl.classList.remove('hidden');
    updateBackdropVisibility();
  }
}

function closeTodoModal() {
  if (todoModalEl) {
    todoModalEl.classList.add('hidden');
    updateBackdropVisibility();
  }
}

function openProjectModal() {
  if (projectModalEl) {
    projectModalEl.classList.remove('hidden');
    updateBackdropVisibility();
  }
}

function closeProjectModal() {
  if (projectModalEl) {
    projectModalEl.classList.add('hidden');
    updateBackdropVisibility();
  }
}

function closeAllModals() {
  closeTodoModal();
  closeProjectModal();
}

function toggleSidebar() {
  if (!projectSidebarEl) return;
  projectSidebarEl.classList.toggle('is-open');
}

export function initDOM(userCallbacks) {
  cacheDOM();

  callbacks = {
    ...callbacks,
    ...userCallbacks,
  };

  if (addProjectButton) {
    addProjectButton.addEventListener('click', openProjectModal);
  }

  if (newProjectForm) {
    newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(newProjectForm);
      const title = (formData.get('projectTitle') || '').trim();
      if (!title) return;
      callbacks.onAddProject(title);
      newProjectForm.reset();
      closeProjectModal();
      render();
    });
  }

  if (closeProjectBtnEl) {
    closeProjectBtnEl.addEventListener('click', closeProjectModal);
  }

  if (newTodoForm) {
    newTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(newTodoForm);
      const todoData = {
        title: (formData.get('title') || '').trim(),
        descriptions: formData.get('descriptions') || '',
        date: formData.get('date') || '',
        note: formData.get('note') || '',
        priority: formData.get('priority') || 'normal',
        isDone: false,
      };
      if (!todoData.title) return;
      callbacks.onAddTodo(todoData);
      newTodoForm.reset();
      renderTodos();
      closeTodoModal();
    });
  }

  if (openTodoBtnEl) {
    openTodoBtnEl.addEventListener('click', openTodoModal);
  }
  if (closeTodoBtnEl) {
    closeTodoBtnEl.addEventListener('click', closeTodoModal);
  }
  if (modalBackdropEl) {
    modalBackdropEl.addEventListener('click', closeAllModals);
  }
  if (projectToggleBtnEl) {
    projectToggleBtnEl.addEventListener('click', toggleSidebar);
  }

  render();
}
