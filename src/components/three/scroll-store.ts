/**
 * Estado de scroll compartido con la escena 3D global.
 *
 * REGLA CRÍTICA: los callbacks de scroll (Lenis / ScrollTrigger.onUpdate) se disparan
 * VARIAS VECES POR FRAME. Si desde ahí llamáramos setState, React re-renderizaría todo
 * el árbol de R3F en cada evento → jank brutal. Por eso el progreso se escribe en este
 * objeto MUTABLE de module-scope, y el render loop (useFrame) lo LEE.
 * Así se desacopla la frecuencia del scroll de la del render.
 */
export const scrollStore = {
  /** Progreso de TODA la página, 0 → 1. Lo escribe Lenis. */
  page: 0,
  /** Progreso solo de la sección showcase, 0 → 1 (para la apertura de la tapa). */
  showcase: 0,
};
