import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import { detectLanguage } from '../utils/languageDetect';

// Prism core styles and plugins
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

// Required languages
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-dart';

export default function CodeBlock({ content }) {
  const codeRef = useRef(null);

 

  const lines = content.split('\n');
  const firstLine = lines[0].trim();
  const hasLang = /^[a-zA-Z]+$/.test(firstLine);
  const lang = hasLang ? firstLine.toLowerCase() : detectLanguage(content) || 'markdown';
  const code = hasLang ? lines.slice(1).join('\n') : content;
  //const escapedCode = escapeHTML(code);

    useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="code-block-wrapper" style={{ position: 'relative', marginBottom: '1rem' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          zIndex: 5,
          fontSize: '12px',
          padding: '4px 8px',
          cursor: 'pointer',
        }}
      >
        Copy
      </button>
      <div style={{ fontSize: '13px', color: '#ccc', paddingBottom: '5px' }}>
        {lang.toUpperCase()}
      </div>
      <pre
        className={`line-numbers language-${lang}`}
        style={{ borderRadius: '8px', overflowX: 'auto' }}
      >
        <code
          ref={codeRef}
          className={`language-${lang}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );

}
