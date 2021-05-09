import React from 'react';
import { gql } from 'graphql-request';
import { hasuraAdminClient } from '../lib/client';
import SnippetForm from '../components/SnippetForm';
const GetLanguages = gql`
  {
    languages {
      id
      name
    }
  }
`;
export default function Add({ languages }) {
  return (
    <div>
      <SnippetForm languages={languages.languages} />
    </div>
  );
}
export async function getStaticProps() {
  const languages = await hasuraAdminClient.request(GetLanguages);

  return {
    props: {
      languages,
    },
  };
}
