"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "left" | "right" | "scale";

interface UseRevealOptions {
  direction?: Direction;
  delay?: number;
  threshold?: number;
  animated?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(options: UseRevealOptions = {}) {
  const { direction = "up", delay = 0, threshold = 0.15, animated = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!animated) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal", `reveal-${direction}`);
    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => { observer.disconnect(); };
  }, [animated, direction, delay, threshold]);

  return ref;
}
