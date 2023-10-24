export function orderByDate(array) {
    array.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });
  }
