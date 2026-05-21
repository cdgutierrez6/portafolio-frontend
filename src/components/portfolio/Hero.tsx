"use client";

import Image from "next/image";
import { type Locale } from "@/lib/types";
import { useEffect, useRef } from "react";

interface Props {
  personal: { name: string; title: string; bio: string; photoUrl: string | null; email: string; githubUrl: string | null; linkedinUrl: string | null; cvUrl: string | null };
  t: { hero: { greeting: string; cta: string; contact: string; download: string } };
  locale: Locale;
  animated: boolean;
}

export default function Hero({ personal, t, locale, animated }: Props) {
  const titleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animated || !titleRef.current) return;
    const titles = [personal.title, "Fullstack Developer", locale === "es" ? "Arquitecto de Software" : "Software Architect"];
    let idx = 0, charIdx = 0, deleting = false;
    const type = () => {
      const current = titles[idx];
      if (!titleRef.current) return;
      if (!deleting) {
        titleRef.current.textContent = current.slice(0, charIdx++);
        if (charIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        titleRef.current.textContent = current.slice(0, charIdx--);
        if (charIdx < 0) { deleting = false; idx = (idx + 1) % titles.length; charIdx = 0; }
      }
      setTimeout(type, deleting ? 40 : 80);
    };
    type();
  }, [animated, personal.title, locale]);

  useEffect(() => {
    if (!animated) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll(".hero-anim");
    elements.forEach((el) => { el.classList.add("reveal", "reveal-up"); });
    const timer = setTimeout(() => { elements.forEach((el) => el.classList.add("visible")); }, 50);
    return () => clearTimeout(timer);
  }, [animated]);

  return (
    <section id="hero" aria-label={locale === "es" ? "Presentación" : "Introduction"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "8rem 1.5rem 4rem", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", width: "100%", display: "grid", gridTemplateColumns: "1fr auto", gap: "4rem", alignItems: "center" }} className="hero-grid">
        <div>
          <div className="hero-anim" style={{ transitionDelay: "0ms", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "9999px", background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)", marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600 }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-secondary)", display: "inline-block", animation: "pulse 2s infinite" }} />
            {locale === "es" ? "Disponible para trabajar" : "Available for work"}
          </div>

          <p className="hero-anim" style={{ fontSize: "1.2rem", opacity: 0.7, marginBottom: "0.5rem", transitionDelay: "0ms" }}>
            {t.hero.greeting}
          </p>

          <h1 className={animated ? "hero-anim hero-name" : ""} style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 900, marginBottom: "0.75rem", lineHeight: 1.1, transitionDelay: animated ? "150ms" : "0ms" }}>
            <span className="gradient-text">{personal.name}</span>
          </h1>

          <h2 className={animated ? "hero-anim" : ""} style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", color: "var(--color-secondary)", fontWeight: 600, marginBottom: "1.5rem", minHeight: "2rem", transitionDelay: animated ? "500ms" : "0ms" }}>
            <span ref={titleRef}>{personal.title}</span>
            {animated && <span style={{ borderRight: "2px solid var(--color-secondary)", animation: "pulse 1s infinite", marginLeft: "2px" }} />}
          </h2>

          <p className={animated ? "hero-anim" : ""} style={{ fontSize: "1rem", opacity: 0.75, lineHeight: 1.7, maxWidth: "600px", marginBottom: "2.5rem", transitionDelay: animated ? "500ms" : "0ms" }}>
            {personal.bio}
          </p>

          <div className="hero-cta-wrap" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#contact" className={`btn-primary${animated ? " hero-anim" : ""}`} style={{ transitionDelay: animated ? "650ms" : "0ms" }}>
              {t.hero.contact}
            </a>
            <a href="#experience" className={`btn-outline${animated ? " hero-anim" : ""}`} style={{ transitionDelay: animated ? "730ms" : "0ms" }}>
              {t.hero.cta}
            </a>
          </div>
        </div>

        <div className={animated ? "hero-anim hero-photo-anim" : "hero-photo"} style={{ display: "flex", justifyContent: "center", transitionDelay: animated ? "800ms" : "0ms" }}>
          <div style={{ position: "relative", width: "280px", height: "280px", borderRadius: "50%", padding: "4px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", boxShadow: "0 0 60px color-mix(in srgb, var(--color-primary) 30%, transparent)" }}>
            {personal.photoUrl ? (
              <Image src={personal.photoUrl} alt={locale === "es" ? `Foto de perfil de ${personal.name}` : `Profile photo of ${personal.name}`} fill style={{ borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--color-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
                👨‍💻
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.5 }}>
        <div style={{ width: "24px", height: "40px", border: "2px solid var(--color-primary)", borderRadius: "12px", display: "flex", justifyContent: "center", paddingTop: "6px" }}>
          <div style={{ width: "4px", height: "8px", background: "var(--color-primary)", borderRadius: "2px", animation: "float 1.5s ease-in-out infinite" }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-name.reveal { transform: scale(0.95); filter: blur(4px); }
        .hero-name.reveal.visible { transform: scale(1); filter: none; }
        .hero-photo-anim.reveal { transform: scale(0.8); filter: blur(6px); }
        .hero-photo-anim.reveal.visible { transform: scale(1); filter: none; }
      ` }} />
    </section>
  );
}
