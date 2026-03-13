import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface HorizontalDeckProps {
  children: React.ReactNode;
  onLastSlide?: (isLast: boolean) => void;
  /** Stable IDs for each slide, used for hash-based deep linking. */
  slideIds?: string[];
}

export function HorizontalDeck({ children, onLastSlide, slideIds }: HorizontalDeckProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
  // Touch tracking refs for mobile swipe navigation
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Returns true when the page has been scrolled past the horizontal deck
  // (user is in the vertical content area). Used to guard all scroll locks.
  const isInVerticalContent = () => window.scrollY > 10;

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

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(slideCount - 1, index));
      track.scrollTo({ left: clamped * window.innerWidth, behavior: 'smooth' });
    },
    [slideCount],
  );

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

  // Re-snap slide position and recalculate activeIndex when the viewport size
  // changes (browser zoom, fullscreen enter/exit, window resize). Without this,
  // track.scrollLeft becomes mis-aligned after the viewport width changes,
  // causing activeIndex to land on a non-last slide and re-locking overflowY.
  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      // Debounce via rAF so we read the final viewport size, not an intermediate one
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        // Recalculate the correct index from the new viewport width
        const newIdx = Math.round(track.scrollLeft / window.innerWidth);
        const clamped = Math.max(0, Math.min(slideCount - 1, newIdx));
        // Re-snap scroll position to the correct slide boundary
        track.scrollLeft = clamped * window.innerWidth;
        setActiveIndex(clamped);
        onLastSlide?.(clamped === slideCount - 1);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [slideCount, onLastSlide]);

  // Lock/unlock vertical page scroll based on slide position.
  // Never lock when the user is already in the vertical content area.
  useEffect(() => {
    const onLastSlideNow = activeIndex === slideCount - 1;
    const shouldLock = !onLastSlideNow && !isInVerticalContent();

    if (isMobile) {
      // iOS Safari ignores overflow:hidden on <html>. Use position:fixed body trick instead.
      if (shouldLock) {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
      } else {
        const scrollY = parseInt(document.body.style.top || '0', 10);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (scrollY) window.scrollTo(0, -scrollY);
      }
    } else {
      document.documentElement.style.overflowY = shouldLock ? 'hidden' : '';
    }

    return () => {
      if (isMobile) {
        const scrollY = parseInt(document.body.style.top || '0', 10);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (scrollY) window.scrollTo(0, -scrollY);
      } else {
        document.documentElement.style.overflowY = '';
      }
    };
  }, [activeIndex, slideCount, isMobile]);

  // Intercept wheel/trackpad to drive horizontal navigation while deck is locked.
  // Does nothing when the user is already scrolling the vertical content.
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Never intercept when user is in the vertical content area
      if (isInVerticalContent()) return;
      // Only intercept while NOT on the last slide
      if (activeIndex === slideCount - 1) return;

      // Only act on the dominant axis — ignore tiny vertical wobble on a horizontal swipe
      const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (!isVertical) return;

      e.preventDefault();

      if (wheelCooldown.current) return;
      wheelCooldown.current = true;
      setTimeout(() => {
        wheelCooldown.current = false;
      }, 700);

      if (e.deltaY > 0) {
        goTo(activeIndex + 1);
      } else if (e.deltaY < 0) {
        goTo(activeIndex - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIndex, slideCount, goTo]);

  // Keyboard navigation — only active while the deck is on screen
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't intercept when user is in the vertical content area
      if (isInVerticalContent()) return;

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

  // Mobile touch handlers — track swipe direction to navigate slides.
  // The track handles horizontal panning natively; we only need to
  // block vertical scroll-through while the deck is locked.
  useEffect(() => {
    if (!isMobile) return;
    const track = trackRef.current;
    if (!track) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isInVerticalContent()) return;
      if (activeIndex === slideCount - 1) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      // If gesture is predominantly vertical, prevent it to stop scroll-through.
      if (dy > dx) e.preventDefault();
    };

    track.addEventListener('touchstart', onTouchStart, { passive: true });
    track.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      track.removeEventListener('touchstart', onTouchStart);
      track.removeEventListener('touchmove', onTouchMove);
    };
  }, [isMobile, activeIndex, slideCount]);

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
            aria-label={`Go to slide ${i + 1}${activeIndex === i ? ' (current)' : ''}`}
            aria-current={activeIndex === i ? 'true' : undefined}
            className="deck-dot"
            style={{
              width: activeIndex === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeIndex === i ? '#fff' : 'rgba(255,255,255,0.5)',
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
    <div style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '100vw', height: '100vh' }}>
      <div key={activationCount} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
