import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Prism?: { highlightElement: (el: Element) => void };
  }
}

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  highlights?: number[];
  maxHeight?: number;
}

export function CodeBlock({ code, language, title, highlights, maxHeight }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const lines = code.split('\n');
  const highlightSet = new Set(highlights ?? []);

  const rendered = highlights?.length
    ? lines
        .map((line, i) => {
          const lineNum = i + 1;
          if (highlightSet.has(lineNum)) {
            return `<mark class="code-highlight">${escapeHtml(line)}</mark>`;
          }
          return escapeHtml(line);
        })
        .join('\n')
    : undefined;

  return (
    <div
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        fontSize: '0.85rem',
        lineHeight: 1.65,
      }}
    >
      {title && (
        <div
          style={{
            padding: '7px 14px',
            backgroundColor: '#f1f5f9',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#475569',
            fontFamily: 'monospace',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          overflow: 'auto',
          backgroundColor: '#1e293b',
          maxHeight: maxHeight ?? 420,
        }}
      >
        {rendered ? (
          <code
            ref={codeRef}
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        ) : (
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        )}
      </pre>
    </div>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
