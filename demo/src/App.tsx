import { useState, useEffect } from 'react';

import { Section } from './walkthrough/Section';
import { CodeBlock } from './walkthrough/CodeBlock';
import { SideBySide } from './walkthrough/SideBySide';
import { Callout } from './walkthrough/Callout';
import { StickyControls } from './walkthrough/StickyControls';
import { TerminalBlock } from './walkthrough/TerminalBlock';
import { ComponentStrip } from './walkthrough/ComponentStrip';
import { TokenInspector } from './panels/TokenInspector';
import { DiffPanel } from './panels/DiffPanel';
import { Button } from './components/Button';

// Actual source files imported as raw strings — always in sync
import logosColorRaw from '../tokens/brand/logos/color.json?raw';
import verbumColorRaw from '../tokens/brand/verbum/color.json?raw';
import logosVarsCssRaw from '../generated/logos/variables.css?raw';
import verbumVarsCssRaw from '../generated/verbum/variables.css?raw';
import buttonTsxRaw from './components/Button.tsx?raw';

type Brand = 'logos' | 'verbum';
type Version = '1.0.0' | '1.1.0' | '2.0.0';

export function App() {
  const [brand, setBrand] = useState<Brand>('logos');
  const [version, setVersion] = useState<Version>('1.0.0');
  const [cssLoadKey, setCssLoadKey] = useState(0);
  const [showVersionControls, setShowVersionControls] = useState(false);

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

  // Show version controls once section 7 is reached
  useEffect(() => {
    const el = document.getElementById('section-evolves');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowVersionControls(true); },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const inlinePill = (active: boolean): React.CSSProperties => ({
    padding: '5px 16px',
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
        showVersion={showVersionControls}
      />

      {/* ================================================================
          SECTION 1 — HERO
          ================================================================ */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 32px 60px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          textAlign: 'center',
          scrollSnapAlign: 'start',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Design Tokens Pipeline
        </h1>
        <p style={{ margin: '16px auto 0', maxWidth: 580, fontSize: '1.25rem', color: '#94a3b8', lineHeight: 1.65 }}>
          Figma Variables &rarr; DTCG tokens.json &rarr; CSS custom properties &rarr; components.
          <br />One source of truth. Every brand. Every platform.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
            maxWidth: 700,
            margin: '40px auto 0',
            textAlign: 'left',
          }}
        >
          {[
            ['One source of truth', 'Token files generate CSS, TypeScript, and Tailwind outputs'],
            ['Multi-brand', 'Same components, completely different visual identity'],
            ['Clean separation', 'Components use CSS variables — zero brand knowledge'],
            ['Breaking change detection', 'Every change classified as patch, minor, or major'],
            ['Version governance', 'CI gate rejects breaking changes automatically'],
            ['Designer empowerment', 'Change a value, rebuild, done — no dev bottleneck'],
          ].map(([title, desc]) => (
            <div
              key={title}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          SECTION 2 — SOURCE OF TRUTH
          ================================================================ */}
      <Section
        step={1}
        title="The source of truth"
        subtitle="Both brands define the same semantic token names — same contract, different values. This mirrors Figma Variable collections with one mode per brand."
      >
        <SideBySide
          left={{ title: 'tokens/brand/logos/color.json', code: logosColorRaw.trim(), language: 'json' }}
          right={{ title: 'tokens/brand/verbum/color.json', code: verbumColorRaw.trim(), language: 'json' }}
          maxHeight={360}
        />
        <Callout role="designer">
          The <code>$value</code>, <code>$type</code>, and <code>$description</code> keys follow the W3C
          Design Tokens Community Group (DTCG) standard. This format is tool-agnostic — it works with
          Style Dictionary, Tokens Studio, Figma Tokens, or any future tool that supports the spec.
        </Callout>
        <Callout role="developer">
          Token names are semantic (<code>primary</code>, <code>danger</code>, <code>surface</code>) rather
          than hue-based (<code>blue-500</code>, <code>red-300</code>). This means a brand can change its
          primary color from blue to green without touching a single component.
        </Callout>
      </Section>

      {/* ================================================================
          SECTION 3 — BUILD PIPELINE
          ================================================================ */}
      <Section
        step={2}
        title="One command generates everything"
        subtitle="A single build command reads the token JSON files and produces CSS custom properties, TypeScript constants, and a Tailwind config fragment for each brand."
        tinted
      >
        <TerminalBlock
          command="npm run build:tokens"
          output={`── Building current tokens ──
✓ logos → generated/logos
✓ verbum → generated/verbum

── Building all history versions ──
✓ logos → generated/versions/1.0.0/logos
✓ verbum → generated/versions/1.0.0/verbum
✓ logos → generated/versions/1.1.0/logos
✓ verbum → generated/versions/1.1.0/verbum
✓ logos → generated/versions/2.0.0/logos
✓ verbum → generated/versions/2.0.0/verbum

✅ Token build complete.`}
          title="Build pipeline"
        />

        <p style={{ margin: '20px 0 12px', fontSize: '0.9rem', color: '#475569' }}>
          Here is what gets generated — the same CSS property names, with brand-specific values scoped to a <code>data-brand</code> selector:
        </p>

        <SideBySide
          left={{ title: 'generated/logos/variables.css', code: logosVarsCssRaw.trim(), language: 'css' }}
          right={{ title: 'generated/verbum/variables.css', code: verbumVarsCssRaw.trim(), language: 'css' }}
          maxHeight={340}
        />

        <Callout role="manager">
          This is the leverage point: designers update a JSON value, one command runs, and every
          product surface updates. No manual CSS edits, no developer handoff for color changes,
          no cross-team ticket.
        </Callout>
      </Section>

      {/* ================================================================
          SECTION 4 — ZERO BRAND AWARENESS
          ================================================================ */}
      <Section
        step={3}
        title="Components have zero brand awareness"
        subtitle="Components reference CSS variables only. No hex values, no theme imports, no ThemeProvider. The same component works on any platform that supports CSS custom properties."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
            alignItems: 'start',
          }}
        >
          <CodeBlock
            code={buttonTsxRaw.trim()}
            language="tsx"
            title="src/components/Button.tsx"
            highlights={[20, 25, 31, 32, 33, 37, 38]}
            maxHeight={480}
          />
          <div>
            <div
              data-brand={brand}
              style={{
                padding: 24,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                backgroundColor: 'var(--color-surface, #fff)',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: 12 }}>
                Live output
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Button variant="primary">Buy now</Button>
                <Button variant="secondary">Learn more</Button>
                <Button variant="ghost">Dismiss</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
            <Callout role="developer">
              Notice the highlighted lines: every visual property resolves through a <code>var(--…)</code> reference.
              This component could be extracted to Vue, Svelte, or a static HTML page unchanged — the CSS
              variable contract is the only interface between design and implementation.
            </Callout>
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 5 — TRY IT: BRAND SWITCHING
          ================================================================ */}
      <div id="sticky-sentinel" />
      <Section
        step={4}
        title="Try it: switch brands"
        subtitle="Toggle between Logos and Verbum. Every component below re-themes instantly — zero JavaScript re-rendering, just CSS reapplied by the browser."
        tinted
      >
        {/* Inline brand toggle (first appearance) */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['logos', 'verbum'] as Brand[]).map((b) => (
            <button key={b} onClick={() => setBrand(b)} style={inlinePill(brand === b)}>
              {b === 'logos' ? 'Logos' : 'Verbum'}
            </button>
          ))}
          <span style={{ marginLeft: 12, fontSize: '0.88rem', color: '#94a3b8', alignSelf: 'center' }}>
            Active: <strong style={{ color: '#334155' }}>{brand}</strong>
          </span>
        </div>

        <ComponentStrip brand={brand} />

        <Callout role="info">
          How many lines of JavaScript ran to re-theme? <strong>Zero.</strong> The brand toggle
          changes a single <code>data-brand</code> attribute. The browser's CSS engine does the rest.
          Components don't re-render — they just repaint.
        </Callout>
      </Section>

      {/* ================================================================
          SECTION 6 — UNDER THE HOOD
          ================================================================ */}
      <Section
        step={5}
        title="Under the hood: live CSS variables"
        subtitle="The token inspector reads actual computed values from the DOM. Switch brands above and watch the values change in real time."
      >
        <div data-brand={brand} style={{ borderRadius: 12, border: '1px solid #e2e8f0', padding: 20, backgroundColor: 'var(--color-surface, #fff)' }}>
          <TokenInspector brand={brand} version={version} cssLoadKey={cssLoadKey} />
        </div>
      </Section>

      {/* ================================================================
          SECTION 7 — DESIGN EVOLVES
          ================================================================ */}
      <Section
        step={6}
        title="Design evolves: version history"
        subtitle="Design systems change over time. Each change to a token is classified as a patch (restyle), minor (add/combine), or major (split/delete) operation."
        tinted
        id="section-evolves"
      >
        {/* Version toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
            Token version
          </span>
          {(['1.0.0', '1.1.0', '2.0.0'] as Version[]).map((v) => (
            <button key={v} onClick={() => setVersion(v)} style={inlinePill(version === v)}>
              {v}
            </button>
          ))}
        </div>

        <ComponentStrip brand={brand} />

        <div style={{ marginTop: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: '#334155' }}>
            1.0.0 &rarr; 1.1.0 (non-breaking)
          </h3>
          <p style={{ margin: '0 0 12px', fontSize: '1rem', color: '#64748b', lineHeight: 1.65 }}>
            Primary color restyled (new shade). New <code>color.accent</code> token added.
            <code>radius-sm</code> and <code>radius-lg</code> combined into <code>radius-md</code>.
            Result: <strong>MINOR</strong> bump. CI gate passes.
          </p>
          <DiffPanel fromVersion="1.0.0" toVersion="1.1.0" />
        </div>
      </Section>

      {/* ================================================================
          SECTION 8 — THE BREAKING CHANGE
          ================================================================ */}
      <Section
        step={7}
        title="The breaking change"
        subtitle="Version 2.0.0 splits color.primary into two tokens and deletes color.accent. Components that depend on the old name break — visually and unmistakably."
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setVersion('2.0.0')} style={inlinePill(version === '2.0.0')}>
            Switch to v2.0.0 to see the breakage
          </button>
          {version === '2.0.0' && (
            <>
              <span style={{ fontSize: '0.88rem', color: '#dc2626', fontWeight: 600 }}>
                Active — look for the hotpink!
              </span>
              <button onClick={() => setVersion('1.0.0')} style={inlinePill(false)}>
                Reset to 1.0.0
              </button>
            </>
          )}
        </div>

        <ComponentStrip brand={brand} />

        <div style={{ marginTop: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 600, color: '#dc2626' }}>
            1.1.0 &rarr; 2.0.0 (BREAKING)
          </h3>
          <p style={{ margin: '0 0 12px', fontSize: '1rem', color: '#64748b', lineHeight: 1.65 }}>
            <code>color.primary</code> was split into <code>primary-light-mode</code> + <code>primary-dark-mode</code>.
            <code>color.accent</code> was deleted. Every component that referenced the old names now resolves
            to <strong style={{ color: 'hotpink' }}>hotpink</strong> — the CSS fallback that makes missing tokens impossible to miss.
          </p>
          <DiffPanel fromVersion="1.1.0" toVersion="2.0.0" />
        </div>

        <Callout role="info">
          This is why splits and deletes are classified as <strong>major / breaking</strong>. The component
          contract changes — any consumer referencing the old token name will break. The hotpink fallback makes
          this instantly visible in development, long before it could reach production.
        </Callout>
      </Section>

      {/* ================================================================
          SECTION 9 — SAFETY NET / CI GATE
          ================================================================ */}
      <Section
        step={8}
        title="The safety net: CI governance"
        subtitle="In CI, every PR that modifies token files runs the check tool. Non-breaking changes pass automatically. Breaking changes are rejected until the team explicitly approves a major version bump."
        tinted
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <TerminalBlock
            command="npm run check -- 1.0.0 1.1.0"
            output={`════════════════════════════════════════════════════════════
  Governance check: 1.0.0  →  1.1.0
  Constraint set: Diagram 1 (restyle · combine · add only)
════════════════════════════════════════════════════════════

[logos]  ✅ 2 restyled, 1 added — compliant

[verbum]  ✅ 2 restyled, 1 added — compliant

════════════════════════════════════════════════════════════
  ✅ PASSED — changes are non-breaking (Diagram 1 compliant)
  Suggested bump: MINOR
════════════════════════════════════════════════════════════`}
            title="Non-breaking — CI passes"
          />

          <TerminalBlock
            command="npm run check -- 1.1.0 2.0.0"
            output={`════════════════════════════════════════════════════════════
  Governance check: 1.1.0  →  2.0.0
  Constraint set: Diagram 1 (restyle · combine · add only)
════════════════════════════════════════════════════════════

[logos]  ❌ REMOVED tokens (FORBIDDEN under Diagram 1):
  ✖  color.accent  (was "#4885FE")
  ✖  color.primary  (was "#0F5FCC")

[verbum]  ❌ REMOVED tokens (FORBIDDEN under Diagram 1):
  ✖  color.accent  (was "#E8C96E")
  ✖  color.primary  (was "#6B1928")

════════════════════════════════════════════════════════════
  ❌ FAILED — breaking changes detected
  To proceed: bump the MAJOR version and provide a migration guide.
════════════════════════════════════════════════════════════`}
            title="Breaking — CI rejects"
          />
        </div>

        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          <div style={{ padding: '16px 20px', borderRadius: 8, border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginBottom: 6 }}>Diagram 1 — Safe operations</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
              <li><strong>Restyle</strong> — change a token value</li>
              <li><strong>Add</strong> — introduce a new token</li>
              <li><strong>Combine</strong> — merge tokens, keep old names as aliases</li>
            </ul>
          </div>
          <div style={{ padding: '16px 20px', borderRadius: 8, border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#991b1b', marginBottom: 6 }}>Diagram 2 — Breaking operations</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.9rem', color: '#334155', lineHeight: 1.7 }}>
              <li><strong>Split</strong> — one token becomes multiple new names</li>
              <li><strong>Delete</strong> — remove a token entirely</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ================================================================
          SECTION 10 — AUDIENCE PAYOFF + MIGRATION
          ================================================================ */}
      <Section
        step={9}
        title="What this means for you"
        subtitle="Different roles, different wins — but the same system serves everyone."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 32 }}>
          {/* Designer card */}
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f5f3ff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>🎨</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#5b21b6' }}>Designers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Change a color in Figma (or the token file), publish, and every product surface updates.
              No handoff ticket, no waiting for a dev sprint. Restyles ship automatically — you have
              direct control over how the product looks.
            </p>
          </div>

          {/* Developer card */}
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#f0f9ff' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⌨️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#0369a1' }}>Developers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Color changes require zero dev work — they're patches that CI auto-approves. New tokens are minor
              bumps you opt into. Breaking changes are explicit major bumps with migration guides. The semver
              contract tells you exactly how much work is coming.
            </p>
          </div>

          {/* Manager card */}
          <div style={{ padding: '24px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fffbeb' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📊</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 700, color: '#b45309' }}>Managers</h3>
            <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.65 }}>
              Design changes that used to be cross-team tickets become self-service operations. Developers aren't
              bottlenecks for visual updates. Breaking changes are visible in CI, not discovered in production.
              Multi-brand scales without multiplying effort.
            </p>
          </div>
        </div>

        <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>
          Migration path for commerce-components
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              num: 1,
              title: 'Extract',
              desc: 'Convert the hand-written colors.ts hex values into DTCG JSON using semantic names (primary, danger, success, etc.).',
            },
            {
              num: 2,
              title: 'Add Style Dictionary',
              desc: 'colors.ts becomes a generated file. The token JSON is now the source of truth.',
            },
            {
              num: 3,
              title: 'Close the CSS variable gap',
              desc: 'Update tailwind-helper.ts to reference var(--color-*) instead of hardcoded hex. Tailwind becomes brand-agnostic.',
            },
            {
              num: 4,
              title: 'Add CI tools',
              desc: 'check-breaking.ts runs on every PR that touches token files. Auto-label PRs as patch/minor/major.',
            },
            {
              num: 5,
              title: 'Connect to Figma',
              desc: 'Tokens Studio syncs Figma Variables → JSON → automated PR. The designer workflow completes the loop.',
            },
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
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
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

        <Callout role="info">
          Steps 1–3 can ship in a single PR with zero visual change to consumers. Steps 4–5 are
          additive. At no point do existing components break.
        </Callout>
      </Section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer
        style={{
          padding: '32px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#94a3b8',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        Design Tokens Pipeline Demo &middot; W3C DTCG &middot; Built with React + Vite + Style Dictionary
      </footer>
    </div>
  );
}
