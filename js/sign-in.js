import { $ } from './lib/dom';
import { signJWT } from './services/jwt';
import { signUp, singIn } from './services/supabase';


$('#sign-in-confirm').addEventListener('click', (event) => {
    handleSubmit()
})

const confirmPass = `
<div class="mt-5">
    <div class="flex items-center justify-between">
        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Confirme a senha</label>
    </div>
    <div class="mt-2">
        <input 
        required 
        minlength="6"
        maxlength="30"
        id="confirm-password" 
        name="confirmPassword" 
        type="password" 
        autocomplete="confirm-password" 
        class="mt-1 mb-1 w-full py-1.5 px-4 block border text-violet-800 border-violet-200 rounded-md text-3xl focus:outline-none focus:ring-2 focus:ring-violet-500">
        <p id="pass-error-msg" class="hidden mt-0 text-left text-sm text-red-600">
             As senhas precisam ser iguais.
        </p>
    </div>
</div>
`

$('#sign-up-button').addEventListener('click', () => {
    $('#sign-up-button').innerText = 'Faça o seu cadastro'

    $('#password-reset-button').classList.add('hidden') 
    $('#sign-up-div').classList.add('hidden')
    $('#sign-in-confirm').classList.add('hidden')

    $('#sign-up-confirm').classList.remove('hidden')
    $('#name-div').classList.remove('hidden')

    $('#name').setAttribute('required', 'required')
    
    $('#password').insertAdjacentHTML('afterend', confirmPass)

    $('#confirm-password').addEventListener('blur', () => {
        newUserErrorPassword()
    })

    $('#confirm-password').addEventListener('focus', () => {
        clearNewUserErrorPassword()
    })
})

$('#sign-up-confirm').addEventListener('click', () => {
    handleSubmit()
})

$('#email').addEventListener('focus', () => {
    clearExistingUserError()
})

$('#password').addEventListener('focus', () => {
    clearPassError()
})

function handleSubmit() {
    const form = $('form')
    $('#email').value = $('#email').value.trim()
    $('#password').value = $('#password').value.trim()
    try {
        $('#name').value = $('#name').value.trim()
        $('#confirm-password').value = $('#confirm-password').value.trim()

    } catch (error){
        // pass
    }
    
    form.onsubmit = async (event) => {
        event.preventDefault()
        let error = false
        let formData
        const isSignUp = form.name.value ? true : false
        if (isSignUp) {
            error = newUserErrorPassword()
        } 
        if (!error) {
            formData = getValues(isSignUp)
        }
        if (isSignUp) {
            loading('sign-up-confirm')
            const { data, error } = await signUp(formData)
            
            if (!data) {
                clearLoading('sign-up-confirm')
                existingUserError()
            } else {
                await generateToken(data)
            }
        } else {
            loading('sign-in-confirm')
            const { data, error } = await singIn(formData.email, formData.password)
            if (!data) {
                passError()
                clearLoading('sign-in-confirm')
                event.preventDefault()
            } else {
                await generateToken(data)
            }
        }
    }

}

function getValues(signUp) {
    const form = Object.fromEntries(new FormData($('form')));
    if (signUp) {
        delete form.confirmPassword
    } else {
        delete form.name
    }
    return form
} 

function newUserErrorPassword() {
    if ($('#confirm-password').value != $('#password').value) {
        $('#sign-up-confirm').setAttribute('disabled', 'disabled');
        $('#sign-up-confirm').classList.add('bg-violet-300')
        $('#sign-up-confirm').classList.remove('hover:bg-violet-500')
        $('#pass-error-msg').classList.remove('hidden')
        $('#confirm-password').classList.add('border-red-500')
        $('#confirm-password').classList.add('bg-red-100')
        return true
    }
    return false
}

function clearNewUserErrorPassword() {
    $('#sign-up-confirm').removeAttribute('disabled', 'disabled');
    $('#sign-up-confirm').classList.remove('bg-violet-300')
    $('#sign-up-confirm').classList.add('hover:bg-violet-500')
    $('#pass-error-msg').classList.add('hidden')
    $('#confirm-password').classList.remove('border-red-500')
    $('#confirm-password').classList.remove('bg-red-100')

}

function checkForToken() {
    if(localStorage.getItem('@todo-app:jwt')) {
        window.location.href = 'index.html'
    }
}

function passError() {
    $('#sign-in-confirm').classList.add('bg-violet-400')
    $('#sign-in-confirm').classList.remove('hover:bg-violet-500')
    $('#bad-pass-error-msg').classList.remove('hidden')
    $('#password').classList.remove('border-violet-200')
    $('#password').classList.add('border-red-500')
    $('#password').classList.add('bg-red-100')
}

function clearPassError() {
    $('#sign-in-confirm').removeAttribute('disabled', 'disabled');
    $('#sign-in-confirm').classList.remove('bg-violet-400')
    $('#sign-in-confirm').classList.add('bg-violet-600')
    $('#password').classList.add('border-violet-200')
    $('#sign-in-confirm').classList.add('hover:bg-violet-500')
    $('#bad-pass-error-msg').classList.add('hidden')
    $('#password').classList.remove('border-red-500')
    $('#password').classList.remove('bg-red-100')
}

function existingUserError() {
    $('#sign-up-confirm').setAttribute('disabled', 'disabled');
    $('#sign-up-confirm').classList.add('bg-violet-300')
    $('#sign-up-confirm').classList.remove('hover:bg-violet-500')
    $('#email-error-msg').classList.remove('hidden')
    $('#email').classList.remove('border-violet-200')
    $('#email').classList.add('border-red-500')
    $('#email').classList.add('bg-red-100')
}

function clearExistingUserError() {
    $('#sign-up-confirm').removeAttribute('disabled', 'disabled');
    $('#sign-up-confirm').classList.remove('bg-violet-300')
    $('#sign-up-confirm').classList.add('bg-violet-600')
    $('#sign-up-confirm').classList.add('hover:bg-violet-500')
    $('#email-error-msg').classList.add('hidden')
    $('#email').classList.add('border-violet-200')
    $('#email').classList.remove('border-red-500')
    $('#email').classList.remove('bg-red-100')
}

async function generateToken(data) {
    const token = await signJWT(data)
    localStorage.setItem(`@todo-app:jwt`, token);
    window.location.href = 'index.html'
}

function loading(buttonId) {
    const loadingAnimation = `
    <svg id="loading-svg" aria-hidden="true" role="status" class="inline my-auto w-6 h-6 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    `
    $(`#${buttonId}`).innerText = ''
    $(`#${buttonId}`).insertAdjacentHTML('beforeend', loadingAnimation)
    $(`#${buttonId}`).classList.remove('bg-violet-600')
    $(`#${buttonId}`).classList.remove('hover:bg-violet-500')
    $(`#${buttonId}`).classList.add('bg-violet-300')
    $(`#${buttonId}`).setAttribute('disabled', 'disabled')
    
}

function clearLoading(buttonId) {
    $(`#${buttonId}`).innerText = (buttonId == 'sign-in-confirm' ? 'Entrar' : 'Confirmar')
}

checkForToken()