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
            const { data, error } = await signUp(formData)
            if (!data) {
                existingUserError()
            } else {
                await generateToken(data)
            }
        } else {
            const { data, error } = await singIn(formData.email, formData.password)
            if (!data) {
                passError()
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
    $('#sign-in-confirm').setAttribute('disabled', 'disabled');
    $('#sign-in-confirm').classList.add('bg-violet-300')
    $('#sign-in-confirm').classList.remove('hover:bg-violet-500')
    $('#bad-pass-error-msg').classList.remove('hidden')
    $('#password').classList.add('border-red-500')
    $('#password').classList.add('bg-red-100')
}

function clearPassError() {
    $('#sign-in-confirm').removeAttribute('disabled', 'disabled');
    $('#sign-in-confirm').classList.remove('bg-violet-300')
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
    $('#email').classList.add('border-red-500')
    $('#email').classList.add('bg-red-100')
}

function clearExistingUserError() {
    $('#sign-up-confirm').removeAttribute('disabled', 'disabled');
    $('#sign-up-confirm').classList.remove('bg-violet-300')
    $('#sign-up-confirm').classList.add('hover:bg-violet-500')
    $('#email-error-msg').classList.add('hidden')
    $('#email').classList.remove('border-red-500')
    $('#email').classList.remove('bg-red-100')
}

async function generateToken(data) {
    const token = await signJWT(data)
    localStorage.setItem(`@todo-app:jwt`, token);
    window.location.href = 'index.html'
}

checkForToken()