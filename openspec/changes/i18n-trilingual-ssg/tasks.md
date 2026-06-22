## 1. Estructura de Rutas por Locale

- [ ] 1.1 Mover `src/app/` a `src/app/[locale]/` — renombrar el directorio y actualizar todos los imports relativos afectados
- [ ] 1.2 Agregar `generateStaticParams` en `src/app/[locale]/layout.tsx` exportando `[{ locale: 'es' }, { locale: 'en' }, { locale: 'pt' }]`
- [ ] 1.3 Actualizar `next.config.js` para declarar el parámetro `[locale]` como static y no incluirlo en ISR
- [ ] 1.4 Crear `middleware.ts` en la raíz que lee `Accept-Language` header y `preferred-locale` de cookies, redirige visitas sin prefijo a `/<locale>/`

## 2. Sistema de Traducciones

- [ ] 2.1 Crear `public/locales/es.json` extrayendo todos los strings hardcodeados del portfolio (hero, about, projects, skills, contact, nav) como objeto tipado
- [ ] 2.2 Crear `public/locales/en.json` con las mismas keys traducidas al inglés
- [ ] 2.3 Crear `public/locales/pt.json` con las mismas keys traducidas al portugués (pt-BR)
- [ ] 2.4 Implementar `src/hooks/useTranslation.ts` con tipo `Translations` inferido desde la estructura de `es.json`, fallback a `es` para keys faltantes, y función `t(key)` con dot-notation tipada
- [ ] 2.5 Reemplazar todos los strings hardcodeados en componentes por `t("seccion.key")` usando el hook

## 3. SEO y Metadata por Locale

- [ ] 3.1 Actualizar `generateMetadata` en `layout.tsx` para retornar `<html lang={locale}>` y `alternates.languages` con las URLs absolutas de los 3 locales
- [ ] 3.2 Verificar con `next build` que el HTML de cada variante contiene `lang` correcto y los 4 tags `hreflang` (es, en, pt, x-default)

## 4. Componente LanguageSwitcher

- [ ] 4.1 Crear `src/components/LanguageSwitcher.tsx` con botones para ES 🇪🇸, EN 🇬🇧, PT 🇧🇷, resaltando el locale activo con clase CSS diferenciada
- [ ] 4.2 Implementar la navegación con `useRouter().push(/<newLocale>/<currentPath>)` preservando la ruta actual sin recarga
- [ ] 4.3 Agregar `aria-label="Seleccionar idioma"` al contenedor y `aria-current="true"` al locale activo
- [ ] 4.4 Guardar el locale seleccionado en `localStorage` key `preferred-locale` y actualizar el middleware para leerlo como cookie (via `document.cookie` en el switcher client-side)
- [ ] 4.5 Integrar `LanguageSwitcher` en el componente `Navbar` o `Header` existente

## 5. Framer Motion y Animaciones

- [ ] 5.1 Agregar `key={locale}` al `<AnimatePresence>` del layout para que las animaciones se re-ejecuten en cada cambio de locale
- [ ] 5.2 Verificar visualmente (dev server) que el cambio de locale produce exactamente una animación de entrada sin flash

## 6. Verificación y Build

- [ ] 6.1 `next build` sin errores TypeScript — verificar que no hay keys de traducción sin tipo
- [ ] 6.2 Navegar a `/`, `/en/`, `/pt/` en local y confirmar que el contenido, `lang` y animaciones son correctos en cada locale
- [ ] 6.3 Verificar con DevTools que `localStorage["preferred-locale"]` se actualiza al cambiar idioma
- [ ] 6.4 Verificar el `<head>` con View Source — confirmar `hreflang` alternates presentes en las 3 variantes
- [ ] 6.5 Push a `master` y confirmar que Vercel build pasa y las 3 URLs de locale están activas
