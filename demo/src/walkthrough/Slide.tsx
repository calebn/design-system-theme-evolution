interface SlideProps {
  children: React.ReactNode;
  dark?: boolean;
  /** Zoom factor applied to the content wrapper. Default 1.25 fills the screen better at 100% browser zoom. */
  zoom?: number;
}

export function Slide({ children, dark = false, zoom = 1.25 }: SlideProps) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 48px',
        backgroundColor: dark ? '#0f172a' : '#0f172a',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          zoom,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
