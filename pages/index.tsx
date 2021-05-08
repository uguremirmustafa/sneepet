import React from 'react';
import fetchGQL from '../utils/fetchql';
import { gql } from 'graphql-request';
import { hasuraAdminClient } from '../lib/client';
import useSWR from 'swr';

const GetUsers = gql`
  {
    users {
      id
      email
    }
  }
`;

export default function Home({ users }) {
  const { data } = useSWR(GetUsers, (query) => fetchGQL(query), {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  });
  return (
    <div>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export async function getStaticProps() {
  const users = await hasuraAdminClient.request(GetUsers);

  return {
    props: {
      users,
    },
  };
}