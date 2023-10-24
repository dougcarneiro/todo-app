import TodoCard from '../components/TodoCard';
import Storage from '../services/storage';
import { $ } from '../lib/dom';

function load(title, 
              notDone=undefined, 
              done=undefined,
              high=undefined,
              medium=undefined,
              low=undefined,
              normal=undefined) {
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

  if (high || medium || low || normal) {

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
    
      if (low) {
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

  if (todos.length == 0) {
    $('.container h2').innerText = 'Nenhum afazer encontrado.'
  } else {
    $('.container h2').innerText = ''
    todos.map(TodoCard.create);
  }
}

function create(todo) {
  delete todo.id;
  const createdTodo = Storage.create('todos', todo);

  TodoCard.create(createdTodo);
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
}

export default { load, create, update, remove };
