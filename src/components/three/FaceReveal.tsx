"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * BEAT 2 — "y este soy yo": el clip de Cristian como plano DENTRO de la escena R3F.
 *
 * Integrado, NO pegado:
 *  - luma-key en shader (fondo NEGRO del clip → transparente) → sin necesitar codec alfa
 *    (imposible en Windows). Se recorta la cara y "flota".
 *  - duotono frío al acento → la piel se ata al ambiente, lee como escultura, no selfie.
 *  - se REVELA de abajo-arriba con dither de ruido al entrar el Beat 2 (scroll 0.18→0.32).
 *  - comparte el mismo EffectComposer (DoF/grano/viñeta/ACES) → grade automático.
 */
export const FACE_POS = new THREE.Vector3(-1.7, 0.2, 0.35);

const faceVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const faceFrag = /* glsl */ `
  precision mediump float;
  uniform sampler2D uTex;
  uniform float uReveal;
  uniform vec3 uAccent;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0, 289.0))) * 43758.5453); }
  void main() {
    vec3 c = texture2D(uTex, vUv).rgb;
    float luma = dot(c, vec3(0.299, 0.587, 0.114));
    // LUMA-KEY: donde el clip es negro (fondo) → transparente.
    float key = smoothstep(0.05, 0.20, luma);
    // DUOTONO frío: sombras al acento oscuro, luces a blanco-acento.
    vec3 duo = mix(uAccent * 0.18, mix(uAccent, vec3(1.0), 0.7), luma);
    // REVEAL de abajo→arriba con dither de ruido (no un fade plano).
    float n = hash(floor(vUv * vec2(90.0)));
    float edge = (1.0 - vUv.y) * 0.82 + n * 0.18;
    float m = smoothstep(edge - 0.1, edge + 0.03, uReveal);
    gl_FragColor = vec4(duo, key * clamp(m, 0.0, 1.0));
  }
`;

export default function FaceReveal() {
  const tex = useVideoTexture("/media/yo.mp4", {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
  });

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex as THREE.Texture },
      uReveal: { value: 0 },
      uAccent: { value: new THREE.Color("#6E8BFF") },
    }),
    [tex]
  );

  useFrame((_s, dt) => {
    // Beat 2 en progreso de viewport: hp 0.6 → 1.3 (mismo mapeo que la cámara).
    const hp = typeof window !== "undefined" ? window.scrollY / (window.innerHeight || 1) : 0;
    const target = THREE.MathUtils.clamp((hp - 0.6) / 0.7, 0, 1);
    uniforms.uReveal.value = THREE.MathUtils.damp(uniforms.uReveal.value, target, 6, Math.min(dt, 0.1));
  });

  // Plano 9:16 (el clip es 720×1280 → ratio 0.5625).
  return (
    <mesh position={FACE_POS}>
      <planeGeometry args={[1.5, 1.5 / 0.5625]} />
      <shaderMaterial
        vertexShader={faceVert}
        fragmentShader={faceFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
