interface SectionProps {
  step?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tinted?: boolean;
  id?: string;
}

export function Section({ step, title, subtitle, children, tinted = false, id }: SectionProps) {
  return (
    <section
      id={id}
      style={{
        padding: '56px 0',
        backgroundColor: tinted ? '#f8f9fb' : '#fff',
        borderBottom: '1px solid #eaedf2',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: subtitle ? 4 : 20 }}>
          {step !== undefined && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                color: '#fff',
                fontSize: '0.75rem',
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
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p
            style={{
              margin: '0 0 24px',
              paddingLeft: step !== undefined ? 42 : 0,
              fontSize: '1rem',
              color: '#64748b',
              lineHeight: 1.6,
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
