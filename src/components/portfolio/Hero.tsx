"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { type Locale } from "@/lib/types";
import HeroTitle from "./HeroTitle";
import { onIntroDone } from "./intro-state";
import { titleLines } from "@/lib/hero-title";

interface Props {
  personal: {
    name: string; title: string; bio: string; photoUrl: string | null;
    email: string; githubUrl: string | null; linkedinUrl: string | null; cvUrl: string | null;
  };
  t: { hero: { greeting: string; cta: string; contact: string; download: string } };
  locale: Locale;
  animated: boolean;
}

/**
 * HERO REDISEÑADO.
 *
 * Antes: nombre a 61px, foto, partículas y degradado → genérico.
 * Ahora, la fórmula medida de las referencias (thepatchsystem lleva su H1 a 270px;
 * thewatch.60fps entrelaza el objeto 3D con la tipografía):
 *   - Titular COLOSAL (~200px) recortado por el viewport.
 *   - El laptop 3D pasa ENTRE las letras (la capa trasera del titular vive bajo el
 *     canvas, en page.tsx; aquí va la capa frontal recortada).
 *   - Fondo negro extremo, sin partículas ni degradado.
 *   - La foto sale del hero (baja a "Sobre mí"): el hero es una declaración, no un CV.
 */
export default function Hero({ personal, t, locale, animated }: Props) {
  const roleRef = useRef<HTMLSpanElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLDivElement>(null);

  const lines = titleLines(personal.name);

  // Máquina de escribir en el rol (queda pequeño, bajo el titular colosal).
  useEffect(() => {
    if (!animated || !roleRef.current) return;
    const titles = [
      personal.title,
      "Fullstack Developer",
      locale === "es" ? "Arquitecto de Software" : "Software Architect",
    ];
    let idx = 0, charIdx = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const cur = titles[idx];
      if (!roleRef.current) return;
      if (!deleting) {
        roleRef.current.textContent = cur.slice(0, charIdx++);
        if (charIdx > cur.length) { deleting = true; timer = setTimeout(type, 1900); return; }
      } else {
        roleRef.current.textContent = cur.slice(0, charIdx--);
        if (charIdx < 0) { deleting = false; idx = (idx + 1) % titles.length; charIdx = 0; }
      }
      timer = setTimeout(type, deleting ? 38 : 78);
    };
    type();
    return () => clearTimeout(timer);
  }, [animated, personal.title, locale]);

  // Eyebrow y bloque inferior entran DESPUÉS del titular (escalonado = se siente dirigido).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [eyebrow.current, bottom.current].filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    gsap.set(els, { autoAlpha: 0, y: 26 });
    return onIntroDone(() => {
      gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.55 });
    });
  }, []);

  const shortBio = personal.bio.split(/(?<=\.)\s/)[0];

  return (
    <section
      id="hero"
      aria-label={locale === "es" ? "Presentación" : "Introduction"}
      style={{ position: "relative", minHeight: "100vh", zIndex: 10 }}
    >
      {/* ── Eyebrow (arriba) ── */}
      <div ref={eyebrow} className="hero-eyebrow">
        <span className="hero-dot" aria-hidden="true" />
        {locale === "es"
          ? "DISPONIBLE PARA TRABAJAR · SOLUTIONS ARCHITECT · MANIZALES, CO"
          : "AVAILABLE FOR WORK · SOLUTIONS ARCHITECT · MANIZALES, CO"}
      </div>

      {/* ── Titular colosal, capa FRONTAL (recortada).
             La capa TRASERA vive en page.tsx, DEBAJO del canvas 3D → el laptop
             pasa por delante de la mitad superior de las letras y por detrás de la baja. ── */}
      <HeroTitle lines={lines} layer="front" />

      {/* ── Bloque inferior: rol + bio corta + CTAs ── */}
      <div ref={bottom} className="hero-bottom">
        <div className="hero-bottom-left">
          <p className="hero-role">
            <span ref={roleRef}>{personal.title}</span>
            {animated && <span className="hero-caret" aria-hidden="true" />}
          </p>
          <p className="hero-bio">{shortBio}</p>
        </div>

        <div className="hero-bottom-right">
          <a href="#contact" className="btn-primary">{t.hero.contact}</a>
          <a href="#experience" className="btn-outline">{t.hero.cta}</a>
          <div className="hero-socials">
            {personal.githubUrl && (
              <a href={personal.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hero-social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
            {personal.linkedinUrl && (
              <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hero-social">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-eyebrow {
          position: absolute;
          top: clamp(6.5rem, 12vh, 9rem);
          left: 0; right: 0;
          margin: 0 auto;
          max-width: 1500px;
          padding: 0 clamp(1.25rem, 4vw, 3.5rem);
          display: flex; align-items: center; gap: 0.65rem;
          font-family: var(--font-display), sans-serif;
          font-size: clamp(0.6rem, 0.85vw, 0.72rem);
          font-weight: 700;
          letter-spacing: 0.28em;
          color: color-mix(in srgb, var(--color-text) 68%, transparent);
          z-index: 4;
        }
        .hero-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--color-secondary);
          box-shadow: 0 0 12px var(--color-secondary);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        .hero-bottom {
          position: absolute;
          bottom: clamp(3rem, 8vh, 6rem);
          left: 0; right: 0;
          margin: 0 auto;
          max-width: 1500px;
          padding: 0 clamp(1.25rem, 4vw, 3.5rem);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2.5rem;
          flex-wrap: wrap;
          z-index: 4;
        }
        .hero-bottom-left { max-width: 520px; }
        .hero-role {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(0.95rem, 1.5vw, 1.2rem);
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--color-secondary);
          margin-bottom: 0.6rem;
          min-height: 1.5em;
        }
        .hero-caret {
          display: inline-block;
          width: 2px; height: 1em;
          background: var(--color-secondary);
          margin-left: 3px;
          vertical-align: -0.12em;
          animation: pulse 1s infinite;
        }
        .hero-bio {
          font-size: 0.95rem;
          line-height: 1.65;
          color: color-mix(in srgb, var(--color-text) 82%, transparent);
        }
        .hero-bottom-right {
          display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
        }
        .hero-socials { display: flex; gap: 0.5rem; }
        .hero-social {
          display: inline-flex; align-items: center; justify-content: center;
          width: 2.5rem; height: 2.5rem; border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--color-text) 20%, transparent);
          color: var(--color-text); text-decoration: none;
          transition: border-color .2s, color .2s, background .2s;
        }
        .hero-social:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
        }
        @media (max-width: 768px) {
          .hero-bottom { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        }
      ` }} />
    </section>
  );
}
