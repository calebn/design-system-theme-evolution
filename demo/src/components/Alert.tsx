/**
 * Alert — brand-agnostic, CSS-var driven.
 * Uses semantic color tokens: --color-danger, --color-warning, --color-success.
 * No hue names. Each brand provides its own values for these tokens.
 */

type AlertVariant = 'danger' | 'warning' | 'success' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

const ICONS: Record<AlertVariant, string> = {
  danger: '✖',
  warning: '⚠',
  success: '✓',
  info: 'ℹ',
};

export function Alert({ variant, title, children }: AlertProps) {
  const isInfo = variant === 'info';
  const colorVar = isInfo ? 'var(--color-secondary)' : `var(--color-${variant})`;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        gap: 'var(--dimension-spacing-sm)',
        padding: 'var(--dimension-spacing-sm) var(--dimension-spacing-md)',
        borderRadius: 'var(--dimension-radius-md)',
        borderLeft: `4px solid ${colorVar}`,
        backgroundColor: 'var(--color-surface-muted)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <span
        style={{
          color: colorVar,
          fontSize: '1rem',
          lineHeight: 1.5,
          flexShrink: 0,
          fontWeight: 700,
        }}
      >
        {ICONS[variant]}
      </span>
      <div>
        {title && (
          <p
            style={{
              margin: '0 0 2px',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: colorVar,
            }}
          >
            {title}
          </p>
        )}
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-on-surface)', opacity: 0.85 }}>
          {children}
        </p>
      </div>
    </div>
  );
}
