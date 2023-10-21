export const searchBar = `
<form id="search-bar" class="flex items-center justify-center">   
    <div class="relative w-1/2 my-10">
        <div class=""/>
        </div>
        <input type="text" id="search-input" class="bg-white rounded-full border-violet-300 text-violet-900 text-md focus:border-violet-500 block w-full pl-10 p-2.5" placeholder="Busque por um afazer..." required>
    </div>
    <button id="search-button" type="submit" class="p-2.5 ml-2 text-md font-medium rounded-full bg-violet-500 text-white hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all text-md dark:bg-violet-700 dark:hover:bg-violet-600 dark:focus:ring-offset-violet-800">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only">Search</span>
    </button>
</form>

`
