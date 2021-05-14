import React from 'react';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';

export default function Layout({ children }) {
  return (
    <div className="grid">
      <Navbar />
      <main className="main">{children}</main>
      <BottomNavbar />
    </div>
  );
}
