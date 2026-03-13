interface SlideProps {
  children: React.ReactNode;
  dark?: boolean;
}

export function Slide({ children, dark = false }: SlideProps) {
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
        padding: '48px 64px',
        backgroundColor: dark ? '#0f172a' : '#0f172a',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
