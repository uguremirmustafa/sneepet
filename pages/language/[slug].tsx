import React from 'react';
import { GetStaticPropsContext } from 'next';
import { hasuraAdminClient } from '../../lib/client';
import { GetLanguageSlugs, GetSnippetByLanguageSlug } from '../../lib/queries/snippets';
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

  const { data } = useSWR(
    user ? GetSnippetByLanguageSlug : null,
    (query) => fetchGQL(query, { slug }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      initialData: snippets,
    }
  );

  return (
    <div className="home">
      {isLoading && <div>loading...</div>}
      {error && <div>{error.message}</div>}
      {data.snippets.map((item) => (
        <SnippetPreviewCard key={item.id} snippet={item} />
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
