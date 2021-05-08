const fetchGQL = (query, variables = {}) => {
  return fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());
};

export default fetchGQL;
