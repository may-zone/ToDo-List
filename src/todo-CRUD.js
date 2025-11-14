// this module builds for control todo cards 
// CRUD :
// C : Create
// R : Read
// U : Update 
// D : Delete

import { addTodo } from './todo-factory.js';

const todos = [];

export const todoController = {
    //C => Create :

    create({ title, descriptions, date, note, priority = 'normal', isDone = false }) {
        const todo = addTodo({ title, descriptions, date, note, priority, isDone });
        todos.push(todo);
        return todo;
    },

    //R => Read :

    getAll(){
        return [...todos];
    },
      getById(id) {
    return todos.find(t => t.id === id) || null;
    },

    //U => Update :

    update(id,updates){
        const todo = todos.find(t => t.id=== id);
        if(!todo) return;
        todo.edit(updates);
    },

    toggleDone(id){
        const todo = todos.find(t =>t.id ===id);
        if(!todo)return
        todo.toggleDone();
    },

    //D => Delete :
    remove(id){
        const index = todos.findIndex(t => t.id === id);
        if (index === -1) return
        todos.splice(index ,1);
    }

}
