## ADDED Requirements

### Requirement: Rutas pre-renderizadas por locale
El sistema SHALL pre-renderizar cada página del portfolio en los 3 locales (`es`, `en`, `pt`) como HTML estático usando `generateStaticParams` en el layout `src/app/[locale]/layout.tsx`, produciendo rutas `/es/`, `/en/` y `/pt/` para cada página.

#### Scenario: Build genera rutas por los 3 locales
- **WHEN** se ejecuta `next build`
- **THEN** el output contiene rutas estáticas `/es/`, `/en/`, `/pt/` (y sus subpáginas) sin ningún segmento marcado como dinámico SSR

#### Scenario: Acceso a ruta sin prefijo de locale
- **WHEN** un visitante accede a `/` sin prefijo de locale
- **THEN** el middleware redirige a `/<locale>/` donde `<locale>` es la preferencia del navegador o `es` por defecto

---

### Requirement: Atributo lang en HTML por locale
El layout raíz SHALL establecer `<html lang="<locale>">` con el valor exacto del locale activo (`es`, `en`, `pt`) para cada variante pre-renderizada.

#### Scenario: html lang correcto por locale
- **WHEN** un crawler o screen reader accede a `/en/`
- **THEN** el HTML contiene `<html lang="en">` en el elemento raíz

---

### Requirement: hreflang SEO alternates
Cada página SHALL incluir en su `<head>` tres tags `<link rel="alternate" hreflang="<locale>" href="<url>">` apuntando a las versiones en los otros 2 locales, más `<link rel="alternate" hreflang="x-default" href="<es-url>">`.

#### Scenario: hreflang generado en la versión EN
- **WHEN** un bot de Google indexa `/en/`
- **THEN** el `<head>` contiene `<link rel="alternate" hreflang="es">`, `<link rel="alternate" hreflang="pt">` y `<link rel="alternate" hreflang="x-default">` con URLs absolutas
