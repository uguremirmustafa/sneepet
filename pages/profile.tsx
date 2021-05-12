import { UserProfile, useUser } from '@auth0/nextjs-auth0';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { GetUser } from '../lib/queries/user';
import fetchGQL from '../utils/fetchql';

let today: Date = new Date();

type UserContext = {
  user?: UserProfile;
  error?: Error;
  isLoading: boolean;
};

type FormValues = {
  name: string;
};
export default function Profile() {
  const { user, error: userError, isLoading }: UserContext = useUser();
  if (isLoading) return <div>loading...</div>;
  const { data, error } = useSWR([GetUser, user?.sub], (query) =>
    fetchGQL(query, { userId: user.sub })
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: user?.nickname } });

  const onSubmit = () => {
    //TODO update user on hasura
  };
  const timeAgo = (date) =>
    formatRelative(Date.parse(date), today, {
      weekStartsOn: 1,
    });
  if (error || userError) return <div>error</div>;

  return (
    <div className="profile">
      <h2 className="pageTitle">My Profile</h2>

      <div className="profileDetails">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>User Details</h3>
          <label htmlFor="name">Name</label>
          <input
            {...register('name', {
              required: 'This field is required',
              maxLength: { value: 200, message: 'You exceeded the length' },
            })}
            type="text"
            id="name"
          />
          {errors.name && <p>{errors.name.message}</p>}
          <button type="submit">{isSubmitting ? 'Saving' : 'Save changes'}</button>
        </form>
      </div>
      <div>
        <h3>My snippets</h3>
        {data
          ? data.users_by_pk.snippets.map((item) => {
              const snippetCreatedAt = timeAgo(item.created_at);

              return (
                <div className="snippetLine">
                  <Link href={`/snippet/${item.id}`}>{item.title}</Link>
                  <div className="snippetMeta">
                    <span>{snippetCreatedAt}</span>
                    <span>{item.public ? 'public' : 'private'}</span>
                  </div>
                </div>
              );
            })
          : 'loading'}
        <h3>Liked snippets</h3>
        {data
          ? data.users_by_pk.likes.map((item) => {
              const snippetCreatedAt = timeAgo(item.snippet.created_at);
              return (
                <div className="snippetLine">
                  <Link href={`/snippet/${item.snippet.id}`}>{item.snippet.title}</Link>
                  <span>{snippetCreatedAt}</span>
                </div>
              );
            })
          : 'loading'}
      </div>
    </div>
  );
}
