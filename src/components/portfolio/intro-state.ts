/**
 * Señal de "la intro terminó". El Preloader la marca y el Hero la escucha para lanzar
 * su titular cinético. Es un objeto mutable + un evento: nada de context ni setState
 * global, que aquí solo añadiría re-renders.
 */
export const introState = { done: false };

export const INTRO_DONE_EVENT = "intro:done";

export function markIntroDone() {
  if (introState.done) return;
  introState.done = true;
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

/** Ejecuta `cb` cuando la intro haya terminado (ya sea ahora o al recibir el evento). */
export function onIntroDone(cb: () => void): () => void {
  if (introState.done) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener(INTRO_DONE_EVENT, h, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, h);
}
