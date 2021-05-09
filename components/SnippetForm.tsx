import { gql } from 'graphql-request';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import fetchGQL from '../utils/fetchql';
import EditorPage from './Editor';

type FormValues = {
  title: string;
  description: string;
  languageId: string;
  public: boolean;
  code: string;
};

const CreateSnippet = gql`
  mutation(
    $code: String!
    $languageId: uuid!
    $title: String!
    $description: String!
    $public: Boolean
  ) {
    insert_snippets_one(
      object: {
        code: $code
        language_id: $languageId
        title: $title
        description: $description
        public: $public
      }
    ) {
      id
    }
  }
`;

export default function SnippetForm({ languages }) {
  //   const languages = ['javascript', 'html'];
  const [editorLanguage, setEditorLanguage] = useState('javascript');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
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
        <label htmlFor="title">Title</label>
        <input
          {...register('title', {
            required: 'This field is required',
            maxLength: { value: 96, message: 'You exceeded the length' },
          })}
          type="text"
          id="title"
        />
        {errors.title && <p>{errors.title.message}</p>}
        <label htmlFor="description">Description</label>
        <textarea
          {...register('description', {
            required: 'This field is required',
            maxLength: { value: 300, message: 'You exceeded the length' },
          })}
          id="description"
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
            <label htmlFor="public">Is it going to be public</label>
            <input type="checkbox" {...register('public')} defaultChecked />
          </div>
        </div>

        <label htmlFor="code">Enter your awesome snippet</label>
        <textarea
          {...register('code', {
            required: 'This field is required',
            maxLength: { value: 300, message: 'You exceeded the length' },
          })}
          id="code"
          rows={20}
          placeholder="enter your code here"
        />

        {errors.code && <p>{errors.code.message}</p>}
        <button type="submit">submit</button>
      </form>
      <div className="highlighted">
        {watchCode ? (
          <EditorPage languages={languages} selectedLangId={watchLanguage} code={watchCode} />
        ) : (
          'start typing and see the magic'
        )}
      </div>
    </div>
  );
}
