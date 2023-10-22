import { $ } from '../lib/dom';
import Todos from '../lib/todos';


function create() {
    const searchBar = `
<form id="search-bar" class="flex items-center justify-center">   
    <div class="relative w-1/2 my-8">
        <div class=""/>
        </div>
        <input type="text" id="search-input" class="bg-white rounded-full text-violet-900 text-md hover:outline-none hover:ring-2 hover:ring-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 text-md block w-full pl-10 p-2.5" placeholder="Busque por um afazer..." required>
    </div>
    <button id="search-button" type="submit" class="p-2.5 ml-2 text-md font-medium rounded-full bg-violet-500 text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all text-md">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only">Search</span>
    </button>
</form>
`
    $('.container').insertAdjacentHTML('beforebegin', searchBar);

    $('#search-button').addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('.todo').innerHTML = ''
        const searchInput = document.querySelector('#search-input').value
        Todos.load(searchInput);
    })
}

export default { create }