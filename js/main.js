import 'preline';
import '@iconify/iconify';

import TodoForm from './components/TodoForm';
import Modal from './components/Modal';
import Todos from './lib/todos';
import Storage from './services/storage';
import { todos } from './data/seed';

import '../css/style.css';


const searchBar = `
<form id="search-bar" class="flex items-center justify-center">   
    <div class="relative w-1/2 my-10">
        <div class=""/>
        </div>
        <input type="text" id="simple-search" class="bg-gray-50 rounded-md border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Busque por um afazer..." required>
    </div>
    <button id=search-button type="submit" class="p-2.5 ml-2 text-md font-medium bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all text-md dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only">Search</span>
    </button>
</form>
`
document.querySelector('#search-bar').insertAdjacentHTML('beforebegin', searchBar)
const search = document.querySelector('#search-button')

let bar = ''

Storage.load('todos', todos);

Todos.load(bar);

TodoForm.create();

Modal.create();

search.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.todo').innerHTML = ''
    bar = document.querySelector('#simple-search').value
    Todos.load(bar);
})