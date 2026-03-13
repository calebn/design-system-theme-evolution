import { useState, useEffect, useRef } from 'react';

import { HorizontalDeck } from './walkthrough/HorizontalDeck';
import { Slide } from './walkthrough/Slide';
import { SlideButtonVisual } from './walkthrough/SlideButtonVisual';
import { ButtonHero } from './walkthrough/ButtonHero';
import { Section } from './walkthrough/Section';
import { CodeBlock } from './walkthrough/CodeBlock';
import { Callout } from './walkthrough/Callout';
import { StickyControls } from './walkthrough/StickyControls';
import { TerminalBlock } from './walkthrough/TerminalBlock';
import { TokenInspector } from './panels/TokenInspector';
import { DiffPanel } from './panels/DiffPanel';

import { versionedCss } from './token-css-strings';

const LOGOS_COMPACT_CSS = `[data-brand="logos"] {
  --color-primary:       #1E6AFE;
  --color-on-primary:    #FFFFFF;
  --color-accent:        #3640B8;
  --color-surface:       #FFFFFF;
  --font-heading:        Georgia, serif;
  --font-body:           'Source Sans 3', sans-serif;
  --dimension-radius-md: 8px;
  /* ... 12 more tokens */
}

/* Verbum uses the same structure — different brand values */`;

type Brand = 'logos' | 'verbum';
type Version = '1.0.0' | '1.1.0' | '2.0.0';

const SLIDE_IDS = [
  'title',
  'content-admin-era',
  'theme-cost',
  'two-worlds',
  'builder-era',
  'storybook',
  'better-not-solved',
  'system-problem',
  'the-bridge',
];

const SECTION_IDS = [
  'design-token',
  'two-brands',
  'design-evolves',
  'breaking-change',
  'safety-net',
  'full-pipeline',
  'for-you',
  'the-ask',
];

// Drifted buttons re-used in the CTA "Today" card
const DRIFTED_STYLES: React.CSSProperties[] = [
  { background: '#1E6AFE', borderRadius: 8,  padding: '10px 22px', fontSize: '0.9rem' },
  { background: '#1a5fe0', borderRadius: 3,  padding: '12px 26px', fontSize: '1rem' },
  { background: '#2B7EFF', borderRadius: 12, padding: '8px 18px',  fontSize: '0.85rem' },
  { background: '#1659cc', borderRadius: 6,  padding: '13px 30px', fontSize: '0.95rem', letterSpacing: '0.02em' },
];

export function App() {
  const [brand, setBrand] = useState<Brand>('logos');
  const [version, setVersion] = useState<Version>('1.0.0');
  const [cssLoadKey, setCssLoadKey] = useState(0);
  const [presentationStarted, setPresentationStarted] = useState(false);

  useEffect(() => {
    const css = versionedCss[version]?.[brand] ?? '';

    // Find the existing element (may be a <link> from index.html on first mount
    // or a <style> we created on a previous switch).
    const existing = document.getElementById('theme-css');

    if (existing && existing.tagName === 'STYLE') {
      // Fast path: just overwrite content — fully synchronous, zero flash.
      (existing as HTMLStyleElement).textContent = css;
    } else {
      // First mount: replace the initial <link> with a <style> that has the
      // same content. Both elements carry identical CSS so the swap is invisible.
      const style = document.createElement('style');
      style.id = 'theme-css';
      style.textContent = css;
      if (existing) {
        existing.replaceWith(style);
      } else {
        document.head.appendChild(style);
      }
    }

    document.documentElement.setAttribute('data-brand', brand);
    setCssLoadKey((k) => k + 1);
  }, [brand, version]);

  // Dismiss fullscreen overlay on any key press too
  useEffect(() => {
    if (presentationStarted) return;
    const handler = () => setPresentationStarted(true);
    window.addEventListener('keydown', handler, { once: true });
    return () => window.removeEventListener('keydown', handler);
  }, [presentationStarted]);

  // On initial load: if the hash points to a vertical section, jump to the last
  // horizontal slide (releasing the scroll lock) then scroll to the section.
  const didHandleInitialHash = useRef(false);
  useEffect(() => {
    if (didHandleInitialHash.current) return;
    didHandleInitialHash.current = true;
    const hash = window.location.hash.slice(1);
    if (!SECTION_IDS.includes(hash)) return;
    // Go to last slide instantly so overflowY is released
    const track = document.querySelector('.horizontal-deck-track') as HTMLElement | null;
    if (track) {
      track.scrollLeft = (SLIDE_IDS.length - 1) * window.innerWidth;
    }
    // Scroll to section after a brief render tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'auto' });
      });
    });
  }, []);

  // Update URL hash as vertical sections scroll into the center of the viewport.
  // Also auto-reset v2.0.0 when the safety-net section comes into view (broken tokens
  // would confuse the "safe vs breaking" comparison that section is demonstrating).
  const versionRef = useRef(version);
  useEffect(() => { versionRef.current = version; }, [version]);

  useEffect(() => {
    const targets = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            history.replaceState(null, '', `#${entry.target.id}`);
            if (entry.target.id === 'safety-net' && versionRef.current === '2.0.0') {
              setVersion('1.0.0');
            }
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const enterPresentation = () => {
    setPresentationStarted(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const inlinePill = (active: boolean): React.CSSProperties => ({
    padding: '6px 18px',
    borderRadius: 6,
    border: active ? '2px solid #1e293b' : '2px solid #e2e8f0',
    backgroundColor: active ? '#1e293b' : '#fff',
    color: active ? '#fff' : '#475569',
    fontSize: '0.95rem',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    transition: 'all 0.12s',
  });

  const darkCard: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: 16,
    padding: '40px 32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div>
      {/* ── Fullscreen entry overlay ────────────────────────────────── */}
      {!presentationStarted && (
        <div
          onClick={enterPresentation}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.97)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            color: '#fff',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            A design system story
          </p>
          <h1 style={{ margin: '0 0 40px', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            From Copy-Paste<br />to Source of Truth
          </h1>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 32px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.08)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⛶</span>
            Enter Fullscreen Presentation
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)' }}>
            Press any key to start without fullscreen
          </p>
        </div>
      )}

      <StickyControls
        brand={brand}
        setBrand={setBrand}
        version={version}
        setVersion={setVersion}
        showVersion={false}
      />

      {/* ================================================================
          PHASE 1 — HORIZONTAL NARRATIVE SLIDES
          ================================================================ */}
      <HorizontalDeck slideIds={SLIDE_IDS}>

        {/* SLIDE 1 — TITLE */}
        <Slide>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                A design system story
              </p>
              <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                From Copy-Paste<br />to Source of Truth
              </h1>
              <p style={{ margin: '20px 0 0', fontSize: '1.2rem', color: 'rgba(255,255,255,0.55)', maxWidth: 520 }}>
                How our design system got here, and where it can go
              </p>
            </div>
            <SlideButtonVisual variant="single" />
          </div>
        </Slide>

        {/* SLIDE 2 — CONTENT ADMIN ERA */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                2018 – 2022
              </p>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                The Content<br />Admin Era
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Every page had bespoke inline CSS with hard-coded values',
                  'Components were copy-pasted HTML — no central update path',
                  'Redesigns meant migrating pages one by one on beta.logos.com',
                  'Commerce (Skeletor) and Marketing lived in completely separate stacks',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 2 }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <SlideButtonVisual variant="scattered" />
          </div>
        </Slide>

        {/* SLIDE 3 — THE COST */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,200,100,0.6)' }}>
                The human cost
              </p>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Theme Upgrades<br />Have Cost Us Years
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'L7, L8, L9, L10, Subscription Era — 5 major redesigns since 2018',
                  "I've spent ~2 of my ~6 years here on theme migration work",
                  'Multiply across the team — hundreds of thousands of dollars in manual labor',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(255,200,100,0.5)', flexShrink: 0, marginTop: 2 }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <SlideButtonVisual variant="searching" />
          </div>
        </Slide>

        {/* SLIDE 4 — TWO WORLDS */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Two Worlds,<br />No Bridge
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Commerce (Skeletor) and Marketing were completely separate stacks',
                  'Buttons, product grids, components — duplicated in different tech',
                  'Design wanted consistent product grids everywhere — the systems were too different to share',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 2 }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p style={{ margin: '24px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                Same design intent. Separate implementations. No shared code.
              </p>
            </div>
            <SlideButtonVisual variant="split" />
          </div>
        </Slide>

        {/* SLIDE 5 — ENTER BUILDER.IO */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(100,220,150,0.7)' }}>
                Progress
              </p>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Builder.io:<br />Shared Components
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Marketing and product now use the same component library',
                  'One <Button>, used everywhere',
                  'A central theme that can be updated in one place',
                  'No more tracking down each custom version of a button',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(100,220,150,0.6)', flexShrink: 0, marginTop: 2 }}>✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <SlideButtonVisual variant="single" />
          </div>
        </Slide>

        {/* SLIDE 6 — STORYBOOK (NEW) */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(100,180,255,0.7)' }}>
                Visibility
              </p>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Storybook:<br />Design Can See<br />What's Built
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  "We're adding Storybook so designers can browse every component and variant",
                  'It helps them understand what exists before designing changes',
                  'But visibility alone doesn\'t prevent breaking changes — that still requires a plan',
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(100,180,255,0.5)', flexShrink: 0, marginTop: 2 }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            {/* Mock Storybook preview frame */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 340, height: 210, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex' }}>
                {/* Sidebar */}
                <div style={{ width: 110, background: 'rgba(255,255,255,0.05)', padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Components</div>
                  {['Alert', 'Badge', 'Button', 'Card', 'Input'].map((name) => (
                    <div
                      key={name}
                      style={{
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        borderRadius: 3,
                        background: name === 'Button' ? 'rgba(255,255,255,0.12)' : 'transparent',
                        color: name === 'Button' ? '#fff' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {name}
                    </div>
                  ))}
                  <div style={{ marginTop: 8, fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stories</div>
                  {['Default', 'Secondary', 'Sizes'].map((name) => (
                    <div
                      key={name}
                      style={{
                        fontSize: '0.65rem',
                        padding: '3px 12px',
                        borderRadius: 3,
                        background: name === 'Default' ? 'rgba(100,180,255,0.15)' : 'transparent',
                        color: name === 'Default' ? 'rgba(100,200,255,0.9)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
                {/* Preview area */}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: '#1E6AFE', color: '#fff', borderRadius: 8,
                      padding: '12px 28px', fontSize: '0.95rem', fontWeight: 600,
                      border: 'none', whiteSpace: 'nowrap', cursor: 'default',
                    }}
                  >
                    Get Started
                  </button>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>Button / Default</div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* SLIDE 7 — THE GAP (was Slide 6) */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,160,80,0.7)' }}>
                But...
              </p>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Better, But<br />Not Solved
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'One shared button is great — until the next redesign',
                  'Design drops the Super size. Pages using it have no obvious replacement.',
                  'Every affected page must be found and fixed one by one',
                  "We're back to the same manual migration we started with",
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(255,160,80,0.6)', flexShrink: 0, marginTop: 2 }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <SlideButtonVisual variant="variants" />
          </div>
        </Slide>

        {/* SLIDE 8 — SYSTEM PROBLEM (was Slide 7) */}
        <Slide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 900, width: '100%' }}>
            <div>
              <h2 style={{ margin: '0 0 28px', fontSize: 'clamp(1.8rem, 3vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Designers Don't<br />Think in Breaking<br />Changes
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  "They think about how things should look — not how code references old values",
                  "They don't see every color, spacing value, and variant downstream pages depend on",
                  "They shouldn't have to. That's a system problem, not a people problem.",
                ].map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 2 }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <SlideButtonVisual variant="annotated-hard" />
          </div>
        </Slide>

        {/* SLIDE 9 — THE BRIDGE (was Slide 8) */}
        <Slide>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 40, maxWidth: 800, width: '100%' }}>
            <div>
              <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                What if the design tool itself<br />was the source of truth?
              </h2>
              <p style={{ margin: 0, fontSize: '1.15rem', color: 'rgba(255,255,255,0.55)' }}>
                What if we could know — automatically — when a change would break something?
              </p>
            </div>
            <SlideButtonVisual variant="annotated-tokens" />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div className="scroll-cue-arrow" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.4)' }}>↓</div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Scroll down to see it live
              </p>
            </div>
          </div>
        </Slide>

      </HorizontalDeck>

      {/* ================================================================
          PHASE 2 — VERTICAL SCROLL: INTERACTIVE DEMO
          ================================================================ */}
      <div id="sticky-sentinel" />

      {/* ================================================================
          SECTION 1 — THIS IS A DESIGN TOKEN
          ================================================================ */}
      <Section
        id="design-token"
        title="This is a Design Token"
        subtitle="Every visual property of this button comes from a named, versioned value. Change the value — the button changes. No code edits."
        tinted
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div data-brand={brand} style={darkCard}>
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#475569', lineHeight: 1.7 }}>
              A <strong>design token</strong> is a named design decision stored in a platform-neutral JSON file —
              the format Figma can export directly. A build step then converts it into a{' '}
              <strong>CSS variable</strong> your components use. Two distinct things; one clear handoff.
            </p>

            {/* Token → CSS variable conversion diagram */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'stretch' }}>
              {/* Left: Design Token (JSON) */}
              <div style={{ background: '#0f172a', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>
                  Design Token (JSON)
                </div>
                {[
                  { path: 'color.primary',    value: '#1E6AFE', swatch: '#1E6AFE' },
                  { path: 'color.on-primary', value: '#FFFFFF',  swatch: '#FFFFFF' },
                  { path: 'dimension.radius-md', value: '8px',   swatch: null },
                ].map(({ path, value, swatch }) => (
                  <div key={path} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    <span style={{ color: '#93c5fd' }}>{path}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {swatch && <div style={{ width: 10, height: 10, borderRadius: 2, background: swatch, border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />}
                      <span style={{ color: '#86efac' }}>{value}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 6, fontSize: '0.6rem', color: 'rgba(255,255,255,0.22)', fontStyle: 'italic' }}>
                  The designer's decision · exported from Figma
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0 4px' }}>
                <div style={{ fontSize: '1.1rem', color: '#94a3b8' }}>→</div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center', whiteSpace: 'nowrap' }}>build tool</div>
              </div>

              {/* Right: CSS Variable */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 2 }}>
                  CSS Variable (output)
                </div>
                {[
                  { varName: '--color-primary',    value: '#1E6AFE', swatch: '#1E6AFE' },
                  { varName: '--color-on-primary', value: '#FFFFFF',  swatch: '#FFFFFF' },
                  { varName: '--dimension-radius-md', value: '8px',   swatch: null },
                ].map(({ varName, value, swatch }) => (
                  <div key={varName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    <span style={{ color: '#7c3aed' }}>{varName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {swatch && <div style={{ width: 10, height: 10, borderRadius: 2, background: swatch, border: '1px solid #e2e8f0', flexShrink: 0 }} />}
                      <span style={{ color: '#0369a1' }}>{value}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 6, fontSize: '0.6rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  What the browser uses · one per token
                </div>
              </div>
            </div>

            <Callout role="designer">
              <strong>Your new workflow:</strong> Update a variable in Figma. Export. Done.
              Every surface that references that token updates automatically —
              no ticket, no dev sprint.
            </Callout>

            <p style={{ margin: 0, fontSize: '1rem', color: '#64748b', lineHeight: 1.6 }}>
              Change the value in Figma, re-export, run the build tool, and{' '}
              <em>every surface updates automatically</em> — no component code touched.
            </p>
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 2 — ONE BUTTON, TWO BRANDS
          ================================================================ */}
      <Section
        id="two-brands"
        title="One Button. Two Brands."
        subtitle="Same component. Same code. Completely different brand. Zero JavaScript re-renders — just CSS."
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['logos', 'verbum'] as Brand[]).map((b) => (
              <button key={b} onClick={() => setBrand(b)} style={inlinePill(brand === b)}>
                {b === 'logos' ? 'Logos' : 'Verbum'}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, width: '100%', alignItems: 'center' }}>
            <div data-brand={brand} style={darkCard}>
              <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
            </div>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  borderRadius: 8,
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #475569',
                  margin: '16px 0',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', gap: 12, padding: '14px 18px' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1.5 }}>💡</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', marginBottom: 4 }}>Key insights</div>
                    <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.65 }}>
                      How many lines of JavaScript ran to re-theme? <strong>Zero.</strong> The brand toggle
                      changes a single <code style={{ whiteSpace: 'nowrap' }}>data-brand</code> attribute.
                      The browser's CSS engine does the rest.
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: '#e2e8f0', margin: '0 18px' }} />
                <div style={{ display: 'flex', gap: 12, padding: '14px 18px' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1.5 }}>🌙</span>
                  <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.65 }}>
                    <strong>Bonus:</strong> The same mechanism makes dark mode trivial — just another set
                    of token values under a <code style={{ whiteSpace: 'nowrap' }}>data-theme="dark"</code> selector.
                    Something design has wanted for years becomes essentially free.
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, backgroundColor: 'var(--color-surface, #fff)' }}>
                <div data-brand={brand}>
                  <TokenInspector brand={brand} version={version} cssLoadKey={cssLoadKey} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 3 — DESIGN EVOLVES (VERSION HISTORY)
          ================================================================ */}
      <Section
        id="design-evolves"
        title="Design Evolves"
        subtitle="Each change to a token is automatically classified as safe or breaking. Safe changes ship without developer involvement."
        tinted
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
            Token version
          </span>
          {(['1.0.0', '1.1.0'] as Version[]).map((v) => (
            <button key={v} onClick={() => setVersion(v)} style={inlinePill(version === v)}>
              {v}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div data-brand={brand} style={{ ...darkCard, flexDirection: 'column', gap: 16 }}>
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, minHeight: 26, alignItems: 'center' }}>
              {version === '1.1.0' && (
                <>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(120,220,120,0.9)', background: 'rgba(40,80,40,0.55)', padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(120,220,120,0.3)', whiteSpace: 'nowrap' }}>
                    ~ color-primary shifted
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(100,200,255,0.9)', background: 'rgba(20,60,90,0.55)', padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(100,200,255,0.3)', whiteSpace: 'nowrap' }}>
                    + color-accent added
                  </span>
                </>
              )}
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: '1.05rem', color: '#475569', lineHeight: 1.65 }}>
              <strong>1.0.0 → 1.1.0:</strong> The primary color was restyled. A new accent token was added.
              Two radius tokens were combined into one. Our automated checks classified this as{' '}
              <strong>safe</strong>. It shipped without any developer work.
            </p>
            <DiffPanel fromVersion="1.0.0" toVersion="1.1.0" />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 4 — THE BREAKING CHANGE
          ================================================================ */}
      <Section
        id="breaking-change"
        title="The Breaking Change"
        subtitle="Version 2.0.0 split color.primary into two new tokens. The old name disappeared. In this demo, we set the fallback to hotpink so you can see exactly what broke."
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setVersion('2.0.0')} style={inlinePill(version === '2.0.0')}>
            Switch to v2.0.0 to see the breakage
          </button>
          {version === '2.0.0' && (
            <>
              <span style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 600 }}>
                Active — look for the hotpink!
              </span>
              <button onClick={() => setVersion('1.0.0')} style={inlinePill(false)}>
                Reset to 1.0.0
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div data-brand={brand} style={{ ...darkCard, flexDirection: 'column', gap: 16 }}>
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, minHeight: 26, alignItems: 'center' }}>
              {version === '2.0.0' && (
                <>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(255,100,100,0.9)', background: 'rgba(80,20,20,0.55)', padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,100,100,0.3)', whiteSpace: 'nowrap' }}>
                    --color-primary: ???
                  </span>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(255,100,180,0.9)', background: 'rgba(80,20,50,0.55)', padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,100,180,0.3)', whiteSpace: 'nowrap' }}>
                    ↑ CSS fallback: hotpink
                  </span>
                </>
              )}
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: '1.05rem', color: '#475569', lineHeight: 1.65 }}>
              <code>color.primary</code> was split into <code>primary-light-mode</code> + <code>primary-dark-mode</code>.{' '}
              <code>color.accent</code> was deleted. We deliberately set the CSS fallback to{' '}
              <strong style={{ color: 'hotpink' }}>hotpink</strong> for this demo so broken
              references are impossible to miss. In a real system you'd choose your own fallback —
              the point is that missing tokens become visible immediately rather than silently
              inheriting the wrong value.
            </p>
            <DiffPanel fromVersion="1.1.0" toVersion="2.0.0" />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 5 — THE SAFETY NET
          ================================================================ */}
      <Section
        id="safety-net"
        title="The Safety Net"
        subtitle="Every change to a token file runs through an automated check. Safe changes ship. Breaking changes are flagged and blocked until a migration plan exists."
        tinted
      >
        {/* Button pair: healthy vs broken */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                ✓ v1.1.0 — Safe change passes
              </span>
            </div>
            <div data-brand={brand} style={{ ...darkCard, padding: '28px 24px' }}>
              <ButtonHero brand={brand} cssLoadKey={cssLoadKey} compact showTokens={false} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#fef2f2', color: '#991b1b', padding: '3px 10px', borderRadius: 20, border: '1px solid #fecaca' }}>
                ✖ v2.0.0 — Breaking change blocked
              </span>
            </div>
            <div style={{ ...darkCard, padding: '28px 24px' }}>
              {/* Static hotpink button — illustrates what would ship if the check didn't catch it */}
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'hotpink', color: '#fff', borderRadius: 8,
                  padding: '14px 32px', fontSize: '1rem', fontWeight: 600,
                  border: 'none', whiteSpace: 'nowrap', cursor: 'default',
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: '16px 20px', borderRadius: 8, border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: 6 }}>Safe operations</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
              <li><strong>Restyle</strong> — change a value</li>
              <li><strong>Add</strong> — introduce a new token</li>
              <li><strong>Combine</strong> — merge, keep old names as aliases</li>
            </ul>
          </div>
          <div style={{ padding: '16px 20px', borderRadius: 8, border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', marginBottom: 6 }}>Breaking operations</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
              <li><strong>Split</strong> — one token becomes multiple new names</li>
              <li><strong>Delete</strong> — remove a token entirely</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <TerminalBlock
            command="check 1.0.0 → 1.1.0"
            output={`[logos]  ✅ 2 restyled, 1 added — safe
[verbum] ✅ 2 restyled, 1 added — safe
PASSED — non-breaking`}
            title="Safe change — automated check passes"
          />
          <TerminalBlock
            command="check 1.1.0 → 2.0.0"
            output={`[logos]  ❌ REMOVED: color.accent, color.primary
[verbum] ❌ REMOVED: color.accent, color.primary
BLOCKED — breaking changes detected`}
            title="Breaking change — automated check blocks"
          />
        </div>
      </Section>

      {/* ================================================================
          SECTION 6 — THE FULL PIPELINE
          ================================================================ */}
      <Section
        id="full-pipeline"
        title="The Full Pipeline"
        subtitle="Figma exports variables as JSON. A build tool generates CSS custom properties. Components re-theme automatically. No developer bottleneck for visual changes."
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
          {/* Pipeline diagram — Figma mockup → tokens.json → CSS vars → live button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            {/* Mini Figma variables panel mockup */}
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', width: 148, background: '#1e1e1e' }}>
              <div style={{ background: '#2c2c2c', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f39c12' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2ecc71' }} />
                <span style={{ marginLeft: 4, fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>Variables</span>
              </div>
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { swatch: '#1E6AFE', name: 'color/primary' },
                  { swatch: '#3640B8', name: 'color/accent' },
                  { swatch: '#FFFFFF', name: 'color/surface' },
                ].map(({ swatch, name }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: swatch, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                  </div>
                ))}
                <div style={{ marginTop: 2, fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>+ 14 more</div>
              </div>
              <div style={{ padding: '5px 10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                Designer updates
              </div>
            </div>

            <div style={{ fontSize: '1.5rem', color: '#94a3b8' }}>→</div>

            <div style={{ padding: '16px 20px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'center', minWidth: 130 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>tokens.json</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>Design tokens · DTCG format</div>
            </div>

            <div style={{ fontSize: '1.5rem', color: '#94a3b8' }}>→</div>

            <div style={{ padding: '16px 20px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'center', minWidth: 130 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>CSS Variables</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>Build tool converts tokens → vars</div>
            </div>

            <div style={{ fontSize: '1.5rem', color: '#94a3b8' }}>→</div>

            {/* Live button as the final pipeline output */}
            <div
              data-brand={brand}
              style={{
                ...darkCard,
                padding: '20px 28px',
                border: '2px solid rgba(255,255,255,0.12)',
                flexDirection: 'column',
                gap: 8,
                minWidth: 150,
              }}
            >
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Output</div>
              <ButtonHero brand={brand} cssLoadKey={cssLoadKey} compact showTokens={false} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
            {/* Focused 4-line component snippet */}
            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <div style={{ background: '#1e293b', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>Button.tsx — what the component references</span>
              </div>
              <pre style={{ margin: 0, background: '#0f172a', padding: '18px 20px', fontSize: '0.88rem', fontFamily: 'monospace', lineHeight: 1.75, overflowX: 'auto', color: '#e2e8f0' }}>
                <code>
                  {'background:   '}<span style={{ color: '#86efac' }}>var</span><span style={{ color: '#e2e8f0' }}>{'(--color-primary, '}</span><span style={{ color: 'hotpink' }}>hotpink</span><span style={{ color: '#e2e8f0' }}>{');'}</span>{'\n'}
                  {'color:        '}<span style={{ color: '#86efac' }}>var</span><span style={{ color: '#e2e8f0' }}>{'(--color-on-primary);'}</span>{'\n'}
                  {'borderRadius: '}<span style={{ color: '#86efac' }}>var</span><span style={{ color: '#e2e8f0' }}>{'(--dimension-radius-md);'}</span>{'\n'}
                  {'fontFamily:   '}<span style={{ color: '#86efac' }}>var</span><span style={{ color: '#e2e8f0' }}>{'(--font-body);'}</span>
                </code>
              </pre>
              <div style={{ background: '#1e293b', padding: '8px 16px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                No hard-coded colors. Every value is a CSS variable — a token in disguise.
              </div>
            </div>

            {/* Compact single-brand CSS excerpt */}
            <CodeBlock
              code={LOGOS_COMPACT_CSS}
              language="css"
              title="generated/logos/variables.css"
              maxHeight={240}
            />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 7 — WHAT THIS MEANS FOR YOU
          ================================================================ */}
      <Section
        id="for-you"
        title="What This Means For You"
        subtitle="Different roles, different wins — but the same system serves everyone."
        tinted
      >
        {/* Button anchor above the cards */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
          <div data-brand={brand} style={{ ...darkCard, padding: '32px 48px' }}>
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} compact showTokens={false} />
          </div>
          <p style={{ margin: '12px 0 0', fontSize: '0.82rem', color: '#94a3b8', letterSpacing: '0.04em' }}>
            One component. Three perspectives.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 40 }}>
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f5f3ff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🎨</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>Designers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Change a color in Figma, export, and every product surface updates.
              No handoff ticket, no waiting for a dev sprint. Safe changes ship automatically.
              And Figma Variables make building new designs faster and more consistent too —
              the investment improves your daily workflow, not just the handoff.
            </p>
          </div>
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f0f9ff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⌨️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#0369a1' }}>Developers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Color changes require zero dev work — automated checks approve them. Breaking changes are
              explicit, versioned, and come with migration guides. You know exactly what's coming.
            </p>
          </div>
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fffbeb' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📊</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#b45309' }}>Managers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Design changes that used to be cross-team tickets become self-service operations.
              Breaking changes are caught before they ship, not discovered in production.
            </p>
          </div>
        </div>

        <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>
          Migration path for commerce-components
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { num: 1, title: 'Extract', desc: 'Convert hand-written colors.ts hex values into DTCG JSON using semantic names.' },
            { num: 2, title: 'Add a build tool', desc: 'colors.ts becomes a generated file. The token JSON is now the source of truth — Style Dictionary or any compatible tool transforms it.' },
            { num: 3, title: 'Map tokens to CSS variables', desc: 'Every design token gets a corresponding CSS custom property. Tailwind, CSS modules, or any styling approach can reference them — no hard-coded hex values anywhere. This is the most labor-intensive step — but it\'s a one-time cost.' },
            { num: 4, title: 'Add automated checks', desc: 'A check script runs on every proposed change that touches token files. Changes are automatically labeled as safe or breaking.' },
            { num: 5, title: 'Connect to Figma', desc: 'Figma Variables export to JSON via native export or the REST API. An automated workflow picks up the file and opens a pull request.' },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 18px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {step.num}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ================================================================
          SECTION 8 — THE ASK (CTA)
          ================================================================ */}
      <section
        id="the-ask"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 32px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          scrollSnapAlign: 'start',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto', width: '100%' }}>
          <p style={{ margin: '0 0 12px', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            The ask
          </p>
          <h2 style={{ margin: '0 0 48px', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            A Small Investment,<br />A Massive Return
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                We need a small, dedicated <strong style={{ color: '#fff' }}>Design System team</strong> —
                2 designers and 2 developers, each contributing ~4 hours a week.
              </p>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                This team would help Design adopt <strong style={{ color: '#fff' }}>Figma Variables</strong> (which
                they don't currently use), build the Figma-to-token pipeline, and maintain the tooling.
              </p>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                Each major redesign has cost us roughly{' '}
                <strong style={{ color: '#fff' }}>6 developer-months</strong> of migration work.
                A non-breaking redesign in a token-driven system costs zero.
              </p>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                ~16 hours a week of focused investment can save many teams{' '}
                <strong style={{ color: '#fff' }}>many, many hours</strong> on every future redesign.
                Theme upgrades that used to consume months become automated, version-controlled operations.
              </p>
            </div>

            {/* Contrast visual — closing the visual loop */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Today — scattered buttons (echoes Slide 2) */}
              <div style={{ padding: '24px 20px', borderRadius: 12, border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.06)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,100,100,0.8)', fontWeight: 700 }}>Today</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {DRIFTED_STYLES.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        height: 32,
                        borderRadius: s.borderRadius as number,
                        background: s.background as string,
                        opacity: 0.55 + i * 0.1,
                        width: `${58 + i * 11}%`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  Each redesign:<br />find every copy, fix it, repeat
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'rgba(255,100,100,0.9)' }}>~6 dev-months per redesign</div>
              </div>

              {/* With a design system team — live ButtonHero */}
              <div style={{ padding: '24px 20px', borderRadius: 12, border: '1px solid rgba(100,220,150,0.3)', background: 'rgba(100,220,150,0.06)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 240 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(100,220,150,0.8)', fontWeight: 700 }}>With a Design System Team</div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} data-brand={brand}>
                  <ButtonHero brand={brand} cssLoadKey={cssLoadKey} compact showTokens={false} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['--color-primary', '--radius-md'].map((t) => (
                    <div key={t} style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'rgba(120,220,120,0.8)', padding: '2px 8px', border: '1px solid rgba(120,220,120,0.25)', borderRadius: 4, whiteSpace: 'nowrap' }}>
                      {t}
                    </div>
                  ))}
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Figma → tokens → CSS → done</div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'rgba(100,220,150,0.9)' }}>~days, not months</div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '28px 32px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
            }}
          >
            2 designers. 2 developers. ~4 hours a week each.{' '}
            <strong style={{ color: '#fff' }}>That's the ask.</strong>{' '}
            The return is a design-to-code pipeline that scales, a team that ships faster,
            and redesigns that don't cost anyone months of their life.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '28px 32px',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: '#94a3b8',
          borderTop: '1px solid #e2e8f0',
          background: '#fff',
        }}
      >
        Design Tokens Pipeline Demo &middot; W3C DTCG &middot; React + Vite + Style Dictionary
      </footer>
    </div>
  );
}
