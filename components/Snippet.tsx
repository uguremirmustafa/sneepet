import React from 'react';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
const today = new Date();

export default function Snippet({ snippet }) {
  const {
    id,
    title,
    description,
    language: { name, slug },
    likes_aggregate: {
      aggregate: { count },
    },
    created_at,
    updated_at,
  } = snippet;
  const edited = created_at !== updated_at;
  const timeAgo = formatRelative(Date.parse(edited ? updated_at : created_at), today, {
    weekStartsOn: 1,
  });
  const userLiked = true;
  return (
    <div className="snippet">
      <div className="like">
        <p>
          {count} {count > 1 ? 'likes' : 'like'}
        </p>

        <svg viewBox="0 0 24 24" width="24" height="24" className={userLiked ? 'liked' : ''}>
          <path fill="none" d="M0 0H24V24H0z" />
          <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
        </svg>
      </div>
      <h2 className="title">
        <Link href={`/snippet/${id}`}>{title}</Link>
      </h2>
      <div className="meta">
        <p className="language">
          Language:
          <Link href={`/language/${slug}`}>{name}</Link>
        </p>
        <p className="time">
          {edited && <p>edited</p>}
          {timeAgo}
        </p>
      </div>
      <p className="description">{description}</p>
    </div>
  );
}
