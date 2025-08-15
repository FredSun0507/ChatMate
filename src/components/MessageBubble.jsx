import React from 'react';
import CodeBlock from './CodeBlock';

  const formatText = (text) => {
  // ✅ Handle base64 images
  const imageRegex = /\[IMAGE_START\](.*?)\[IMAGE_END\]/gs;
  text = text.replace(imageRegex, (match, base64) => {
    const src = `data:image/png;base64,${base64.trim()}`;
    return `<img src="${src}" alt="Generated Image" class="chat-image"/>`;
  });
  // ✅ Normalize line endings and remove excessive blank lines
  text = text.replace(/\r\n|\r/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  // ✅ Parse fenced code blocks (```code```)
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${language}>${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });
  // ✅ Parse blockquotes
  text = text.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  // ✅ Headings
  text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  // ✅ Horizontal rules
  text = text.replace(/^---$/gm, '<hr>');
  // ✅ Bold (**text**) and italic (*text*)
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // ✅ Emoji rendering using colon syntax (:smile:)
  const emojiMap = {
    smile: "😄",
    sad: "😢",
    heart: "❤️",
    thumbs_up: "👍",
    fire: "🔥",
    check: "✅",
    x: "❌",
    star: "⭐",
    rocket: "🚀",
    warning: "⚠️",
  };
  text = text.replace(/:([a-z0-9_+-]+):/g, (match, name) => emojiMap[name] || match);
  // ✅ Unordered list (bullets)
  const listify = (lines, tag) =>
    `<${tag}>` +
    lines.map(item => `<li>${item.replace(/^(\-|\d+\.)\s*/, '').trim()}</li>`).join('') +
    `</${tag}>`;
  text = text.replace(
    /((?:^[-*] .+(?:\n|$))+)/gm,
    (match) => listify(match.trim().split('\n'), 'ul')
  );
  // ✅ Ordered list (fix separate `1.` items issue)
  text = text.replace(/^(\d+\. .+)$/gm, '__ORDERED__START__$1__ORDERED__END__');
  text = text.replace(
    /__ORDERED__START__(\d+\. .+?)__ORDERED__END__/gs,
    (_, line) => `<ol><li>${line.replace(/^\d+\.\s*/, '')}</li></ol>`
  );
  text = text.replace(/<\/ol>\s*<ol>/g, '');
  // ✅ Markdown-style tables
  text = text.replace(
    /^\|(.+?)\|\n\|([-:| ]+)\|\n((?:\|.*\|\n?)*)/gm,
    (_, headerRow, dividerRow, bodyRows) => {
      const headers = headerRow.split('|').map(h => `<th>${h.trim()}</th>`).join('');
      const rows = bodyRows.trim().split('\n').map(r =>
        '<tr>' + r.split('|').map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>'
      ).join('');
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );
  // ✅ Paragraphs and line breaks inside paragraphs
  const blocks = text.split(/\n{2,}/).map(block => {
    if (
      block.startsWith('<h3>') ||
      block.startsWith('<hr>') ||
      block.startsWith('<ul>') ||
      block.startsWith('<ol>') ||
      block.startsWith('<table>') ||
      block.startsWith('<pre>') ||
      block.startsWith('<blockquote>') ||
      block.startsWith('<img')
    ) {
      return block;
    } else {
      return `<p>${block.trim().replace(/\n/g, '<br>')}</p>`;
    }
  });
  return blocks.join('\n');
};

export default function MessageBubble({ role, content, time }) {
  return (
    <div className={`message ${role}`}>
      <div className="bubble">
        <FormattedContent content={content} />
        <div className="timestamp">{time}</div>
      </div>
    </div>
  );
}

function FormattedContent({ content }) {
  const blocks = content.split('```');

  return (
    <>
      {blocks.map((block, i) =>
        i % 2 === 1 ? (
          <CodeBlock key={i} content={block} />
        ) : (
          <div
            key={i}
            className="formatted-text"
            dangerouslySetInnerHTML={{ __html: formatText(block) }}
          />
        )
      )}
    </>
  );
}
