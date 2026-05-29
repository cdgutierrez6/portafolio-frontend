"use client";

import { type Skill } from "@/lib/types";
import { useReveal } from "@/hooks/useReveal";
import { TechTag } from "@/components/portfolio/TechTag";

interface Props {
  skills: Skill[];
  t: { skills: { title: string; technologies: string } };
  animated: boolean;
}

const CATEGORY_META: Record<string, { icon: string; gradient: string; accent: string }> = {
  Frontend:                { icon: "⚡", gradient: "135deg, #6366F1, #8B5CF6", accent: "#6366F1" },
  Backend:                 { icon: "🔧", gradient: "135deg, #10B981, #059669", accent: "#10B981" },
  "Bases de Datos & Caché":{ icon: "🗄️", gradient: "135deg, #F59E0B, #D97706", accent: "#F59E0B" },
  "Databases & Cache":     { icon: "🗄️", gradient: "135deg, #F59E0B, #D97706", accent: "#F59E0B" },
  "DevOps & Cloud":        { icon: "🚀", gradient: "135deg, #EF4444, #EC4899", accent: "#EF4444" },
  "IA & Automatización":   { icon: "🤖", gradient: "135deg, #06B6D4, #3B82F6", accent: "#06B6D4" },
  "AI & Automation":       { icon: "🤖", gradient: "135deg, #06B6D4, #3B82F6", accent: "#06B6D4" },
  "APIs & Arquitectura":   { icon: "🔌", gradient: "135deg, #8B5CF6, #6366F1", accent: "#8B5CF6" },
  "APIs & Architecture":   { icon: "🔌", gradient: "135deg, #8B5CF6, #6366F1", accent: "#8B5CF6" },
};

export default function Skills({ skills, t, animated }: Props) {
  const titleRef = useReveal<HTMLHeadingElement>({ direction: "up", threshold: 0.2, animated });

  return (
    <section id="skills" className="section" aria-labelledby="skills-heading" style={{ position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <h2 id="skills-heading" ref={titleRef} className="section-title">{t.skills.title}</h2>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "1.75rem" }}>
          {skills.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} index={i} animated={animated} technologies={t.skills.technologies} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, index, animated, technologies }: { skill: Skill; index: number; animated: boolean; technologies: string }) {
  const ref  = useReveal<HTMLDivElement>({ direction: "up", delay: index * 120, threshold: 0.1, animated });
  const meta = CATEGORY_META[skill.category] ?? { icon: "💡", gradient: "135deg, #6366F1, #10B981", accent: "#6366F1" };

  return (
    <div ref={ref} className="skill-card-v2">
      <div className="skill-card-bar" style={{ background: `linear-gradient(${meta.gradient})` }} />
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.5rem" }}>
        <div className="skill-icon-wrap" style={{ background: `linear-gradient(${meta.gradient})` }}>
          <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{meta.icon}</span>
        </div>
        <div>
          <h3 className="skill-category-title" style={{ color: meta.accent }}>{skill.category}</h3>
          <p className="skill-count">{skill.items.length} {technologies}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {skill.items.map((item, tagIdx) => (
          <TechTag key={item} name={item} accentColor={meta.accent} animDelay={animated ? `${index * 120 + tagIdx * 35}ms` : "0ms"} />
        ))}
      </div>
      <div className="skill-card-glow" style={{ background: `linear-gradient(to right, transparent, ${meta.accent}60, transparent)` }} />
    </div>
  );
}
