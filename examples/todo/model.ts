
module TodoApp {

    export class Task {
        constructor(public id: number, public name: string, public completed: boolean, public isInEditMode: boolean = false) {
        }

        public setStatus(completed: boolean): void {
            this.completed = completed;
        }

        public setEditMode(isEdit: boolean): void {
            this.isInEditMode = isEdit;
        }

        public setName(name: string): void {
            this.name = name;
        }
    }

    export class Tasks {
        private counter: number;
        public items: Task[];
        private storageItemsKey = 'todoApp.taskListItems';
        private storageCounterKey = 'todoApp.taskListCounter';

        constructor() {
            this.items = [];
            this.counter = 0;
        }

        public saveToStorage() {
            localStorage.setItem(this.storageItemsKey, JSON.stringify(this.items));
            localStorage.setItem(this.storageCounterKey, JSON.stringify(this.counter));
        }

        public restoreFromStorage() {
            var storageItems = JSON.parse(localStorage.getItem(this.storageItemsKey));
            if (storageItems) {
                for (var i = 0; i < storageItems.length; i++) {
                    var item = storageItems[i];
                    this.items.push(new Task(item.id, item.name, item.completed, item.isInEditMode));
                }
            }
            var counter = JSON.parse(localStorage.getItem(this.storageCounterKey));
            if (typeof(counter) === 'number') {
                this.counter = counter;
            }
        }

        public getItemsCount(): number {
            return this.items.length;
        }

        public addTask(name: string): void
        {
            this.items.push(new Task(this.counter++, name, false));
            this.saveToStorage();
        }

        public markTaskAsCompleted(id: number): void {
            this.setTaskStatus(id, true);
            this.saveToStorage();
        }

        public markAllTasksAsCompleted(): void {
            for (var i = 0; i < this.items.length; i++) {
                this.markTaskAsCompleted(this.items[i].id);
                this.setTaskEditMode(this.items[i].id, false);
            }
            this.saveToStorage();
        }

        public markTaskAsActive(id: number): void {
            this.setTaskStatus(id, false);
            this.saveToStorage();
        }

        public markAllTasksAsActive(): void {
            for (var i = 0; i < this.items.length; i++) {
                this.markTaskAsActive(this.items[i].id);
                this.setTaskEditMode(this.items[i].id, false);
            }
            this.saveToStorage();
        }

        public removeTask(id: number): void {
            this.removeTasksByPredicate((item: Task) => { return item.id === id; });
            this.saveToStorage();
        }

        public getNumberOfCompletedTasks(): number {
            var res = 0;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].completed) {
                    res++;
                }
            }
            return res;
        }

        public removeCompletedTasks(): void {
            this.removeTasksByPredicate((item: Task) => { return item.completed; });
            this.saveToStorage();
        }

        public setTaskStatus(taskId: number, status: boolean): void {
            this.findTaskById(taskId).setStatus(status)
            this.saveToStorage();
        }

        public setTaskEditMode(taskId: number, inEditMode: boolean): void {
            this.findTaskById(taskId).setEditMode(inEditMode);
        }

        public setTaskName(taskId: number, name: string): void {
            this.findTaskById(taskId).setName(name);
            this.saveToStorage();
        }

        public isWholeListCompleted(): boolean {
            return this.items.every((currentValue, index, array) => {
                    return currentValue.completed;
                });
        }

        public isTaskCompleted(taskId: number): boolean {
            return this.findTaskById(taskId).completed;
        }

        public isInEditMode(taskId: number): boolean {
            return this.findTaskById(taskId).isInEditMode;
        }

        private findTaskById(taskId: number): Task {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].id === taskId) {
                    return this.items[i];
                }
            }
            return null;
        }

        private removeTasksByPredicate(predicate: (Task) => boolean) {
            for (var i = this.items.length - 1; i >= 0; i--) {
                if (predicate(this.items[i])) {
                    this.items.splice(i, 1);
                }
            }
        }
    }
}