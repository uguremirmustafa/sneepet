import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import React from 'react';

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};

export default function MobileTapMenu() {
  const { user, error, isLoading }: UserContext = useUser();
  return (
    <nav className="bottomnav">
      <Link href="/">
        <button className="bottomnav__button">
          <svg viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19zm2-4h8v2H8v-2z" />
          </svg>
        </button>
      </Link>
      <Link href="/add">
        <button className="bottomnav__button">
          <svg viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </button>
      </Link>
      {isLoading && (
        <button className="bottomnav__button">
          <svg viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M3.055 13H5.07a7.002 7.002 0 0 0 13.858 0h2.016a9.001 9.001 0 0 1-17.89 0zm0-2a9.001 9.001 0 0 1 17.89 0H18.93a7.002 7.002 0 0 0-13.858 0H3.055z" />
          </svg>
        </button>
      )}
      {user ? (
        <Link href="/profile">
          <button className="bottomnav__button">
            <svg viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2zm-8-9a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
          </button>
        </Link>
      ) : (
        <Link href="/api/auth/login">
          <button className="bottomnav__button">
            <svg viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M4 15h2v5h12V4H6v5H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zm6-4V8l5 4-5 4v-3H2v-2h8z" />
            </svg>
          </button>
        </Link>
      )}
      {user && (
        <Link href="/api/auth/logout">
          <button className="bottomnav__button">
            <svg viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z" />
            </svg>
          </button>
        </Link>
      )}
    </nav>
  );
}
