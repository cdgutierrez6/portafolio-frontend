export type Locale = "es" | "en";

export interface PortfolioData {
  settings: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    bgColor: string;
    textColor: string;
    cardColor: string;
    navbarColor: string;
    effectParticles: boolean;
    effectGradient: boolean;
    effectAnimations: boolean;
  };
  personalInfo: {
    nameEs: string;
    nameEn: string;
    titleEs: string;
    titleEn: string;
    bioEs: string;
    bioEn: string;
    headlineEs: string;
    headlineEn: string;
    email: string;
    phone: string;
    location: string;
    photoUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    cvUrl: string | null;
  };
  experiences: ExperienceRaw[];
  education: EducationRaw[];
  skills: SkillRaw[];
  courses: CourseRaw[];
}

export interface ExperienceRaw {
  company: string;
  roleEs: string;
  roleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  technologies: string[];
  startDate: string;
  startDateEn?: string;
  endDate: string | null;
  endDateEn?: string;
  current: boolean;
}

export interface EducationRaw {
  institution: string;
  degreeEs: string;
  degreeEn: string;
  period: string;
  periodEn?: string;
}

export interface SkillRaw {
  categoryEs: string;
  categoryEn: string;
  items: string[];
}

export interface CourseRaw {
  institution: string;
  nameEs: string;
  nameEn: string;
  hours: number | null;
}

// Tipos localizados (usados por componentes)
export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  period: string;
}

export interface Skill {
  id: number;
  category: string;
  items: string[];
}

export interface Course {
  id: number;
  institution: string;
  name: string;
  hours: number | null;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  cvUrl: string | null;
}

export const i18n = {
  es: {
    nav: {
      about: "Sobre mí",
      experience: "Experiencia",
      skills: "Habilidades",
      education: "Educación",
      contact: "Contacto",
    },
    hero: {
      greeting: "Hola, soy",
      cta: "Ver mi trabajo",
      contact: "Contáctame",
      download: "Descargar CV",
    },
    about: { title: "Sobre Mí", years: "años de experiencia", projects: "proyectos", companies: "empresas" },
    experience: { title: "Experiencia Laboral", present: "Presente", technologies: "Tecnologías" },
    skills: { title: "Habilidades Técnicas", technologies: "tecnologías" },
    education: { title: "Educación & Formación", courses: "Cursos & Certificaciones", hours: "horas" },
    contact: {
      title: "Contacto", send: "Enviar mensaje", name: "Nombre", message: "Mensaje", subject: "Asunto",
      phone: "TELÉFONO", location: "UBICACIÓN", email: "EMAIL",
      placeholderName: "Tu nombre", placeholderEmail: "tu@email.com",
      placeholderSubject: "Asunto del mensaje", placeholderMessage: "Escribe tu mensaje aquí...",
    },
    footer: { rights: "Todos los derechos reservados." },
  },
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      education: "Education",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      cta: "See my work",
      contact: "Contact me",
      download: "Download CV",
    },
    about: { title: "About Me", years: "years of experience", projects: "projects", companies: "companies" },
    experience: { title: "Work Experience", present: "Present", technologies: "Technologies" },
    skills: { title: "Technical Skills", technologies: "technologies" },
    education: { title: "Education & Training", courses: "Courses & Certifications", hours: "hours" },
    contact: {
      title: "Contact", send: "Send message", name: "Name", message: "Message", subject: "Subject",
      phone: "PHONE", location: "LOCATION", email: "EMAIL",
      placeholderName: "Your name", placeholderEmail: "your@email.com",
      placeholderSubject: "Subject", placeholderMessage: "Write your message here...",
    },
    footer: { rights: "All rights reserved." },
  },
};
