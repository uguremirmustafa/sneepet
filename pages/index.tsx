import React from 'react';
import fetchGQL from '../utils/fetchql';
import { hasuraAdminClient } from '../lib/client';
import useSWR from 'swr';
import { GetPublicSnippets } from '../lib/queries/snippets';
import SnippetForm from '../components/SnippetForm';
import Snippet from '../components/Snippet';

export default function Home({ snippets }) {
  const { data } = useSWR(GetPublicSnippets, (query) => fetchGQL(query), {
    revalidateOnMount: true,
    initialData: snippets,
  });
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data.snippets.map((item) => (
        <Snippet key={item.id} snippet={item} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const data = await hasuraAdminClient.request(GetPublicSnippets);

  return {
    props: {
      snippets: data,
    },
  };
}
