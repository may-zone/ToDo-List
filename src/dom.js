let projectListEl;
let todoListEl;
let projectTitleEl;
let newProjectForm;
let newTodoForm;

let callbacks = {
  getProjects: () => [],
  getActiveProject: () => null,
  getActiveProjectTodos: () => [],
  onAddProject: (title) => {},
  onChangeProject: (projectId) => {},
  onAddTodo: (todoData) => {},
  onToggleTodo: (todoId) => {},
  onDeleteTodo: (todoId) => {},
};

function cacheDOM() {
  projectListEl = document.querySelector('[data-project-list]');
  todoListEl = document.querySelector('[data-todo-list]');
  projectTitleEl = document.querySelector('[data-project-title]');
  newProjectForm = document.querySelector('[data-new-project-form]');
  newTodoForm = document.querySelector('[data-new-todo-form]');
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
    const btn = document.createElement('button');

    btn.textContent = project.title;
    btn.dataset.id = project.id;

    if (activeProject && project.id === activeProject.id) {
      btn.classList.add('active-project'); 
    }

    btn.addEventListener('click', () => {
      callbacks.onChangeProject(project.id);
      render();
    });

    li.appendChild(btn);
    projectListEl.appendChild(li);
  });
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
    const li = document.createElement('li');
    li.classList.add('todo-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.isDone;
    checkbox.addEventListener('change', () => {
      callbacks.onToggleTodo(todo.id);
      renderTodos(); 
    });

    const titleEl = document.createElement('span');
    titleEl.textContent = `${todo.title} (${todo.date || 'no date'})`;
    if (todo.isDone) {
      titleEl.classList.add('todo-done'); 
    }

    const descEl = document.createElement('p');
    descEl.textContent = todo.descriptions || '';

    const noteEl = document.createElement('small');
    noteEl.textContent = todo.note || '';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      callbacks.onDeleteTodo(todo.id);
      renderTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(titleEl);
    li.appendChild(descEl);
    li.appendChild(noteEl);
    li.appendChild(deleteBtn);

    todoListEl.appendChild(li);
  });
}

export function render() {
  renderProjects();
  renderTodos();
}

export function initDOM(userCallbacks) {
  cacheDOM();

  callbacks = {
    ...callbacks,
    ...userCallbacks,
  };

  if (newProjectForm) {
    newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newProjectForm.querySelector('input[name="projectTitle"]');
      const title = input.value.trim();
      if (!title) return;

      callbacks.onAddProject(title);
      input.value = '';
      render();
    });
  }

  if (newTodoForm) {
    newTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(newTodoForm);

      const todoData = {
        title: formData.get('title').trim(),
        descriptions: formData.get('descriptions') || '',
        date: formData.get('date') || '',
        note: formData.get('note') || '',
        isDone: false,
      };

      if (!todoData.title) return;

      callbacks.onAddTodo(todoData);
      newTodoForm.reset();
      renderTodos();
    });
  }

  render();
}