const createsTask = document.forms.creates_task,
addButton = createsTask.elements.add_task, 
filtersTask = document.forms.filters_task, 
sort__dates = document.getElementById('sort_date'),
sort__priorities = document.getElementById('sort_priority'),
textTask = createsTask.elements.text_task,
priorityTask = createsTask.elements.priority_task,
filter__priorities = filtersTask.elements.filter_prior

let filteredTaskList = [],
    statusElements = [],
    taskList = []

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.responseType = 'json'
    if(data) {
      xhr.setRequestHeader('Content-Type', 'application/json')
    }
    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response)
      } else {
        resolve(xhr.response)
      }
    }
    xhr.onerror = () => {
      reject('Ошибка!')
    }
    xhr.send(JSON.stringify(data))
  })
  return promise
}
const getData = () => {
  sendHttpRequest('GET', 'http://127.0.0.1:3000/items').then(responseData => {
    taskList = responseData
    filteredTaskList = taskList.slice()
    fillHtmlList(responseData)
  }).catch(err => {
    console.log(err)
  })
}
getData()
const deleteData = itemId => {
  sendHttpRequest('DELETE', `http://127.0.0.1:3000/items/${itemId}`).then(responseData => {
    fillHtmlList(filteredTaskList)
  }).catch(err => {
    console.log(err)
  })
}
const editDataText = (itemId, editedText) => {
  sendHttpRequest('PUT', `http://127.0.0.1:3000/items/${itemId}`, {
  text: editedText }).catch(err => {
    console.log(err)
  })
}
const editDataStatus = (itemId, editedStatus) => {
  sendHttpRequest('PUT', `http://127.0.0.1:3000/items/${itemId}`, {
    status: editedStatus }).catch(err => {
      console.log(err)
    })
}
const sendData = () => {
  sendHttpRequest('POST', 'http://127.0.0.1:3000/items', {
    text: textTask.value,
    priority: priorityTask.value,
    date: new Date().toLocaleString(),
    status: "actively"
  }).then(responseData => {
    taskList.push(responseData)
    filteredTaskList = taskList.slice()
    fillHtmlList(filteredTaskList)
  }).catch(err => {
    console.log(err)
  })
}
// Добавление задачи
function addTask () {
  if(!textTask.value) return (alert("Заполните поле текста задачи!"))
  filtersTask.elements.filter_prior.value = ''
  filtersTask.elements.filter_input.value = ''
  sort__dates.classList.remove('selected-sort')
  sort__priorities.classList.remove('selected-sort')
  sendData()
  createsTask.elements.text_task.value = ''
}
// Фильтрация задач по приоритету, статусу, тексту
function filteringTasks() {
  const filter__statuses = [...filtersTask.querySelectorAll('#status input:checked')].map(n => n.value),
  filter__texts = filtersTask.elements.filter_input.value,
  filter__priorities = filtersTask.elements.filter_prior.value
  filteredTaskList = taskList.filter(n => (
    (!filter__priorities || n.priority === filter__priorities) &&
    (!filter__statuses.length || filter__statuses.includes(n.status)) &&
    (!filter__texts || n.text.toLowerCase().indexOf(filter__texts.toLowerCase()) > -1 
    || n.text.toUpperCase().indexOf(filter__texts.toUpperCase()) > -1) &&
    (!sort__dates.classList.contains('selected-sort') || (!sort__priorities.classList.contains('selected-sort')))
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
const deleteTask = (index) => {
  const result = confirm("Вы уверены, что хотите удалить эту задачу?")
  if (result) {
  const ind = filteredTaskList[index].id
  for (let n = 0 ; n < taskList.length ; n++) {
    if (taskList[n].id === ind) {
      let removedTask = taskList.splice(n,1)
      removedTask = null
      break
    }
}
  filteredTaskList.splice(index, 1)
  deleteData(ind)  
  }
} 
// Отмена задачи - установка статуса "отмененный"
const cancelTask = index => {
  const ind = filteredTaskList[index].id
  filteredTaskList[index].status === "cancelled" 
    ? filteredTaskList[index].status = "actively" 
    : filteredTaskList[index].status = "cancelled" 
  editDataStatus(ind, filteredTaskList[index].status)
  fillHtmlList(filteredTaskList)
}
// Завершение задачи - установка статуса "завершенный"
const completeTask = index => {
  const ind = filteredTaskList[index].id
  filteredTaskList[index].status === "completed" 
    ? filteredTaskList[index].status = "actively"
    : filteredTaskList[index].status = "completed"
  editDataStatus(ind, filteredTaskList[index].status)
  fillHtmlList(filteredTaskList)
}
// Редактирование текста задачи
const editTask = index => {
  const text = document.querySelectorAll('#task_text')
  text[index].contentEditable = true
  text[index].oninput = () => {
    filteredTaskList[index].text = text[index].innerText
    const ind = filteredTaskList[index].id
    editDataText(ind, filteredTaskList[index].text)
  }
}
// Сортировка задач по дате создания
function sortTasksByDate () {
  if (filteredTaskList.length > 1) {  
  sort__priorities.classList.remove('selected-sort')
  sort__dates.classList.add('selected-sort')
    if (sort__dates.classList.contains('active')) {
      filteredTaskList.sort((a, b) => a['date'] > b['date'] ? 1 : -1)
      sort__dates.classList.remove('active') 
    } else {
      filteredTaskList.sort((a, b) => a['date'] > b['date'] ? -1 : 1)
      sort__dates.classList.add('active') 
    }} else {
      sort__dates.classList.add('disabled')
    }
  fillHtmlList(filteredTaskList)
}
// Сортировка задач по приоритету
function sortTasksByPriority () {
  if (filter__priorities.value !== '') {
    return alert('Уберите фильтр по приоритету!')}
  if (filteredTaskList.length > 1) {  
    sort__dates.classList.remove('selected-sort')
    sort__priorities.classList.add('selected-sort')
    if (sort__priorities.classList.contains('active')) {
      filteredTaskList.sort((a, b) => a.priority > b.priority ? -1 : 1)
      sort__priorities.classList.remove('active')
    } else {
      filteredTaskList.sort((a, b) => a.priority > b.priority ? 1 : -1)
      sort__priorities.classList.add('active') 
    }
    } else {
      sort__priorities.classList.add('disabled')
    }
  fillHtmlList(filteredTaskList)
}