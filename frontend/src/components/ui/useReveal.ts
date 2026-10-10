import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — Attaches an IntersectionObserver to a container element.
 * Returns a [ref, isVisible] tuple.
 * When the element enters the viewport, it updates isVisible state to true
 * and adds the 'is-visible' CSS class to trigger CSS reveal transitions.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.08,
  once = true
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Sync is-visible class on DOM node whenever isVisible updates
  useEffect(() => {
    const el = ref.current;
    if (el && isVisible) {
      el.classList.add('is-visible');
    }
  }, [isVisible]);

  // IntersectionObserver logic
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      queueMicrotask(() => {
        setIsVisible(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isVisible] as const;
}
