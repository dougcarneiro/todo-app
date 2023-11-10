import TodoCard from '../components/TodoCard';
import Storage from '../services/storage';
import { $ } from './dom';
import { orderByDate } from './orderByCreatedAt';

function load(options = {}) {
  
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

  document.querySelector('.todo').innerHTML = ''
  let todos = Storage.read('todos');
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
  const notFoundMsg = search ? 'Nenhum afazer encontrado.' : 'Você não possui nenhum afazer.'
  if (!todos || todos.length == 0) {
    $('#not-found-todo').innerText = notFoundMsg
  } else {
    $('#not-found-todo').innerText = ''
    orderByDate(todos, 'desc')
    todos.map(TodoCard.create);
  }
}


function get(id) {
  return Storage.read('todos', id)
}


function create(todo) {
  delete todo.id;
  const createdTodo = Storage.create('todos', todo);

  TodoCard.create(createdTodo);

  load()
}

function update(todo) {
  const { id } = todo;
  const updatedTodo = Storage.update('todos', id, todo);
  if (!updatedTodo) {
    create(todo)
  } else {
    TodoCard.update(updatedTodo);
  }
}

function remove(todo) {
  const { id } = todo;

  Storage.remove('todos', id);

  TodoCard.remove(id);

  load()
}

export default { load, get, create, update, remove };
