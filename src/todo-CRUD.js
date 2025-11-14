// this module builds for control todo cards 
// CRUD :
// C : Create
// R : Read
// U : Update 
// D : Delete

import {createTodo } from './todo-factory.js'

const todos = [];

const todoController = {
    //C => Create :

    create({title, descriptions, date, note, isDone=false}){
        const todo = createTodo(title, descriptions, date, note, isDone);
        todos.push(todo);
        return todo;
    }

}