/**
 * Button — brand-agnostic, CSS-var driven.
 * No brand logic. No theme imports. No ThemeProvider.
 * The same markup renders correctly for any [data-brand] on a parent.
 */

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    lineHeight: 1,
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'opacity 0.15s, transform 0.1s',
    borderRadius: 'var(--dimension-radius-lg)',
    whiteSpace: 'nowrap',
    // --color-accent transparent fallback makes the ring invisible when the token doesn't exist
    boxShadow: '0 3px 0 var(--color-accent, transparent)',
  },
  sm: { padding: 'var(--dimension-spacing-xs) var(--dimension-spacing-sm)', fontSize: '0.8rem' },
  md: { padding: 'var(--dimension-spacing-sm) var(--dimension-spacing-md)', fontSize: '0.9rem' },
  lg: { padding: 'var(--dimension-spacing-sm) var(--dimension-spacing-lg)', fontSize: '1rem' },
  primary: {
    backgroundColor: 'var(--color-primary, hotpink)',
    color: 'var(--color-on-primary, #fff)',
    borderColor: 'var(--color-primary, hotpink)',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary, hotpink)',
    borderColor: 'var(--color-primary, hotpink)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-on-surface)',
    borderColor: 'transparent',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        ...styles.base,
        ...styles[size],
        ...styles[variant],
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {children}
    </button>
  );
}
