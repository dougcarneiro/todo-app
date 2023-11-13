import { createClient } from '@supabase/supabase-js'


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
export async function getAllTodoByUser(profileId, filters) {
    const priority = [filters.normal ? 'normal' : '',
                      filters.light ? 'light' : '',
                      filters.medium ? 'medium' : '', 
                      filters.high ? 'high' : '']
    const title = filters.title ? filters.title : ''
    let filterPriority = priority.filter(filter => filter !== '')
    let statusFilter = [true, false]
    if (filters.done || filters.notDone) {
        statusFilter = []
        statusFilter.push(filters.done ? true : false)
        statusFilter.push(filters.notDone ? false : true)
    }
    if (filterPriority.length == 0) {
        filterPriority = ['normal', 'light', 'medium', 'high']
    }
    let query = await supabase.from('Todo')
                         .select('*')
                         .eq('profile_id', profileId) 
                         .eq('is_active', true)
                         .order('created_at', { ascending: true })
                         .ilike('title', `%${title}%`)
                         .in('priority', filterPriority)
                         .in('is_completed', statusFilter)
    return query
    

}

export async function createTodo(todo, profile_id) {
    return await supabase.from('Todo')
                         .insert({ profile_id, ...todo })
                         .select()
}

export async function updateTodo(todo) {
    delete todo.created_at
    return await supabase.from('Todo')
                         .update({...todo})
                         .select('*')
                         .eq('id', todo.id)
}

export async function getTodoById(id) {
    return await supabase.from('Todo')
                         .select()
                         .eq('id', id)
}

export async function deleteTodo(todo) {
    return await supabase.from('Todo')
                         .update({'is_active': false})
                         .eq('id', todo.id)
                         .select('*')
}
