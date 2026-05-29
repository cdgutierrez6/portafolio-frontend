import { i18n, type Locale } from "@/lib/types";
import { portfolioData } from "@/data/portfolio-data";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Experience from "@/components/portfolio/Experience";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Education from "@/components/portfolio/Education";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/ui/Footer";
import ParticlesBg from "@/components/ui/ParticlesBg";

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
      {data.settings.effectParticles && <ParticlesBg />}
      <div className={data.settings.effectGradient ? "bg-gradient-animated" : ""} style={{ minHeight: "100vh" }}>
        <Hero personal={data.personal} t={t} locale={locale} animated={data.settings.effectAnimations} />
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
