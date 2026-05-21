import type { PortfolioData } from "@/lib/types";

export const portfolioData: PortfolioData = {
  settings: {
    primaryColor: "#6366F1",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    bgColor: "#0F172A",
    textColor: "#F1F5F9",
    cardColor: "#1E293B",
    navbarColor: "#0F172ABB",
    effectParticles: true,
    effectGradient: true,
    effectAnimations: true,
  },
  personalInfo: {
    nameEs: "Cristian Daniel Gutiérrez S.",
    nameEn: "Cristian Daniel Gutiérrez S.",
    titleEs: "Desarrollador de Software Senior",
    titleEn: "Senior Software Developer",
    bioEs:
      "Senior Full-Stack Software Engineer con más de 12 años de experiencia liderando la arquitectura y el desarrollo de microservicios escalables en ecosistemas .NET Core, Java y Node.js. Historial demostrado en la construcción de aplicaciones web dinámicas y de alto rendimiento con React y Angular. Comprometido con estándares rigurosos de calidad de código y la entrega de soluciones empresariales robustas y mantenibles.",
    bioEn:
      "Senior Full-Stack Software Engineer with 12+ years of experience driving the architecture and development of scalable microservices across .NET Core, Java, and Node.js ecosystems. Demonstrated success in engineering dynamic, high-performance web applications leveraging React and Angular. Proven track record of upholding rigorous code quality standards and delivering robust, maintainable enterprise software solutions.",
    headlineEs: "12 años de experiencia  ·  9 empresas  ·  Arquitecto de Microservicios  ·  IA Engineer",
    headlineEn: "12 years of experience  ·  9 companies  ·  Microservices Architect  ·  AI Engineer",
    email: "cdgutierrez6@gmail.com",
    phone: "320-617-4143",
    location: "Manizales, Caldas, Colombia",
    photoUrl: null,
    githubUrl: null,
    linkedinUrl: null,
    cvUrl: null,
  },
  experiences: [
    {
      company: "SATRACK",
      roleEs: "Desarrollador 2",
      roleEn: "Developer 2",
      descriptionEs:
        "Nuevas implementaciones y soporte a sistemas en producción. Desarrollo de microservicios con arquitectura escalable usando Docker y microfrontends.",
      descriptionEn:
        "New implementations and support for production systems. Development of microservices with scalable architecture using Docker and microfrontends.",
      technologies: ["Microservices", "Angular 8", "C#", "SQL Server", "Docker", "Microfrontends"],
      startDate: "Sep 2022",
      endDate: "Nov 2025",
      current: false,
    },
    {
      company: "DOCTUS",
      roleEs: "Analista Sr. / Desarrollador de Software",
      roleEn: "Sr. Analyst / Software Developer",
      descriptionEs:
        "Nuevas implementaciones y soporte a sistemas en producción y próximos a producción. Trabajo con arquitectura de microservicios y microfrontends.",
      descriptionEn:
        "New implementations and support for systems in production and near production. Work with microservices and microfrontends architecture.",
      technologies: ["Microservices", "Angular 8", "C#", "SQL Server", "Docker"],
      startDate: "Feb 2022",
      endDate: "Ago 2022",
      current: false,
    },
    {
      company: "INGENEO",
      roleEs: "Analista Sr. / Desarrollador de Software",
      roleEn: "Sr. Analyst / Software Developer",
      descriptionEs:
        "Nuevas implementaciones y soporte a sistemas en producción. Arquitectura de microservicios con Docker y desarrollo de microfrontends en Angular.",
      descriptionEn:
        "New implementations and support for production systems. Microservices architecture with Docker and microfrontends development in Angular.",
      technologies: ["Microservices", "Angular 8", "C#", "SQL Server", "Docker", "Microfrontends"],
      startDate: "Jul 2021",
      endDate: "Dic 2021",
      current: false,
    },
    {
      company: "COXTI",
      roleEs: "Desarrollador de Software",
      roleEn: "Software Developer",
      descriptionEs:
        "Nuevas implementaciones y soporte a sistemas en producción. Desarrollo full-stack con múltiples tecnologías modernas.",
      descriptionEn:
        "New implementations and support for production systems. Full-stack development with multiple modern technologies.",
      technologies: ["Adonis.js", "React.js", "MySQL", "SQL Server", "Angular", "Node.js"],
      startDate: "Mar 2020",
      endDate: "Ene 2021",
      current: false,
    },
    {
      company: "SOFTWARE ESTRATÉGICO",
      roleEs: "Desarrollador Web",
      roleEn: "Web Developer",
      descriptionEs:
        "Desarrollo de aplicaciones para call center para medir tiempos de llamadas y horas laborales. Proyecto con la Gobernación de Cundinamarca para la página de la economía naranja.",
      descriptionEn:
        "Development of call center applications to measure call times and working hours. Project with the Cundinamarca Government for the orange economy page.",
      technologies: ["C#", ".NET Core", "Oracle", "Java", "Angular", "MySQL", "Node.js"],
      startDate: "Jul 2018",
      endDate: "Ene 2019",
      current: false,
    },
    {
      company: "LET ME KNOW",
      roleEs: "Desarrollador de Software",
      roleEn: "Software Developer",
      descriptionEs:
        "Programación de aplicativos de la empresa. Desarrollo multiplataforma con Cordova y aplicaciones web con Angular y .NET Core.",
      descriptionEn:
        "Development of company applications. Cross-platform development with Cordova and web applications with Angular and .NET Core.",
      technologies: ["C#", "SQL Server", "MVC", "Cordova", "Angular", ".NET Core"],
      startDate: "Nov 2016",
      endDate: "Feb 2018",
      current: false,
    },
    {
      company: "LLANO ALTO",
      roleEs: "Desarrollador de Software",
      roleEn: "Software Developer",
      descriptionEs:
        "Desarrollo de plataformas para la gestión, administración y geolocalización de vehículos particulares.",
      descriptionEn:
        "Development of platforms for management, administration and geolocation of private vehicles.",
      technologies: ["Java", "PostgreSQL", "PHP", "Laravel", "CSS", "PrimeFaces", "C#", ".NET"],
      startDate: "Dic 2014",
      endDate: "Oct 2016",
      current: false,
    },
    {
      company: "ELISE COLOMBIA",
      roleEs: "Desarrollador de Software (Freelance)",
      roleEn: "Software Developer (Freelance)",
      descriptionEs: "Desarrollo de la plataforma Elise. Implementación de módulos con Java, PostgreSQL y PrimeFaces.",
      descriptionEn: "Development of the Elise platform. Module implementation with Java, PostgreSQL and PrimeFaces.",
      technologies: ["Java", "PostgreSQL", "CSS", "PrimeFaces"],
      startDate: "2014",
      endDate: "2014",
      current: false,
    },
    {
      company: "INTERKONT",
      roleEs: "Desarrollador / Soporte Nivel 2",
      roleEn: "Developer / Level 2 Support",
      descriptionEs:
        "Participación en la solución de incidentes. Desarrollo y diseño del sistema COBRA. Primera experiencia laboral formal en desarrollo de software.",
      descriptionEn:
        "Participation in incident resolution. Development and design of the COBRA system. First formal work experience in software development.",
      technologies: ["Java", "PostgreSQL", "CSS", "RichFaces"],
      startDate: "Abr 2012",
      endDate: "Oct 2014",
      current: false,
    },
  ],
  education: [
    {
      institution: "Universidad de Remington",
      degreeEs: "Ingeniería de Sistemas — 8° Semestre (En curso)",
      degreeEn: "Systems Engineering — 8th Semester (In progress)",
      period: "Actualidad",
    },
    {
      institution: "SENA",
      degreeEs: "Tecnólogo en Análisis y Desarrollo de Sistemas de Información",
      degreeEn: "Technologist in Analysis and Information Systems Development",
      period: "2011",
    },
    {
      institution: "CONFAMILIARES",
      degreeEs: "Técnico en Sistemas",
      degreeEn: "Computer Systems Technician",
      period: "2008",
    },
    {
      institution: "Colegio Fe y Alegría",
      degreeEs: "Bachillerato — Manizales, Caldas",
      degreeEn: "High School Diploma — Manizales, Caldas",
      period: "2006",
    },
  ],
  skills: [
    {
      categoryEs: "Frontend",
      categoryEn: "Frontend",
      items: ["React.js", "Angular 8", "Next.js", "TypeScript", "JavaScript", "jQuery", "CSS3", "Bootstrap", "Tailwind CSS"],
    },
    {
      categoryEs: "Backend",
      categoryEn: "Backend",
      items: ["Java", "Spring", "C#", ".NET Core", ".NET Framework", "Node.js", "Adonis.js", "PHP", "Laravel"],
    },
    {
      categoryEs: "Bases de Datos & Caché",
      categoryEn: "Databases & Cache",
      items: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "Redis", "Prisma ORM"],
    },
    {
      categoryEs: "DevOps & Cloud",
      categoryEn: "DevOps & Cloud",
      items: ["Docker", "Kubernetes", "Git", "GitLab", "AWS", "Azure", "Vercel", "CI/CD", "Microservices", "Microfrontends", "Tomcat", "GlassFish"],
    },
    {
      categoryEs: "APIs & Arquitectura",
      categoryEn: "APIs & Architecture",
      items: ["REST APIs", "GraphQL", "WebSockets", "gRPC", "API Gateway", "Stripe", "JWT / OAuth2"],
    },
    {
      categoryEs: "IA & Automatización",
      categoryEn: "AI & Automation",
      items: ["Claude Code", "ChatGPT", "GitHub Copilot", "Gemini", "n8n", "Cursor AI", "Prompt Engineering", "LangChain", "RAG Systems", "AI Code Review", "Copilot Chat", "MCP Servers", "OpenAI API"],
    },
  ],
  courses: [
    {
      institution: "SENA",
      nameEs: "Animación 2D – Flash",
      nameEn: "2D Animation – Flash",
      hours: 40,
    },
    {
      institution: "SENA",
      nameEs: "Variables y Estructura de Control – Programación Orientada a Objetos: Java",
      nameEn: "Variables and Control Structure – Object-Oriented Programming: Java",
      hours: 40,
    },
    {
      institution: "SENA",
      nameEs: "Estructura del Lenguaje de Programación C++ (Niveles 1 y 2)",
      nameEn: "C++ Programming Language Structure (Levels 1 and 2)",
      hours: 80,
    },
  ],
};
