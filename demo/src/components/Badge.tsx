/**
 * Badge — brand-agnostic, CSS-var driven.
 */

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const BG: Record<BadgeVariant, string> = {
  primary:   'var(--color-primary, hotpink)',
  secondary: 'var(--color-secondary)',
  success:   'var(--color-success)',
  warning:   'var(--color-warning)',
  danger:    'var(--color-danger)',
  neutral:   'var(--color-surface-muted)',
};

const FG: Record<BadgeVariant, string> = {
  primary:   'var(--color-on-primary, #fff)',
  secondary: 'var(--color-on-primary)',
  success:   'var(--color-on-primary)',
  warning:   'var(--color-on-surface)',
  danger:    'var(--color-on-primary)',
  neutral:   'var(--color-on-surface)',
};

export function Badge({ children, variant = 'primary' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px var(--dimension-spacing-sm)',
        borderRadius: 'var(--dimension-radius-full)',
        backgroundColor: BG[variant],
        color: FG[variant],
        fontFamily: 'var(--font-caption)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
}
