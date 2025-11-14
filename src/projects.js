

function projCreator(title){
    const id = crypto.randomUUID();
    const todos =[];

    function addTodo(todo){
        todos.push(todo);
    }

    function removeTodo (todoId){
        const index = todos.findIndex(t => t.id === todoId);
        if(index !== -1) todos.splice(index,1);
    }

    function getTodos (){
        return [...todos]
    }

    function editTitle (newTitle){
        if(newTitle.title) title = newTitle.title;
    }

    return { id, title, addTodo, removeTodo, getTodos, editTitle};

}