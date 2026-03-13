import { useEffect, useState } from 'react';
import { Brand, Version } from '../types';

interface StickyControlsProps {
  brand: Brand;
  setBrand: (b: Brand) => void;
  version: Version;
  setVersion: (v: Version) => void;
  showVersion?: boolean;
}

const VERSIONS: Version[] = ['1.0.0', '1.1.0', '2.0.0'];

export function StickyControls({
  brand,
  setBrand,
  version,
  setVersion,
  showVersion,
}: StickyControlsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('sticky-sentinel');
    if (!sentinel) return;

    let hasBeenOnScreen = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenOnScreen = true;
          setVisible(false);
        } else if (hasBeenOnScreen) {
          const rect = sentinel.getBoundingClientRect();
          if (rect.top < 0) setVisible(true);
        }
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  const pill = (active: boolean): React.CSSProperties => ({
    padding: '4px 14px',
    borderRadius: 5,
    border: active ? '2px solid #1e293b' : '2px solid #e2e8f0',
    backgroundColor: active ? '#1e293b' : '#fff',
    color: active ? '#fff' : '#475569',
    fontSize: '0.78rem',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    transition: 'background 0.12s, color 0.12s, border-color 0.12s',
  });

  return (
    <nav
      aria-label="Theme controls"
      className="sticky-controls"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '8px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        animation: 'slideDown 0.2s ease-out',
      }}
    >
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#64748b',
        }}
      >
        Brand
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        {(['logos', 'verbum'] as Brand[]).map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            aria-pressed={brand === b}
            style={pill(brand === b)}
          >
            {b === 'logos' ? 'Logos' : 'Verbum'}
          </button>
        ))}
      </div>

      {showVersion && (
        <>
          <div style={{ width: 1, height: 20, backgroundColor: '#e2e8f0' }} />
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748b',
            }}
          >
            Version
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {VERSIONS.map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                aria-pressed={version === v}
                style={pill(version === v)}
              >
                {v}
              </button>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}
