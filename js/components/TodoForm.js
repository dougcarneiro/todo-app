import Todos from '../lib/todos';
import { $ } from '../lib/dom';
import { formatDate } from '../lib/format';

function setValues({
  id,
  title,
  text,
  priority,
  is_completed,
  date,
}) {
  const form = $('#todo-form');

  date = formatDate(date, 'ymd');

  form.id.value = id;

  form.title.value = title;

  form.text.value = text;

  form.priority.value = priority;

  form.is_completed = is_completed;

  form.date.value = date;
}

function getValues() {
  const todo = Object.fromEntries(new FormData($('#todo-form')));

  let created_at = Todos.get(todo.id).created_at

  let date = ''

  if (!created_at) {
    created_at = new Date().toISOString();
  }
  if (!todo.date) {
    date = created_at;
  } else {
    date = new Date(
      todo.date + 'T00:00:00-03:00'
    ).toISOString();
  }
  
  return { ...todo, date, created_at };
}

function create() {
  const form = `
  <div class="bg-white rounded-lg p-4 relative max-w-md mx-auto mt-0 h-full">
  <h2 id="form-title" class="font-satisfy text-center text-5xl mb-7 font-bold text-violet-500"></h2>
    <div class="mb-5 flex justify-center mt-1">
      <form id="todo-form">
      
      <input
        type="hidden"
        id="id"
        name="id"
      >
      <div>
        <label
          for="title"
          class="w-full block text-md font-medium text-violet-800">
          Título
        </label>
        <input
          required
          maxlength="50"
          type="text"
          id="title"
          name="title"
          class="mt-1 mb-1 w-full py-3 px-4 block border border-violet-200 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
      </div>
      <div class="mt-4">
        <label
          for="text"
          class="mt-4 mb-1 w-full block text-md font-medium text-violet-800"
        >
          Texto
        </label>
        <textarea required maxlength="300" id="text" name="text" rows="4" class=" w-full block p-2.5 text-lg text-violet-900 bg-violet-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 " placeholder="Descreva o seu afazer..."></textarea>
      </div>

      <div>
        <label
          for="priority"
          class="mt-4 mb-1 w-full block text-md font-medium text-violet-800">
          Prioridade
        </label>
        <select
          name="priority"
          id="priority"
          class="w-full py-2 px-4 border border-gray-200 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
          <option value="normal" class="text-violet-800">Normal</option>
          <option value="light" class="text-violet-800">Leve</option>
          <option value="medium" class="text-violet-800">Média</option>
          <option value="high" class="text-violet-800">Alta</option>
        </select>
      </div>
      <div class="mb-3">
        <label
          for="date"
          class="mt-4 mb-1 block text-md font-medium text-violet-800"
        >
          Data
        </label>
        <input
          type="date"
          id="date"
          name="date"
          class="text-violet-800 py-3 px-4 block w-full border border-violet-200 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-violet-500 "
        >
      </div>
      <div>
        <button
          type="submit"
          class="submit-button mt-4 py-3 px-4 inline-flex w-full justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-violet-500 text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all text-md"
        >
          Enviar
        </button>
      </div>
    </form>
  </div>
</div>
  `;

  const newTodoBtn = `
    <div class="fixed top-8 right-8">
      <button
        type="button"
        class="new-todo-btn py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-violet-500 text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all text-sm"
        data-hs-overlay="#add-modal"
      >
        + Novo Afazer
      </button>
    </div>
  `;

  const addModal = `
    <div
      id="add-modal"
      class="modal hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto"
    >
      <div
        class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto"
      >
        <div
          class="flex flex-col bg-white border shadow-sm rounded-xl"
        >
          <div
            class="flex justify-between items-center py-3 px-4 border-b "
          >
            <h3 class="font-satisfy font-bold text-xl text-violet-800">Tásku</h3>
            <button
              type="button"
              class="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-violet-500 hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
              data-hs-overlay="#add-modal"
            >
              <span class="sr-only">Close</span>
              <svg
                class="w-3.5 h-3.5"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div class="p-4">${form}</div>
        </div>
      </div>
    </div>
    ${newTodoBtn}
  `;

  $('.container').insertAdjacentHTML('afterend', addModal);
  
  $('.submit-button').onclick = () => {
    handleSubmit();

  };

  $('.new-todo-btn').onclick = () => {
    $('#form-title').textContent = 'Novo Afazer'
    $('#todo-form').reset();
    $('#todo-form #id').value = ''
  }
}

function handleSubmit() {
  const form = $('#todo-form')
  form.onsubmit = async (event) => {
    event.preventDefault();

    $('#add-modal').classList.add('hidden')
    $('div[data-hs-overlay-backdrop-template]').remove()
    document.body.removeAttribute("style");

    const todo = getValues();

    Todos.update(todo);
  };
}

export default { setValues, getValues, create, handleSubmit };
