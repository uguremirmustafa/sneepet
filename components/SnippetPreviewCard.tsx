import React from 'react';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
let today: Date = new Date();

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
      <div className="content">
        <h2 className="title">
          <Link href={`/snippet/${id}`}>{title}</Link>
        </h2>
        <div className="meta">
          <div className="meta__left">
            <p className="language">
              <svg viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M23 12l-7.071 7.071-1.414-1.414L20.172 12l-5.657-5.657 1.414-1.414L23 12zM3.828 12l5.657 5.657-1.414 1.414L1 12l7.071-7.071 1.414 1.414L3.828 12z" />
              </svg>
              <Link href={`/language/${slug}`}>{name}</Link>
            </p>
            <div className="like">
              <svg viewBox="0 0 24 24" width="20" height="20" className={count > 0 ? 'liked' : ''}>
                <path fill="none" d="M0 0H24V24H0z" />
                <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
              </svg>
              <p>{count === 0 ? '' : count > 1 ? `${count} likes` : '1 like'}</p>
            </div>
          </div>
          <div className="time">
            <p>{timeAgo}</p>
            <p>
              {edited && (
                <svg viewBox="0 0 24 24" width={16}>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M21 6.757l-2 2V4h-9v5H5v11h14v-2.757l2-2v5.765a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6.003-6h10.995C20.55 2 21 2.455 21 2.992v3.765zm.778 2.05l1.414 1.415L15.414 18l-1.416-.002.002-1.412 7.778-7.778z" />
                </svg>
              )}
            </p>
          </div>
        </div>
        <p className="description">{description}</p>
      </div>
    </div>
  );
}
