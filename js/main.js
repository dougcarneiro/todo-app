import 'preline';
import '@iconify/iconify';

import TodoForm from './components/TodoForm';
import Modal from './components/RemoveModal';
import Todos from './lib/todos';
import Storage from './services/storage';
import { seed } from './data/seed';
import Search from './components/SearchBar';

import '../css/style.css';


let searchInput = ''

Storage.loadSeed('todos', seed);

Todos.load(searchInput);

TodoForm.create();

Modal.create();

Search.create();