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

    createDOMElement(type, className, parent) {
        if (!parent) {
            throw new Error('parent is not defined');
        }
        const element = document.createElement(type);
        element.classList.add(className);
        parent.appendChild(element);
        return element;
    }

    createAndAppendChildWithText(type, className, text, parent) {
        const element = this.createDOMElement(type, className, parent);
        element.textContent = text;
        return element;
    }
    
    createContainer() {
        this.container = this.createDOMElement('div', 'to-do-container', this.domManager.domManager.main.main.children[0]);
    }

    createTaskForm() {
        const form = this.createDOMElement('form', 'to-do-form', this.container);
        const input = this.createDOMElement('input', 'to-do-input', form);
        input.placeholder = 'Add a task...';
        input.maxLength = 25;
        const priority = new this.Components.Dropdown(form, 'Priority', ['Low', 'Normal', 'High'], 'Normal');
        const priorityElement = form.querySelector('.dropdown-container');
        priorityElement.classList.add('to-do-priority');
        const button = this.createAndAppendChildWithText('button', 'to-do-button', 'Add Task', form);
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const task = input.value;
            let taskPriority = priority.getSelectedOption();
            if (!taskPriority) {
                taskPriority = 'Normal';
            }
            if (task) {
                this.logic.addTask(task, taskPriority);
                this.updateTaskList();
                input.value = '';
                priority.resetSelectedOption('Priority');
            }
        });
    }

    createButton(text, className, eventListener, parent) {
        const button = this.createAndAppendChildWithText('button', className, text, parent);
        button.addEventListener('click', eventListener);
        return button;
    }

    createTaskList() {
        this.taskList = this.createDOMElement('ul', 'to-do-list', this.container);
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
        if (!this.taskList) {
            throw new Error('taskList is not defined');
        }
        const taskElement = this.createDOMElement('li', 'to-do-task', this.taskList);
        taskElement.dataset.id = task.id;
        const description = this.createDescriptionElement(task.description, taskElement);
        const priority = this.createPriorityElement(task.priority, taskElement);
        const buttons = this.createButtonsElement(task, taskElement);
        return taskElement;
    }

    createDescriptionElement(descriptionText, parent) {
        const description = this.createDOMElement('span', 'to-do-task-description', parent);
        description.textContent = descriptionText;
        return description;
    }

    createPriorityElement(priorityText, parent) {
        const priority = this.createDOMElement('span', 'to-do-task-priority', parent);
        priority.textContent = priorityText;
        return priority;
    }

    createButtonsElement(task, taskElement) {
        const buttons = this.createDOMElement('div', 'to-do-task-buttons', taskElement);
        const editButton = this.createEditButton(task, taskElement, buttons);
        const deleteButton = this.createDeleteButton(task, buttons);
        const completeButton = this.createCompleteButton(task, buttons);
        return buttons;
    }

    createEditButton(task, taskElement, parent) {
        return this.createButton('Edit', 'to-do-edit', () => {
            this.editTask(task, taskElement);
        }, parent);
    }

    createDeleteButton(task, parent) {
        return this.createButton('Delete', 'to-do-delete', () => {
            const confirmation = confirm('Are you sure you want to delete this task?');
            if (confirmation) {
                this.logic.removeTask(task.id);
                this.updateTaskList();
            }
        }, parent);
    }

    createCompleteButton(task, parent) {
        const completeButton = this.createButton('Complete', 'to-do-complete', () => {
            this.logic.toggleTaskStatus(task.id);
            this.updateTaskList();
        }, parent);
        if (task.completed) {
            completeButton.style.backgroundColor = 'grey';
        }
        return completeButton;
    }

    editTask(task, taskElement) {
        taskElement.innerHTML = '';
        const input = this.createInput(task.description, taskElement);
        const priority = new this.Components.Dropdown(taskElement, task.priority, ['Low', 'Normal', 'High'], task.priority);
        const priorityElement = taskElement.querySelector('.dropdown-container');
        priorityElement.classList.add('task-priority-dropdown');
        const buttons = this.createDOMElement('div', 'to-do-task-buttons', taskElement);
        const saveButton = this.createSaveButton(task, input, priority, buttons, taskElement);
        buttons.appendChild(saveButton);
    }

    createInput(value, parent) {
        const input = this.createDOMElement('input', 'to-do-task-input', parent);
        input.value = value;
        input.maxLength = 25;
        return input;
    }

    createSaveButton(task, input, priority, parent, taskElement) {
        const saveButton = this.createButton('Save', 'to-do-save', () => {
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
        }, parent);
        return saveButton;
    }
}