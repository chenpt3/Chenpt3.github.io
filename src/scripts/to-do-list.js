import Components from 'chens-magic-components';
import '../styles/to-do-list.css';

export default class ToDoList {
    constructor(domManager, state) {
        this.domManager = domManager;
        this.logic = new ToDoLogic();
        this.state = state || this.logic.tasks;
        this.logic.tasks = this.state;
        this.toDoDOM = new ToDoDOM(this.domManager, this.logic);
    }
}

class ToDoLogic {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 0;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addTask(task, priority = 'Normal') {
        const taskWithId = { id: this.currentId++, description: task, completed: false, priority };
        this.tasks.push(taskWithId);
        this.saveTasks();
    }

    setPriority(id, priority) {
        const task = this.findTask(id);
        if (task) {
            task.priority = priority;
            this.saveTasks();
        } 
    }

    removeTask(id) {
        const task = this.findTask(id);
        if (task) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
        }
    }

    updateTask(id, newDescription) {
        const task = this.findTask(id);
        if (!task) {
            throw new Error(`Task with id ${id} not found.`);
        }
        task.description = newDescription;
        this.saveTasks();
    }

    toggleTaskStatus(id) {
        const task = this.findTask(id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.tasks.push(task);
            }
            this.saveTasks();
        }
    }

    findTask(id) {
        return this.tasks.find(task => task.id === id);
    }
}

class ToDoDOM {
    constructor(domManager, logic) {
        this.Components = new Components();
        this.domManager = domManager;
        this.logic = logic;
        this.createContainer();
        this.createTaskForm();
        this.createTaskList();
    }

    createContainer() {
        const container = document.createElement('div');
        container.classList.add('to-do-container');
        this.domManager.domManager.main.main.children[0].appendChild(container);
        this.container = container;
    }

    createTaskForm() {
        const form = document.createElement('form');
        form.classList.add('to-do-form');
        this.container.appendChild(form);

        const input = document.createElement('input');
        input.classList.add('to-do-input');
        input.placeholder = 'Add a task...';
        input.maxLength = 25;
        form.appendChild(input);

        const priority = new this.Components.Dropdown(form, 'Priority', ['Low', 'Normal', 'High'], 'Normal');
        const priorityElement = form.querySelector('.dropdown-container');
        priorityElement.classList.add('to-do-priority');
 
        const button = document.createElement('button');
        button.classList.add('to-do-button');
        button.textContent = 'Add Task';
        form.appendChild(button);

        

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const task = input.value;
            let taskPriority = priority.getSelectedOption(); // get the selected option's innerText
            if (!taskPriority) {
                taskPriority = 'Normal'; // set the default priority to 'Normal' if no priority is chosen
            }
            if (task) {
                this.logic.addTask(task, taskPriority);
                this.updateTaskList();
                input.value = '';
                priority.resetSelectedOption('Priority');
            }
        });
        
    }

    createTaskList() {
        const taskList = document.createElement('ul');
        taskList.classList.add('to-do-list');
        this.container.appendChild(taskList);
        this.taskList = taskList;
        this.updateTaskList();
    }

    updateTaskList() {
        this.taskList.innerHTML = '';
        if (this.logic.tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.classList.add('to-do-empty');
            emptyMessage.textContent = 'No tasks to display.';
            this.taskList.appendChild(emptyMessage);
        }
        this.logic.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskElement = document.createElement('li');
        taskElement.classList.add('to-do-task');
        taskElement.dataset.id = task.id;

        const description = document.createElement('span');
        description.classList.add('to-do-task-description');
        description.textContent = task.description;
        taskElement.appendChild(description);

        const priority = document.createElement('span');
        priority.classList.add('to-do-task-priority');
        priority.textContent = task.priority; // display the task's priority
        taskElement.appendChild(priority);

        const buttons = document.createElement('div');
        buttons.classList.add('to-do-task-buttons');
        taskElement.appendChild(buttons);

        const editButton = document.createElement('button');
        editButton.classList.add('to-do-edit');
        editButton.textContent = 'Edit';
        buttons.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('to-do-delete');
        deleteButton.textContent = 'Delete';
        buttons.appendChild(deleteButton);

        const completeButton = document.createElement('button');
        completeButton.classList.add('to-do-complete');
        completeButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
        if (task.completed) {
            completeButton.style.backgroundColor = 'grey';
        }
        buttons.appendChild(completeButton);

        editButton.addEventListener('click', () => {
            taskElement.innerHTML = '';

            const input = document.createElement('input');
            input.classList.add('to-do-task-input');
            input.value = task.description;
            taskElement.appendChild(input);

            const priority = new this.Components.Dropdown(taskElement, task.priority, ['Low', 'Normal', 'High'], task.priority);
            const priorityElement = taskElement.querySelector('.dropdown-container');
            priorityElement.classList.add('task-priority-dropdown');

            const buttons = document.createElement('div');
            buttons.classList.add('to-do-task-buttons');
            taskElement.appendChild(buttons);
    
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.classList.add('to-do-save');
            buttons.appendChild(saveButton);
    
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('to-do-delete');
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = 'grey';
            buttons.appendChild(deleteButton);
    
            const completeButton = document.createElement('button');
            completeButton.classList.add('to-do-complete');
            completeButton.textContent = task.completed ? 'Uncomplete' : 'Complete';
            completeButton.style.backgroundColor = 'grey';
            buttons.appendChild(completeButton);

            saveButton.addEventListener('click', () => {
                const newDescription = input.value;
                const existingSaveButton = taskElement.querySelector('.to-do-save');
                if (existingSaveButton) {
                    existingSaveButton.remove();
                }
                let newPriority = priority.getSelectedOption();
                if (!newPriority) {
                    newPriority = 'Normal';
                }
                if (newDescription) {
                    this.logic.updateTask(task.id, newDescription);
                    this.logic.setPriority(task.id, newPriority);
                    this.updateTaskList();
                }
            });
        });

        deleteButton.addEventListener('click', () => {
            const confirmation = confirm('Are you sure you want to delete this task?');
            if (confirmation) {
                this.logic.removeTask(task.id);
                this.updateTaskList();
            }
        });

        completeButton.addEventListener('click', () => {
            this.logic.toggleTaskStatus(task.id);
            this.updateTaskList();
        });

        return taskElement;
    }
}