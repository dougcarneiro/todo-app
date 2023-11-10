import { createClient } from '@supabase/supabase-js'
import { encryptPass, comparePass } from '../lib/password.js'


const SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL
const SUPABASE_API_SECRET_KEY = import.meta.env.VITE_SUPABASE_API_SECRET_KEY

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_SECRET_KEY)

const PROFILE_SELECT = 'id, name, user_id, email'


// PROFILE
export async function getAllProfiles() {
    return await supabase.from('Profile')
                            .select(PROFILE_SELECT) 
}

export async function getProfileById(id) {
    return await supabase.from('Profile')
                            .select(PROFILE_SELECT)
                            .eq('id', id)
}

export async function getProfileByEmail(email) {
    return await supabase.from('Profile')
                            .select(PROFILE_SELECT)
                            .eq('email', email)
}

export async function createProfile(profile) {
    return await supabase.from('Profile')
                            .insert({ ...profile })
                            .select(PROFILE_SELECT)
}

export async function updateProfile(profile) {
    return await supabase.from('Profile')
                            .update({...profile})
                            .eq('id', profile.id)
                            .select(PROFILE_SELECT)
}

// USER MANAGEMENT SUPABASE PROVIDED
export async function signUp(user) {
    const existingUser = await getProfileByEmail(user.email)
    if (existingUser.data[0]) {
        return false
    }
    const { data, error } = await supabase.auth.signUp({ ...user })
    const created_user = data.user
    if (created_user) {
        const profile = {
            name: user.name,
            user_id: created_user.id,
            email: user.email,
            password: created_user.encrypted_password
        }
        const { data, error } = await createProfile(profile)
        return {data, error}
    } else {
        return error
    }
}

export async function singIn(email, password) {
    const existingUser = await getProfileByEmail(email)
    if (!existingUser.data[0]) {
        return false
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (data.user) {
        return existingUser
    } else {
        return false
    }
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
