export function addTodo({ title, descriptions, date, note, priority = 'normal', isDone = false, id = crypto.randomUUID() }) {
    return {
        id,
        title,
        descriptions,
        date,
        note,
        priority,
        isDone,

        toggleDone() {
            this.isDone = !this.isDone;
        },

        edit(updateCard) {
            Object.assign(this, updateCard);
        },
    };
}
