import { createClient } from '@supabase/supabase-js'
import { encryptPass, comparePass } from '../lib/password.js'


const SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL
const SUPABASE_API_SECRET_KEY = import.meta.env.VITE_SUPABASE_API_SECRET_KEY

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_SECRET_KEY)

const USER_SELECT = 'id, name, email, confirmed_email, last_access'
const USER_SELECT_PASS = USER_SELECT + ', password'

// USER
export async function login(email, password) {
    const { data } = await getUserByEmail(email)
    const user = data[0]
    if (user) {
        if (comparePass(password, user.password)) {
            delete user.password
            return user
        } else {
            return false
        }
    }
}

export async function getAllUsers() {
    return await supabase.from('User')
                            .select(USER_SELECT) 
}

export async function getUserById(id) {
    return await supabase.from('User')
                            .select(USER_SELECT_PASS)
                            .eq('id', id)
}

export async function getUserByEmail(email) {
    return await supabase.from('User')
                            .select(USER_SELECT_PASS)
                            .eq('email', email)
}

export async function createUser(user) {
    user.password = encryptPass(user.password)
    return await supabase.from('User')
                            .insert({ ...user })
                            .select(USER_SELECT) 
}

export async function updateUser(user) {
    return await supabase.from('User')
                            .update({...user})
                            .eq('id', user.id)
                            .select(USER_SELECT)
}

// USER MANAGEMENT SUPABASE PROVIDED
export async function signUp(user) {
    return await supabase.auth.signUp({ ...user })
}

export async function singIn(email, password) {
    return await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
} 

export async function recoverPass(email) {
    await supabase.auth.resetPasswordForEmail(email)
}

export async function logOut() {
    await supabase.auth.signOut()
}

export async function getLoggedUser() {
    return await supabase.auth.getUser()
}

export async function updateLoggedUser(data) {
    return await supabase.auth.updateUser({
        ...data
      })
} 

// ToDos
export async function getAllTodoByUser(userId, filters) {
    // TODO: adicionar lógica de filtros
    return await supabase.from('Todo')
                         .select('id, user_id, title, description, priority, created_at_, todo_date')
                         .eq('id', userId) 
}

export async function createTodo(todo, user_id) {
    return await supabase.from('Todo')
                         .insert({ user_id, ...todo })
                         .select('*')
}

export async function updateTodo(todo) {
    return await supabase.from('Todo')
                         .update({...todo})
                         .eq('id', todo.id)
                         .select('*')
}

export async function getTodoById(id) {
    return await supabase.from('Todo')
                         .eq('id', id)
                         .select('*')
}

export async function deleteTodo(todo) {
    return await supabase.from('Todo')
                         .update({'is_active': false})
                         .eq('id', todo.id)
                         .select('*')
}
