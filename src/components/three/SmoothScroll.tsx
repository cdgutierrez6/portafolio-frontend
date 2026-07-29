"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStore } from "./scroll-store";

/**
 * Motor de scroll de toda la página:
 *  - Lenis (smooth scroll) → es lo que hace que el scroll se sienta "caro".
 *  - Escribe el progreso global (0→1) en scrollStore.page, que lee la escena 3D.
 *  - Mantiene ScrollTrigger sincronizado con el scroll suavizado (frame-perfect).
 *  - Pinta la barra de progreso superior.
 *
 * Bajo prefers-reduced-motion NO se activa el smooth scroll (queda el scroll nativo).
 */
export default function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lenis: import("lenis").default | null = null;
    let cancelled = false;

    const paint = (p: number) => {
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };

    // Fallback sin smooth scroll: seguimos alimentando el progreso.
    const nativeScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      scrollStore.page = p;
      paint(p);
    };

    if (reduce) {
      window.addEventListener("scroll", nativeScroll, { passive: true });
      nativeScroll();
      return () => window.removeEventListener("scroll", nativeScroll);
    }

    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.05,
        // ease-out exponencial: el "coast" suave al soltar la rueda.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // syncTouch off: en móvil se usa el scroll táctil nativo (mejor INP).
      });

      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", (e: { progress: number }) => {
        scrollStore.page = e.progress;
        paint(e.progress);
        ScrollTrigger.update();
      });
      gsap.ticker.lagSmoothing(0);

      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      // El layout se asienta tarde (fuentes/imágenes) → recalibrar.
      [400, 1200, 2500].forEach((d) =>
        setTimeout(() => {
          lenis?.resize();
          ScrollTrigger.refresh();
        }, d)
      );
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        ref={bar}
        style={{
          height: "100%",
          width: "100%",
          transformOrigin: "0 50%",
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
          boxShadow: "0 0 12px color-mix(in srgb, var(--color-primary) 60%, transparent)",
        }}
      />
    </div>
  );
}
