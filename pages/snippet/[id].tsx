import React, { useState } from 'react';
import { GetStaticPropsContext } from 'next';
import { hasuraAdminClient } from '../../lib/client';
import {
  GetSnippetById,
  GetSnippetIds,
  InsertLike,
  DeleteLike,
  DeleteSnippet,
  UpdateSnippet,
} from '../../lib/queries/snippets';
import useSWR, { trigger } from 'swr';
import { useRouter } from 'next/router';
import fetchGQL from '../../utils/fetchql';
import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { formatRelative } from 'date-fns';
import Link from 'next/link';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import { materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import SnippetForm from '../../components/SnippetForm';
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('php', php);

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};
let today: Date = new Date();

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
    author: { name: authorName, id: authorId },
    created_at,
    updated_at,
    language: { name, slug, id: languageId },
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

  const handleDelete = async (snippetId) => {
    const res = await fetchGQL(DeleteSnippet, { snippetId });
    if (res.id) {
      router.push('/');
    }
  };

  const [editing, setEditing] = useState(false);
  const toggleEditing = () => {
    setEditing((v) => !v);
  };

  const edited = created_at !== updated_at;

  const timeAgo = formatRelative(Date.parse(edited ? updated_at : created_at), today, {
    weekStartsOn: 1,
  });

  const userLiked = likes.filter((item) => item.user_id === user?.sub).length > 0;
  const isOwner = user ? authorId === user?.sub : false;
  if (isFallback) return <div>Loading...</div>;
  return (
    <div className="snippetPage">
      {editing ? (
        <SnippetForm
          languages={data.languages}
          code={code}
          description={description}
          languageId={languageId}
          title={title}
          editing={editing}
          toggleEditing={toggleEditing}
          snippetId={id}
        />
      ) : (
        <>
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
                {isOwner && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      onClick={() => handleDelete(id)}
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zM9 4v2h6V4H9z" />
                    </svg>

                    <svg viewBox="0 0 24 24" onClick={toggleEditing}>
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M21 6.757l-2 2V4h-9v5H5v11h14v-2.757l2-2v5.765a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6.003-6h10.995C20.55 2 21 2.455 21 2.992v3.765zm.778 2.05l1.414 1.415L15.414 18l-1.416-.002.002-1.412 7.778-7.778z" />
                    </svg>
                  </>
                )}
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
        </>
      )}
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
