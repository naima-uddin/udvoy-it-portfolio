import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * Hair-thin fibres of light (data cables) that sweep in from the dark, with pulses travelling
 * along them toward their end. They draw themselves in during the entrance. Pass `fibres` to
 * route them; each is { color, points: [[x,y,z]...], offset }.
 */
// they fall in from above the frame and curve into the top of the prism
const FIBRES = [
  { color: "#8fd3ff", points: [[-1.6, 3.6, -1.8], [-1.1, 2.4, -0.9], [-0.35, 1.5, -0.2], [0, 0.95, 0]], offset: 0 },
  { color: "#ff9ccf", points: [[0.9, 3.8, -2.4], [0.6, 2.6, -1.2], [0.2, 1.6, -0.3], [0.02, 1.0, 0]], offset: 0.37 },
  { color: "#ffc48a", points: [[2.4, 3.4, -1.4], [1.5, 2.3, -0.6], [0.5, 1.45, -0.1], [0.04, 0.95, 0]], offset: 0.71 },
];

const vertexShader = /* glsl */ `
varying float vAlong;
void main() {
  vAlong = uv.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uReveal;
uniform float uOffset;
varying float vAlong;
void main() {
  // drawn in from the far end towards the prism
  float drawn = 1.0 - smoothstep(uReveal * 1.2 - 0.2, uReveal * 1.2, vAlong);
  // a short bright pulse travelling towards the prism
  float pulse = pow(smoothstep(0.86, 1.0, fract(vAlong - uTime * 0.16 + uOffset)), 2.0);
  float fadeIn = smoothstep(0.0, 0.25, vAlong);
  float a = (0.3 + pulse * 1.8) * drawn * fadeIn;
  gl_FragColor = vec4(uColor * a, a);
}
`;

export default function LightFibres({ motion, fibres: paths = FIBRES }) {
  const fibres = useMemo(
    () =>
      paths.map((f) => {
        const curve = new THREE.CatmullRomCurve3(f.points.map((p) => new THREE.Vector3(...p)));
        const geometry = new THREE.TubeGeometry(curve, 140, 0.011, 6, false);
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uColor: { value: new THREE.Color(f.color) },
            uTime: { value: 0 },
            uReveal: { value: 0 },
            uOffset: { value: f.offset },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        return { geometry, material };
      }),
    [paths],
  );

  useEffect(
    () => () =>
      fibres.forEach((f) => {
        f.geometry.dispose();
        f.material.dispose();
      }),
    [fibres],
  );

  useFrame(() => {
    for (const f of fibres) {
      f.material.uniforms.uTime.value = motion.time;
      f.material.uniforms.uReveal.value = motion.fibres;
    }
  });

  return fibres.map((f, i) => <mesh key={i} geometry={f.geometry} material={f.material} />);
}
