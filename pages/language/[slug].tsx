import React, { useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { hasuraAdminClient } from '../../lib/client';
import {
  DeleteLike,
  GetLanguageSlugs,
  GetSnippetByLanguageSlug,
  InsertLike,
} from '../../lib/queries/snippets';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetchGQL from '../../utils/fetchql';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import SnippetPreviewCard from '../../components/SnippetPreviewCard';

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};
export default function Home({ snippets }) {
  const { user, error, isLoading }: UserContext = useUser();
  const router = useRouter();
  const { slug } = router.query;

  const { data, mutate } = useSWR(
    user ? GetSnippetByLanguageSlug : null,
    (query) => fetchGQL(query, { slug }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      initialData: snippets,
    }
  );
  // const [likeId, setLikeId] = useState('');
  // const [optimisticallyLiked, setOptimisticallyLiked] = useState(false);

  // const handleLike = async (snippetId) => {
  //   let temp = { ...data };
  //   // temp.snippets.likes_aggregate.aggregate.count = (p) => p + 1;
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
      {data.snippets.map((item) => (
        <SnippetPreviewCard
          key={item.id}
          snippet={item}
          // handleLike={handleLike}
          // likeId={likeId}
          // userId={user?.sub}
          // handleUnlike={handleUnlike}
          // optimisticallyLiked={optimisticallyLiked}
        />
      ))}
    </div>
  );
}
export async function getStaticProps(context: GetStaticPropsContext) {
  const data = await hasuraAdminClient.request(GetSnippetByLanguageSlug, {
    slug: context.params.slug,
  });
  return {
    props: {
      snippets: data,
    },
  };
}
export async function getStaticPaths<GetStaticPaths>() {
  const { languages } = await hasuraAdminClient.request(GetLanguageSlugs);
  const paths = languages.map((item) => ({ params: item }));
  return {
    paths,
    fallback: false,
  };
}
