import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="grid">
      <Navbar />
      <main className="main">{children}</main>
    </div>
  );
}
