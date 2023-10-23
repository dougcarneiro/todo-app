import Todos from '../lib/todos';
import TodoForm from './TodoForm';
import { $ } from '../lib/dom';
import { formatDate } from '../lib/format';
import Storage from '../services/storage';

const background = {
  normal: 'bg-white',
  light: 'bg-yellow-100',
  medium: 'bg-orange-200',
  high: 'bg-red-200'
}

function create(todo) {
  const card = `
    <div
      id="todo-${todo.id}"
      class="shadow-md rounded-lg p-4 relative"
    >
    <div class="mb-5 w-full flex justify-end mt-1">
        <span class="mr-2 text-sm font-extrabold text-violet-900">Feito</span>
        <label class="todo-toggle-status relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600">
        </div>
        </label>
    </div>
      <div class="flex justify-between items-center">
        <h3 class="todo-title text-lg font-semibold text-gray-700">
          ${todo.title}
        </h3>
      
      </div>
      <div class="mt-4">
        <p class="text-justify text-lg text-black-500">
          <span class="todo-text">
            ${todo.text}
          </span>
        </p>
        <p class="mt-4 text-sm text-gray-500">
          <span class="font-bold">Data:</span>
          <span class="todo-date">
            ${formatDate(todo.date)}
          </span>
        </p>
      </div>
      <div class="absolute bottom-4 right-4 inline-flex">
        <span
          class="icon-trash mr-1 text-gray-400 hover:text-gray-700 cursor-pointer"
          data-hs-overlay="#remove-modal"
        >
          <span
            class="iconify"
            data-icon="solar:trash-bin-minimalistic-broken"
          >
          </span>
        </span>
        <span
          class="icon-pencil text-gray-400 hover:text-gray-700 cursor-pointer"
          data-hs-overlay="#add-modal"
        >
          <span
            class="iconify"
            data-icon="tabler:pencil"
          >
          </span>
        </span>
      </div>
    </div>
  `;

  $('.todo').insertAdjacentHTML('beforeend', card);

  $(`#todo-${todo.id} .todo-toggle-status input[type='checkbox']`).checked = todo.is_completed
  
  if (todo.priority == 'light') {
    $(`#todo-${todo.id}`).classList.add(background.light)
  } else if (todo.priority == 'medium'){
    $(`#todo-${todo.id}`).classList.add(background.medium)
  } else if (todo.priority == 'high'){
    $(`#todo-${todo.id}`).classList.add(background.high)
  } else {
    $(`#todo-${todo.id}`).classList.add(background.normal)
  }
 
  $(`#todo-${todo.id} .todo-toggle-status input[type='checkbox']`).onchange = () => {
    const updatedTodo = Storage.read('todos', todo.id)
    updatedTodo.is_completed = $(`#todo-${todo.id} .todo-toggle-status input[type='checkbox']`).checked
    Todos.update(updatedTodo)
  }

  $(`#todo-${todo.id} .icon-pencil`).onclick = () => {
    $('#form-title').textContent = 'Alterar Afazer'
    const TodoToUpdate = Storage.read('todos', todo.id)
    TodoForm.setValues(TodoToUpdate);
    TodoForm.handleSubmit();
  };

  $(`#todo-${todo.id} .icon-trash`).onclick = () => {
    $(`#remove-modal .todo-title`).innerText = todo.title;

    $(`#remove-modal .remove-todo-btn`).onclick = () =>
      Todos.remove(todo);
  };
}

function setBackgroundColor(id, priority) {

  $(`#todo-${id}`).classList.remove(background.light)
  $(`#todo-${id}`).classList.remove(background.medium)
  $(`#todo-${id}`).classList.remove(background.high)
  $(`#todo-${id}`).classList.remove(background.normal)

  if (priority == 'light') {
    $(`#todo-${id}`).classList.add(background.light)
  } else if (priority == 'medium'){
    $(`#todo-${id}`).classList.add(background.medium)
  } else if (priority == 'high'){
    $(`#todo-${id}`).classList.add(background.high)
  } else {
    $(`#todo-${id}`).classList.add(background.normal)
  }
}

function update({ id, title, text, priority, is_completed, date }) {
  date = formatDate(date);

  $(`#todo-${id} .todo-title`).innerText = title;

  $(`#todo-${id} .todo-text`).innerText = text;

  $(`#todo-${id} .todo-toggle-status`).checked = is_completed;

  $(`#todo-${id} .todo-date`).innerText = date;

  setBackgroundColor(id, priority)
}

function remove(id) {
  $(`#todo-${id}`).remove();
}

export default { create, update, remove };
