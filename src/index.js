import './styles.css';
import { todoController } from './todo-CRUD.js';
import {projectCreator} from './projects.js';
import { addTodo } from './todo-factory.js';



let projects = [];
let todos = [];
let currentProject = null;

function createDefaultProject () {
    const defaultProject = projectCreator('Inbox');
    projects.push(defaultProject);
    currentProject = defaultProject;
}

function createNewProject (title){
    const project = projectCreator(title);
    projects.push(project);
    return project;
}

function addTodoToActiveProject({title,descriptions,date,note,isDone=false}){
    if(!currentProject){
        console.error("There is no Project !");
        return;
    }
    const todo = todoController.create({title, descriptions, date,note,isDone});
    currentProject.addTodo(todo);
    
    return todo;
}

function getActiveProjectTodos (){
    if(!currentProject) return [];
    return currentProject.getToDos();
}

function getAllProjects(){
    return[...projects];
}


function init (){
    createDefaultProject();

    addTodoToActiveProject({
        title : " Go Fuck YourSelf",
        descriptions :"because im angry right now !",
        date :"every day",
        note :"just kidding"
    });
    console.log('All Projects :',projects);
    console.log('Todos :',getActiveProjectTodos());

}

init();

