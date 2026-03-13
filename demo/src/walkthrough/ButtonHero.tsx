import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';

interface ButtonHeroProps {
  brand: string;
  cssLoadKey: number;
  showTokens?: boolean;
  /** Render at 1x scale instead of 1.4x — for use inside diagrams/cards */
  compact?: boolean;
}

const TOKEN_PROPS = [
  { name: '--color-primary', label: 'color-primary' },
  { name: '--color-accent', label: 'color-accent' },
  { name: '--color-on-primary', label: 'color-on-primary' },
  { name: '--dimension-radius-lg', label: 'radius-lg' },
  { name: '--font-body', label: 'font-body' },
];

export function ButtonHero({
  brand,
  cssLoadKey,
  showTokens = true,
  compact = false,
}: ButtonHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cs = getComputedStyle(container);
    const values: Record<string, string> = {};
    TOKEN_PROPS.forEach(({ name }) => {
      values[name] = cs.getPropertyValue(name).trim() || '(unset)';
    });
    setTokenValues(values);
  }, [brand, cssLoadKey]);

  return (
    <div
      ref={containerRef}
      data-brand={brand}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}
    >
      <div style={compact ? undefined : { transform: 'scale(1.4)', transformOrigin: 'center' }}>
        <Button size="lg" variant="primary">
          Get Started
        </Button>
      </div>

      {showTokens && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '16px 24px',
            minWidth: 0,
            width: '100%',
            maxWidth: 320,
          }}
        >
          {TOKEN_PROPS.map(({ name, label }) => (
            <div
              key={name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 24,
                fontSize: '0.8rem',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
              <span style={{ color: '#7dd3fc' }}>{tokenValues[name] ?? '…'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
