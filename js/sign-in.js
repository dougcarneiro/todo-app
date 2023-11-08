import { $ } from './lib/dom';
import { signJWT } from './services/jwt';
import { login } from './services/supabase';

$('#sign-in-button').addEventListener('click', async (event) => {
    event.preventDefault()
    const email = $('#email').value
    const password = $('#password').value
    const user = await login(email, password)
    if (user) {
        const token = await signJWT(user)
        localStorage.setItem(`@todo-app:jwt-token`, token);
        console.log('foi')
    } else {
        console.log('nope')
    }
})