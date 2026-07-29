"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "./scroll-store";

/**
 * EL TRAZO DEL ARQUITECTO — el objeto protagonista que recorre TODA la pantalla al
 * scrollear (el reemplazo del laptop), pero es lo OPUESTO a un aparato: una línea-diagrama
 * VIVA, dibujada por una cabeza-cometa luminosa, que MUTA de pose sección a sección con la
 * arquitectura real de Cristian:
 *
 *   pose 0  FIRMA          → subraya el nombre colosal (hero)
 *   pose 1  STREAM (Kafka)  → onda de paquetes que fluye (SATRACK / eventos)
 *   pose 2  MALLA 9 NODOS   → anillo de 9 lóbulos (.NET8 / FleetVision)
 *   pose 3  LOOP DE VOZ     → lemniscata / ciclo (EfiziAI)
 *   pose 4  CONVERGENCIA    → espiral que colapsa a un punto (el CTA)
 *
 * CLAVE DE RENDIMIENTO (lo que lo hace barato y sin jank):
 *  - Topología FIJA: los 5 tubos se hornean UNA vez con el MISMO nº de vértices.
 *  - El morph es un blend de pesos-tienda de 5 atributos de posición EN EL SHADER
 *    (aPos0..aPos4) → jamás se regenera geometría por frame (nada de GC/jank).
 *  - Cero setState en el loop; todo por uniforms leyendo scrollStore.
 *  - Material NÍTIDO (línea + cabeza emissive) contra el fondo de puntos suaves →
 *    figura/fondo impecable. Lo enciende el Bloom que YA vive en Scene3DBackground.
 *
 * Vive DENTRO del canvas que Scene3DBackgroundClient ya difiere tras el LCP, y bajo
 * reduced-motion / gama baja ese canvas no se monta → fallback digno automático.
 */

const N = 128;          // segmentos tubulares → N+1 anillos de vértices
const RADIAL = 8;       // segmentos radiales del tubo
const RADIUS = 0.03;    // grosor base (con Bloom se ve más grueso)
const Z = 0.4;          // un pelo hacia cámara → el trazo va DELANTE del campo de puntos
const POSES = 5;

/** Muestrea una pose (u∈[0,1] → punto de la línea central) a N+1 puntos. */
type PoseFn = (u: number) => [number, number, number];

// pose 0 — FIRMA: subrayado ancho y ondulado bajo el nombre.
const poseSignature: PoseFn = (u) => [
  -3.3 + 6.6 * u,
  -1.25 + 0.14 * Math.sin(u * Math.PI * 3) + 0.05 * Math.sin(u * Math.PI * 9),
  Z + 0.06 * Math.sin(u * Math.PI * 5),
];

// pose 1 — STREAM (Kafka): onda de paquetes que fluye, amplitud creciente.
const poseStream: PoseFn = (u) => [
  -3.4 + 6.8 * u,
  0.95 * Math.sin(u * Math.PI * 4) * (0.45 + 0.55 * u),
  Z - 0.25 * Math.cos(u * Math.PI * 4),
];

// pose 2 — MALLA DE 9 NODOS: anillo de 9 lóbulos (gear/mesh) → "9 microservicios".
const poseMesh: PoseFn = (u) => {
  const th = u * Math.PI * 2;
  const r = 1.7 + 0.28 * Math.cos(9 * th);
  return [r * Math.cos(th), r * Math.sin(th) * 0.92, Z + 0.18 * Math.sin(9 * th)];
};

// pose 3 — LOOP DE VOZ: lemniscata (figura-8) = ciclo/loop.
const poseLoop: PoseFn = (u) => {
  const th = u * Math.PI * 2;
  const s = 1.0 + Math.sin(th) * Math.sin(th);
  return [(2.1 * Math.cos(th)) / s, (2.5 * Math.cos(th) * Math.sin(th)) / s, Z];
};

// pose 4 — CONVERGENCIA: espiral que colapsa a un punto (el CTA, abajo-centro).
const poseConverge: PoseFn = (u) => {
  const r = (1 - u) * 2.5;
  const th = u * Math.PI * 6;
  return [r * Math.cos(th), r * Math.sin(th) * 0.9 - 0.35 * u, Z + 0.35 * u];
};

const POSE_FNS: PoseFn[] = [poseSignature, poseStream, poseMesh, poseLoop, poseConverge];

function centerline(fn: PoseFn): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const [x, y, z] = fn(i / N);
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

/* ------------------------------- SHADERS -------------------------------- */

const traceVertex = /* glsl */ `
  attribute vec3 aPos0;
  attribute vec3 aPos1;
  attribute vec3 aPos2;
  attribute vec3 aPos3;
  attribute vec3 aPos4;
  attribute float aU;        // 0..1 a lo largo del tubo

  uniform float uMorph;      // 0..4 posición entre poses
  uniform float uTime;

  varying float vU;
  varying float vComet;

  void main() {
    // Pesos-tienda: sólo las dos poses adyacentes a uMorph pesan, y suman 1.
    float w0 = max(0.0, 1.0 - abs(uMorph - 0.0));
    float w1 = max(0.0, 1.0 - abs(uMorph - 1.0));
    float w2 = max(0.0, 1.0 - abs(uMorph - 2.0));
    float w3 = max(0.0, 1.0 - abs(uMorph - 3.0));
    float w4 = max(0.0, 1.0 - abs(uMorph - 4.0));

    vec3 p = aPos0 * w0 + aPos1 * w1 + aPos2 * w2 + aPos3 * w3 + aPos4 * w4;

    // Respiración sutil → nunca se ve "muerto" ni perfectamente rígido.
    p += 0.012 * sin(uTime * 1.2 + aU * 42.0);

    vU = aU;

    // COMETA: una cabeza de luz recorre el trazo (dato viajando por la arquitectura).
    float head = fract(uTime * 0.14);
    float dcirc = abs(fract(aU - head + 0.5) - 0.5); // distancia circular a la cabeza
    vComet = smoothstep(0.06, 0.0, dcirc);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const traceFragment = /* glsl */ `
  precision mediump float;

  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uReveal;   // 0..1 draw-on inicial (la firma se dibuja sola)
  uniform float uGlow;     // pico de brillo en las transiciones de pose
  uniform float uOpacity;

  varying float vU;
  varying float vComet;

  void main() {
    vec3 col = mix(uColorA, uColorB, vU);
    // La cabeza-cometa vira a blanco-cálido y enciende → chiaroscuro.
    col = mix(col, vec3(1.0, 0.98, 0.9), vComet * 0.9);

    // draw-on: revela el trazo de principio a fin (1 detrás de la cabeza, 0 delante).
    float revealMask = 1.0 - smoothstep(uReveal - 0.02, uReveal + 0.02, vU);

    float base = uOpacity * (0.55 + uGlow * 0.5);
    float alpha = (base + vComet * 1.1) * revealMask;
    float glow = 1.0 + vComet * 3.2 + uGlow * 1.2;

    gl_FragColor = vec4(col * glow, alpha);
  }
`;

type Props = { colorA?: string; colorB?: string };

export default function ArchitectTrace({ colorA = "#6366F1", colorB = "#10B981" }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  // Líneas centrales de cada pose (para posicionar la cabeza-cometa en CPU).
  const centers = useMemo(() => POSE_FNS.map(centerline), []);

  // Geometría del tubo: se hornean las 5 poses UNA vez (misma topología) y se guardan
  // sus posiciones como 5 atributos; el shader hace el morph.
  const geometry = useMemo(() => {
    const posArrays: Float32Array[] = [];
    let index: THREE.BufferAttribute | null = null;

    for (let k = 0; k < POSES; k++) {
      const curve = new THREE.CatmullRomCurve3(centers[k], false, "catmullrom", 0.5);
      const tube = new THREE.TubeGeometry(curve, N, RADIUS, RADIAL, false);
      posArrays.push(new Float32Array(tube.attributes.position.array as Float32Array));
      if (k === 0 && tube.index) index = tube.index.clone();
      tube.dispose();
    }

    const vertexCount = posArrays[0].length / 3;
    const g = new THREE.BufferGeometry();
    if (index) g.setIndex(index);

    // 'position' es obligatorio para three; el shader lo ignora (usa aPos0..aPos4).
    g.setAttribute("position", new THREE.BufferAttribute(posArrays[0], 3));
    for (let k = 0; k < POSES; k++) {
      g.setAttribute(`aPos${k}`, new THREE.BufferAttribute(posArrays[k], 3));
    }

    // aU = índice de anillo / N (mismo orden de vértices en TubeGeometry: anillo por anillo).
    const perRing = RADIAL + 1;
    const aU = new Float32Array(vertexCount);
    for (let v = 0; v < vertexCount; v++) aU[v] = Math.floor(v / perRing) / N;
    g.setAttribute("aU", new THREE.BufferAttribute(aU, 1));

    // Bounds a mano: los vértices reales viven en aPos*, no en 'position' base.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, Z), 6);
    return g;
  }, [centers]);

  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uGlow: { value: 0 },
      uOpacity: { value: 0.4 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    [colorA, colorB]
  );

  const lastMorph = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    if (!mat.current) return;
    const d = Math.min(dt, 0.1);
    const t = state.clock.elapsedTime;

    uniforms.uTime.value = t;
    // draw-on inicial: la firma se dibuja sola en los primeros ~1.6s del canvas.
    uniforms.uReveal.value = THREE.MathUtils.clamp(t / 1.6, 0, 1);

    // scrollStore.page (0..1) → posición entre poses (0..POSES-1), con damping.
    const targetMorph = scrollStore.page * (POSES - 1);
    uniforms.uMorph.value = THREE.MathUtils.damp(uniforms.uMorph.value, targetMorph, 5, d);

    // Pico de brillo (peak-end) cuando cruza de una pose a la siguiente.
    const speed = Math.abs(uniforms.uMorph.value - lastMorph.current) / Math.max(d, 1e-4);
    lastMorph.current = uniforms.uMorph.value;
    uniforms.uGlow.value = THREE.MathUtils.damp(
      uniforms.uGlow.value,
      THREE.MathUtils.clamp(speed * 1.6, 0, 1),
      6,
      d
    );

    // Cabeza-cometa: punto de la línea central mezclado con los mismos pesos-tienda.
    const m = uniforms.uMorph.value;
    const idx = Math.round(THREE.MathUtils.clamp(t * 0.14 - Math.floor(t * 0.14), 0, 1) * N);
    tmp.set(0, 0, 0);
    for (let k = 0; k < POSES; k++) {
      const w = Math.max(0, 1 - Math.abs(m - k));
      if (w > 0) tmp.addScaledVector(centers[k][idx], w);
    }
    if (head.current) {
      head.current.position.copy(tmp);
      const s = 0.06 + uniforms.uGlow.value * 0.05;
      head.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={mesh} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={traceVertex}
          fragmentShader={traceFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Cabeza-cometa: esfera emissive blanca → el Bloom la vuelve un punto de luz con masa. */}
      <mesh ref={head} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#FFFDF2" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
