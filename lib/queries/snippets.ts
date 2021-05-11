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
      likes {
        user_id
        id
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

export const CreateSnippet = gql`
  mutation (
    $code: String!
    $languageId: uuid!
    $title: String!
    $description: String!
    $public: Boolean
  ) {
    insert_snippets_one(
      object: {
        code: $code
        language_id: $languageId
        title: $title
        description: $description
        public: $public
      }
    ) {
      id
    }
  }
`;

export const InsertLike = gql`
  mutation InsertLike($snippetId: uuid!) {
    insert_likes_one(object: { snippet_id: $snippetId }) {
      id
    }
  }
`;
export const DeleteLike = gql`
  mutation DeleteLike($likeId: uuid!) {
    delete_likes_by_pk(id: $likeId) {
      id
    }
  }
`;
