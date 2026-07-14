"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { onIntroDone } from "./intro-state";

/**
 * TITULAR COLOSAL — el corazón del rediseño.
 *
 * Se pinta DOS VECES, en dos capas, y el canvas 3D va EN MEDIO:
 *   layer="back"  → z-index 1  (debajo del canvas)   → el laptop pasa POR DELANTE
 *   canvas 3D     → z-index 2
 *   layer="front" → z-index 3, RECORTADO por clip-path → el laptop pasa POR DETRÁS
 *
 * Resultado: el objeto 3D se entrelaza con las letras. Es el efecto de thewatch.60fps
 * y es lo que hace que la composición se sienta cara, no los efectos sueltos.
 *
 * Ambas capas se posicionan IGUAL (absolute, top 0, 100vh) para que casen al píxel.
 */
export default function HeroTitle({
  lines,
  layer,
}: {
  lines: [string, string];
  layer: "back" | "front";
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = wrap.current?.querySelectorAll<HTMLElement>(".ht-line");
    if (!els?.length) return;

    // Estado inicial: cada línea fuera de su máscara (overflow:hidden en el padre).
    gsap.set(els, { yPercent: 118 });

    // Cuando la cortina del preloader se abre, las líneas suben a su sitio.
    return onIntroDone(() => {
      gsap.to(els, {
        yPercent: 0,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.09,
      });
    });
  }, []);

  const isFront = layer === "front";

  const inner = (
    <>
      {lines.map((l, i) => (
        <span key={i} className="ht-mask">
          <span className="ht-line">{l}</span>
        </span>
      ))}
    </>
  );

  return (
    <div
      ref={wrap}
      // La capa TRASERA es puramente visual (duplicado) → fuera del árbol de accesibilidad.
      // La FRONTAL lleva el <h1> real: aunque esté recortada por clip-path, el lector de
      // pantalla y los crawlers la leen igual. Así no duplicamos el titular.
      aria-hidden={isFront ? undefined : true}
      className={`hero-title-layer ${isFront ? "hero-title-front" : "hero-title-back"}`}
    >
      {isFront ? (
        <h1 className="hero-title-inner">{inner}</h1>
      ) : (
        <div className="hero-title-inner">{inner}</div>
      )}
    </div>
  );
}
