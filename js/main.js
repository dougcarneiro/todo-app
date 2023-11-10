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


let searchInput = ''


Todos.load(searchInput);

TodoForm.create();

const user = Storage.getUserByJWT()

if (user) {
    Profile.create(user);
} else {
    Profile.login()
    Storage.loadSeed('todos', seed);
}

Modal.create();

Search.create();