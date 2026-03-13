/**
 * Card — brand-agnostic, CSS-var driven.
 */

interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  elevated?: boolean;
}

export function Card({ title, description, children, elevated = false }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--dimension-radius-lg)',
        padding: 'var(--dimension-spacing-lg)',
        boxShadow: elevated ? 'var(--shadow-elevated)' : 'var(--shadow-card)',
        border: '1px solid var(--color-surface-muted)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-on-surface)',
          margin: '0 0 var(--dimension-spacing-xs)',
          fontSize: '1.1rem',
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-on-surface)',
            opacity: 0.7,
            margin: '0 0 var(--dimension-spacing-md)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
