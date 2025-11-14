function addTodo (title,descriptions,date,note,isDone = false,id){
    return{
        id:crypto.randomUUID(),
        title,
        descriptions,
        date,
        note,
        isDone
    }

}