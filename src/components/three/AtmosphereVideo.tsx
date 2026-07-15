"use client";

import { useEffect, useRef, useState } from "react";
import { scrollStore } from "./scroll-store";

/**
 * Capa de ATMÓSFERA: el video de red neuronal (Veo) MUY oscurecido y desenfocado,
 * detrás de todo (z0). Aporta profundidad de campo volumétrica que los puntos del
 * campo vivo (z2) no pueden dar — pero NO compite: es fondo, no figura.
 *
 * - El trípode que Veo dibujó en el centro-abajo se esconde con object-position alto +
 *   scale + una viñeta/gradiente inferior oscuro.
 * - Se DESVANECE al salir del hero (opacidad ligada al scroll): el protagonista del
 *   resto de la página es el grafo vivo, no el video.
 * - LCP-safe: primero el poster (webp 30KB); el video se monta tras el primer paint.
 * - prefers-reduced-motion → solo poster, sin video.
 */
export default function AtmosphereVideo() {
  const layer = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      const id = window.setTimeout(() => setShowVideo(true), 700);
      // Desvanecer con el scroll: full en el hero, fuera al bajar (protege legibilidad
      // y le cede el protagonismo al grafo). rAF barato, lee scrollStore (sin setState).
      let raf = 0;
      const tick = () => {
        if (layer.current) {
          const o = Math.max(0, 1 - scrollStore.page / 0.14);
          layer.current.style.opacity = String(o);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => {
        clearTimeout(id);
        cancelAnimationFrame(raf);
      };
    }
  }, []);

  const media: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center 26%", // muestra la parte alta → el trípode (abajo) queda fuera
    filter: "brightness(0.5) saturate(1.1) blur(2px)",
    transform: "scale(1.3)",
  };

  return (
    <div ref={layer} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", opacity: 1 }}>
      {/* Poster (siempre, LCP-safe) */}
      <div
        style={{
          ...media,
          backgroundImage: "url(/media/hero-poster.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center 26%",
        }}
      />
      {showVideo && (
        <video autoPlay loop muted playsInline preload="none" style={media}>
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      )}
      {/* Viñeta + oscurecido inferior: mata el trípode y protege la lectura del texto. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 32%, transparent 28%, rgba(5,5,8,0.6) 78%), linear-gradient(to bottom, rgba(5,5,8,0.25) 0%, transparent 30%, #050508 94%)",
        }}
      />
    </div>
  );
}
