import TodoCard from '../components/TodoCard';
import Storage from '../services/storage';
import { $ } from '../lib/dom';

function load(filter) {
  let todos = Storage.read('todos');
  if (filter){
    todos = todos.filter((todos) =>
    todos.title.toLowerCase().includes(filter.toLowerCase())
    );
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
