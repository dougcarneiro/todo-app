import { $ } from '../lib/dom';
import Todos from '../lib/todos';


function create() {
    const dropdownFilter = `
        <div id="filters" class="hs-dropdown" data-hs-dropdown-auto-close="inside">
            <button id="hs-dropdown-item-checkbox" type="button" class="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-violet-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-violet-600 transition-all text-sm">
            Filtros
                <svg class="hs-dropdown-open:rotate-180 w-2.5 h-2.5 text-violet-600" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>

            <div id="search-filter-checkbox" class="z-[99] hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] bg-white shadow-md rounded-lg p-2 mt-2" aria-labelledby="hs-dropdown-item-checkbox">
                <div class="relative flex items-start py-2 px-3 rounded-md hover:bg-gray-100">
                    <div class="flex items-center h-5 mt-1">
                        <input id="hs-dropdown-item-checkbox-done" name="hs-dropdown-item-checkbox-done" type="checkbox" class="done-checkbox border-gray-200 rounded text-violet-600 focus:ring-violet-500" aria-describedby="hs-dropdown-item-checkbox-done-description">
                    </div>
                    <label for="hs-dropdown-item-checkbox-done" class="ml-3.5">
                    <span class="block text-sm font-semibold text-violet-800">Feito</span>
                    <span id="hs-dropdown-item-checkbox-done-description" class="block text-sm text-violet-600">Afazeres finalizados</span>
                    </label>
                </div>
                <div class="relative flex items-start py-2 px-3 rounded-md hover:bg-gray-100">
                    <div class="flex items-center h-5 mt-1">
                        <input id="hs-dropdown-item-checkbox-not-done" name="hs-dropdown-item-checkbox" type="checkbox" class="notDone-checkbox border-gray-200 rounded text-violet-600 focus:ring-violet-500" aria-describedby="hs-dropdown-item-checkbox-description">
                    </div>
                    <label for="hs-dropdown-item-checkbox-not-done" class="ml-3.5">
                    <span class="block text-sm font-semibold text-violet-800">Não Feitos</span>
                    <span id="hs-dropdown-item-checkbox-not-done-description" class="block text-sm text-violet-600">Afazeres pendentes</span>
                    </label>
                </div>
                <div class="relative flex items-start py-2 px-3 rounded-md hover:bg-gray-100">
                    <div class="flex items-center h-5 mt-1">
                        <input id="hs-dropdown-item-checkbox-high" name="hs-dropdown-item-checkbox-high" type="checkbox" class="high-checkbox border-gray-200 rounded text-violet-600 focus:ring-violet-500" aria-describedby="hs-dropdown-item-checkbox-high-description">
                    </div>
                    <label for="hs-dropdown-item-checkbox-high" class="ml-3.5">
                    <span class="block text-sm font-semibold text-violet-800">Prioridade Alta</span>
                    <span id="hs-dropdown-item-checkbox-high-description" class="block text-sm text-violet-600">Afazeres de alta prioridade</span>
                    </label>
                </div>
                <div class="relative flex items-start py-2 px-3 rounded-md hover:bg-gray-100">
                    <div class="flex items-center h-5 mt-1">
                        <input id="hs-dropdown-item-checkbox-medium" name="hs-dropdown-item-checkbox-medium" type="checkbox" class="medium-checkbox border-gray-200 rounded text-violet-600 focus:ring-violet-500" aria-describedby="hs-dropdown-item-checkbox-medium-description">
                    </div>
                    <label for="hs-dropdown-item-checkbox-medium" class="ml-3.5">
                    <span class="block text-sm font-semibold text-violet-800">Prioridade Média</span>
                    <span id="hs-dropdown-item-checkbox-medium-description" class="block text-sm text-violet-600">Afazeres de média prioridade</span>
                    </label>
                </div>
                <div class="relative flex items-start py-2 px-3 rounded-md hover:bg-gray-100">
                    <div class="flex items-center h-5 mt-1">
                        <input id="hs-dropdown-item-checkbox-light" name="hs-dropdown-item-checkbox-light" type="checkbox" class="light-checkbox border-gray-200 rounded text-violet-600 focus:ring-violet-500" aria-describedby="hs-dropdown-item-checkbox-light-description">
                    </div>
                    <label for="hs-dropdown-item-checkbox-light" class="ml-3.5">
                    <span class="block text-sm font-semibold text-violet-800">Prioridade Baixa</span>
                    <span id="hs-dropdown-item-checkbox-light-description" class="block text-sm text-violet-600">Afazeres de baixa prioridade</span>
                    </label>
                </div>
                <div class="relative flex items-start py-2 px-3 rounded-md hover:bg-gray-100">
                    <div class="flex items-center h-5 mt-1">
                        <input id="hs-dropdown-item-checkbox-normal" name="hs-dropdown-item-checkbox-normal" type="checkbox" class="normal-checkbox border-gray-200 rounded text-violet-600 focus:ring-violet-500" aria-describedby="hs-dropdown-item-checkbox-normal-description">
                    </div>
                    <label for="hs-dropdown-item-checkbox-normal" class="ml-3.5">
                    <span class="block text-sm font-semibold text-violet-800">Prioridade Normal</span>
                    <span id="hs-dropdown-item-checkbox-normal-description" class="block text-sm text-violet-600">Afazeres de prioridade normal</span>
                    </label>
                </div>
            </div>
        </div>`
    
    const searchBar = `
    <form id="search-bar" class="mx-2 flex items-center justify-center w-1/3">   
        <div class="relative w-full my-8">
            <div class=""/>
            </div>
            <input type="text" id="search-input" class="bg-white rounded-md text-violet-900 text-md hover:outline-none hover:ring-2 hover:ring-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 text-md block w-full pl-10 p-2.5" placeholder="Busque por um afazer..." required>
        </div>
        <button id="search-button" type="submit" class="p-2.5 ml-2 text-md font-medium rounded-full bg-violet-500 text-white hover:bg-violet-600 hover:outline-none hover:ring-2 hover:ring-violet-500 hover:ring-offset-2 transition-all text-md">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span class="sr-only">Search</span>
        </button>
    </form>`

    const searchComponent = `
    <div class="flex items-center justify-center">
        ${dropdownFilter}
        ${searchBar}
    </div>
    `
    $('.container').insertAdjacentHTML('beforebegin', searchComponent);

    const doneCheckbox = $('.done-checkbox')
    const notDoneCheckbox = $('.notDone-checkbox')
    const highCheckbox = $('.high-checkbox')
    const mediumCheckbox = $('.medium-checkbox')
    const lightCheckbox = $('.light-checkbox')
    const normalCheckbox = $('.normal-checkbox')

    $('#search-button').addEventListener('click', (event) => {
        
       search(event,
              doneCheckbox,
              notDoneCheckbox,
              highCheckbox,
              mediumCheckbox,
              lightCheckbox,
              normalCheckbox)
    })

    $('#search-filter-checkbox').addEventListener('change', (event) => {
        search(event,
               doneCheckbox,
               notDoneCheckbox,
               highCheckbox,
               mediumCheckbox,
               lightCheckbox,
               normalCheckbox)
     })
}

function search(event,
                doneCheckbox,
                notDoneCheckbox,
                highCheckbox,
                mediumCheckbox,
                lightCheckbox,
                normalCheckbox) {
    event.preventDefault()
    document.querySelector('.todo').innerHTML = ''
    const inputFilter = document.querySelector('#search-input').value
    Todos.load(inputFilter, 
                notDoneCheckbox.checked,
                doneCheckbox.checked,
                highCheckbox.checked,
                mediumCheckbox.checked,
                lightCheckbox.checked,
                normalCheckbox.checked);

}

export default { create }