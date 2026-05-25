# Portfolio — Cristian Daniel Gutiérrez S.

[![Deploy](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portafolio-frontend-wheat.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Portfolio personal multilingüe (ES · EN · PT) que presenta mi experiencia como Solutions Architect & Senior Full-Stack Engineer con 15+ años en la industria.

**[Ver Demo en Vivo →](https://portafolio-frontend-wheat.vercel.app)**

---

## Capturas de Pantalla

> *Portfolio con animación de partículas, secciones de experiencia, habilidades y formulario de contacto.*

---

## Características

- **Multilingüe** — Español, Inglés y Portugués con `next-intl`
- **Animaciones** — Transiciones fluidas con `framer-motion`
- **Partículas interactivas** — Fondo dinámico con `@tsparticles`
- **Formulario de contacto** — Envío de emails vía `Resend` API
- **SEO optimizado** — Metadata dinámica por locale
- **Rendimiento** — 90+ en Lighthouse (Performance, Accessibility, Best Practices)
- **Tests** — Suite de pruebas con `Vitest`

---

## Stack Técnico

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

## Arquitectura del Proyecto

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

## Instalación y Desarrollo Local

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos

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

### Variables de Entorno

```env
RESEND_API_KEY=your_resend_api_key_here
```

---

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

---

## Deploy

El proyecto está desplegado en **Vercel** con deploy automático desde la rama `master`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cdgutierrez6/portafolio-frontend)

---

## Contacto

**Cristian Daniel Gutiérrez S.**

- Email: [cdgutierrez6@gmail.com](mailto:cdgutierrez6@gmail.com)
- LinkedIn: [cristian-daniel-gutiérrez-segura](https://www.linkedin.com/in/cristian-daniel-guti%C3%A9rrez-segura)
- Portfolio: [portafolio-frontend-wheat.vercel.app](https://portafolio-frontend-wheat.vercel.app)

---

## Licencia

MIT License — ver [LICENSE](LICENSE) para detalles.
