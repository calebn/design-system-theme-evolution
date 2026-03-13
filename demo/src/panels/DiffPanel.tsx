/**
 * DiffPanel — shows the token changelog between two selected versions,
 * with semver classification. Uses pre-computed diff data embedded at
 * build time so it works without a Node.js runtime in the browser.
 */

interface TokenChange {
  path: string;
  type: 'unchanged' | 'restyle' | 'added' | 'removed';
  oldValue?: unknown;
  newValue?: unknown;
}

interface BrandDiff {
  brand: string;
  changes: TokenChange[];
  semverBump: 'none' | 'patch' | 'minor' | 'major';
}

interface DiffData {
  fromVersion: string;
  toVersion: string;
  brands: BrandDiff[];
  contractMismatches: string[];
  overallBump: 'none' | 'patch' | 'minor' | 'major';
  isBreaking: boolean;
}

// Pre-computed diff data (generated at build time to avoid Node.js in browser)
import { DIFF_DATA } from '../diff-data';

interface DiffPanelProps {
  fromVersion: string;
  toVersion: string;
}

const BUMP_COLORS: Record<string, string> = {
  none: '#888',
  patch: '#2563eb',
  minor: '#d97706',
  major: '#dc2626',
};

const BUMP_LABELS: Record<string, string> = {
  none: 'No change',
  patch: 'PATCH',
  minor: 'MINOR',
  major: '⚠ MAJOR / BREAKING',
};

const CHANGE_ICONS: Record<string, string> = {
  restyle: '~',
  added: '+',
  removed: '✖',
};

const CHANGE_LABELS: Record<string, string> = {
  restyle: 'restyled',
  added: 'added',
  removed: 'removed',
};

const CHANGE_COLORS: Record<string, string> = {
  restyle: '#2563eb',
  added: '#16a34a',
  removed: '#dc2626',
};

export function DiffPanel({ fromVersion, toVersion }: DiffPanelProps) {
  const key = `${fromVersion}->${toVersion}`;
  const data: DiffData | undefined = DIFF_DATA[key];

  if (!data) {
    return (
      <div
        style={{
          color: 'var(--color-on-surface)',
          opacity: 0.5,
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
        }}
      >
        No diff available for {fromVersion} → {toVersion}
      </div>
    );
  }

  const bumpColor = BUMP_COLORS[data.overallBump] ?? '#888';

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          {fromVersion}
        </span>
        <span style={{ color: 'var(--color-on-surface)', opacity: 0.4 }}>→</span>
        <span
          style={{
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            backgroundColor: 'var(--color-surface-muted)',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          {toVersion}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: bumpColor,
            backgroundColor: `${bumpColor}18`,
            padding: '3px 10px',
            borderRadius: 20,
            border: `1px solid ${bumpColor}44`,
          }}
        >
          {BUMP_LABELS[data.overallBump]}
        </span>
      </div>

      {data.brands.map((bd) => {
        const nonTrivial = bd.changes.filter((c) => c.type !== 'unchanged');
        return (
          <div key={bd.brand} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-on-surface)',
                opacity: 0.45,
                marginBottom: 4,
              }}
            >
              {bd.brand}
            </div>
            {nonTrivial.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-on-surface)', opacity: 0.4 }}>
                No changes
              </div>
            ) : (
              <div
                style={{
                  border: '1px solid var(--color-surface-muted)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                {nonTrivial.map((c) => (
                  <div
                    key={c.path}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '16px 1fr',
                      gap: 8,
                      padding: '5px 10px',
                      borderBottom: '1px solid var(--color-surface-muted)',
                      alignItems: 'start',
                      backgroundColor: 'var(--color-surface)',
                    }}
                  >
                    <span
                      aria-label={CHANGE_LABELS[c.type]}
                      style={{ color: CHANGE_COLORS[c.type], fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      <span aria-hidden="true">{CHANGE_ICONS[c.type]}</span>
                    </span>
                    <div>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          color: 'var(--color-on-surface)',
                        }}
                      >
                        {c.path}
                      </span>
                      {c.type === 'restyle' && (
                        <div style={{ fontSize: '0.875rem', marginTop: 3 }}>
                          <span style={{ color: '#dc2626' }}>{JSON.stringify(c.oldValue)}</span>
                          <span style={{ color: '#94a3b8', margin: '0 6px' }}>→</span>
                          <span style={{ color: '#16a34a' }}>{JSON.stringify(c.newValue)}</span>
                        </div>
                      )}
                      {c.type === 'added' && (
                        <div style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: 3 }}>
                          {JSON.stringify(c.newValue)}
                        </div>
                      )}
                      {c.type === 'removed' && (
                        <div
                          style={{
                            fontSize: '0.875rem',
                            marginTop: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: '#fecaca',
                              color: '#991b1b',
                              padding: '1px 6px',
                              borderRadius: 3,
                            }}
                          >
                            Deleted
                          </span>
                          <span style={{ color: '#dc2626' }}>{JSON.stringify(c.oldValue)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {data.contractMismatches.length > 0 && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 12px',
            backgroundColor: '#fef2f2',
            borderRadius: 6,
            border: '1px solid #fca5a5',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
            Brand contract violations
          </div>
          {data.contractMismatches.map((m, i) => (
            <div key={i} style={{ fontSize: '0.75rem', color: '#b91c1c' }}>
              • {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
