"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Locale, i18n } from "@/lib/types";

interface NavbarProps {
  locale: string;
  initials?: string;
}

const SECTION_IDS = ["hero", "about", "experience", "skills", "education", "contact"];

export default function Navbar({ locale, initials = "P" }: NavbarProps) {
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const pathname = usePathname();
  const router   = useRouter();
  const t = i18n[locale as Locale]?.nav ?? i18n.es.nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sectionVisibility: Record<string, number> = {};
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          sectionVisibility[id] = entry.intersectionRatio;
          const best = Object.entries(sectionVisibility).sort((a, b) => b[1] - a[1])[0];
          if (best && best[1] > 0) setActiveSection(best[0]);
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: "-60px 0px -30% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const otherLocale = locale === "es" ? "en" : "es";
  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  const navLinks = [
    { href: "#about",      label: t.about,      id: "about"      },
    { href: "#experience", label: t.experience,  id: "experience" },
    { href: "#skills",     label: t.skills,      id: "skills"     },
    { href: "#education",  label: t.education,   id: "education"  },
    { href: "#contact",    label: t.contact,     id: "contact"    },
  ];

  const sectionLabels: Record<string, string> = {
    hero: locale === "es" ? "Inicio" : "Home",
    about: t.about,
    experience: t.experience,
    skills: t.skills,
    education: t.education,
    contact: t.contact,
  };
  const breadcrumbLabel = sectionLabels[activeSection] ?? "";

  return (
    <nav
      aria-label={locale === "es" ? "Navegación principal" : "Main navigation"}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "var(--color-navbar)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)" : "none",
        transition: "all 0.3s ease",
        padding: "0.85rem 0",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <Link href={`/${locale}`} style={{ textDecoration: "none", flexShrink: 0 }} className="nav-logo">
          <span style={{ fontSize: "1.4rem", fontWeight: 800, background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.05em" }}>
            {initials}
          </span>
        </Link>

        {scrolled && activeSection !== "hero" && (
          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", opacity: 0.55, fontWeight: 500, animation: "fadeIn 0.25s ease" }}>
            <span>{locale === "es" ? "Inicio" : "Home"}</span>
            <span style={{ opacity: 0.4 }}>›</span>
            <span style={{ color: "var(--color-primary)", opacity: 1, fontWeight: 700 }}>{breadcrumbLabel}</span>
          </div>
        )}

        <ul style={{ display: "flex", gap: "2rem", listStyle: "none", alignItems: "center" }} className="hidden-mobile">
          {navLinks.map((l) => {
            const isActive = activeSection === l.id;
            return (
              <li key={l.href}>
                <a href={l.href} className="nav-link" style={{ color: isActive ? "var(--color-primary)" : undefined, fontWeight: isActive ? 700 : undefined, position: "relative" }}>
                  {l.label}
                  {isActive && (
                    <span style={{ position: "absolute", bottom: "-4px", left: 0, right: 0, height: "2px", borderRadius: "1px", background: "var(--color-primary)", animation: "fadeIn 0.2s ease" }} />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
          <button
            onClick={switchLocale}
            aria-label={locale === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish"}
            style={{ padding: "0.35rem 0.9rem", borderRadius: "9999px", border: "1.5px solid var(--color-primary)", background: "transparent", color: "var(--color-primary)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}
            onMouseOver={(e) => { (e.target as HTMLElement).style.background = "var(--color-primary)"; (e.target as HTMLElement).style.color = "white"; }}
            onMouseOut={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "var(--color-primary)"; }}
          >
            {otherLocale.toUpperCase()}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? (locale === "es" ? "Cerrar menú" : "Close menu") : (locale === "es" ? "Abrir menú" : "Open menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="show-mobile"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text)", fontSize: "1.5rem" }}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {scrolled && activeSection !== "hero" && (
        <div className="show-mobile" style={{ padding: "0.2rem 1.5rem 0.4rem", fontSize: "0.72rem", opacity: 0.55, display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>{locale === "es" ? "Inicio" : "Home"}</span>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: "var(--color-primary)", opacity: 1, fontWeight: 700 }}>{breadcrumbLabel}</span>
        </div>
      )}

      {menuOpen && (
        <div id="mobile-menu" role="menu" style={{ background: "var(--color-card)", borderTop: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)", padding: "1rem 1.5rem" }}>
          {navLinks.map((l) => {
            const isActive = activeSection === l.id;
            return (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "0.75rem 0", color: isActive ? "var(--color-primary)" : "var(--color-text)", textDecoration: "none", fontWeight: isActive ? 700 : 500, borderBottom: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)" }}>
                {isActive && <span style={{ marginRight: "0.4rem" }}>›</span>}
                {l.label}
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: block !important; } }
      `}</style>
    </nav>
  );
}
