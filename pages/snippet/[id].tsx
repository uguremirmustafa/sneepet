import React, { useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { hasuraAdminClient } from '../../lib/client';
import { GetSnippetById, GetSnippetIds, InsertLike, DeleteLike } from '../../lib/queries/snippets';
import useSWR, { trigger } from 'swr';
import { useRouter } from 'next/router';
import fetchGQL from '../../utils/fetchql';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import { materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('php', php);

let today: Date = new Date();

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};

export default function SingleSnippet({ data: initialData }) {
  const [likeId, setLikeId] = useState('');
  const router = useRouter();
  const { user }: UserContext = useUser();
  const { id, isFallback } = router.query;
  const { data, mutate } = useSWR(
    user ? [GetSnippetById, id] : null,
    (query) => fetchGQL(query, { id }),
    {
      revalidateOnMount: true,
      initialData,
    }
  );

  if (!isFallback && !data) return <p>No such content found</p>;
  const {
    title,
    author: { name: authorName },
    created_at,
    updated_at,
    language: { name, slug },
    likes_aggregate: {
      aggregate: { count },
    },
    code,
    description,
    likes,
  } = data.snippets_by_pk;

  const handleLike = async (snippetId) => {
    let temp = { ...data };
    temp.snippets_by_pk.likes_aggregate.aggregate.count = count + 1;
    mutate({ ...data, temp });
    const res = await fetchGQL(InsertLike, { snippetId });
    trigger([GetSnippetById, id]);
    if (res.insert_likes_one) {
      setLikeId(res.insert_likes_one.id);
    }
  };

  const handleUnlike = async (likeId) => {
    let temp = { ...data };
    temp.snippets_by_pk.likes_aggregate.aggregate.count = count - 1;

    mutate({ ...data, temp });
    await fetchGQL(DeleteLike, { likeId });
    trigger([GetSnippetById, id]);
  };

  const edited = created_at !== updated_at;

  const timeAgo = formatRelative(Date.parse(edited ? updated_at : created_at), today, {
    weekStartsOn: 1,
  });

  const userLiked = likes.filter((item) => item.user_id === user?.sub).length > 0;

  if (isFallback) return <div>Loading...</div>;
  return (
    <div className="snippetPage">
      <div className="meta">
        <h1 className="title">{title}</h1>
        <div className="flex">
          <h3 className="author">@{authorName ? authorName : 'unknown user'}</h3>
          <p className="time">
            {edited && <p>edited</p>}
            {timeAgo}
          </p>
        </div>
        <div className="flex">
          <div className="language">
            <Link href={`/language/${slug}`}>{name}</Link>
          </div>
          <div className="like">
            <p>{count === 0 ? 'no likes' : count > 1 ? `${count} likes` : '1 like'}</p>
            <svg
              viewBox="0 0 24 24"
              className={userLiked ? 'liked' : ''}
              onClick={userLiked ? () => handleUnlike(likeId) : () => handleLike(id)}
            >
              <path fill="none" d="M0 0H24V24H0z" />
              <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="description">
          <h3>Description</h3>
          <p>{description}</p>
        </div>
        <SyntaxHighlighter
          style={materialOceanic}
          wrapLines={true}
          language={name}
          lineProps={{ style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
          customStyle={{
            borderRadius: '4px',
            padding: '20px',
            fontSize: '13px',
            boxShadow: '0px 1px 30px -3px rgba(1,1,1,0.1)',
            width: '100%',
            fontWeight: '600',
            fontFamily: 'Nunito',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
export async function getStaticProps(context: GetStaticPropsContext) {
  const data = await hasuraAdminClient.request(GetSnippetById, { id: context.params.id });
  return {
    props: {
      data,
    },
    revalidate: 1,
  };
}
export async function getStaticPaths<GetStaticPaths>() {
  const { snippets } = await hasuraAdminClient.request(GetSnippetIds);
  const paths = snippets.map((item) => ({ params: item }));
  return {
    paths,
    fallback: true,
  };
}
