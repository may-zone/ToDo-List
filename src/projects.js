export function projCreator(title, { id = crypto.randomUUID(), todos: initialTodos = [] } = {}) {
    let projectTitle = title;
    const projectId = id;
    const todos = [...initialTodos];

    function addTodo(todo) {
        todos.push(todo);
    }

    function removeTodo(todoId) {
        const index = todos.findIndex((t) => t.id === todoId);
        if (index !== -1) todos.splice(index, 1);
    }

    function getTodos() {
        return [...todos];
    }

    function editTitle(newTitle) {
        if (typeof newTitle === 'string' && newTitle.trim()) {
            projectTitle = newTitle.trim();
        }
    }

    return {
        get id() {
            return projectId;
        },
        get title() {
            return projectTitle;
        },
        addTodo,
        removeTodo,
        getTodos,
        editTitle,
    };
}
