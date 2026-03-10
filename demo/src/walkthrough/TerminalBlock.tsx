interface TerminalBlockProps {
  command: string;
  output: string;
  title?: string;
}

export function TerminalBlock({ command, output, title }: TerminalBlockProps) {
  return (
    <div
      style={{
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #334155',
        fontFamily: "'Courier New', Consolas, monospace",
        fontSize: '0.85rem',
        lineHeight: 1.65,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          backgroundColor: '#334155',
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#eab308' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        {title && (
          <span style={{ marginLeft: 8, fontSize: '0.78rem', color: '#94a3b8' }}>{title}</span>
        )}
      </div>
      {/* Body */}
      <div style={{ backgroundColor: '#0f172a', padding: '12px 16px', overflow: 'auto', maxHeight: 340 }}>
        <div style={{ color: '#22d3ee', marginBottom: 4 }}>
          <span style={{ color: '#a78bfa' }}>$</span> {command}
        </div>
        <pre style={{ margin: 0, color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
          {output}
        </pre>
      </div>
    </div>
  );
}
