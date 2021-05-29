const taskList = [], 
      createsTask = document.forms.creates_task,
      addButton = createsTask.elements.add_task, 
      filtersTask = document.forms.filters_task, 
      sort__dates = document.getElementById('sort_date'),
      sort__priorities = document.getElementById('sort_priority')

let filteredTaskList = [],
    statusElements = [] 

function Task(text, priority, date, status) {
  this.text = text
  this.priority = priority
  this.date = date
  this.status = status
}
// Добавление задачи
function addTask () {
  const textTask = createsTask.elements.text_task,
  priorityTask = createsTask.elements.priority_task
  if(!textTask.value) return (alert("Заполните поле текста задачи!"))
  filtersTask.elements.filter_prior.value = ''
  filtersTask.elements.filter_input.value = ''
  taskList.push(new Task(textTask.value, priorityTask.value, new Date().toLocaleString(), "actively"))
  filteredTaskList = taskList.slice()
  fillHtmlList(taskList)
  textTask.value = ''
}
// Фильтрация задач по приоритету, статусу, тексту
function filteringTasks() {
  const filter__priorities = filtersTask.elements.filter_prior.value,
  filter__statuses = [...filtersTask.querySelectorAll('#status input:checked')].map(n => n.value),
  filter__texts = filtersTask.elements.filter_input.value
  filteredTaskList = taskList.filter(n => (
    (!filter__priorities || n.priority === filter__priorities) &&
    (!filter__statuses.length || filter__statuses.includes(n.status)) &&
    (!filter__texts || n.text.toLowerCase().indexOf(filter__texts.toLowerCase()) > -1 || n.text.toUpperCase().indexOf(filter__texts.toUpperCase()) > -1) 
  ))
  fillHtmlList(filteredTaskList)
}
// Создание HTML задачи
const createTemplate = (n, index) => {
  outputPriority(n)
  return `
  <div class="task">
    <div class="task-priority task-item" id="item_${index}">${priority}</div>
    <div class="status-of-task task-item">
        <div class="task-text task-item" id="task_text" onclick="editTask(${index})">${n.text}</div>
        <small class="task-date task-item">${n.date}</small>
      <div class="task-item task-icons">
        <button class="fa fa-angle-down" onclick="completeTask(${index})" id="complete_task" aria-hidden="true"></button><br>
        <button class="fa fa-times" onclick="cancelTask(${index})" id="cancel_task" aria-hidden="true"></button>
      </div>
    </div>
    <button class="fa fa-trash task-item" onclick="deleteTask(${index})" id="delete_task" aria-hidden="true"></button>
</div>`
}
// Вывод задач
const fillHtmlList = array => {
  const tasks = document.getElementById('tasks')
  tasks.innerHTML = ""
  if(array.length > 0) {
    array.forEach((item, index) => {
      tasks.innerHTML += createTemplate(item, index)
      outputStatus(array,index)
    })
  }
}
// Вывод приоритета на русском языке с цветом
function outputPriority(n) {
    if (n.priority === 'high') {
      priority = '<label  class ="priority high-priority">Высокий</label>'
    } else if (n.priority === 'middle') {
      priority = '<label class ="priority mid-priority">Средний</label>'
    } else {
      priority = '<label class ="priority poor-priority">Низкий</label>'
    }}
// Вывод статуса в соответствующем цвете
function outputStatus(array,index) {
  statusElements = document.querySelectorAll('.status-of-task')
  array[index].status === 'completed'
  ? (statusElements[index].classList.remove('cancelled-task'),
  statusElements[index].classList.add('completed-task'))
  : array[index].status === 'cancelled'
  ? (statusElements[index].classList.remove('completed-task'),
  statusElements[index].classList.add('cancelled-task'))
  : (statusElements[index].classList.remove('completed-task'),
  statusElements[index].classList.remove('cancelled-task'))
}
// Удаление задачи
const deleteTask = index => {
  const result = confirm("Вы точно хотите удалить этот элемент?")
  if (result) {
  filteredTaskList.splice(index, 1)
  taskList.splice(index, 1)
  }
  fillHtmlList(filteredTaskList)
}
// Отмена задачи - установка статуса "отмененный"
const cancelTask = index => {
  filteredTaskList[index].status === "cancelled" 
    ? filteredTaskList[index].status = "actively" 
    : filteredTaskList[index].status = "cancelled" 
  fillHtmlList(filteredTaskList)
}
// Завершение задачи - установка статуса "завершенный"
const completeTask = index => {
  filteredTaskList[index].status === "completed" 
    ? filteredTaskList[index].status = "actively" 
    : filteredTaskList[index].status = "completed" 
  fillHtmlList(filteredTaskList)
}
// Редактирование текста задачи
const editTask = index => {
  const text = document.querySelectorAll('#task_text')
  text[index].contentEditable = true
  text[index].oninput = () => {
    filteredTaskList[index].text = text[index].innerText
  }
}
// Сортировка задач по дате создания
function sortTasksByDate () {
  if (filteredTaskList.length > 1) {  
  sort__priorities.classList.remove('selected-sort')
  sort__dates.classList.add('selected-sort')
  }
  if (sort__dates.classList.contains('active')) {
    filteredTaskList.sort((a, b) => a['date'] > b['date'] ? 1 : -1)
    sort__dates.classList.remove('active') 
  } else {
    filteredTaskList.sort((a, b) => a['date'] > b['date'] ? -1 : 1)
    sort__dates.classList.add('active') 
  }
  fillHtmlList(filteredTaskList)
}
// Сортировка задач по приоритету
function sortTasksByPriority () {
  if (filteredTaskList.length > 1) {  
  sort__dates.classList.remove('selected-sort')
  sort__priorities.classList.add('selected-sort')
  }
  if (sort__priorities.classList.contains('active')) {
    filteredTaskList.sort((a, b) => a.priority > b.priority ? -1 : 1)
    sort__priorities.classList.remove('active')
  } else {
    filteredTaskList.sort((a, b) => a.priority > b.priority ? 1 : -1)
    sort__priorities.classList.add('active') 
  }
  fillHtmlList(filteredTaskList)
}
