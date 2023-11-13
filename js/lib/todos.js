import TodoCard from '../components/TodoCard';
import Storage from '../services/storage';
import { createTodo, deleteTodo, getAllTodoByUser, getTodoById, updateTodo } from '../services/supabase';
import { $ } from './dom';
import { orderByDate } from './orderByCreatedAt';

async function load(options = {}) {
  const loggedUser = await Storage.getUserByJWT()
  
  const {
    title = '',
    notDone = false,
    done = false,
    high = false,
    medium = false,
    light = false,
    normal = false,
    search = false
  } = options;
  
  
  $('.todo').innerHTML = ''

  let todos
  
  if (loggedUser) {
    const loading = `
    <div id="loading-spinner" class="flex justify-center items-center">
      <svg id="loading-svg" aria-hidden="true" role="status" class="inline w-14 h-14 me-3 text-violet-800 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
      </svg>
    </div>
    `
    $('.container').insertAdjacentHTML('beforeend', loading)
    const { data, error } =  await getAllTodoByUser(loggedUser.id, options)
    $('#loading-spinner').remove()
    if (data) {
      todos = data
    }
  } else {
    todos = Storage.read('todos');
  }

  if (!loggedUser) {
    if (title){
      todos = todos.filter((todo) =>
      todo.title.toLowerCase().includes(title.toLowerCase())
      );
    }
  
    if (notDone && !done) {
      todos = todos.filter((todo) =>
      !(todo.is_completed)
      );
    }
  
    if (done && !notDone) {
      todos = todos.filter((todo) =>
      todo.is_completed
      );
    }
  
    let todosHigh = []
    let todosMedium = []
    let todosLow = []
    let todosNormal = []
    let filteredTodos = []
  
    if (high || medium || light || normal) {
  
        if (high) {
          todosHigh = todos.filter((todo) =>
          todo.priority === 'high'
          );
        }
      
        if (medium) {
          todosMedium = todos.filter((todo) =>
          todo.priority === 'medium'
          );
        }
      
        if (light) {
          todosLow = todos.filter((todo) =>
          todo.priority === 'light'
          );
        }
      
        if (normal) {
          todosNormal = todos.filter((todo) => 
            todo.priority === 'normal'
          );
        }
      
        filteredTodos = [...todosHigh, ...todosMedium, ...todosLow, ...todosNormal]
        
        todos = filteredTodos
  
    }
  }

  const notFoundMsg = search ? 'Nenhum afazer encontrado.' : 'Você não possui nenhum afazer.'
  if (!todos || todos.length == 0) {
    $('#not-found-todo').innerText = notFoundMsg
  } else {
    $('#not-found-todo').innerText = ''
    if (!loggedUser) {
      orderByDate(todos, 'desc')
    }
    todos.map(TodoCard.create);
  }
}

async function get(id) {
  const loggedUser = await Storage.getUserByJWT()
  if (loggedUser) {
    const { data, error } = await getTodoById(id)
    if (data) {
      return data[0]
    }
  } else {
    return Storage.read('todos', id)
  }
}


async function create(todo) {
  delete todo.id;
  let createdTodo

  const loggedUser = await Storage.getUserByJWT()
  if (loggedUser) {
    const { data, error } = await createTodo(todo, loggedUser.id)
    if (data) {
      createdTodo = data[0]
    }
  } else {
    createdTodo = Storage.create('todos', todo);
  }
  TodoCard.create(createdTodo);
  
  await load()
}

async function update(todo, isCreating=false) {
  const { id } = todo;
  let updatedTodo

  const loggedUser = await Storage.getUserByJWT()
  
  if (loggedUser) {
    try {

      const loading = `
      <div id="loading-spinner" class="blur-none flex justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
        <svg id="loading-svg" aria-hidden="true" role="status" class="inline w-14 h-14 me-3 text-violet-800 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>
      `
      $('.todo').classList.add('blur-md')
      $('.container a').classList.add('blur-md')
      $('.todo').insertAdjacentHTML('beforebegin', loading)
      const { data, erro } = await updateTodo(todo)
      $("#loading-spinner").remove()
      $('.container a').classList.remove('blur-md')
      $('.todo').classList.remove('blur-md')
      updatedTodo = data[0]
    } catch (err) {
      // pass
    }
  } else {
    updatedTodo = Storage.update('todos', id, todo);
  }
  if (!updatedTodo) {
    await create(todo)
  } else {
    TodoCard.update(updatedTodo);
  }
}

async function remove(todo) {
  const { id } = todo;

const loggedUser = await Storage.getUserByJWT()
if (loggedUser) {
  const { data, erro } = await deleteTodo(todo)
} else {
  Storage.remove('todos', id);
}
  TodoCard.remove(id);

  load()
}

export default { load, get, create, update, remove };
