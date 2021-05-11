import React from 'react';
import fetchGQL from '../utils/fetchql';
import { hasuraAdminClient } from '../lib/client';
import useSWR from 'swr';
import { GetPublicSnippets } from '../lib/queries/snippets';
import Snippet from '../components/Snippet';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};
export default function Home({ snippets }) {
  const { user, error, isLoading }: UserContext = useUser();

  const { data } = useSWR(user ? GetPublicSnippets : null, (query) => fetchGQL(query), {
    revalidateOnMount: true,
    initialData: snippets,
    revalidateOnFocus: false,
  });

  return (
    <div className="home">
      {isLoading && <div>loading...</div>}
      {error && <div>{error.message}</div>}
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
    revalidate: 1,
  };
}
