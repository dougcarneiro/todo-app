export function formatDate(value, pattern) {
  const date = new Date(value).toLocaleDateString('pt-br');

  if (pattern === 'ymd') {
    return date.split('/').reverse().join('-');
  } else {
    return date;
  }
}
