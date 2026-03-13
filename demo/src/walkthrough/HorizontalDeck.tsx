import { useRef, useState, useEffect, useCallback } from 'react';

interface HorizontalDeckProps {
  children: React.ReactNode;
  onLastSlide?: (isLast: boolean) => void;
}

export function HorizontalDeck({ children, onLastSlide }: HorizontalDeckProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = Array.isArray(children) ? children.length : 1;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slideCount - 1, index));
    track.scrollTo({ left: clamped * window.innerWidth, behavior: 'smooth' });
  }, [slideCount]);

  // Sync activeIndex from scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => {
      const idx = Math.round(track.scrollLeft / window.innerWidth);
      setActiveIndex(idx);
      onLastSlide?.(idx === slideCount - 1);
    };
    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [slideCount, onLastSlide]);

  // Keyboard navigation — only when not on last slide (to allow vertical scroll after)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, goTo]);

  // Inject activeIndex as a key into each child so animations replay on navigation
  const slides = Array.isArray(children) ? children : [children];
  const slidesWithKeys = slides.map((child, i) =>
    // We wrap each slide in a div keyed by `${i}-${activeIndex === i ? 'active' : 'inactive'}`
    // Using a separate activationKey per slot: increments each time that slot becomes active
    <SlideWrapper key={i} isActive={activeIndex === i} slideIndex={i}>
      {child}
    </SlideWrapper>
  );

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Scroll track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          height: '100vh',
          width: '100vw',
        }}
        className="horizontal-deck-track"
      >
        {slidesWithKeys}
      </div>

      {/* Left arrow */}
      {activeIndex > 0 && (
        <button
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous slide"
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.15s',
          }}
        >
          ‹
        </button>
      )}

      {/* Right arrow */}
      {activeIndex < slideCount - 1 && (
        <button
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next slide"
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.15s',
          }}
        >
          ›
        </button>
      )}

      {/* Progress dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: activeIndex === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeIndex === i ? '#fff' : 'rgba(255,255,255,0.35)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.2s, background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Wraps each slide and increments a key each time it becomes active,
// causing React to remount the child and restart CSS animations.
function SlideWrapper({
  children,
  isActive,
  slideIndex,
}: {
  children: React.ReactNode;
  isActive: boolean;
  slideIndex: number;
}) {
  const [activationCount, setActivationCount] = useState(0);
  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive && !wasActive.current) {
      setActivationCount((c) => c + 1);
    }
    wasActive.current = isActive;
  }, [isActive]);

  return (
    <div
      key={`slide-${slideIndex}-${activationCount}`}
      style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '100vw', height: '100vh' }}
    >
      {/* Force remount of children on each activation by keying this inner div */}
      <div key={activationCount} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
