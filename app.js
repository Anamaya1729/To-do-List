// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert")
const form = document.querySelector(".task-form")
const task = document.querySelector("#task")
const submitBtn = document.querySelector(".submit-btn")
const container = document.querySelector(".task-container")
const list = document.querySelector(".task-list")
const clearBtn = document.querySelector(".clear-btn")
// edit option
let editElement;
let isEditing = false;
let editId = "";
// ****** EVENT LISTENERS **********
form.addEventListener("submit",addItem)
clearBtn.addEventListener("click",clearTasks)
window.addEventListener("DOMContentLoaded",setupItems)
// ****** FUNCTIONS **********
function addItem(e)
{
    e.preventDefault()
    const inputValue = task.value 
    const id = new Date().getTime().toString()

    if (inputValue && !isEditing)
    {
        //Add item to the list
        createListItem(id,inputValue)
        
        // display the message
        display("Task added to the list successfully!!" , "success")
        // show the list
        container.classList.add("show-container")
        // add to local Storage
        addToLocalStorage(id,inputValue)
        // set Back to default
        setBackToDefault()
    }
    else if( inputValue && isEditing)
    {
        // edit the item
        editElement.innerHTML = inputValue;
        display("Task Edited Successfully!", "success")
        //edit local storage
        editLocalStorage(editId,inputValue)
        setBackToDefault()
    }
    else
    {
        // empty value
        display("Please enter the value", "danger")
        
    }
}

// Clear Tasks
function clearTasks()
{
    const tasks = document.querySelectorAll(".task-item")
    if (tasks.length > 0)
    {
        tasks.forEach(function(item){
            list.removeChild(item)
        })
    }
    container.classList.remove("show-container")
    display("Cleared list", "success")
    setBackToDefault()
    localStorage.removeItem("list")
}

// Display function
function display(text, action)
{
    alert.textContent = text
    alert.classList.add(`alert-${action}`)

    // remove text
    setInterval(function(){
        alert.textContent = ""
        alert.classList.remove(`alert-${action}`)
    },2000)
}

//set back to default
function setBackToDefault()
{
    task.value = "";
    isEditing = false;
    editId = "";
    submitBtn.textContent = "submit";
}

//delete function
function deleteItem(e)
{
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id
    list.removeChild(element)
    if (list.children.length === 0)
    {
        container.classList.remove("show-container")
    }
    display("Item removed", "success")
    setBackToDefault()
    //remove from local storage
    removeFromLocalStorage(id)
}

//edit function
function editItem(e)
{
    const element = e.currentTarget.parentElement.parentElement;
    // selecting the item to be edited
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set input value box
    task.value = editElement.innerHTML;
    isEditing = true;
    editId = element.dataset.id
    submitBtn.textContent = "Edit";

}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value)
{
    console.log("added to local storage")
    const taskInfo = {id, value}
    let tasks = getLocalStorage()
    tasks.push(taskInfo)
    localStorage.setItem("list",JSON.stringify(tasks))
}

function removeFromLocalStorage(id)
{
    let tasks = getLocalStorage()
    tasks = tasks.filter(function(item)
    {
        if (id !== item.id)
        {
            return item;
        }
    })
    localStorage.setItem("list",JSON.stringify(tasks))
}

function editLocalStorage(id, value)
{
    console.log("edited")
    let tasks = getLocalStorage()
    tasks = tasks.map(function(item)
    {
        if (id === item.id)
        {
            item.value = value
        }
        return item
    })
    localStorage.setItem("list",JSON.stringify(tasks))
}

function getLocalStorage()
{
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[]
}

// ****** SETUP ITEMS **********
//Display local storage
function setupItems()
{
    const tasks = getLocalStorage()
    if (tasks.length > 0)
    {
        tasks.forEach(function(item)
        {
            createListItem(item.id,item.value)
        })
        container.classList.add("show-container")
    }
}

function createListItem(id, value)
{
    const element = document.createElement("article")
    element.classList.add("task-item")
    const attr = document.createAttribute("data-id")
    attr.value = id;
    element.setAttributeNode(attr)

    element.innerHTML = `<p class="title">${value}</p>
                            <div class="btn-container">
        <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
        <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>`
    //delete btn
    const deleteBtn = element.querySelector(".delete-btn")
    const editBtn = element.querySelector(".edit-btn")
    
    deleteBtn.addEventListener("click",deleteItem)
    editBtn.addEventListener("click",editItem)

    //append child to the list
    list.appendChild(element)
}