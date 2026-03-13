import { useState } from 'react';

interface SectionProps {
  step?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tinted?: boolean;
  id?: string;
}

function CopyLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      className="section-anchor-link"
      aria-label="Copy link to this section"
      title={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? '✓' : '#'}
    </a>
  );
}

export function Section({ step, title, subtitle, children, tinted = false, id }: SectionProps) {
  return (
    <section
      id={id}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 0',
        backgroundColor: tinted ? '#f8f9fb' : '#fff',
        borderBottom: '1px solid #eaedf2',
        scrollSnapAlign: 'start',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: subtitle ? 4 : 20 }}>
          {step !== undefined && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {step}
            </span>
          )}
          <h2
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>
          {id && <CopyLink id={id} />}
        </div>
        {subtitle && (
          <p
            style={{
              margin: '0 0 28px',
              paddingLeft: step !== undefined ? 46 : 0,
              fontSize: '1.1rem',
              color: '#64748b',
              lineHeight: 1.65,
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
