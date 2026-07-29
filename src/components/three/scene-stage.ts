import * as THREE from "three";

/**
 * ESCENARIO compartido del hero: posiciones mutables del cristal y la cara, actualizadas
 * UNA vez por frame (StageDriver) y leídas por la cámara, HeroArtifact y FaceReveal.
 *
 * BEAT 2 (scroll 0.6→1.3 en viewports): cristal y cara ORBITAN 180° alrededor de un
 * centro → se INTERCAMBIAN de lado, cruzándose en Z (uno al frente, otro atrás) mientras
 * cada uno rota. Es el "rotating swap" que pidió Cristian (más dinámico que abrirse).
 */
export const ORBIT_CENTER = new THREE.Vector3(0.4, 0.55, 0);
export const ORBIT_R = 2.75;

export const stage = {
  crystal: new THREE.Vector3(ORBIT_CENTER.x + ORBIT_R, ORBIT_CENTER.y, 0),
  face: new THREE.Vector3(ORBIT_CENTER.x - ORBIT_R, ORBIT_CENTER.y, 0),
  swap: 0,  // 0..1 progreso del intercambio (Beat 2)
  hp: 0,    // scrollY/innerHeight (progreso relativo al viewport)
  orbit: 0, // ángulo de órbita AMORTIGUADO (suave, no marea)
};

const clamp = THREE.MathUtils.clamp;
const smooth = (x: number) => x * x * (3 - 2 * x);

// LENTO: un medio giro (180° = intercambio) cada ~2 viewports → rotación suave por sección,
// no mareante. (Antes π/0.9 hacía que un scroll chico girara demasiado.)
const RAD_PER_VIEWPORT = Math.PI / 2.0;

export function updateStage(dt = 0.016) {
  const hp = typeof window !== "undefined" ? window.scrollY / (window.innerHeight || 1) : 0;
  stage.hp = hp;
  // swap = arranque suave del primer intercambio (para el reveal de la cara y la cámara).
  const b = smooth(clamp((hp - 0.6) / 0.7, 0, 1));
  stage.swap = b;
  // Ángulo objetivo continuo, pero AMORTIGUADO → un scroll brusco llega nivelado, sin marear.
  const targetAng = Math.max(0, hp - 0.6) * RAD_PER_VIEWPORT;
  stage.orbit = THREE.MathUtils.damp(stage.orbit, targetAng, 2.5, Math.min(dt, 0.1));
  const ang = stage.orbit;
  // Cristal: derecha → (cruza al frente) → izquierda.
  stage.crystal.set(
    ORBIT_CENTER.x + ORBIT_R * Math.cos(ang),
    ORBIT_CENTER.y + Math.sin(ang) * 0.18,
    ORBIT_CENTER.z + Math.sin(ang) * 1.15
  );
  // Cara: opuesta (izquierda → cruza al fondo → derecha).
  stage.face.set(
    ORBIT_CENTER.x + ORBIT_R * Math.cos(ang + Math.PI),
    ORBIT_CENTER.y + Math.sin(ang + Math.PI) * 0.18,
    ORBIT_CENTER.z + Math.sin(ang + Math.PI) * 1.15
  );
}
