## Why

Un portfolio de Solutions Architect dirigido a mercados de habla inglesa, española y portuguesa necesita presentar el contenido en el idioma nativo del visitante para maximizar el impacto profesional. Con Next.js 14 App Router y SSG, la internacionalización debe funcionar sin costo de runtime — cada locale se pre-renderiza como HTML estático y se despliega en Vercel sin servidor.

## What Changes

- Soporte de 3 locales: `es` (default), `en`, `pt` con detección automática por `Accept-Language` header
- Archivos de traducción JSON por locale en `public/locales/<locale>/`
- Hook `useTranslation()` para acceso tipado a strings en componentes React
- Rutas con prefijo de locale (`/en/`, `/pt/`) generadas estáticamente con `generateStaticParams`
- Componente `LanguageSwitcher` con flags y cambio de locale preservando la ruta actual
- Metadata SEO por locale: `<html lang>`, `<link rel="alternate" hreflang>` en `<head>`
- Framer Motion preserva animaciones de entrada en cambios de locale sin flash

## Capabilities

### New Capabilities

- `locale-routing`: Enrutamiento por prefijo de locale con SSG — cada combinación página×locale es un HTML pre-renderizado en Vercel
- `translation-system`: Sistema de traducción JSON con hook tipado, sin dependencia de runtime i18n library pesada
- `language-switcher`: Componente UI de selección de idioma con flags, accesible y sin recarga de página

### Modified Capabilities

_(ninguna — implementación inicial del sistema i18n trilingüe)_

## Impact

- **`src/app/[locale]/`**: estructura de rutas dinámica por locale reemplaza `src/app/`
- **`src/components/`**: `LanguageSwitcher.tsx`, `useTranslation.ts` hook
- **`public/locales/`**: archivos `es.json`, `en.json`, `pt.json` por sección del portfolio
- **`next.config.js`**: configuración de `i18n` con locales y defaultLocale
- **Vercel**: sin cambios de infraestructura — SSG estático funciona igual
- **SEO**: mejora de indexación en búsquedas en inglés y portugués
