import { CodeBlock } from './CodeBlock';

interface SideBySideProps {
  left: { title: string; code: string; language: string; highlights?: number[] };
  right: { title: string; code: string; language: string; highlights?: number[] };
  maxHeight?: number;
}

export function SideBySide({ left, right, maxHeight }: SideBySideProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 12,
      }}
    >
      <CodeBlock
        code={left.code}
        language={left.language}
        title={left.title}
        highlights={left.highlights}
        maxHeight={maxHeight}
      />
      <CodeBlock
        code={right.code}
        language={right.language}
        title={right.title}
        highlights={right.highlights}
        maxHeight={maxHeight}
      />
    </div>
  );
}
