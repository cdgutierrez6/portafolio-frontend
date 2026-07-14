"use client";

import { useRef, useMemo, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "./scroll-store";

const MODEL = "/models/laptop.glb";
useGLTF.preload(MODEL);

/**
 * El laptop RECORRE TODA LA PÁGINA.
 *
 * En vez de un 3D encerrado en una sección, hay un único canvas fijo detrás de todo y
 * este modelo viaja por él: cambia de posición, gira sin parar y abre/cierra la tapa
 * según el progreso GLOBAL del scroll. Cada sección tiene su "pose".
 *
 * Las poses son keyframes sobre el progreso 0→1 de la página. Entre keyframes se
 * interpola con smoothstep, y encima se aplica `damp` para que nunca haya saltos
 * (si el usuario pega un scrollazo, el modelo persigue la pose, no teletransporta).
 */

type Pose = {
  at: number;                        // progreso de página (0→1)
  pos: [number, number, number];
  rot: [number, number, number];     // rot.y crece de forma monótona = giro continuo
  scale: number;
  lid: number;                       // 0 = tapa cerrada, 1 = abierta
};

const LID_CLOSED = Math.PI / 2;
const LID_OPEN = -0.16;

const JOURNEY: Pose[] = [
  // HERO — cruza la parte DERECHA del titular colosal (weave con las letras),
  // sin tapar el nombre. Aquí es donde el laptop pasa por delante de unas letras
  // y por detrás de otras (la capa frontal del titular está recortada).
  { at: 0.00, pos: [1.95, 0.30, -0.35], rot: [-0.22, 0.28, 0.00], scale: 0.74, lid: 1 },
  // Entra al SHOWCASE — se acerca y CIERRA la tapa (gancho)
  { at: 0.10, pos: [1.55, -0.25, 0.0], rot: [-0.30, -0.35, 0.00], scale: 0.80, lid: 0 },
  // SHOWCASE — la tapa se ABRE mientras gira
  { at: 0.22, pos: [1.45, 0.05, 0.0], rot: [-0.05, 2.00, 0.00], scale: 0.86, lid: 1 },
  { at: 0.36, pos: [1.45, -0.20, 0.0], rot: [-0.30, 5.90, 0.00], scale: 0.78, lid: 1 },
  // SOBRE MÍ — cruza a la izquierda
  { at: 0.48, pos: [-1.95, 0.10, -0.5], rot: [-0.20, 7.20, 0.16], scale: 0.62, lid: 1 },
  // EXPERIENCIA — se aleja al fondo (profundidad)
  { at: 0.60, pos: [1.95, -0.30, -1.9], rot: [-0.36, 8.60, -0.14], scale: 0.50, lid: 1 },
  // HABILIDADES — vuelve al centro, más cerca
  { at: 0.72, pos: [0.00, 0.25, -0.9], rot: [-0.14, 10.20, 0.00], scale: 0.70, lid: 1 },
  // PROYECTOS — se va al borde izquierdo
  { at: 0.84, pos: [-2.15, -0.20, -1.5], rot: [-0.30, 11.60, 0.12], scale: 0.55, lid: 1 },
  // CONTACTO — al centro y CIERRA la tapa (cierre de la historia)
  { at: 0.94, pos: [0.00, -0.10, -0.4], rot: [-0.25, 13.00, 0.00], scale: 0.72, lid: 0 },
  { at: 1.00, pos: [0.00, -0.35, -1.1], rot: [-0.40, 13.60, 0.00], scale: 0.60, lid: 0 },
];

const smooth = (t: number) => t * t * (3 - 2 * t); // smoothstep

/** Devuelve la pose interpolada para un progreso de página dado. */
function poseAt(p: number) {
  const c = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < JOURNEY.length - 2 && c > JOURNEY[i + 1].at) i++;
  const a = JOURNEY[i];
  const b = JOURNEY[i + 1];
  const span = Math.max(1e-5, b.at - a.at);
  const t = smooth(Math.min(1, Math.max(0, (c - a.at) / span)));
  const L = THREE.MathUtils.lerp;
  return {
    px: L(a.pos[0], b.pos[0], t),
    py: L(a.pos[1], b.pos[1], t),
    pz: L(a.pos[2], b.pos[2], t),
    rx: L(a.rot[0], b.rot[0], t),
    ry: L(a.rot[1], b.rot[1], t),
    rz: L(a.rot[2], b.rot[2], t),
    s: L(a.scale, b.scale, t),
    lid: L(a.lid, b.lid, t),
  };
}

export default function LaptopJourney() {
  const { scene } = useGLTF(MODEL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Object3D | null>(null);

  useLayoutEffect(() => {
    lid.current = model.getObjectByName("LidPivot") ?? null;

    // SNAP inicial a la pose que toca. Sin esto, el modelo arranca en el centro a escala 1
    // y "vuela" hasta su sitio (y si la pestaña estuvo en background, se queda a medias).
    const g = group.current;
    const q = poseAt(scrollStore.page);
    if (g) {
      g.position.set(q.px, q.py, q.pz);
      g.rotation.set(q.rx, q.ry, q.rz);
      g.scale.setScalar(q.s);
    }
    if (lid.current) {
      lid.current.rotation.x = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, q.lid);
    }
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      // El "código" y el logo deben saltarse el tone mapping para que el bloom
      // los encienda de verdad (si no, quedan lavados).
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && /^(Code|Logo)/i.test(mat.name)) mat.toneMapped = false;
    });
  }, [model]);

  useFrame((state, dt) => {
    const g = group.current;
    const l = lid.current;
    if (!g || !l) return;

    // dt acotado: tras una pestaña en background dt es enorme y el damp pega un salto.
    const d = Math.min(dt, 0.1);
    const t = state.clock.elapsedTime;

    const q = poseAt(scrollStore.page);

    // Flotación viva incluso con el scroll quieto (la página nunca se siente "muerta").
    const bobY = Math.sin(t * 0.7) * 0.05;
    const bobR = Math.sin(t * 0.45) * 0.02;

    g.position.x = THREE.MathUtils.damp(g.position.x, q.px, 4, d);
    g.position.y = THREE.MathUtils.damp(g.position.y, q.py + bobY, 4, d);
    g.position.z = THREE.MathUtils.damp(g.position.z, q.pz, 4, d);

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, q.rx + bobR, 4, d);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, q.ry, 4, d);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, q.rz, 4, d);

    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, q.s, 4, d));

    l.rotation.x = THREE.MathUtils.damp(
      l.rotation.x,
      THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, q.lid),
      5,
      d
    );
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={model} />
    </group>
  );
}
