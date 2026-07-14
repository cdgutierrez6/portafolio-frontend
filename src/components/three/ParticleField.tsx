"use client";

import { useMemo, useRef, useState, useLayoutEffect, useEffect } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";
import { scrollStore } from "./scroll-store";

/* --------------------------------------------------------------------------
 * pointerStore: MISMO patrón que scrollStore.
 * El canvas es un background fijo con pointer-events:none → R3F NUNCA recibe
 * pointermove, así que state.pointer se queda en (0,0). Hay que escuchar en
 * window y escribir en un objeto mutable de module-scope.
 * ----------------------------------------------------------------------- */
export const pointerStore = { nx: 0, ny: 0 };

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointerStore.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointerStore.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

/* ------------------------------- SHADERS -------------------------------- */

const simVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0); // fullscreen quad, sin matrices
  }
`;

const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 snoiseVec3(vec3 x) {
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }

  // curl del campo de ruido = flujo incompresible (nunca "explota", nunca colapsa).
  // COSTE: 6 snoiseVec3 = 18 evaluaciones de simplex por partícula por frame.
  // Es el dial de rendimiento #1 → si hay que recortar, se recorta SIM_SIZE.
  vec3 curlNoise(vec3 p) {
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    vec3 px0 = snoiseVec3(p - dx), px1 = snoiseVec3(p + dx);
    vec3 py0 = snoiseVec3(p - dy), py1 = snoiseVec3(p + dy);
    vec3 pz0 = snoiseVec3(p - dz), pz1 = snoiseVec3(p + dz);

    float x = (py1.z - py0.z) - (pz1.y - pz0.y);
    float y = (pz1.x - pz0.x) - (px1.z - px0.z);
    float z = (px1.y - px0.y) - (py1.x - py0.x);

    return normalize(vec3(x, y, z) / (2.0 * e));
  }
`;

const simFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uPrev;      // ping-pong: xyz = posición, w = vida
  uniform sampler2D uOrigin;    // posiciones de reposo (nunca cambia)
  uniform float uTime;
  uniform float uDelta;
  uniform float uScroll;        // 0..1 progreso de página (scrollStore.page)
  uniform float uVelocity;      // |velocidad de scroll| normalizada → "inercia"
  uniform vec3  uMouse;         // mouse proyectado al plano z=0, en mundo
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uFreeze;        // 1.0 = prefers-reduced-motion

  varying vec2 vUv;

  ${NOISE}

  void main() {
    vec4 prev   = texture2D(uPrev,   vUv);
    vec4 origin = texture2D(uOrigin, vUv);

    vec3  pos  = prev.xyz;
    float life = prev.w;

    // dt acotado: tras una pestaña en background dt es enorme y el sim explota.
    float dt = min(uDelta, 0.033) * (1.0 - uFreeze);

    // 1) FLUJO — la energía del campo la manda el scroll.
    float energy = 0.20 + uScroll * 1.00 + uVelocity * 0.8;
    vec3 flow = curlNoise(pos * 0.28 + vec3(0.0, 0.0, uTime * 0.05));
    pos += flow * energy * dt * 0.6;

    // 2) DERIVA — el campo "cae" mientras avanzas la página.
    pos.y -= uScroll * dt * 0.30;

    // 3) MOUSE — repulsión suave. Sin if(): smoothstep hace de falloff.
    vec3 toMouse = pos - uMouse;
    float d = length(toMouse);
    float push = 1.0 - smoothstep(0.0, uMouseRadius, d);
    pos += normalize(toMouse + vec3(1e-4)) * push * push * uMouseStrength * dt;

    // 4) MUELLE al origen — sin esto la nube se disuelve en 10s y pierde silueta.
    pos = mix(pos, origin.xyz, 0.55 * dt);

    // 5) VIDA → respawn escalonado (evita que todo se mueva en bloque).
    life -= dt * (0.06 + uScroll * 0.06);
    float dead = step(life, 0.0);
    pos  = mix(pos, origin.xyz, dead);
    life = mix(life, 1.0, dead);

    gl_FragColor = vec4(pos, life);
  }
`;

const pointsVertex = /* glsl */ `
  uniform sampler2D uPositions;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScroll;

  attribute vec2  aRef;   // uv dentro de la textura de simulación
  attribute float aSeed;

  varying float vLife;
  varying float vSeed;
  varying float vDepth;

  void main() {
    vec4 sim = texture2D(uPositions, aRef);   // vertex texture fetch (WebGL2: OK siempre)
    vLife = sim.w;
    vSeed = aSeed;

    vec4 mv = modelViewMatrix * vec4(sim.xyz, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aSeed * 0.9) * (0.85 + uScroll * 0.3);
    // CLAMP DURO: sin esto, una partícula cerca de cámara se come el fill-rate del móvil.
    gl_PointSize = clamp(size * uPixelRatio / max(vDepth, 0.1), 1.0, 5.0);
  }
`;

const pointsFragment = /* glsl */ `
  precision mediump float;

  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uOpacity;

  varying float vLife;
  varying float vSeed;
  varying float vDepth;

  void main() {
    // Sprite redondo procedural: sin textura, sin discard.
    // discard rompe el early-Z de los GPUs tile-based (Adreno/Mali) → NUNCA en móvil.
    vec2 c = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.25, 0.0, dot(c, c));

    // fade in/out por vida → nada aparece ni desaparece de golpe
    alpha *= smoothstep(0.0, 0.20, vLife) * smoothstep(1.0, 0.80, vLife);

    // profundidad: lo lejano se apaga → da volumen real (no un plano de puntos)
    alpha *= 1.0 - smoothstep(4.0, 13.0, vDepth);

    vec3 col = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

/* ------------------------------ COMPONENTE ------------------------------ */

type Props = {
  /** 256 → 65.536 partículas (desktop). 128 → 16.384 (móvil). Potencia de 2. */
  size?: number;
  colorA?: string;
  colorB?: string;
};

function makeOriginTexture(size: number) {
  const n = size * size;
  const data = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    // Cascarón elipsoidal alrededor del laptop: hueco en el centro para que
    // el modelo respire y las partículas no le hagan ruido encima.
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = 2.6 + Math.pow(Math.random(), 0.6) * 4.2;

    data[i * 4 + 0] = r * Math.sin(phi) * Math.cos(theta) * 1.35;
    data[i * 4 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.70;
    data[i * 4 + 2] = r * Math.cos(phi) * 0.55 - 1.0;
    data[i * 4 + 3] = Math.random(); // vida escalonada
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

export default function ParticleField({
  size = 256,
  colorA = "#6366F1",
  colorB = "#10B981",
}: Props) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // FloatType no está garantizado en móvil: sin EXT_color_buffer_float el FBO
  // se crea NEGRO y las partículas colapsan al origen. Fallback a HalfFloat.
  const fboType = useMemo(
    () =>
      gl.extensions.get("EXT_color_buffer_float") ? THREE.FloatType : THREE.HalfFloatType,
    [gl]
  );

  const fboOpts = useMemo(
    () => ({
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: fboType,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    }),
    [fboType]
  );

  const fboA = useFBO(size, size, fboOpts);
  const fboB = useFBO(size, size, fboOpts);
  const swap = useRef(0);
  const booted = useRef(false);

  const originTex = useMemo(() => makeOriginTexture(size), [size]);
  useEffect(() => () => originTex.dispose(), [originTex]);

  // Escena aparte para la simulación (no cuelga del root → R3F no la dibuja sola).
  const [simScene] = useState(() => new THREE.Scene());
  const simCam = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const simMat = useRef<THREE.ShaderMaterial>(null);
  const pointsMat = useRef<THREE.ShaderMaterial>(null);
  const points = useRef<THREE.Points>(null);

  const simUniforms = useMemo(
    () => ({
      uPrev: { value: originTex as THREE.Texture },
      uOrigin: { value: originTex as THREE.Texture },
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uMouseRadius: { value: 1.6 },
      uMouseStrength: { value: 6.0 },
      uFreeze: { value: reduced ? 1 : 0 },
    }),
    [originTex, reduced]
  );

  const pointUniforms = useMemo(
    () => ({
      uPositions: { value: originTex as THREE.Texture },
      uSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uScroll: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uOpacity: { value: 0.55 },
    }),
    [originTex, colorA, colorB]
  );

  const geometry = useMemo(() => {
    const count = size * size;
    const positions = new Float32Array(count * 3); // dummy: la posición real vive en la textura
    const refs = new Float32Array(count * 2);
    const seeds = new Float32Array(count);
    let i = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        refs[i * 2 + 0] = (x + 0.5) / size;
        refs[i * 2 + 1] = (y + 0.5) / size;
        seeds[i] = Math.random();
        i++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aRef", new THREE.BufferAttribute(refs, 2));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    // El position attribute es basura (todo ceros) → three calcularía una bounding
    // sphere de radio 0 y frustum-culling BORRARÍA la nube entera. Bounds a mano.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -1), 14);
    return g;
  }, [size]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Semilla: con uDelta = 0 el shader es un copy puro origin → FBO. Dos veces
  // para que ambos lados del ping-pong arranquen con datos válidos.
  useLayoutEffect(() => {
    if (!simMat.current || booted.current) return;
    const prevTarget = gl.getRenderTarget();
    simUniforms.uPrev.value = originTex;
    simUniforms.uDelta.value = 0;
    for (const t of [fboA, fboB]) {
      gl.setRenderTarget(t);
      gl.render(simScene, simCam);
    }
    gl.setRenderTarget(prevTarget);
    booted.current = true;
  }, [gl, fboA, fboB, simScene, simCam, originTex, simUniforms]);

  // Mouse en mundo + velocidad de scroll — todo con refs, CERO setState.
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 1.0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const lastScroll = useRef(0);

  useFrame((state, dt) => {
    if (!simMat.current || !pointsMat.current || !booted.current) return;
    const d = Math.min(dt, 0.1);

    // --- mouse → mundo (damping = la sensación "cara": la nube persigue, no salta)
    ndc.set(pointerStore.nx, pointerStore.ny);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      simUniforms.uMouse.value.lerp(hit, 1 - Math.exp(-6 * d));
    }

    // --- scroll + velocidad de scroll (la inercia que hace que "se sienta")
    const p = scrollStore.page;
    const vel = Math.min(1, Math.abs(p - lastScroll.current) / Math.max(d, 1e-4) / 1.2);
    lastScroll.current = p;
    simUniforms.uVelocity.value = THREE.MathUtils.damp(
      simUniforms.uVelocity.value,
      vel,
      4,
      d
    );
    simUniforms.uScroll.value = THREE.MathUtils.damp(simUniforms.uScroll.value, p, 6, d);
    simUniforms.uTime.value = state.clock.elapsedTime;
    simUniforms.uDelta.value = d;

    // --- PING-PONG: leo de uno, escribo en el otro. Nunca el mismo.
    const read = swap.current === 0 ? fboA : fboB;
    const write = swap.current === 0 ? fboB : fboA;

    simUniforms.uPrev.value = read.texture;

    const prevTarget = state.gl.getRenderTarget();
    state.gl.setRenderTarget(write);
    state.gl.render(simScene, simCam);
    state.gl.setRenderTarget(prevTarget); // devolver el target: si no, el EffectComposer se rompe

    pointUniforms.uPositions.value = write.texture;
    pointUniforms.uScroll.value = simUniforms.uScroll.value;
    pointUniforms.uPixelRatio.value = state.gl.getPixelRatio();

    swap.current = swap.current === 0 ? 1 : 0;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            ref={simMat}
            vertexShader={simVertex}
            fragmentShader={simFragment}
            uniforms={simUniforms}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>,
        simScene
      )}

      <points ref={points} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={pointsMat}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
