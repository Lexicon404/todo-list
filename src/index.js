import {
    todo,
    projectFactory,
    taskFactory,
    newProject,
    newTask,
    addTaskToTodo,
    addProjectToTodo,
    deleteProjectFromTodo,
    deleteTaskFromTodo,
    editTaskFromTodo,
    editDateFromTodo,
    editProjectFromTodo,
    getProjectIndexFromTodo,
    getProjectArrayFromTodo,
    getProjectNameByIndex,
    getTaskArrayFromTodo,
    fromStorage,
    syncStorage
} from "./modules.js"


import { format, add, isWithinInterval, parseISO } from 'date-fns'


function currentDate () {
    return format(new Date(), "yyyy-MM-dd")
}

function nextSevenDays () {
    const result = add((new Date), {
        days: 7,
    })
    return format(result, "yyyy-MM-dd")
} 


const projectTodo = newProject ('All Todos')
const projectOne = newProject ('projectOne')
const projectTwo = newProject ('projectTwo')
const projectThree = newProject ('projectThree')
const projectFour = newProject ('projectFour')


const taskOne = newTask ('taskOne')
const taskOneOne = newTask ('taskOneOne')
const taskTwo = newTask ('taskTwo')
const taskTodoOne = newTask ('task To do 1', '2023-01-25');
const taskTodoTwo = newTask ('task To do 2', '2023-01-26');
const taskTodoThree = newTask ('task To do 3', '2023-01-27');

addProjectToTodo(projectTodo);
addProjectToTodo(projectOne);
addProjectToTodo(projectTwo);
addProjectToTodo(projectThree);
addProjectToTodo(projectFour);


addTaskToTodo('projectOne', taskOne);
addTaskToTodo('projectOne', taskOneOne);
addTaskToTodo('projectTwo', taskTwo);
addTaskToTodo('All Todos', taskTodoOne);
addTaskToTodo('All Todos', taskTodoTwo);
addTaskToTodo('All Todos', taskTodoThree);


function createHTMLElement(tag, attribute, name, text) {
    const element = document.createElement(tag);
    element.setAttribute(attribute, name);
    element.textContent = text;
    return element;
}

function clearElementContent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function navButtonListeners(){
    
const allButton = document.getElementById('all-button');
const todayButton = document.getElementById('today-button');
const weekButton = document.getElementById('week-button');

allButton.addEventListener('click', () => displayTodo("All Todos"))
todayButton.addEventListener('click', () => displayToday())
weekButton.addEventListener('click', () => displaySevenDays())
}



function displayTodo(projectName) {
    const content = document.getElementById('tasks');
    const title = document.getElementById('project-title');
    const edit = document.getElementById('edit-button');

    title.textContent = projectName;
    content.textContent = '';
    edit.textContent = '';

    let taskArray = getTaskArrayFromTodo(projectName);

    for (let i=0; i<taskArray.taskArray.length; i++) {
        const taskContainer = document.createElement('div')
        const taskContainerId = `${getProjectIndexFromTodo(projectName)}-${i}`
        taskContainer.setAttribute('id', taskContainerId)
        const task = document.createElement('div');
        const date = document.createElement('div');
        task.textContent = taskArray.taskArray[i].task;
        date.textContent = taskArray.taskArray[i].date;
        taskContainer.appendChild(task);
        taskContainer.appendChild(date);
        content.appendChild(taskContainer);

        //add edit task button
        editTaskButton(taskContainerId)
        
        //add edit date button
        editDateButton(taskContainerId)

        //add delete task button
        deleteTaskButton(taskContainerId)
    }

    if (projectName !== 'All Todos'){
        editProjectNameButton(edit)
        deleteProjectButton(edit)
    }

    newTodoForm(projectName)

}




function newTodoForm (projectName) {
    const content = document.getElementById('tasks');
    const formContainer = createHTMLElement('form', 'action', './');
    const textInput = createHTMLElement('input', 'type', 'text');
    const dateInput = createHTMLElement('input', 'type', 'date');
    const submit = createHTMLElement('input', 'type', 'submit');


    formContainer.appendChild(textInput);
    formContainer.appendChild(dateInput);
    formContainer.appendChild(submit);
    content.appendChild(formContainer);

    submit.addEventListener('click', () => {
        event.preventDefault();
        const project = projectName;
        const task = textInput.value;
        const date = dateInput.value;
        const taskObject = newTask(task, date);
        addTaskToTodo(project, taskObject);
        refreshTodoPage(projectName)
    });
}


function newProjectButton (anchorText) {
    const content = document.getElementById('add-new');
    const formContainer = createHTMLElement('form', 'action', './');
    const textInput = createHTMLElement('input', 'type', 'text');
    const submit = createHTMLElement('input', 'type', 'submit');

    textInput.setAttribute('value', anchorText)
    formContainer.appendChild(textInput);
    formContainer.appendChild(submit);
    content.appendChild(formContainer);

    submit.addEventListener('click', () => {
        event.preventDefault();
        const projectName = textInput.value;
        const project = newProject(projectName);
        addProjectToTodo(project)
        syncStorage()
        refreshNavBar()
    });
}



function displayAllProjectButton(){
    const content = document.getElementById('add-new');
    let projectArray = getProjectArrayFromTodo();

    for (let i=0; i<projectArray.length; i++) {
        if (projectArray[i] !== "All Todos") { //display all except All Todos
        const container = document.createElement('div')
        const button = createHTMLElement('button', 'id', `project-${i}`, projectArray[i]);
        button.setAttribute('class', 'project-button')
        container.appendChild(button);
        content.appendChild(container);
    }}

    //add eventlisteners to all project button
    const buttons = document.querySelectorAll('.project-button')
    const arrayButtons = Array.from(buttons)
    arrayButtons.forEach(
        function(button){
            button.addEventListener("click", event => {
                let projectIndex = event.target.id.replace('project-', '');
                let projectName = getProjectNameByIndex(projectIndex);
                displayTodo(projectName)
            }
         )}
    )
}


function editProjectNameButton(container){
    const nameContainer = document.getElementById('project-title');
    const buttonId = getProjectIndexFromTodo(nameContainer.innerText)
    const editButton = createHTMLElement('button', 'id', `edit-project-${buttonId}`, 'Edit');
    editButton.setAttribute('class', 'edit-button')
    container.appendChild(editButton);

    const edits = document.querySelectorAll('.edit-button')
    const arrayEdits = Array.from(edits)
    arrayEdits.forEach(
        function(button){
            button.addEventListener("click", event => {
            editProjectForm (nameContainer, nameContainer.innerText)
        }
         )}
    )
}


function editProjectForm (container, anchorText) {
    const formContainer = createHTMLElement('form', 'action', './');
    const textInput = createHTMLElement('input', 'type', 'text');
    const submit = createHTMLElement('input', 'type', 'submit');

    textInput.setAttribute('value', anchorText)
    formContainer.appendChild(textInput);
    formContainer.appendChild(submit);
    container.appendChild(formContainer);

    submit.addEventListener('click', () => {
        event.preventDefault();
        const oldName = anchorText;
        const newName = textInput.value;
        if (editProjectFromTodo(oldName, newName)){
        refreshTodoPage(newName);
    } else {
        refreshTodoPage(oldName);
    }

        refreshNavBar()

    });
}

function deleteProjectButton(container){
    const nameContainer = document.getElementById('project-title');
    const buttonId = getProjectIndexFromTodo(nameContainer.innerText)
    const deleteButton = createHTMLElement('button', 'id', `delete-project-${buttonId}`, 'Delete');
    deleteButton.setAttribute('class', 'delete-project')
    container.appendChild(deleteButton);


    deleteButton.addEventListener("click", event => {
        const projectIndex = buttonId;
        const projectName = getProjectNameByIndex(projectIndex);
        deleteProjectFromTodo (projectName)
        refreshTodoPage("All Todos")
        refreshNavBar()
    })
}






function refreshNavBar(){
    const content = document.getElementById('add-new');
    content.innerHTML = "";
    newProjectButton('');
    displayAllProjectButton();
}

function refreshTodoPage(projectName){
    syncStorage();
    displayTodo(projectName);
}


function editTaskButton(taskDivId){
    const container = document.getElementById(taskDivId);
    const editButton = createHTMLElement('button', 'class', `edit-task-button`, 'Edit');
    container.appendChild(editButton);

    editButton.addEventListener("click", event => {
                    const anchorText = event.target.parentElement.firstChild.innerText;
                    editTaskForm (container, anchorText)
            }, {once : true})
    }



function editTaskForm (container, anchorText) {
    const formContainer = createHTMLElement('form', 'action', './');
    const textInput = createHTMLElement('input', 'type', 'text');
    const submit = createHTMLElement('input', 'type', 'submit');

    textInput.setAttribute('value', anchorText)
    formContainer.appendChild(textInput);
    formContainer.appendChild(submit);
    container.appendChild(formContainer);

    submit.addEventListener('click', (event) => {
        event.preventDefault();
        const newTask = textInput.value;
        const taskDivId = event.target.parentElement.parentElement.id;
        const projectTask = taskDivId.split("-");
        const targetProjectName = getProjectNameByIndex(projectTask[0]);
        const taskIndex =  projectTask[1];

        editTaskFromTodo (targetProjectName, taskIndex, newTask);

        refreshTodoPage(targetProjectName);

        refreshNavBar();
    });
}



function editDateButton(taskDivId){
    const container = document.getElementById(taskDivId);
    const editButton = createHTMLElement('button', 'class', `edit-date-button`, 'Edit Date');
    container.appendChild(editButton);

    editButton.addEventListener("click", event => {
                    editDateForm (container)
            }, {once : true})
    }



function editDateForm (container) {
    const formContainer = createHTMLElement('form', 'action', './');
    const dateInput = createHTMLElement('input', 'type', 'date');
    const submit = createHTMLElement('input', 'type', 'submit');

    formContainer.appendChild(dateInput);
    formContainer.appendChild(submit);
    container.appendChild(formContainer);

    submit.addEventListener('click', (event) => {
        event.preventDefault();
        const newDate = dateInput.value;
        const taskDivId = event.target.parentElement.parentElement.id;
        const projectTask = taskDivId.split("-");
        const targetProjectName = getProjectNameByIndex(projectTask[0]);
        const taskIndex =  projectTask[1];

        editDateFromTodo (targetProjectName, taskIndex, newDate)

        refreshTodoPage(targetProjectName)

        refreshNavBar()
    });
}


function deleteTaskButton(taskDivId){
    const container = document.getElementById(taskDivId);
    const deleteButton = createHTMLElement('button', 'class', `delete-task-button`, 'Delete Task');
    container.appendChild(deleteButton);

    deleteButton.addEventListener("click", event => {
        const divId = event.target.parentElement.id;
        const projectTask = divId.split("-");
        const targetProjectName = getProjectNameByIndex(projectTask[0]);
        const taskIndex =  projectTask[1];

        deleteTaskFromTodo (targetProjectName, taskIndex)

        refreshTodoPage(targetProjectName)

        refreshNavBar()            
    })
}



function displayToday() {
    const content = document.getElementById('tasks');
    const title = document.getElementById('project-title');
    const edit = document.getElementById('edit-button');

    title.textContent = "Today's Agenda";
    content.textContent = '';
    edit.textContent = '';

// use a for each [i], for each [j] loop to go through all dates
        for (let i = 0; i < todo.length; i++ ){
            for (let j = 0; j < todo[i].task.length; j++ ){
                if (todo[i].task[j].date === currentDate()){
                    displayTasks(i, j);
                }

            }
        }

    function displayTasks(projectIndex, taskIndex){

        const taskContainer = document.createElement('div')
        const taskContainerId = `${projectIndex}-${taskIndex}`
        taskContainer.setAttribute('id', taskContainerId)
        const task = document.createElement('div');
        const date = document.createElement('div');
        task.textContent = `${todo[projectIndex].project} - ${todo[projectIndex].task[taskIndex].task}`
        date.textContent = todo[projectIndex].task[taskIndex].date
        taskContainer.appendChild(task);
        taskContainer.appendChild(date);
        content.appendChild(taskContainer);

        //add edit task button
        editTaskButton(taskContainerId)
        
        //add edit date button
        editDateButton(taskContainerId)

        //add delete task button
        deleteTaskButton(taskContainerId)
    
    }
}


function displaySevenDays() {
    const content = document.getElementById('tasks');
    const title = document.getElementById('project-title');
    const edit = document.getElementById('edit-button');

    title.textContent = "Agendas for next 7 days";
    content.textContent = '';
    edit.textContent = '';

// use a for each [i], for each [j] loop to go through all dates
        for (let i = 0; i < todo.length; i++ ){
            for (let j = 0; j < todo[i].task.length; j++ ){
                if (
                    //todo[i].task[j].date === currentDate()
                    isWithinInterval(parseISO(todo[i].task[j].date),{
                        start: parseISO(currentDate()),
                        end: parseISO(nextSevenDays())
                    }))
                    {
                    displayTasks(i, j);
                }
                

            }
        }

    function displayTasks(projectIndex, taskIndex){

        const taskContainer = document.createElement('div')
        const taskContainerId = `${projectIndex}-${taskIndex}`
        taskContainer.setAttribute('id', taskContainerId)
        const task = document.createElement('div');
        const date = document.createElement('div');
        task.textContent = `${todo[projectIndex].project} - ${todo[projectIndex].task[taskIndex].task}`
        date.textContent = todo[projectIndex].task[taskIndex].date
        taskContainer.appendChild(task);
        taskContainer.appendChild(date);
        content.appendChild(taskContainer);

        //add edit task button
        editTaskButton(taskContainerId)
        
        //add edit date button
        editDateButton(taskContainerId)

        //add delete task button
        deleteTaskButton(taskContainerId)
    
    }
}

function initiateUI(){
fromStorage()
navButtonListeners();
newProjectButton('add new project');
displayAllProjectButton();
displayTodo("All Todos");
}

initiateUI()


