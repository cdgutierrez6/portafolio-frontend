/**
 * Estado de scroll compartido con la escena 3D.
 *
 * REGLA CRÍTICA: ScrollTrigger.onUpdate se dispara VARIAS VECES POR FRAME. Si desde ahí
 * llamamos setState, React re-renderiza todo el árbol de R3F en cada evento → jank brutal.
 * Por eso el progreso se escribe en este objeto MUTABLE de module-scope, y el render loop
 * (useFrame) lo LEE. Así se desacopla la frecuencia del scroll de la del render.
 */
export const scrollStore = {
  /** 0 → 1 mientras la sección showcase recorre el viewport. */
  showcase: 0,
};
