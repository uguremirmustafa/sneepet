import { gql } from 'graphql-request';

export const GetPublicSnippets = gql`
  query GetPublicSnippets {
    snippets(where: { public: { _eq: true } }, limit: 1) {
      id
      author {
        name
        id
      }
      language {
        name
        id
        slug
      }
      title
      updated_at
      created_at
      description
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
export const GetSnippetIds = gql`
  query GetSnippetIds {
    snippets {
      id
    }
  }
`;

export const GetSnippetById = gql`
  query GetSnippetById($id: uuid!) {
    snippets_by_pk(id: $id) {
      id
      author {
        name
      }
      code
      created_at
      updated_at
      language {
        slug
        name
      }
      description
      title
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
