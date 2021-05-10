import { gql } from 'graphql-request';

export const GetPublicSnippets = gql`
  query GetPublicSnippets {
    snippets(where: { public: { _eq: true } }, limit: 10, order_by: { created_at: desc }) {
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
export const GetLanguageSlugs = gql`
  query GetLanguageSlugs {
    languages {
      slug
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

export const GetSnippetByLanguageSlug = gql`
  query GetSnippetByLanguageSlug($slug: String!) {
    snippets(where: { language: { slug: { _eq: $slug } }, public: { _eq: true } }) {
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
