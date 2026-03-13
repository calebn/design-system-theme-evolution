import { useEffect, useState } from 'react';

/**
 * Static/CSS-animated button illustrations for the Phase 1 horizontal slides.
 * These are NOT live theme-aware — they use hard-coded styles to tell the story.
 */

export type SlideButtonVariant =
  | 'single'
  | 'scattered'
  | 'searching'
  | 'split'
  | 'variants'
  | 'annotated-hard'
  | 'annotated-tokens';

interface SlideButtonVisualProps {
  variant: SlideButtonVariant;
  /** Pass an ever-incrementing value to force remount and restart animations */
  animationKey?: number;
}

const BASE_BTN: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
  fontWeight: 600,
  cursor: 'default',
  border: 'none',
  userSelect: 'none',
  whiteSpace: 'nowrap',
};

const BLUE_BTN: React.CSSProperties = {
  ...BASE_BTN,
  background: '#1E6AFE',
  color: '#fff',
  borderRadius: 8,
  padding: '14px 32px',
  fontSize: '1rem',
};

export function SlideButtonVisual({ variant }: SlideButtonVisualProps) {
  if (variant === 'single') return <SingleButton />;
  if (variant === 'scattered') return <ScatteredButtons />;
  if (variant === 'searching') return <SearchingButtons />;
  if (variant === 'split') return <SplitButtons />;
  if (variant === 'variants') return <VariantButtons />;
  if (variant === 'annotated-hard') return <AnnotatedButton tokenStyle={false} />;
  if (variant === 'annotated-tokens') return <AnnotatedButton tokenStyle />;
  return null;
}

/* ---- Single centered button ---- */
function SingleButton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <button style={{ ...BLUE_BTN, fontSize: '1.25rem', padding: '18px 48px' }}>
        Get Started
      </button>
    </div>
  );
}

/* ---- Scattered copy-paste drift buttons ---- */
const DRIFTED: { style: React.CSSProperties; label: string }[] = [
  { style: { background: '#1E6AFE', borderRadius: 8, fontSize: '0.95rem', padding: '12px 28px' }, label: 'Homepage' },
  { style: { background: '#1a5fe0', borderRadius: 4, fontSize: '1.05rem', padding: '14px 30px' }, label: 'Pricing' },
  { style: { background: '#2B7EFF', borderRadius: 12, fontSize: '0.9rem', padding: '10px 24px' }, label: 'Campaign A' },
  { style: { background: '#1659cc', borderRadius: 6, fontSize: '1rem', padding: '16px 36px', letterSpacing: '0.02em' }, label: 'Promo page' },
  { style: { background: '#0d4fc8', borderRadius: 3, fontSize: '0.88rem', padding: '11px 22px' }, label: 'Blog CTA' },
  { style: { background: '#2472f5', borderRadius: 10, fontSize: '1.1rem', padding: '15px 32px' }, label: 'Landing' },
];

function ScatteredButtons() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 20, justifyContent: 'center' }}>
        {DRIFTED.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <button style={{ ...BASE_BTN, color: '#fff', ...d.style }}>{d.label}</button>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>{d.label}</span>
          </div>
        ))}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0, marginTop: 8 }}>
        Same button. 6 pages. 6 versions.
      </p>
    </div>
  );
}

/* ---- Search-and-update animation ---- */

// The uniform "new" style every button settles into after migration
const MIGRATED_STYLE: React.CSSProperties = {
  background: '#1E6AFE',
  borderRadius: 8,
  fontSize: '1rem',
  padding: '12px 28px',
  transition: 'all 0.5s ease',
};

// Each slot: highlight starts at `highlightAt`, button is "done" at `doneAt`
const SLOT_TIMING = [
  { highlightAt: 200,  doneAt: 2000 },
  { highlightAt: 2000, doneAt: 3800 },
  { highlightAt: 3800, doneAt: 5600 },
  { highlightAt: 5600, doneAt: 7400 },
  { highlightAt: 7400, doneAt: 9200 },
  { highlightAt: 9200, doneAt: 11000 },
];

function SearchingButtons() {
  const [migrated, setMigrated] = useState<boolean[]>(Array(6).fill(false));
  const [counter, setCounter] = useState('Pages migrated: 0');

  useEffect(() => {
    const counterLabels = ['Pages migrated: 0', 'Pages migrated: 1', 'Pages migrated: 2',
      'Pages migrated: 3', 'Pages migrated: 4', 'Pages migrated: 5', 'Pages migrated: 6 ✓'];

    const timers: ReturnType<typeof setTimeout>[] = [];

    SLOT_TIMING.forEach(({ doneAt }, i) => {
      // Flip the button to its uniform "migrated" style
      timers.push(window.setTimeout(() => {
        setMigrated(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        // Advance counter label
        setCounter(counterLabels[i + 1]);
      }, doneAt));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 20 }}>
        {DRIFTED.map((d, i) => (
          <div
            key={i}
            // Keep the CSS highlight class only while still being animated
            className={migrated[i] ? undefined : `search-btn-slot search-btn-slot-${i}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <button
              style={{
                ...BASE_BTN,
                color: '#fff',
                // Before: each button has its own drifted style
                // After: all buttons look the same
                ...(migrated[i] ? MIGRATED_STYLE : d.style),
              }}
            >
              {d.label}
            </button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', height: 24 }}>
        {counter}
      </div>
    </div>
  );
}

/* ---- Split two worlds ---- */
function SplitButtons() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            border: '2px dashed rgba(255,255,255,0.25)',
            borderRadius: 12,
            padding: '28px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button style={{ ...BLUE_BTN }}>Buy Now</button>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Skeletor</span>
        </div>
      </div>
      <div style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.2)' }}>⟷</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            border: '2px dashed rgba(255,255,255,0.25)',
            borderRadius: 12,
            padding: '28px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button style={{ ...BLUE_BTN, borderRadius: 4 }}>Buy Now</button>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Content Admin</span>
        </div>
      </div>
    </div>
  );
}

/* ---- 4→3 variant mapping (SM/MD/LG/Super → SM/MD/LG) ---- */
function VariantButtons() {
  const oldSizes = [
    { label: 'SM',    padding: '9px 20px',   fontSize: '0.875rem' },
    { label: 'MD',    padding: '12px 28px',  fontSize: '1rem' },
    { label: 'LG',    padding: '16px 36px',  fontSize: '1.1rem' },
    { label: 'Super', padding: '22px 56px',  fontSize: '1.3rem' },
  ];
  const newSizes = [
    { label: 'SM', padding: '9px 20px',  fontSize: '0.875rem' },
    { label: 'MD', padding: '12px 28px', fontSize: '1rem' },
    { label: 'LG', padding: '16px 36px', fontSize: '1.1rem' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Before</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {oldSizes.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button style={{ ...BASE_BTN, ...BLUE_BTN, padding: s.padding, fontSize: s.fontSize }}>
                Buy
              </button>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>↓ Redesign</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>After</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {newSizes.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button style={{ ...BASE_BTN, ...BLUE_BTN, padding: s.padding, fontSize: s.fontSize }}>
                Buy
              </button>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
            </div>
          ))}
          {/* Super: no longer exists, shown as a prominent ghost */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                ...BASE_BTN,
                padding: '22px 56px',
                fontSize: '1.3rem',
                border: '2px dashed rgba(255,100,100,0.7)',
                background: 'rgba(255,100,100,0.06)',
                color: 'rgba(255,100,100,0.7)',
                borderRadius: 8,
                position: 'relative',
              }}
            >
              Buy
              <span
                style={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  background: 'rgba(220,38,38,0.9)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                ?
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255,100,100,0.7)' }}>Super → ?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Annotated button (hard-coded values vs token names) ---- */
function AnnotatedButton({ tokenStyle }: { tokenStyle: boolean }) {
  const annotations = tokenStyle
    ? [
        { label: 'var(--color-primary)', side: 'right' as const, top: '20%' },
        { label: 'var(--dimension-radius-md)', side: 'left' as const, top: '50%' },
        { label: 'var(--font-body)', side: 'right' as const, top: '80%' },
      ]
    : [
        { label: '#1E6AFE', side: 'right' as const, top: '20%' },
        { label: 'border-radius: 8px', side: 'left' as const, top: '50%' },
        { label: "font-family: 'Source Sans 3'", side: 'right' as const, top: '80%' },
      ];

  return (
    <div style={{ position: 'relative', width: 480, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        style={{
          ...BLUE_BTN,
          fontSize: '1.2rem',
          padding: '18px 48px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        Get Started
      </button>
      {annotations.map((ann, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: ann.top,
            [ann.side]: ann.side === 'left' ? 0 : 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexDirection: ann.side === 'left' ? 'row' : 'row-reverse',
          }}
        >
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              color: tokenStyle ? 'rgba(120,220,120,0.9)' : 'rgba(255,200,100,0.8)',
              background: tokenStyle ? 'rgba(40,80,40,0.6)' : 'rgba(80,60,20,0.6)',
              padding: '3px 8px',
              borderRadius: 4,
              border: `1px solid ${tokenStyle ? 'rgba(120,220,120,0.3)' : 'rgba(255,200,100,0.3)'}`,
              whiteSpace: 'nowrap',
            }}
          >
            {ann.label}
          </span>
          <div
            style={{
              width: 32,
              height: 1,
              background: tokenStyle ? 'rgba(120,220,120,0.4)' : 'rgba(255,200,100,0.4)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
