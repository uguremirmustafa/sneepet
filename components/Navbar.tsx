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
        <div className="logo">logo</div>
        <ul>
          <li>
            {isLoading && <div>loading...</div>}
            {error && <div>{error.message}</div>}
            {user ? (
              <div>
                {user.name}! <a href="/api/auth/logout">Logout</a>
              </div>
            ) : (
              <div>
                <Link href="/api/auth/login">login</Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
