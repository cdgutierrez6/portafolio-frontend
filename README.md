# Portfolio — Cristian Daniel Gutiérrez S.

[![Deploy](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portafolio-frontend-wheat.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

<details open>
<summary><h2>🇺🇸 English</h2></summary>

Multilingual personal portfolio (ES · EN · PT) showcasing 15+ years of experience as a Solutions Architect & Senior Full-Stack Engineer. Built with Next.js 14 App Router, animated with Framer Motion and auto-deployed to Vercel.

**[View Live Demo →](https://portafolio-frontend-wheat.vercel.app)**

---

### Features

- **Multilingual** — Spanish, English and Portuguese with `next-intl`
- **Animations** — Smooth transitions with `framer-motion`
- **Interactive particles** — Dynamic background with `@tsparticles`
- **Contact form** — Email delivery via `Resend` API
- **SEO optimized** — Dynamic metadata per locale
- **Performance** — 90+ on Lighthouse (Performance, Accessibility, Best Practices)
- **Tests** — Test suite with `Vitest`

---

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styles | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| Particles | @tsparticles/react |
| i18n | next-intl |
| Email | Resend API |
| Testing | Vitest |
| Deploy | Vercel |

---

### Project Architecture

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── contact/       # API Route for contact form
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── portfolio/         # Main sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   ├── IntroScreen.tsx
│   │   └── TechTag.tsx
│   └── ui/                # Reusable components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── ParticlesBg.tsx
├── data/
│   └── portfolio-data.ts  # Centralized portfolio data
├── hooks/
│   └── useReveal.ts       # Reveal-on-scroll animation hook
├── lib/
│   ├── types.ts
│   └── tech-descriptions.ts
└── middleware.ts           # Locale handling
```

---

### Local Development

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Setup

```bash
# 1. Clone the repository
git clone https://github.com/cdgutierrez6/portafolio-frontend.git
cd portafolio-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your RESEND_API_KEY

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Environment Variables

```env
RESEND_API_KEY=your_resend_api_key_here
```

---

### Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
npm run test     # Vitest test suite
```

---

### Deploy

The project is deployed on **Vercel** with automatic CI/CD from the `master` branch.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cdgutierrez6/portafolio-frontend)

---

### Contact

**Cristian Daniel Gutiérrez S.**

- Email: [cdgutierrez6@gmail.com](mailto:cdgutierrez6@gmail.com)
- LinkedIn: [cristian-daniel-gutiérrez-segura](https://www.linkedin.com/in/cristian-daniel-guti%C3%A9rrez-segura)
- Portfolio: [portafolio-frontend-wheat.vercel.app](https://portafolio-frontend-wheat.vercel.app)

---

### License

MIT License — see [LICENSE](LICENSE) for details.

</details>

---

<details>
<summary><h2>🇨🇴 Español</h2></summary>

Portfolio personal multilingüe (ES · EN · PT) que presenta más de 15 años de experiencia como Solutions Architect & Senior Full-Stack Engineer. Construido con Next.js 14 App Router, animado con Framer Motion y desplegado automáticamente en Vercel.

**[Ver Demo en Vivo →](https://portafolio-frontend-wheat.vercel.app)**

---

### Características

- **Multilingüe** — Español, Inglés y Portugués con `next-intl`
- **Animaciones** — Transiciones fluidas con `framer-motion`
- **Partículas interactivas** — Fondo dinámico con `@tsparticles`
- **Formulario de contacto** — Envío de emails vía `Resend` API
- **SEO optimizado** — Metadata dinámica por locale
- **Rendimiento** — 90+ en Lighthouse (Performance, Accessibility, Best Practices)
- **Tests** — Suite de pruebas con `Vitest`

---

### Stack Técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3 |
| Animaciones | Framer Motion 11 |
| Partículas | @tsparticles/react |
| i18n | next-intl |
| Email | Resend API |
| Testing | Vitest |
| Deploy | Vercel |

---

### Arquitectura del Proyecto

```
src/
├── app/
│   ├── [locale]/          # Rutas internacionalizadas
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── contact/       # API Route para formulario de contacto
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── portfolio/         # Secciones principales
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   ├── IntroScreen.tsx
│   │   └── TechTag.tsx
│   └── ui/                # Componentes reutilizables
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── ParticlesBg.tsx
├── data/
│   └── portfolio-data.ts  # Datos centralizados del portfolio
├── hooks/
│   └── useReveal.ts       # Hook para animaciones de entrada
├── lib/
│   ├── types.ts
│   └── tech-descriptions.ts
└── middleware.ts           # Manejo de locales
```

---

### Instalación y Desarrollo Local

#### Prerrequisitos
- Node.js 18+
- npm o yarn

#### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/cdgutierrez6/portafolio-frontend.git
cd portafolio-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tu RESEND_API_KEY

# 4. Correr en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

#### Variables de Entorno

```env
RESEND_API_KEY=your_resend_api_key_here
```

---

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
npm run test     # Suite de tests Vitest
```

---

### Deploy

El proyecto está desplegado en **Vercel** con deploy automático desde la rama `master`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cdgutierrez6/portafolio-frontend)

---

### Contacto

**Cristian Daniel Gutiérrez S.**

- Email: [cdgutierrez6@gmail.com](mailto:cdgutierrez6@gmail.com)
- LinkedIn: [cristian-daniel-gutiérrez-segura](https://www.linkedin.com/in/cristian-daniel-guti%C3%A9rrez-segura)
- Portfolio: [portafolio-frontend-wheat.vercel.app](https://portafolio-frontend-wheat.vercel.app)

---

### Licencia

MIT License — ver [LICENSE](LICENSE) para detalles.

</details>
