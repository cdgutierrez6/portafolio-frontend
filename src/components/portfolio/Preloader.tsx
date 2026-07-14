"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markIntroDone } from "./intro-state";

/**
 * Lo primero que se ve. No es decoración: es lo que fija el tono antes de la página
 * (thewatch.60fps abre con un "Now loading"; Ducati con un "START EXPERIENCE").
 *
 * Contador 0→100 + línea de progreso, y al terminar una CORTINA que se abre en dos
 * mitades revelando el hero. Luego avisa (markIntroDone) para que el titular entre.
 *
 * Disciplina:
 *  - Techo duro de ~1.6s: un preloader que se eterniza es una fuga de visitantes.
 *  - prefers-reduced-motion → se salta entero, sin animación.
 *  - Bloquea el scroll mientras dura (si no, el usuario scrollea a ciegas).
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      markIntroDone();
      setGone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const counter = { v: 0 };
    const tl = gsap.timeline();

    // Contador + barra (el número sube con un ease, no lineal: se siente "vivo").
    tl.to(counter, {
      v: 100,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.v);
        setN(v);
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      },
    });

    // CORTINA: dos mitades que se abren. El hero aparece por el medio.
    tl.to([top.current, bottom.current], {
      scaleY: 0,
      duration: 0.9,
      ease: "power4.inOut",
      stagger: 0.06,
    }, "+=0.12");

    tl.call(() => {
      document.body.style.overflow = "";
      markIntroDone();      // ← el Hero arranca su titular cinético aquí
    }, undefined, "-=0.45");

    tl.call(() => setGone(true));

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      {/* Mitad superior */}
      <div
        ref={top}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50.5%",
          background: "#050505",
          transformOrigin: "50% 0%",
        }}
      />
      {/* Mitad inferior */}
      <div
        ref={bottom}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50.5%",
          background: "#050505",
          transformOrigin: "50% 100%",
        }}
      />

      {/* Contador + barra, centrados (viven sobre la cortina) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          opacity: n >= 100 ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(3.5rem, 11vw, 9rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#F2F2F2",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(n).padStart(3, "0")}
        </span>
        <div style={{ width: "min(280px, 40vw)", height: "1px", background: "#2a2a2e", overflow: "hidden" }}>
          <div
            ref={bar}
            style={{
              height: "100%",
              width: "100%",
              transformOrigin: "0 50%",
              transform: "scaleX(0)",
              background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
