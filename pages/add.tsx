import React from 'react';
import { gql } from 'graphql-request';
import { hasuraAdminClient } from '../lib/client';
import SnippetForm from '../components/SnippetForm';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
const GetLanguages = gql`
  {
    languages {
      id
      name
    }
  }
`;
const Add = ({ languages }) => {
  return (
    <div>
      <SnippetForm languages={languages.languages} />
    </div>
  );
};
export async function getStaticProps() {
  const languages = await hasuraAdminClient.request(GetLanguages);

  return {
    props: {
      languages,
    },
  };
}
export default withPageAuthRequired(Add);
