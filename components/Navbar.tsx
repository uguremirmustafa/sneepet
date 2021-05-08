import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  } else {
    return (
      <div>
        <Link href="/api/auth/login">login</Link>
      </div>
    );
  }
}
