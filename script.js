const date = new Date;
document.getElementById('dashboardDate').innerText = `${date.toUTCString().substring(5, 16)}`
showTask();
checkCompletedTask();
function checkCompletedTask (){
    let completedTaskList = JSON.parse(localStorage.getItem('completedTaskList'));
    if (!completedTaskList.length) {
        console.log('this ran');
        document.getElementById('showCompleteTaskModal').style.opacity = '50%';
        document.getElementById('showCompleteTaskModal').setAttribute('onclick','');
    }else{
        document.getElementById('showCompleteTaskModal').style.opacity = '';
        document.getElementById('showCompleteTaskModal').setAttribute('onclick','showModal(\'complete\')');
    }
}
const addNewTask = () => {
    let allTask;
    let html = "";
    if (!localStorage.getItem("taskList")) {
        allTask = [];
    } else {
        allTask = JSON.parse(localStorage.getItem('taskList'));
    }
    let todayDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let taskTitle = document.forms[0].title.value;
    let taskDescription = document.forms[0].description.value;

    let task = {
        title: taskTitle,
        description: taskDescription,
        date: todayDate
    }
    allTask.push(task);
    localStorage.setItem("taskList", JSON.stringify(allTask));
    closeModal();
    showTask();
}

const closeModal = () => {
    resetField();
    document.getElementById("modal").style.display = 'none';
}

const closeCompleteModal = () => {
    document.getElementById("completeTaskModal").style.display = 'none';
    checkCompletedTask();
}

const showModal = (type, index) => {
    if (type == 'edit') {
        document.getElementById("modal").style.display = 'flex';
        document.getElementById('addTask').setAttribute('onclick', `saveEditedTask(${index})`)
        document.getElementById('addTask').innerText = 'Save Changes';
    } else if (type == 'complete') {
        document.getElementById('completeTaskModal').style.display = 'flex';
        showCompletedTask();
    } else {
        document.getElementById("modal").style.display = 'flex';
        document.getElementById('addTask').setAttribute('onclick', `addNewTask()`)
        document.getElementById('addTask').innerText = 'Add Task';
    }
}

function resetField() {
    document.forms[0].title.value = '';
    document.forms[0].description.value = '';
}

function showTask() {
    let html = '';
    if (localStorage.getItem('taskList') && JSON.parse(localStorage.getItem('taskList')).length) {
        let allTask = JSON.parse(localStorage.getItem('taskList'));
        allTask.forEach((element, index) => {
            html += `<div class="task-card">
            <p class="task-heading">${element.title}</p>
            <p class="task-body">${element.description}</p>
            <div class="task-card-option">
            <a href="#"><i class="fa-solid fa-calendar-days"></i> ${element.date}</a>
            <a href="#" id="${index}" onclick="openEditModal(this.id)"><i class="fa-solid fa-pen"></i> Edit</a>
            <a href="#" id="${index}" onclick="deleteTask(this.id)"><i class="fa-solid fa-xmark"></i> Remove</a>
            <a href="#" id="${index}" onclick="completeTask(this.id)"><i class="fa-solid fa-check"></i> Complete</a>
            </div>
            </div>`
        });
    } else {
        html = '<h3 align="center">No task available</h3>'
    }
    document.getElementById('task').innerHTML = html;
}

const openEditModal = (index) => {
    let allTask = JSON.parse(localStorage.getItem("taskList"));
    let task = allTask[index]
    document.forms[0].title.value = task.title;
    document.forms[0].description.value = task.description;
    showModal('edit', index);
}
const saveEditedTask = (index) => {
    let allTask = JSON.parse(localStorage.getItem("taskList"));
    let task = allTask[index];
    task.title = document.forms[0].title.value;
    task.description = document.forms[0].description.value;
    allTask[index] = task;
    localStorage.setItem('taskList', JSON.stringify(allTask));
    closeModal();
    showTask();
}

const deleteTask = (index) => {
    if (localStorage.getItem('taskList')) {
        let allTask = JSON.parse(localStorage.getItem('taskList'));
        allTask.splice(index, 1);
        localStorage.setItem('taskList', JSON.stringify(allTask));
        showTask();
    }
}

const changeSidePanel = (x) => {
    if (x) {
        document.getElementById('mainLayout').style.gridTemplateColumns = '148px 0.75fr 1.5fr';
        document.querySelectorAll('.side-panel-icon').forEach(e => { e.style.alignItems = 'flex-start'; e.style.paddingLeft = '12px'; });
        document.querySelectorAll('.icon-label').forEach(e => { e.style.display = 'inherit' });
        document.querySelector('.fa-angles-right').style.rotate = '180deg';
        document.getElementById('expandBtn').setAttribute('onclick', 'changeSidePanel(false)')
    } else {
        document.querySelectorAll('.icon-label').forEach(e => { e.style.display = '' });
        document.querySelectorAll('.side-panel-icon').forEach(e => { e.style.alignItems = ''; e.style.paddingLeft = ''; });
        document.getElementById('mainLayout').style.gridTemplateColumns = '';
        document.querySelector('.fa-angles-right').style.rotate = '';
        document.getElementById('expandBtn').setAttribute('onclick', 'changeSidePanel(true)')

    }

}

const toggleSidePanel = () => {
    if (window.innerWidth > 1000) {
        changeSidePanel(true)
    } else {
        changeSidePanel(false)
    }
}

const completeTask = (index) => {
    let completedTaskList = JSON.parse(localStorage.getItem('completedTaskList'));
    if (!localStorage.getItem('completedTaskList')) completedTaskList = [];
    if (localStorage.getItem('taskList')) {
        let allTask = JSON.parse(localStorage.getItem('taskList'));
        completedTaskList.push(allTask.splice(index, 1)[0]);
        localStorage.setItem('completedTaskList', JSON.stringify(completedTaskList));
        localStorage.setItem('taskList', JSON.stringify(allTask));
        showTask();
        checkCompletedTask();
    }
}

const showCompletedTask = () => {
    let html = '';
    let completedTaskList = JSON.parse(localStorage.getItem('completedTaskList'));
    console.log(completedTaskList);
    if (completedTaskList) {
        completedTaskList.forEach((e, index) => {
            html += `<div class="task-card">
            <p class="task-heading">${e.title}</p>
            <p class="task-body">${e.description}</p>
            <div class="task-card-option">
                <a href="#"><i class="fa-solid fa-calendar-days"></i> ${e.date}</a>
                <a href="#" id="${index}" onclick=deleteCompletedTask(this.id)><i class="fa-solid fa-xmark"></i> Remove</a>
            </div>
        </div>`
        })
    }
    document.getElementById('completedTaskListBox').innerHTML = html;
}

const deleteCompletedTask = (index) => {
    let completedTaskList = JSON.parse(localStorage.getItem('completedTaskList'));
    if (completedTaskList) {
        let allTask = JSON.parse(localStorage.getItem('completedTaskList'));
        allTask.splice(index, 1);
        localStorage.setItem('completedTaskList', JSON.stringify(allTask));
    }
    if (!JSON.parse(localStorage.getItem('completedTaskList')).length) {
        closeCompleteModal();
    }
    showCompletedTask();
    checkCompletedTask();
}

// git remote add origin repoURl
// git branch -M main
// git push -u origin main

