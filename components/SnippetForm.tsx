import { gql } from 'graphql-request';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import fetchGQL from '../utils/fetchql';
import CodePreview from './Editor';
import { CreateSnippet, UpdateSnippet } from '../lib/queries/snippets';
import Link from 'next/link';
import { useRouter } from 'next/router';
type FormValues = {
  title: string;
  description: string;
  languageId: string;
  public: boolean;
  code: string;
};

export default function SnippetForm({
  languages,
  code,
  description,
  languageId,
  title,
  editing,
  toggleEditing,
  snippetId,
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      code,
      description,
      languageId,
      title,
    },
  });
  const watchLanguage = watch('languageId');
  const watchCode = watch('code');

  const onSubmit = async (data) => {
    if (editing) {
      const res = await fetchGQL(UpdateSnippet, { ...data, snippetId });
      if (res.update_snippets_by_pk.id) {
        toggleEditing();
      }
    } else {
      const res = await fetchGQL(CreateSnippet, data);
      if (res.insert_snippets_one.id) {
        reset();
      }
    }
  };

  return (
    <div className="formWrapper">
      <div className="header">
        <h2>{editing ? 'Editing snippet' : 'Creating a new snippet'}</h2>
        {editing ? (
          <button className="editIconWrapper btn" onClick={toggleEditing}>
            <p>Cancel editing</p>
            <svg viewBox="0 0 24 24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M21 6.757l-2 2V4h-9v5H5v11h14v-2.757l2-2v5.765a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8l6.003-6h10.995C20.55 2 21 2.455 21 2.992v3.765zm.778 2.05l1.414 1.415L15.414 18l-1.416-.002.002-1.412 7.778-7.778z" />
            </svg>
          </button>
        ) : (
          <Link href="/">back to home</Link>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="firstColumn">
          <label htmlFor="title">Title</label>
          <input
            {...register('title', {
              required: 'This field is required',
              maxLength: { value: 200, message: 'You exceeded the length' },
            })}
            type="text"
            id="title"
          />
          {errors.title && <p>{errors.title.message}</p>}

          <label htmlFor="description">Description</label>
          <textarea
            {...register('description', {
              required: 'This field is required',
              maxLength: { value: 100000, message: 'You exceeded the length' },
            })}
            id="description"
            className="description"
            rows={5}
          />
          {errors.description && <p>{errors.description.message}</p>}

          <div className="form-flex">
            <div>
              <label htmlFor="languageId">Language</label>
              <select
                {...register('languageId', {
                  required: "You haven't selected the language",
                })}
                id="languageId"
              >
                <option value="">Select...</option>
                {languages?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.languageId && <p>{errors.languageId.message}</p>}
            </div>
            <div>
              <label htmlFor="public">Public</label>
              <input type="checkbox" {...register('public')} defaultChecked />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="code">Enter your awesome snippet</label>
          <textarea
            {...register('code', {
              required: 'This field is required',
              maxLength: { value: 300000, message: 'You exceeded the length' },
            })}
            id="code"
            rows={15}
            placeholder="enter your code here"
          />

          {errors.code && <p>{errors.code.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'submitting' : 'submit'}
        </button>
      </form>
      <div className="highlighted">
        <CodePreview languages={languages} selectedLangId={watchLanguage} code={watchCode} />
      </div>
    </div>
  );
}
