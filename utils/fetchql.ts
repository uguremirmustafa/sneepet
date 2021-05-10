const fetchGQL = (query, variables = {}, admin = false) => {
  return fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      admin,
    }),
  }).then((res) => res.json());
};

export default fetchGQL;
