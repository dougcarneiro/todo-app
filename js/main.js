import 'preline';
import '@iconify/iconify';

import TodoForm from './components/TodoForm';
import Modal from './components/Modal';
import Todos from './lib/todos';
import Storage from './services/storage';
import { todos } from './data/seed';
import { searchBar } from './searchBar';

import '../css/style.css';


document.querySelector('#search-bar').insertAdjacentHTML('beforebegin', searchBar)
const search = document.querySelector('#search-button')

let searchInput = ''

Storage.load('todos', todos);

Todos.load(searchInput);

TodoForm.create();

Modal.create();

search.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.todo').innerHTML = ''
    searchInput = document.querySelector('#search-input').value
    Todos.load(searchInput);
})