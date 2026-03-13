import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';

interface HorizontalDeckProps {
  children: React.ReactNode;
  onLastSlide?: (isLast: boolean) => void;
  /** Stable IDs for each slide, used for hash-based deep linking. */
  slideIds?: string[];
}

export function HorizontalDeck({ children, onLastSlide, slideIds }: HorizontalDeckProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Compute initial index from URL hash before first paint to avoid a flash.
  const initialIndex = (() => {
    if (typeof window === 'undefined' || !slideIds) return 0;
    const hash = window.location.hash.slice(1);
    const idx = slideIds.indexOf(hash);
    return idx !== -1 ? idx : 0;
  })();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const slideCount = Array.isArray(children) ? children.length : 1;

  // Throttle gate: prevents advancing more than one slide per wheel gesture
  const wheelCooldown = useRef(false);

  // Sync initial scroll position from hash before first paint.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || initialIndex === 0) return;
    track.scrollLeft = initialIndex * window.innerWidth;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep URL hash in sync with the active slide.
  useEffect(() => {
    const id = slideIds?.[activeIndex];
    if (!id) return;
    history.replaceState(null, '', `#${id}`);
  }, [activeIndex, slideIds]);

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

  // Lock/unlock vertical page scroll based on whether we're on the last slide.
  // When locked, intercept wheel events to drive horizontal slide navigation.
  useEffect(() => {
    const onLastSlideNow = activeIndex === slideCount - 1;

    if (onLastSlideNow) {
      document.documentElement.style.overflowY = '';
    } else {
      document.documentElement.style.overflowY = 'hidden';
    }

    // Restore on unmount
    return () => {
      document.documentElement.style.overflowY = '';
    };
  }, [activeIndex, slideCount]);

  // Intercept wheel/trackpad to drive horizontal navigation while deck is locked
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only intercept while NOT on the last slide
      if (activeIndex === slideCount - 1) return;

      // Only act on the dominant axis — ignore tiny vertical wobble on a horizontal swipe
      const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (!isVertical) return;

      e.preventDefault();

      if (wheelCooldown.current) return;
      wheelCooldown.current = true;
      setTimeout(() => { wheelCooldown.current = false; }, 700);

      if (e.deltaY > 0) {
        goTo(activeIndex + 1);
      } else if (e.deltaY < 0) {
        goTo(activeIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIndex, slideCount, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Only intercept arrows while the deck is visible (page scrolled to top)
      if (window.scrollY > window.innerHeight * 0.5) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // On last slide, ArrowDown lets the page scroll normally
        if (activeIndex === slideCount - 1 && e.key === 'ArrowDown') return;
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, slideCount, goTo]);

  const slides = Array.isArray(children) ? children : [children];
  const slidesWithKeys = slides.map((child, i) => (
    <SlideWrapper key={i} isActive={activeIndex === i} slideIndex={i}>
      {child}
    </SlideWrapper>
  ));

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
      style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '100vw', height: '100vh' }}
    >
      <div key={activationCount} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
