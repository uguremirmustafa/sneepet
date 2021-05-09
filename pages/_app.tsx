import type { AppProps } from 'next/app';
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../components/Layout';
import '../styles/main.scss';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
