import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import theme from 'react-syntax-highlighter/dist/cjs/styles/prism/dracula';
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('php', php);
const EditorPage = ({ code, languages, selectedLangId }) => {
  const lang = languages?.filter((item) => item.id === selectedLangId)[0]?.name;
  return (
    <>
      <span className="langBadge">{lang ? lang : 'no language selected'}</span>
      <SyntaxHighlighter
        style={theme}
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
          minHeight: '380px',
        }}
      >
        {code ? code : 'start typing yoo!'}
      </SyntaxHighlighter>
    </>
  );
};
export default EditorPage;
