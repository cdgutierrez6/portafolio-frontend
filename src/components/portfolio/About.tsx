"use client";

import { useReveal } from "@/hooks/useReveal";

interface Props {
  personal: { name: string; bio: string; email: string; phone: string; location: string };
  t: { about: { title: string; years: string; projects: string; companies: string } };
  experienceCount: number;
  animated: boolean;
}

const stats = [
  { value: "12+", keyEs: "años de experiencia", keyEn: "years of experience" },
  { value: "9",   keyEs: "empresas",             keyEn: "companies"           },
  { value: "20+", keyEs: "tecnologías",           keyEn: "technologies"        },
];

export default function About({ personal, t, experienceCount, animated }: Props) {
  const titleRef = useReveal<HTMLHeadingElement>({ direction: "up", threshold: 0.3, animated });
  const bioRef   = useReveal<HTMLDivElement>({ direction: "left", threshold: 0.2, animated });
  const statsRef = useReveal<HTMLDivElement>({ direction: "right", threshold: 0.2, animated });

  const contactItems = [
    { icon: "📧", label: personal.email },
    { icon: "📱", label: personal.phone },
    { icon: "📍", label: personal.location },
  ];

  return (
    <section id="about" className="section" aria-labelledby="about-heading" style={{ position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h2 id="about-heading" ref={titleRef} className={`section-title${animated ? " title-animated" : ""}`}>
          {t.about.title}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="about-grid">
          <div ref={bioRef}>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.8, opacity: 0.85, marginBottom: "2rem" }}>{personal.bio}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {contactItems.map((item, i) => (
                <ContactItem key={item.label} icon={item.icon} label={item.label} staggerIndex={i + 1} animated={animated} />
              ))}
            </div>
          </div>
          <div ref={statsRef} className="about-stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            {stats.map((s, i) => (
              <StatCard
                key={s.value}
                value={s.value}
                label={t.about.years === "años de experiencia" ? s.keyEs : s.keyEn}
                staggerIndex={i + 1}
                animated={animated}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, staggerIndex, animated }: { icon: string; label: string; staggerIndex: number; animated: boolean }) {
  const ref = useReveal<HTMLDivElement>({ direction: "left", delay: staggerIndex * 80, threshold: 0.1, animated });
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>{icon}</span>
      <span style={{ opacity: 0.8, fontSize: "0.95rem" }}>{label}</span>
    </div>
  );
}

function StatCard({ value, label, staggerIndex, animated }: { value: string; label: string; staggerIndex: number; animated: boolean }) {
  const ref = useReveal<HTMLDivElement>({ direction: "scale", delay: staggerIndex * 150, threshold: 0.2, animated });
  return (
    <div ref={ref} className="card" style={{ padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "0.5rem" }} className="gradient-text">{value}</div>
      <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>{label}</div>
    </div>
  );
}
