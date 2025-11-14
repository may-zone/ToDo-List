

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

}