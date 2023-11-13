import 'preline';
import '@iconify/iconify';

import TodoForm from './components/TodoForm';
import Modal from './components/RemoveModal';
import Todos from './lib/todos';
import Storage from './services/storage';
import { seed } from './data/seed';
import Search from './components/SearchBar';
import Profile from './components/Profile';

import '../css/style.css';


const user = await Storage.getUserByJWT()

let searchInput = ''

if (user) {
    await Profile.create(user);
} else {
    Profile.login()
    Storage.loadSeed('todos', []);
}

await Todos.load(searchInput);

TodoForm.create();

Modal.create();

Search.create();