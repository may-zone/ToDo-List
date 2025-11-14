import { EvalDevToolModulePlugin, ids } from "webpack"

function addTodo (title,descriptions,date,note,isDone = false,id){
    return{
        id:crypto.randomUUID(),
        title,
        descriptions,
        date,
        note,
        isDone,

        toggleDone(){
            this.isDone =  !isDone;
        },

        edit(updateCard){
            Object.assign(this, updateCard);
        }
    };

}