import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import React from 'react';

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};

export default function Navbar() {
  const { user, error, isLoading }: UserContext = useUser();

  return (
    <nav className="navbar">
      <div className="innerNav">
        <div className="logo">
          <Link href="/">Sneepet</Link>
        </div>
        <ul>
          <li>
            <Link href="/add">Create a snippet</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            {isLoading && <a>loading...</a>}
            {error && <a>{error.message}</a>}
            {user ? (
              <div className="avatarContainer">
                <a href="/api/auth/logout">Logout</a>{' '}
                <img src={user.picture} alt="avatar for user" className="avatar" />
              </div>
            ) : (
              <Link href="/api/auth/login">login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
