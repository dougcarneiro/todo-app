import 'preline';
import '@iconify/iconify';

import TodoForm from './components/TodoForm';
import Modal from './components/Modal';
import Todos from './lib/todos';
import Storage from './services/storage';
import { seed } from './data/seed';
import Search from './components/searchBar';

import '../css/style.css';


let searchInput = ''

Storage.loadSeed('todos', seed);

Todos.load(searchInput);

TodoForm.create();

Modal.create();

Search.create();