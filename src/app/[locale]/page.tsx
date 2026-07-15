import { i18n, type Locale } from "@/lib/types";
import { portfolioData } from "@/data/portfolio-data";
import Hero from "@/components/portfolio/Hero";
import Showcase3D from "@/components/portfolio/Showcase3D";
import About from "@/components/portfolio/About";
import Experience from "@/components/portfolio/Experience";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/ui/Footer";
import SmoothScroll from "@/components/three/SmoothScroll";
import Scene3DBackgroundClient from "@/components/three/Scene3DBackgroundClient";
import AtmosphereVideo from "@/components/three/AtmosphereVideo";
import HeroTitle from "@/components/portfolio/HeroTitle";
import { titleLines } from "@/lib/hero-title";

function getData(locale: Locale) {
  const { settings, personalInfo, experiences, skills, education, courses, projects } = portfolioData;
  const isEs = locale === "es";

  return {
    settings,
    personal: {
      name:       isEs ? personalInfo.nameEs  : personalInfo.nameEn,
      title:      isEs ? personalInfo.titleEs : personalInfo.titleEn,
      bio:        isEs ? personalInfo.bioEs   : personalInfo.bioEn,
      email:      personalInfo.email,
      phone:      personalInfo.phone,
      location:   personalInfo.location,
      photoUrl:   personalInfo.photoUrl,
      githubUrl:  personalInfo.githubUrl,
      linkedinUrl: personalInfo.linkedinUrl,
      cvUrl:      personalInfo.cvUrl,
    },
    experiences: experiences.map((e, i) => ({
      id:           i + 1,
      company:      e.company,
      role:         isEs ? e.roleEs        : e.roleEn,
      description:  isEs ? e.descriptionEs : e.descriptionEn,
      technologies: e.technologies,
      startDate:    (!isEs && e.startDateEn) ? e.startDateEn : e.startDate,
      endDate:      (!isEs && e.endDateEn)   ? e.endDateEn   : e.endDate,
      current:      e.current,
    })),
    skills: skills.map((s, i) => ({
      id:       i + 1,
      category: isEs ? s.categoryEs : s.categoryEn,
      items:    s.items,
    })),
    education: education.map((e, i) => ({
      id:          i + 1,
      institution: e.institution,
      degree:      isEs ? e.degreeEs : e.degreeEn,
      period:      (!isEs && e.periodEn) ? e.periodEn : e.period,
    })),
    projects: projects.map((p, i) => ({
      id:           i + 1,
      name:         p.name,
      description:  isEs ? p.descriptionEs : p.descriptionEn,
      technologies: p.technologies,
      githubUrl:    p.githubUrl,
      liveUrl:      p.liveUrl,
      isCurrent:    p.isCurrent,
      language:     p.language,
      stars:        p.stars,
      accent:       p.accent,
    })),
    courses: courses.map((c, i) => ({
      id:          i + 1,
      institution: c.institution,
      name:        isEs ? c.nameEs : c.nameEn,
      hours:       c.hours,
    })),
  };
}

export default function PortfolioPage({ params }: { params: { locale: string } }) {
  const locale = (params.locale === "en" ? "en" : "es") as Locale;
  const data = getData(locale);
  const t = i18n[locale];

  return (
    <>
      {/* Motor de scroll suave (Lenis) + barra de progreso superior */}
      <SmoothScroll />

      {/* Capa de atmósfera (z0): video de red neuronal muy oscurecido/desenfocado, solo
          en el hero (se desvanece al scrollear). Le da profundidad al campo vivo. */}
      <AtmosphereVideo />

      {/* ── ORDEN DE CAPAS (esto es lo que crea el efecto de 60fps) ──
          z1  capa TRASERA del titular colosal   → el laptop pasa POR DELANTE
          z2  canvas 3D global (fijo)
          z3  capa FRONTAL del titular (recortada) + todo el contenido
          Resultado: el laptop se ENTRELAZA con las letras. */}
      <HeroTitle lines={titleLines(data.personal.name)} layer="back" />

      {/* UN canvas 3D fijo detrás de toda la página. El laptop la recorre entera:
          cambia de pose en cada sección, gira sin parar y abre/cierra la tapa. */}
      <Scene3DBackgroundClient />

      {/* Contenido (z 3), transparente para que el 3D se vea entre las secciones. */}
      <div style={{ minHeight: "100vh", position: "relative", zIndex: 3 }}>
        <Hero personal={data.personal} t={t} locale={locale} animated={data.settings.effectAnimations} />
        <Showcase3D locale={locale} />
        <About personal={data.personal} t={t} experienceCount={data.experiences.length} animated={data.settings.effectAnimations} />
        <Experience experiences={data.experiences} t={t} animated={data.settings.effectAnimations} />
        <Skills skills={data.skills} t={t} animated={data.settings.effectAnimations} />
        <Projects projects={data.projects} t={t} animated={data.settings.effectAnimations} />
        <Education education={data.education} courses={data.courses} t={t} animated={data.settings.effectAnimations} />
        <Contact personal={data.personal} t={t} animated={data.settings.effectAnimations} />
        <Footer personal={data.personal} t={t} locale={locale} />
      </div>
    </>
  );
}
