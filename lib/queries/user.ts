import { gql } from 'graphql-request';

export const GetUser = gql`
  query GetUser($userId: String!) {
    users_by_pk(id: $userId) {
      id
      name
      snippets(order_by: { updated_at: desc }) {
        title
        id
        created_at
        public
      }
      likes(order_by: { snippet: { likes_aggregate: { count: desc } } }) {
        snippet {
          id
          title
          created_at
        }
      }
    }
  }
`;
export const UpdateUser = gql`
  mutation UpdateUser($userId: String!, $name: String!) {
    update_users_by_pk(pk_columns: { id: $userId }, _set: { name: $name }) {
      name
      id
    }
  }
`;
