# Mi Portafolio — CLAUDE.md

## Descripción del Proyecto
Portfolio personal de Cristian Gutierrez (cristian-portfolio). Sitio web de presentación con proyectos, habilidades y experiencia profesional. Stack más ligero que el portafolio multilingüe.

## Stack
| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Animaciones | Framer Motion |
| Estilos | Tailwind CSS + tailwind-merge + clsx |
| Deploy | Vercel |

## Estructura
```
app/              # Next.js App Router (layout, pages)
components/       # UI components
contexts/         # React contexts
hooks/            # Custom hooks
lib/              # Utilities
public/           # Assets estáticos
```

## Comandos
```bash
# Dev
npm run dev        # http://localhost:3000

# Build
npm run build

# Lint
npm run lint
```

## Variables de Entorno (.env.local)
```
NEXT_PUBLIC_SITE_URL=https://...
```

## Convenciones
- Componentes en PascalCase
- Clases Tailwind con `cn()` de `lib/utils.ts` (tailwind-merge + clsx)
- Animaciones con Framer Motion — variantes definidas fuera del render

## Estado actual
En desarrollo / mantenimiento.

## Reglas de trabajo
1. Contenido del portafolio debe estar actualizado con proyectos reales
2. Performance first — imágenes optimizadas con `next/image`
3. Accesibilidad básica en todos los componentes interactivos
