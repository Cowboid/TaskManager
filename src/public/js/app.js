const addBtn = document.querySelector(".add-btn")
const todoInput = document.querySelector(".todo-input")
const todoList = document.querySelector(".todo-list")

addBtn.addEventListener("click", addTask)
todoList.addEventListener("click",  deleteCheck)

const url = 'http://localhost:3000'

//FETCH TASKS ----------------------------------------
async function fetchTasks() {
    const res = await fetch(url + '/tasks', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
        }
    })

    const data = await res.json()
    
    todoList.textContent = ''
    
    data.forEach(task => {
        const todoDiv = document.createElement("div")
        todoDiv.setAttribute('data-identifier', task._id)
        todoDiv.classList.add("todo-div")
        
        const todoLi = document.createElement("li")
        todoLi.innerText = task.description;
        todoLi.classList.add("todo-li")
        todoDiv.appendChild(todoLi)
    
        const checkBtn = document.createElement("button")
        checkBtn.innerHTML = "<i class='fas fa-check'></i>";
        checkBtn.classList.add("check-btn");
        todoDiv.appendChild(checkBtn)
    
        const trashBtn = document.createElement("button")
        trashBtn.innerHTML = "<i class='fas fa-trash'></i>";
        trashBtn.classList.add("trash-btn")
        todoDiv.appendChild(trashBtn)
        
        todoList.appendChild(todoDiv)
    })

    todoInput.value = ''
}

fetchTasks()

//ADD NEW TASK ----------------------------------------------
async function addTask(event) {
    event.preventDefault()
    const task = await fetch(url + '/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
        },
        body: JSON.stringify({
            description: todoInput.value
        })
    })

    fetchTasks()
}

//CHECK TASK - DELETE TASK ----------------------------------
async function deleteCheck(event) {
    const target = event.target;
    if (target.classList[0] === "trash-btn") {
        const taskId = target.parentElement.dataset.identifier
        const task = await fetch(url + '/tasks/' + taskId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
            }
        })

        target.parentElement.classList.toggle("fall")
        target.parentElement.addEventListener("transitionend", ()=> target.parentElement.remove())

    }
    else if (target.classList[0] === "check-btn") {
        const taskId = target.parentElement.dataset.identifier
        const task = await fetch(url + '/tasks/' + taskId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
            },
            body: JSON.stringify({
                completed: true
            })
        })

        target.parentElement.classList.toggle('completed')
        setTimeout(()=> {
            target.parentElement.remove()
        }, 500)
    }
}

//LOGOUT AND LOGOUT ALL -----------------------------------------
const logoutBtn = document.querySelector('.logout-btn')
const logoutAllBtn = document.querySelector('.logoutall-btn')

logoutBtn.addEventListener('click', logout)
logoutAllBtn.addEventListener('click', logout)


async function logout (event) {
    const clickedBtn = event.target.innerText
    fetch(url + (clickedBtn === 'Logout' ? '/users/logout' : '/users/logoutAll'), {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
        }
    })
    localStorage.removeItem('jwt_token')
    location.replace(url)
}

//DELETE ACCOUNT -----------------------------------------------------
const delAccountBtn = document.querySelector('.del-account-btn')

delAccountBtn.addEventListener('click', () => {
    if (confirm('If you proceed, your account as well as your tasks will be completely removed from our application.')) {
        deleteAccount()
    } else {
        console.log('cancelled')
    }
})

async function deleteAccount () {
    fetch(url + '/users/me', {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
        }
    })
    location.replace(url)
}