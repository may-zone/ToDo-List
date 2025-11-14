export function addTodo({ title, descriptions, date, note, priority = 'normal', isDone = false }) {
    return {
        id: crypto.randomUUID(),
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
