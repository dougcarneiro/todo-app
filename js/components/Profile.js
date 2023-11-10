import { $ } from '../lib/dom';


function create() {
    const profileButton = `
    <div class="fixed top-8 right-8">
        <button type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-violet-600" data-hs-overlay="#hs-overlay-right">
        Meu Perfil
        </button>
    </div>
    `


    const drawer = `
    <div id="hs-overlay-right" class="font-montserrat hs-overlay hs-overlay-open:translate-x-0 hidden translate-x-full fixed top-0 end-0 transition-all duration-300 transform h-full max-w-xs w-full w-full z-[60] bg-white border-s dark:bg-violet-800 dark:border-violet-700 hidden" tabindex="-1">
        <div class="flex justify-between items-center py-3 px-4 border-b dark:border-violet-700">
            <h3 class="font-satisfy font-bold text-2xl text-violet-800 dark:text-white">
            Meu Perfil
            </h3>
            <button type="button" class="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-violet-800 hover:bg-violet-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-violet-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-violet-600" data-hs-overlay="#hs-overlay-right">
            <span class="sr-only">Close modal</span>
            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
        <div class="p-4">
            <p class="text-violet-800 dark:text-violet-400">
            Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
            </p>
        </div>
        
        <div class="fixed bottom-8 right-8">
            
            <button id="logout-button" type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-violet-600" data-hs-overlay="#hs-overlay-right">
            Sair da minha conta
            </button>
        </div>
    </div>
    ${profileButton}
    `
    $('.container').insertAdjacentHTML('afterend', drawer);

    $('#logout-button').addEventListener('click', () => {
        localStorage.removeItem('@todo-app:jwt');
        window.location.href = 'sign-in.html'
    })
}

function login() {
    const loginButton = `
    <div class="fixed top-8 right-8">
        <button id="login-button" type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-violet-600">
        Entrar
        </button>
    </div>
    `
    $('.container').insertAdjacentHTML('afterend', loginButton);

    $('#login-button').addEventListener('click', () => {
        window.location.href = 'sign-in.html'
    })
}

export default { create, login };
