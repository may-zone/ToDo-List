const STORAGE_KEY = 'todo-app-state';

function canUseLocalStorage() {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function saveState(projects, currentProjectId) {
  if (!canUseLocalStorage()) return;
  const serializedProjects = projects.map((project) => ({
    id: project.id,
    title: project.title,
    todos: project.getTodos().map((todo) => ({
      id: todo.id,
      title: todo.title,
      descriptions: todo.descriptions || '',
      date: todo.date || '',
      note: todo.note || '',
      priority: todo.priority || 'normal',
      isDone: !!todo.isDone,
    })),
  }));

  const payload = {
    projects: serializedProjects,
    currentProjectId: currentProjectId || null,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save state', err);
  }
}

export function loadState() {
  if (!canUseLocalStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.projects)) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse saved state', err);
    return null;
  }
}
