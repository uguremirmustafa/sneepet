import { gql } from 'graphql-request';

export const GetUser = gql`
  query GetUser($userId: String!) {
    users_by_pk(id: $userId) {
      id
      name
      snippets {
        title
        id
      }
      likes {
        snippet {
          id
          title
        }
      }
    }
  }
`;
