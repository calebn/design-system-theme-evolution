import { useIsMobile } from '../hooks/useIsMobile';

interface SlideProps {
  children: React.ReactNode;
  /** Zoom factor applied to the content wrapper. Default 1.25 fills the screen better at 100% browser zoom. */
  zoom?: number;
}

export function Slide({ children, zoom = 1.25 }: SlideProps) {
  const isMobile = useIsMobile();

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
        padding: isMobile ? '24px 16px' : '32px 48px',
        backgroundColor: '#0f172a',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          zoom: isMobile ? 1 : zoom,
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
