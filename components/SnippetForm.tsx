import { gql } from 'graphql-request';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import fetchGQL from '../utils/fetchql';
import EditorPage from './Editor';
import { CreateSnippet } from '../lib/queries/snippets';
type FormValues = {
  title: string;
  description: string;
  languageId: string;
  public: boolean;
  code: string;
};

export default function SnippetForm({ languages }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const watchLanguage = watch('languageId');
  const watchCode = watch('code');

  const onSubmit = async (data) => {
    const res = await fetchGQL(CreateSnippet, data);
    console.log(res);
    if (res.insert_snippets_one.id) {
      reset();
    }
  };

  return (
    <div className="formWrapper">
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
                {languages.map((item) => (
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
          submit
        </button>
      </form>
      <div className="highlighted">
        <EditorPage languages={languages} selectedLangId={watchLanguage} code={watchCode} />
      </div>
    </div>
  );
}
