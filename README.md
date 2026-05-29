# Portafolio — Cristian Daniel Gutiérrez S.

Portfolio personal bilingüe (ES / EN) desplegado en Vercel.

**Live:** https://portafolio-frontend-wheat.vercel.app

## Stack

- **Next.js 14** (App Router, SSG)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion / animaciones CSS**
- **Vitest** para tests unitarios

## Estructura

```
src/
├── app/[locale]/        # Rutas ES y EN (SSG)
├── components/
│   ├── portfolio/       # Secciones: Hero, Experience, Skills, Education, Contact
│   └── ui/              # Navbar, Footer, ParticlesBg
├── data/
│   └── portfolio-data.ts  # Toda la información del portafolio (bilingüe)
├── lib/
│   └── types.ts           # Tipos TypeScript + i18n (traducciones)
└── __tests__/             # Tests con Vitest
```

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:3000 → redirige a /es o /en
```

## Actualizar contenido

Todo el contenido (experiencia, educación, skills, foto) está centralizado en:

```
src/data/portfolio-data.ts
```

- **Fechas bilingües:** usar `startDateEn` / `endDateEn` para meses en inglés
- **Educación bilingüe:** usar `periodEn` para el período en inglés
- **Foto de perfil:** colocar imagen en `public/` y actualizar `photoUrl`

## Deploy

Push a `master` → Vercel despliega automáticamente.
