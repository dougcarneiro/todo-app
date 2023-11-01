import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

import { encryptPass } from '../lib/password.js'


const supabase = createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_API_SECRET_KEY)


// USER
export async function getAllUsers() {
    return await supabase.from('User')
                         .select('id, name, email, confirmed_email, last_access') 
}

export async function createUser(user) {
    user.password = encryptPass(user.password)
    return await supabase
                .from('User')
                .insert({ ...user })
                .select('id, name, email, confirmed_email, last_access') 
}

// ToDos
export async function getAllTodoByUser(userId, filters) {
    // TODO: adicionar lógica de filtros
    return await supabase.from('Todo')
                         .select('id, user_id, title, description, priority, created_at_, todo_date')
                         .eq('id', userId) 
}

export async function createTodo(todo, user_id) {
    return await supabase
                .from('Todo')
                .insert({ user_id, ...todo })
                .select()
}

export async function getTodoById(id) {
    return await supabase
                 .from('Todo')
                 .select()
                 .eq('id', id)
}
