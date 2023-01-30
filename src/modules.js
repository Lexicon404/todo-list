let todo = []

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function toStorage (){
    if (storageAvailable('localStorage')) {
        window.localStorage.setItem('todo', JSON.stringify(todo) )
        console.log('push to local storage')
        console.log(JSON.parse(window.localStorage.getItem('todo')))
      }
      else {
        console.log('No Storage on browser') // Too bad, no localStorage for us
      }
}

function fromStorage (){
    if (storageAvailable('localStorage')) {
        todo = JSON.parse(window.localStorage.getItem('todo'))
        
      }
      else {
        console.log('No Storage on browser') // Too bad, no localStorage for us
      }
}

function syncStorage (){
    toStorage();
    fromStorage();
}

// database moderating functions

const projectFactory = (project, task=[]) => {

    return {
        project,
        task, 
    }
}

const taskFactory = (task, date) => {

    return {
        task,
        date
    }
}

function newProject (project) {
    const newProject = projectFactory(project)
    return newProject
}

function newTask (task, date) {
    const newTask = taskFactory(task, date)
    return newTask
}

function addTaskToTodo (targetProjectName, task) {
        let target = todo.find(e => e.project === targetProjectName)
        target.task.push (task)
    }
    

function addProjectToTodo (project) {
    if (todo.some ((e => e.project === project.project))) {
        console.log('duplicate entry not pushed')
        } 
        else {todo.push(project)}
    }


function deleteProjectFromTodo (targetProjectName) {
    let target = todo.findIndex(e => e.project === targetProjectName);
    todo.splice(target, 1)
}

function deleteTaskFromTodo (targetProjectName, taskIndex) {
    let target = todo.find(e => e.project === targetProjectName);
    target.task.splice(taskIndex, 1)
}

function editTaskFromTodo (targetProjectName, taskIndex, newTask) {
    let target = todo.find(e => e.project === targetProjectName);
    target.task[taskIndex].task = newTask
}

function editDateFromTodo (targetProjectName, taskIndex, newDate) {
    let target = todo.find(e => e.project === targetProjectName);
    target.task[taskIndex].date = newDate
}

function editProjectFromTodo (targetProjectName, newName) {
    if (todo.some ((e => e.project === newName))) {
        alert('This project name already exist')
        console.log('duplicate entry not pushed')
        return false
        } 
        else {
                let target = todo.find(e => e.project === targetProjectName);
                target.project = newName
                return true
            }
}

function getProjectIndexFromTodo(targetProjectName){
    const target = todo.findIndex(object => (
        object.project.match(targetProjectName)
    ))
    return target;
}


function getProjectArrayFromTodo(){
    const array = todo.map( name => name.project)
    return array
}


function getProjectNameByIndex (index) {
    return todo[index].project
}


function getTaskArrayFromTodo(targetProjectName){
    const target = todo.findIndex(object => (
        object.project.match(targetProjectName)
    ))
    const taskArray = todo[target].task;


    function getTaskIndex(taskName){
        const target = taskArray.findIndex(object => (
            object.task.match(taskName)
        ))
        return target;
    }
    
    return {taskArray, getTaskIndex}
}


export { 
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
};