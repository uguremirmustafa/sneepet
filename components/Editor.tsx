import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import { materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism';
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('php', php);
const EditorPage = ({ code, languages, selectedLangId }) => {
  const lang = languages.filter((item) => item.id === selectedLangId)[0]?.name;
  return (
    <SyntaxHighlighter
      style={materialOceanic}
      wrapLines={true}
      language={lang}
      lineProps={{ style: { wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
      customStyle={{
        borderRadius: '8px',
        padding: '20px 20px',
        fontSize: '13px',
        boxShadow: '0px 1px 30px -3px rgba(1,1,1,0.1)',
        width: '100%',
        fontWeight: '600',
        fontFamily: 'Nunito',
        minHeight: '600px',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};
export default EditorPage;
