import { v4 as uuidv4 } from 'uuid';
import { getProfileById } from './supabase';
import { decodeJWT } from './jwt';

function storageInsert(key, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }

  localStorage.setItem(`@todo-app:${key}`, value);
}

function storageSelect(key, isJSON = true) {
  let value = localStorage.getItem(`@todo-app:${key}`);

  if (isJSON) {
    value = JSON.parse(value);
  }

  return value;
}

function loadSeed(resource, data) {
  if (storageSelect('loaded', false) !== 'ok') {
    storageInsert(resource, data);

    storageInsert('loaded', 'ok');
  }
}

function create(resource, value) {
  const values = storageSelect(resource);

  value = { ...value, id: uuidv4() };

  storageInsert(resource, [...values, value]);

  return value;
}

function read(resource, id) {
  const str = ''
  const values = storageSelect(resource);

  if (id) {
    return values.find((value) => value.id === id);
  } else {
    if (values) {
      const filteredValues = values.filter((value) =>
      value.title.toLowerCase().includes(str.toLowerCase())
    );
    return filteredValues;
    } return
  }
}

function update(resource, id, value) {
  const values = storageSelect(resource);

  const index = values.findIndex((value) => value.id === id);

  if (index >= 0) {
    value = { id, ...value };

    values[index] = { ...values[index], ...value };

    storageInsert(resource, values);

    return value;
  } else {
    return false;
  }
}

function remove(resource, id) {
  const values = storageSelect(resource);

  const index = values.findIndex((value) => value.id === id);

  if (index >= 0) {
    values.splice(index, 1);
  }

  storageInsert(resource, values);
}

function getUserByJWT() {
  const jwt = localStorage.getItem('@todo-app:jwt')
  if (jwt) {
    return decodeJWT(jwt).user
  } else {
    return false
  }
}

export default { loadSeed, create, read, update, remove, getUserByJWT };