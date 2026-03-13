import { useState, useEffect } from 'react';

import { HorizontalDeck } from './walkthrough/HorizontalDeck';
import { Slide } from './walkthrough/Slide';
import { SlideButtonVisual } from './walkthrough/SlideButtonVisual';
import { ButtonHero } from './walkthrough/ButtonHero';
import { Section } from './walkthrough/Section';
import { CodeBlock } from './walkthrough/CodeBlock';
import { SideBySide } from './walkthrough/SideBySide';
import { Callout } from './walkthrough/Callout';
import { StickyControls } from './walkthrough/StickyControls';
import { TerminalBlock } from './walkthrough/TerminalBlock';
import { TokenInspector } from './panels/TokenInspector';
import { DiffPanel } from './panels/DiffPanel';

import logosColorRaw from '../tokens/brand/logos/color.json?raw';
import verbumColorRaw from '../tokens/brand/verbum/color.json?raw';
import { logosVarsCss as logosVarsCssRaw, verbumVarsCss as verbumVarsCssRaw } from './token-css-strings';
import buttonTsxRaw from './components/Button.tsx?raw';

type Brand = 'logos' | 'verbum';
type Version = '1.0.0' | '1.1.0' | '2.0.0';

export function App() {
  const [brand, setBrand] = useState<Brand>('logos');
  const [version, setVersion] = useState<Version>('1.0.0');
  const [cssLoadKey, setCssLoadKey] = useState(0);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const cssPath = `${base}generated/versions/${version}/${brand}/variables.css`;
    let link = document.getElementById('theme-css') as HTMLLinkElement | null;
    if (link) {
      link.href = cssPath;
    } else {
      link = document.createElement('link');
      link.id = 'theme-css';
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }
    document.documentElement.setAttribute('data-brand', brand);
    const onLoad = () => setCssLoadKey((k) => k + 1);
    link.addEventListener('load', onLoad, { once: true });
    return () => link?.removeEventListener('load', onLoad);
  }, [brand, version]);

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

  return (
    <div>
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
      <HorizontalDeck>

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
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
              Press → or click the arrow to continue
            </p>
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

        {/* SLIDE 6 — THE GAP */}
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
                  'Design goes from 4 button sizes to 3. Some variants don\'t map cleanly.',
                  'Every page using an old variant must be found and fixed one by one',
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

        {/* SLIDE 7 — SYSTEM PROBLEM */}
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

        {/* SLIDE 8 — THE BRIDGE */}
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
        title="This is a Design Token"
        subtitle="Every visual property of this button comes from a token. Change a token, the button changes. No code edits."
        tinted
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div data-brand={brand}>
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#475569', lineHeight: 1.7 }}>
              Each CSS variable is a <strong>token</strong> — a named, versioned design decision.
              Instead of hard-coding <code>#1E6AFE</code> into your component,
              you reference <code>var(--color-primary)</code>.
            </p>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#475569', lineHeight: 1.7 }}>
              The token file is the contract between designers and developers.
              Change the value in Figma, publish, and <em>every surface updates</em>.
            </p>
            <SideBySide
              left={{ title: 'tokens/brand/logos/color.json', code: logosColorRaw.trim(), language: 'json' }}
              right={{ title: 'tokens/brand/verbum/color.json', code: verbumColorRaw.trim(), language: 'json' }}
              maxHeight={280}
            />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 2 — ONE BUTTON, TWO BRANDS
          ================================================================ */}
      <Section
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
            <div
              data-brand={brand}
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: 16,
                padding: '48px 32px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
            </div>
            <div>
              <Callout role="info">
                How many lines of JavaScript ran to re-theme? <strong>Zero.</strong> The brand toggle
                changes a single <code>data-brand</code> attribute. The browser's CSS engine does the rest.
                Components don't re-render — they just repaint.
              </Callout>
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
        title="Design Evolves"
        subtitle="Each change to a token is automatically classified as patch, minor, or major. Non-breaking changes ship without developer involvement."
        tinted
        id="section-evolves"
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
          <div
            data-brand={brand}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: 16,
              padding: '48px 32px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: '1.05rem', color: '#475569', lineHeight: 1.65 }}>
              <strong>1.0.0 → 1.1.0:</strong> The primary color was restyled. A new accent token was added.
              Two radius tokens were combined into one. CI classified this as <strong>non-breaking</strong>.
              It shipped automatically.
            </p>
            <DiffPanel fromVersion="1.0.0" toVersion="1.1.0" />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 4 — THE BREAKING CHANGE
          ================================================================ */}
      <Section
        title="The Breaking Change"
        subtitle="Version 2.0.0 split color.primary into two new tokens. The old name disappeared. The button falls back to hotpink — a visible scream that something broke."
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
          <div
            data-brand={brand}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: 16,
              padding: '48px 32px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ButtonHero brand={brand} cssLoadKey={cssLoadKey} />
          </div>
          <div>
            <p style={{ margin: '0 0 16px', fontSize: '1.05rem', color: '#475569', lineHeight: 1.65 }}>
              <code>color.primary</code> was split into <code>primary-light-mode</code> + <code>primary-dark-mode</code>.{' '}
              <code>color.accent</code> was deleted. Every component that referenced the old names
              now resolves to <strong style={{ color: 'hotpink' }}>hotpink</strong> — the CSS fallback
              that makes missing tokens impossible to miss.
            </p>
            <DiffPanel fromVersion="1.1.0" toVersion="2.0.0" />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 5 — THE SAFETY NET
          ================================================================ */}
      <Section
        title="The Safety Net"
        subtitle="In CI, every change to a token file is automatically classified. Non-breaking changes ship. Breaking changes are blocked until a migration plan exists."
        tinted
      >
        <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
          <TerminalBlock
            command="npm run check -- 1.0.0 1.1.0"
            output={`════════════════════════════════════════════════════════════
  Governance check: 1.0.0  →  1.1.0
════════════════════════════════════════════════════════════

[logos]  ✅ 2 restyled, 1 added — compliant
[verbum]  ✅ 2 restyled, 1 added — compliant

  ✅ PASSED — non-breaking. Suggested bump: MINOR`}
            title="Non-breaking — CI passes"
          />
          <TerminalBlock
            command="npm run check -- 1.1.0 2.0.0"
            output={`════════════════════════════════════════════════════════════
  Governance check: 1.1.0  →  2.0.0
════════════════════════════════════════════════════════════

[logos]  ❌ REMOVED tokens (FORBIDDEN):
  ✖  color.accent   ✖  color.primary

[verbum]  ❌ REMOVED tokens (FORBIDDEN):
  ✖  color.accent   ✖  color.primary

  ❌ FAILED — breaking changes detected.
  To proceed: bump MAJOR version + provide a migration guide.`}
            title="Breaking — CI rejects"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
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
      </Section>

      {/* ================================================================
          SECTION 6 — THE FULL PIPELINE
          ================================================================ */}
      <Section
        title="The Full Pipeline"
        subtitle="Designers update variables in Figma. Tokens Studio exports them as JSON. Style Dictionary generates CSS. Components re-theme. No developer bottleneck for visual changes."
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
          {/* Pipeline diagram */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Figma Variables', sub: 'Designer updates' },
              null,
              { label: 'tokens.json', sub: 'W3C DTCG format' },
              null,
              { label: 'CSS Variables', sub: 'Style Dictionary' },
              null,
              { label: 'Components', sub: 'Zero re-render' },
            ].map((item, i) =>
              item === null ? (
                <div key={i} style={{ fontSize: '1.5rem', color: '#94a3b8' }}>→</div>
              ) : (
                <div
                  key={i}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    textAlign: 'center',
                    minWidth: 130,
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{item.sub}</div>
                </div>
              )
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%' }}>
            <CodeBlock
              code={buttonTsxRaw.trim()}
              language="tsx"
              title="src/components/Button.tsx"
              highlights={[20, 25, 31, 32, 33, 37, 38]}
              maxHeight={360}
            />
            <SideBySide
              left={{ title: 'generated/logos/variables.css', code: logosVarsCssRaw.trim(), language: 'css' }}
              right={{ title: 'generated/verbum/variables.css', code: verbumVarsCssRaw.trim(), language: 'css' }}
              maxHeight={360}
            />
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 7 — WHAT THIS MEANS FOR YOU
          ================================================================ */}
      <Section
        title="What This Means For You"
        subtitle="Different roles, different wins — but the same system serves everyone."
        tinted
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 40 }}>
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f5f3ff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🎨</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>Designers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Change a color in Figma, publish, and every product surface updates.
              No handoff ticket, no waiting for a dev sprint. Restyles ship automatically.
            </p>
          </div>
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f0f9ff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⌨️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#0369a1' }}>Developers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Color changes require zero dev work — CI auto-approves. Breaking changes are explicit
              major bumps with migration guides. The semver contract tells you exactly what's coming.
            </p>
          </div>
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fffbeb' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📊</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#b45309' }}>Managers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Design changes that used to be cross-team tickets become self-service operations.
              Breaking changes are visible in CI, not discovered in production. Multi-brand scales without multiplying effort.
            </p>
          </div>
        </div>

        <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>
          Migration path for commerce-components
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { num: 1, title: 'Extract', desc: 'Convert hand-written colors.ts hex values into DTCG JSON using semantic names.' },
            { num: 2, title: 'Add Style Dictionary', desc: 'colors.ts becomes a generated file. The token JSON is now the source of truth.' },
            { num: 3, title: 'Close the CSS variable gap', desc: 'Update tailwind-helper.ts to reference var(--color-*) instead of hard-coded hex.' },
            { num: 4, title: 'Add CI tools', desc: 'check-breaking.ts runs on every PR that touches token files. Auto-label as patch/minor/major.' },
            { num: 5, title: 'Connect to Figma', desc: 'Tokens Studio syncs Figma Variables → JSON → automated PR. The designer workflow completes the loop.' },
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 56 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                We need a small, dedicated <strong style={{ color: '#fff' }}>Design System team</strong> —
                a handful of designers and developers collaborating a few hours a week.
              </p>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                This team would help Design adopt <strong style={{ color: '#fff' }}>Figma Variables</strong> (which
                they don't currently use), build the Figma-to-token-to-theme pipeline, and maintain the tooling.
              </p>
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
                The math is simple: a few dedicated people investing a few hours a week can
                save many teams <strong style={{ color: '#fff' }}>many, many hours</strong> on every future redesign.
                Theme upgrades that used to consume years become automated, version-controlled operations.
              </p>
            </div>

            {/* Contrast visual */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Today */}
              <div style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.06)' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,100,100,0.7)', marginBottom: 12 }}>Today</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { bg: '#1E6AFE', r: 8 },
                    { bg: '#1a5fe0', r: 3 },
                    { bg: '#2B7EFF', r: 12 },
                    { bg: '#1659cc', r: 6 },
                  ].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        height: 28,
                        borderRadius: d.r,
                        background: d.bg,
                        opacity: 0.6 + i * 0.1,
                        width: `${60 + i * 10}%`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  Years of manual work<br />per redesign
                </div>
              </div>

              {/* With a design system team */}
              <div style={{ padding: '20px', borderRadius: 12, border: '1px solid rgba(100,220,150,0.3)', background: 'rgba(100,220,150,0.06)' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(100,220,150,0.7)', marginBottom: 12 }}>With a Design System Team</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                  <div style={{ height: 28, borderRadius: 8, background: '#1E6AFE', width: '80%' }} />
                  <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'rgba(120,220,120,0.8)', padding: '4px 8px', border: '1px solid rgba(120,220,120,0.3)', borderRadius: 4 }}>
                    var(--color-primary)
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Figma → JSON → CSS → UI</div>
                </div>
                <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  Hours, not months.<br />Automated. Versioned.
                </div>
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
            A few designers. A few developers. A few hours a week.{' '}
            <strong style={{ color: '#fff' }}>That's the ask.</strong>{' '}
            The return is a design-to-code pipeline that scales, a team that ships faster,
            and redesigns that don't cost anyone years of their life.
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
