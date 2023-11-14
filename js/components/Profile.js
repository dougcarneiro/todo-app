import { $ } from '../lib/dom';
import { formatDate } from '../lib/format';
import Storage from '../services/storage'
import { getTodosCountByProfileId } from '../services/supabase';
import LoadSpinner from './LoadSpinner';

async function create() {
    const profileButton = `
    <div class="fixed top-8 right-8">
        <button id="profile-button"type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-violet-600" data-hs-overlay="#hs-overlay-right">
        Meu Perfil
        </button>
    </div>
    `


    const drawer = `
    <div id="profile-drawer"> 
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
            <div class="bg-white overflow-hidden shadow rounded-lg border">
                <div class="px-4 py-5 sm:px-6">
                    <h3 id="profile-user-first-name" class="text-lg leading-6 font-medium text-violet-800">
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-violet-500">
                        Apenas algumas informações sobre você.
                    </p>
                </div>
                <div class="border-t border-violet-200 px-4 py-5 sm:p-0">
                    <dl class="sm:divide-y sm:divide-violet-200">
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-violet-500">
                            Nome Completo
                        </dt>
                        <dd id="profile-user-name" class="mt-1 text-sm text-violet-800 sm:mt-0 sm:col-span-2">
                        </dd>
                        </div>
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-violet-500">
                                Emails
                            </dt>
                            <dd id="profile-user-email" class="mt-1 text-sm text-violet-800 sm:mt-0 sm:col-span-2">
                            </dd>
                        </div>
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-violet-500">
                                Total de Afazeres criados:
                            </dt>
                            <dd id="profile-todo-count" class="mt-1 text-sm text-violet-800 sm:mt-0 sm:col-span-2">
                            </dd>
                        </div>
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-violet-500">
                                Total de Afazeres completos:
                            </dt>
                            <dd id="profile-completed-count" class="mt-1 text-sm text-violet-800 sm:mt-0 sm:col-span-2">
                            </dd>
                        </div>
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-violet-500">
                            Total de Afazeres pendentes:
                            </dt>
                            <dd id="profile-uncompleted-count" class="mt-1 text-sm text-violet-800 sm:mt-0 sm:col-span-2">
                            </dd>
                        </div>
                        <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-violet-500">
                            Membro desde:
                            </dt>
                            <dd id="profile-created-at" class="mt-1 text-sm text-violet-800 sm:mt-0 sm:col-span-2">
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div class="fixed bottom-8 right-8">
                
                <button id="logout-button" type="button" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-violet-600" data-hs-overlay="#hs-overlay-right">
                Sair da minha conta
                </button>
            </div>
        </div>
    </div>
    ${profileButton}
    `
    $('.container').insertAdjacentHTML('afterend', drawer);

    $('#logout-button').addEventListener('click', () => {
        localStorage.removeItem('@todo-app:jwt');
        window.location.href = 'sign-in.html'
    })

    $('#profile-button').addEventListener('click', async () => {
        // LoadSpinner.loading('#hs-overlay-right', 'beforeend')
        await populateUserData()
    })

}

function profileSpinner() {
    const loading = `
      <div id="loading-spinner" class="blur-none flex justify-center items-center fixed top-1/2 right-24 transform -translate-x-1/4 -translate-y-1/4 z-[99]">
        <svg id="loading-svg" aria-hidden="true" role="status" class="inline w-14 h-14 me-3 text-violet-800 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>
      `
      $('#hs-overlay-right').classList.add('blur-md')
      $('#hs-overlay-right').insertAdjacentHTML('beforebegin', loading)
}

function clearProfileSpinner() {
    $("#loading-spinner").remove()
    $('#hs-overlay-right').classList.remove('blur-md')
}

async function populateUserData() {
    
    profileSpinner()
    const user = await Storage.getUserByJWT()
    user.name = user.name.toLowerCase().split(' ').map((x) => x[0].toUpperCase() + x.slice(1)).join(' ')
    const userFirstName = user.name.split(' ')[0]
    user.created_at = formatDate(user.created_at)
    const createdTodos = await getTodosCountByProfileId(user.id, [true, false], [true, false])
    const completedTodos = await getTodosCountByProfileId(user.id, [true])
    const uncompletedTodos = await getTodosCountByProfileId(user.id, [false])
    user.name = user.name.toLowerCase().split(' ').map((x) => x[0].toUpperCase() + x.slice(1)).join(' ')
    $("#profile-user-first-name").innerText = `Perfil de ${userFirstName}`
    $("#profile-user-name").innerText = user.name
    $("#profile-user-email").innerText = user.email
    $("#profile-todo-count").innerText = createdTodos
    $("#profile-completed-count").innerText = completedTodos
    $("#profile-uncompleted-count").innerText = uncompletedTodos
    $("#profile-created-at").innerText = user.created_at
    clearProfileSpinner()
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
