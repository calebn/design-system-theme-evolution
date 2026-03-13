type Role = 'designer' | 'developer' | 'manager' | 'info';

interface CalloutProps {
  role?: Role;
  children: React.ReactNode;
}

const ROLE_CONFIG: Record<Role, { icon: string; label: string; accent: string; bg: string }> = {
  designer: { icon: '🎨', label: 'For designers', accent: '#7c3aed', bg: '#f5f3ff' },
  developer: { icon: '⌨️', label: 'For developers', accent: '#0369a1', bg: '#f0f9ff' },
  manager: { icon: '📊', label: 'For managers', accent: '#b45309', bg: '#fffbeb' },
  info: { icon: '💡', label: 'Key insight', accent: '#475569', bg: '#f8fafc' },
};

export function Callout({ role = 'info', children }: CalloutProps) {
  const cfg = ROLE_CONFIG[role];
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '14px 18px',
        borderRadius: 8,
        backgroundColor: cfg.bg,
        borderLeft: `4px solid ${cfg.accent}`,
        margin: '16px 0',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1.5 }}>
        {cfg.icon}
      </span>
      <div>
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: cfg.accent,
            marginBottom: 4,
          }}
        >
          {cfg.label}
        </div>
        <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}
