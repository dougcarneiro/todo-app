import { $ } from './lib/dom';
import { signJWT } from './services/jwt';
import { signUp, singIn } from './services/supabase';


$('#sign-in-confirm').addEventListener('click', () => {
    handleSubmit()
})

$('#sign-up-button').addEventListener('click', () => {
    signUpForm()
})


$('#email').addEventListener('focus', () => {
    clearSignUpError(true, undefined, undefined)
})


function signUpForm() {
    try {
        $('#invalid-credentials-alert').remove()
    } catch (error) {
        // pass
    }

    $('#password-reset-button').classList.add('hidden') 
    $('#sign-up-div').classList.add('hidden')
    $('#sign-in-confirm').classList.add('hidden')

    const signUpButton = `
    <button 
        id="sign-up-confirm" 
        type="submit" 
        class="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
        Cadastrar
    </button>
    `
    $('#sign-in-button-div').insertAdjacentHTML('beforeend', signUpButton)

    $('#name-div').classList.remove('hidden')

    $('#name').setAttribute('required', 'required')

    const confirmPass = `
    <div class="mt-5">
        <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Confirme a senha</label>
        </div>
        <div class="mt-2">
            <input 
            required 
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

    $('#password-div').insertAdjacentHTML('beforeend', confirmPass)

    $('#password').addEventListener('blur', () => {
        const validLength = checkLength()
        if (!validLength) {
            signUpError(undefined, true, undefined)
        } else {
            comparePasswords()
        }
    })

    $('#password').addEventListener('focus', () => {
        clearSignUpError(undefined, true, undefined)
    })

    $('#confirm-password').addEventListener('blur', () => {
        comparePasswords()
        clearSignUpError(undefined, undefined, true)
    })

    $('#confirm-password').addEventListener('focus', () => {
        comparePasswords()
        clearSignUpError(undefined, undefined, true)
    })

    $('#sign-up-confirm').addEventListener('click', () => {
        handleSubmit()
    })
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

function checkLength() {
    const password = $('#password')
    if (password.value && password.value.length <= 5){  
        return false
    } 
    return true
}

function comparePasswords() {
    if (!($('#confirm-password').value)) {
        return false
    }
    if ($('#confirm-password').value != $('#password').value) {
        signUpError(undefined, undefined, true)
        return true
    }
    return false
}

function checkForToken() {
    if(localStorage.getItem('@todo-app:jwt')) {
        window.location.href = 'index.html'
    }
}

function invalidCredentials() {
    const alert = `
    <div id="invalid-credentials-alert" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">
            Credenciais inválidas!
        </strong>
        <span class="block sm:inline">
            Se certifique que você informou os dados corretos.
        </span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Fechar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
    </div>
    `

    $('#sign-in-button-div').insertAdjacentHTML('beforebegin', alert)

    $('#invalid-credentials-alert').addEventListener('click', () => {
        $('#invalid-credentials-alert').remove()
    })

    $('#sign-in-confirm').classList.add('bg-violet-400')
    $('#sign-in-confirm').classList.remove('hover:bg-violet-500')
}

function signUpError(email=false, pass=false, confirmPass=false) {
    const buttonId = 'sign-up-confirm'
    const msgId = email ? 'email-error-msg' : (pass ? 'pass-length-error-msg' : (confirmPass ? 'pass-error-msg'  : ''))
    const fieldId = email ? 'email' : (pass ? 'password' : (confirmPass ? 'confirm-password' : ''))


    if (email || pass || confirmPass) {
        $(`#${buttonId}`).setAttribute('disabled', 'disabled');
        $(`#${buttonId}`).classList.add('bg-violet-300')
        $(`#${buttonId}`).classList.remove('bg-violet-600')
        $(`#${buttonId}`).classList.remove('hover:bg-violet-500')
        $(`#${msgId}`).classList.remove('hidden')
        $(`#${fieldId}`).classList.remove('border-violet-200')
        $(`#${fieldId}`).classList.add('border-red-500')
        $(`#${fieldId}`).classList.add('bg-red-100')
    }

}

function clearSignUpError(email=false, pass=false, confirmPass=false) {
    const buttonId = 'sign-up-confirm'
    const msgId = email ? 'email-error-msg' : (pass ? 'pass-length-error-msg' : (confirmPass ? 'pass-error-msg'  : ''))
    const fieldId = email ? 'email' : (pass ? 'password' : (confirmPass ? 'confirm-password' : ''))
    
    if (confirmPass && !checkLength()) {
        return
    }

    if ((email && $('#email').value) || pass || confirmPass) {
        if ($('#confirm-password').value == $('#password').value) {
            $(`#${buttonId}`).removeAttribute('disabled', 'disabled');
            $(`#${buttonId}`).classList.remove('bg-violet-300')
            $(`#${buttonId}`).classList.add('bg-violet-600')
            $(`#${buttonId}`).classList.add('hover:bg-violet-500')
            $(`#${msgId}`).classList.add('hidden')
            $(`#${fieldId}`).classList.add('border-violet-200')
            $(`#${fieldId}`).classList.remove('border-red-500')
            $(`#${fieldId}`).classList.remove('bg-red-100')
        }
    }
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
    if (buttonId == 'sign-in-confirm') {
        $(`#${buttonId}`).removeAttribute('disabled', 'disabled')
        $(`#${buttonId}`).classList.remove('bg-violet-400')
        $(`#${buttonId}`).classList.add('bg-violet-600')
        $(`#${buttonId}`).classList.add('hover:bg-violet-500')
    }
}

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

    try {
        $('#invalid-credentials-alert').remove()
    } catch (error) {
        // pass
    }
    
    form.onsubmit = async (event) => {
        event.preventDefault()
        let error = false
        let formData
        const isSignUp = form.name.value ? true : false
        if (isSignUp) {
            error = comparePasswords()
        } 
        if (!error) {
            formData = getValues(isSignUp)
        }
        if (isSignUp) {
            loading('sign-up-confirm')
            const { data, error } = await signUp(formData)
            
            if (!data) {
                clearLoading('sign-up-confirm')
                signUpError(true, undefined, undefined)
            } else {
                await generateToken(data)
            }
        } else {
            loading('sign-in-confirm')
            const { data, error } = await singIn(formData.email, formData.password)
            if (!data) {
                invalidCredentials()
                clearLoading('sign-in-confirm')
                event.preventDefault()
            } else {
                await generateToken(data)
            }
        }
    }
}

checkForToken()