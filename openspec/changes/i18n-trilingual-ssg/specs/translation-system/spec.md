## ADDED Requirements

### Requirement: Archivos de traducción JSON por locale
El sistema SHALL mantener un archivo JSON por locale en `public/locales/<locale>.json` con todas las strings del portfolio organizadas por sección (hero, about, projects, skills, contact). Cada key SHALL existir en los 3 locales.

#### Scenario: JSON de locale cargado correctamente
- **WHEN** el hook `useTranslation` se inicializa con locale `en`
- **THEN** retorna el objeto con las traducciones de `public/locales/en.json` sin errores

#### Scenario: Fallback a ES para keys faltantes en PT
- **WHEN** una key existe en `es.json` pero no en `pt.json`
- **THEN** el hook retorna el valor del locale `es` en lugar de mostrar la key raw o undefined

---

### Requirement: Hook useTranslation tipado
El hook `useTranslation(locale: Locale)` SHALL retornar un objeto `t` con tipado TypeScript inferido desde la estructura de `es.json` (el locale canónico), de modo que los accesos a keys inexistentes sean errores de compilación.

#### Scenario: Error de compilación en key inválida
- **WHEN** un componente accede a `t("seccion.keyQueNoExiste")`
- **THEN** TypeScript reporta error en tiempo de compilación, no en runtime

#### Scenario: Acceso a traducción anidada
- **WHEN** el componente accede a `t("hero.title")`
- **THEN** retorna el string correspondiente al locale activo sin runtime errors

---

### Requirement: Locale persistido en localStorage
El locale seleccionado por el usuario SHALL persistirse en `localStorage` con key `preferred-locale` y leerse en el middleware de Next.js para el redirect inicial en visitas subsiguientes.

#### Scenario: Preferencia de locale recordada
- **WHEN** el usuario cambia a `en` y recarga la página
- **THEN** el middleware lee `preferred-locale` de la cookie/header y redirige a `/en/` sin pasar por `/es/`
