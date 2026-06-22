## Context

El portfolio de Cristian está desplegado en Vercel con Next.js 14 App Router y actualmente soporta ES y EN. Para ampliar la audiencia al mercado lusófono (Brasil, Portugal) se añade PT como tercer locale. La restricción clave es que el portfolio es completamente estático (SSG) — sin server-side rendering ni edge functions — por lo que el i18n no puede depender de resolución dinámica de idioma en runtime.

## Goals / Non-Goals

**Goals:**
- 3 locales (es, en, pt) pre-renderizados como HTML estático en Vercel
- Detección de locale por preferencia del navegador en la primera visita
- Cambio de idioma sin recarga de página, preservando la ruta actual
- SEO correcto: `<html lang>` + `hreflang` alternates para los 3 locales
- Sin librería i18n pesada (next-intl o i18next) — solución propia liviana

**Non-Goals:**
- Traducción automática (machine translation) — las traducciones son manuales
- Detección de locale por geolocalización IP
- Cambio de locale persistido en base de datos o sesión de usuario (solo localStorage)
- Traducción de imágenes o assets binarios

## Decisions

### D1 — App Router `[locale]` segment sobre Pages Router i18n config

**Decisión**: estructura `src/app/[locale]/` con `generateStaticParams` exportando los 3 locales.

**Alternativas consideradas**:
- _Pages Router con `next.config.js` i18n_: deprecado en Next.js 13+ en favor de App Router; no compatible con RSC (React Server Components).
- _Sub-dominio por locale_ (es.cristian.dev): requiere DNS por locale y Vercel project por locale — complejidad operacional innecesaria.

**Rationale**: `[locale]` como segmento dinámico en App Router es el patrón canónico de Next.js 14 para i18n estático. `generateStaticParams` pre-renderiza las 3 variantes sin runtime adicional.

---

### D2 — JSON files propios sobre next-intl / i18next

**Decisión**: archivos `public/locales/<locale>.json` consumidos por un hook `useTranslation(locale)` propio.

**Alternativas consideradas**:
- _next-intl_: excelente DX pero añade ~30KB al bundle y requiere Provider en el layout root.
- _i18next_: demasiado pesado para un portfolio estático; diseñado para apps con namespaces complejos.

**Rationale**: el portfolio tiene ~50 strings por locale. Un hook de 20 líneas que lee el JSON del locale activo es suficiente y no añade peso al bundle. Las traducciones son accesibles como objeto tipado en TypeScript.

---

### D3 — localStorage para persistir locale sobre cookies

**Decisión**: el locale seleccionado se persiste en `localStorage` y se lee en el `middleware.ts` de Next.js para el redirect inicial.

**Alternativas consideradas**:
- _Cookies_: requieren banner de consentimiento GDPR en algunos mercados; más fricción.
- _Solo URL_: si el usuario borra el historial, vuelve al locale default en cada visita.

**Rationale**: localStorage es suficiente para la UX deseada (recordar preferencia entre visitas) sin fricción regulatoria.

## Risks / Trade-offs

| Riesgo | Mitigation |
|--------|-----------|
| Flash de idioma incorrecto antes de que Next.js lea el locale de la URL | `<html lang>` se establece en el layout server component — no hay flash de idioma |
| Strings sin traducir en PT muestran la key en lugar del texto | Fallback a `es` en el hook cuando la key no existe en el locale solicitado |
| Build time crece por 3× el número de páginas pre-renderizadas | El portfolio tiene <10 páginas — el build sigue siendo sub-30s en Vercel |
| hreflang mal configurado daña el SEO existente | Validar con Google Search Console tras el deploy; hreflang generado dinámicamente por locale en `generateMetadata` |

## Migration Plan

1. Renombrar `src/app/` → `src/app/[locale]/` y actualizar todos los imports
2. Añadir `generateStaticParams` en el layout root exportando `['es', 'en', 'pt']`
3. Crear `public/locales/es.json` con strings existentes; generar `en.json` y `pt.json`
4. Implementar `useTranslation` hook y reemplazar strings hardcodeados en componentes
5. Añadir `LanguageSwitcher` al header
6. Configurar `middleware.ts` para redirect a locale del navegador en visita sin prefijo
7. Verificar build local con `next build && next export`
8. Push a `master` → Vercel auto-deploys

**Rollback**: revertir el commit — Vercel re-deploya la versión anterior automáticamente.

## Open Questions

- ¿El locale `pt` es pt-BR o pt-PT? (Brasil tiene mayor audiencia tech — propuesta: `pt-BR` con hreflang `pt-BR`)
- ¿Animaciones de Framer Motion se re-ejecutan al cambiar locale? (verificar que `AnimatePresence` tiene key por locale)
