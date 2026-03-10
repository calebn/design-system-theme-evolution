/**
 * TokenInspector — reads the live CSS custom property values from the DOM
 * and displays them in a table. Proves that the components are consuming
 * real CSS variables (not hardcoded values) and that swapping the brand
 * changes those values in real time.
 */

import { useEffect, useState } from 'react';

const WATCHED_VARS = [
  '--color-primary',
  '--color-primary-light',
  '--color-primary-dark',
  '--color-secondary',
  '--color-surface',
  '--color-surface-muted',
  '--color-on-surface',
  '--color-on-primary',
  '--color-danger',
  '--color-warning',
  '--color-success',
  '--font-heading',
  '--font-body',
  '--dimension-radius-md',
  '--dimension-spacing-md',
];

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';
}

function ColorSwatch({ value }: { value: string }) {
  const isColor = value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
  if (!isColor) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 3,
        backgroundColor: value,
        border: '1px solid rgba(0,0,0,0.15)',
        verticalAlign: 'middle',
        marginRight: 6,
        flexShrink: 0,
      }}
    />
  );
}

interface TokenInspectorProps {
  brand: string;
  version: string;
  /** Incremented by App.tsx after the theme CSS link fires its load event. */
  cssLoadKey: number;
}

export function TokenInspector({ brand, version, cssLoadKey }: TokenInspectorProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const v of WATCHED_VARS) {
      next[v] = readCssVar(v);
    }
    setValues(next);
  // cssLoadKey only increments after the <link> load event fires, so the CSS
  // for the current brand+version is guaranteed to be applied when this runs.
  }, [cssLoadKey]);

  const cellStyle: React.CSSProperties = {
    padding: '5px 10px',
    fontSize: '0.78rem',
    fontFamily: 'monospace',
    borderBottom: '1px solid var(--color-surface-muted)',
    color: 'var(--color-on-surface)',
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--color-on-surface)',
          opacity: 0.5,
          margin: '0 0 8px',
        }}
      >
        Live CSS Variables — [{brand}] v{version}
      </h3>
      <div
        style={{
          border: '1px solid var(--color-surface-muted)',
          borderRadius: 'var(--dimension-radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-muted)' }}>
              <th style={{ ...cellStyle, textAlign: 'left', fontWeight: 700 }}>Token</th>
              <th style={{ ...cellStyle, textAlign: 'left', fontWeight: 700 }}>Resolved value</th>
            </tr>
          </thead>
          <tbody>
            {WATCHED_VARS.map((v) => (
              <tr key={v}>
                <td style={cellStyle}>{v}</td>
                <td style={{ ...cellStyle, display: 'flex', alignItems: 'center' }}>
                  <ColorSwatch value={values[v] ?? ''} />
                  {values[v] ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
