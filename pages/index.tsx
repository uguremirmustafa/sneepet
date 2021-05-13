import React, { useEffect, useState } from 'react';
import fetchGQL from '../utils/fetchql';
import { hasuraAdminClient } from '../lib/client';
import useSWR from 'swr';
import { DeleteLike, GetPublicSnippets, InsertLike } from '../lib/queries/snippets';
import SnippetPreviewCard from '../components/SnippetPreviewCard';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};
export default function Home({ snippets }) {
  const { user, error, isLoading }: UserContext = useUser();

  const { data, mutate } = useSWR(user ? GetPublicSnippets : null, (query) => fetchGQL(query), {
    revalidateOnMount: true,
    initialData: snippets,
    revalidateOnFocus: false,
  });
  // const [likeId, setLikeId] = useState('');
  // const [optimisticallyLiked, setOptimisticallyLiked] = useState(false);

  // const handleLike = async (snippetId) => {
  //   let temp = { ...data };
  //   temp.snippets.map((s) => {
  //     if (s.id === snippetId) {
  //       s.likes_aggregate.aggregate.count = (p) => p + 1;
  //     } else {
  //       return s;
  //     }
  //   });
  //   setOptimisticallyLiked((v) => !v);
  //   mutate({ ...data, temp }, false);
  //   const res = await fetchGQL(InsertLike, { snippetId });
  //   mutate();
  //   if (res.insert_likes_one) {
  //     setLikeId(res.insert_likes_one.id);
  //   }
  // };

  // const handleUnlike = async (likeId) => {
  //   let temp = { ...data };
  //   temp.snippets.map((s) => {
  //     if (s.id === likeId) {
  //       s.likes_aggregate.aggregate.count = (p) => p - 1;
  //     } else {
  //       return s;
  //     }
  //   });
  //   setOptimisticallyLiked((v) => !v);
  //   mutate({ ...data, temp }, false);
  //   await fetchGQL(DeleteLike, { likeId });
  //   mutate();
  // };
  return (
    <div className="home">
      {isLoading && <div>loading...</div>}
      {error && <div>{error.message}</div>}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data.snippets.length > 0
        ? data.snippets.map((item) => (
            <SnippetPreviewCard
              key={item.id}
              snippet={item}
              // handleLike={handleLike}
              // likeId={likeId}
              // userId={user?.sub}
              // handleUnlike={handleUnlike}
              // optimisticallyLiked={optimisticallyLiked}
            />
          ))
        : ''}
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
