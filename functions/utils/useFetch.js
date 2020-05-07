const fetch = require('node-fetch');

async function useFetch(url, args) {
  const { headers = { 'content-type': 'application/json' }, ...body } = args;

  const response = await fetch(url, {
    method: body ? 'POST' : method,
    mode: 'cors',
    headers: {
      ...headers
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return data;
}

module.exports = useFetch;
