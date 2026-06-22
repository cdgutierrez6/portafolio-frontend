## ADDED Requirements

### Requirement: Componente LanguageSwitcher
El componente `LanguageSwitcher` SHALL mostrar los 3 locales disponibles (ES, EN, PT) con su bandera emoji y nombre corto, resaltando el locale activo, y navegar a la misma ruta en el locale seleccionado sin recarga de página completa.

#### Scenario: Cambio de locale preserva la ruta
- **WHEN** el usuario está en `/en/projects` y selecciona PT
- **THEN** el router navega a `/pt/projects` sin recarga de página ni pérdida de estado de scroll

#### Scenario: Locale activo resaltado visualmente
- **WHEN** el locale activo es `en`
- **THEN** el botón EN tiene estilos diferenciados (font-weight: bold o color distinto) respecto a ES y PT

---

### Requirement: Accesibilidad del switcher
El `LanguageSwitcher` SHALL ser navegable por teclado (Tab para enfocar, Enter/Space para seleccionar) y tener `aria-label="Seleccionar idioma"` en el contenedor y `aria-current="true"` en el locale activo.

#### Scenario: Navegación por teclado
- **WHEN** el usuario presiona Tab hasta llegar al LanguageSwitcher y luego Enter en un locale
- **THEN** el locale cambia y el foco se mantiene en el switcher

#### Scenario: aria-current en locale activo
- **WHEN** el locale activo es `pt`
- **THEN** el elemento PT tiene `aria-current="true"` y los demás tienen `aria-current="false"`

---

### Requirement: Sin recarga en cambio de locale con Framer Motion
Las animaciones de Framer Motion del layout SHALL re-ejecutarse correctamente al cambiar de locale, sin flash visual ni animación duplicada.

#### Scenario: Animación de entrada al cambiar locale
- **WHEN** el usuario cambia de `es` a `en`
- **THEN** el contenido de la página anima su entrada (fade-in o slide) exactamente una vez, sin parpadeo
