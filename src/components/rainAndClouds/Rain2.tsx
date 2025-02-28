import { EffectComposer, Bloom } from "@react-three/postprocessing";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export const Effects = () => (
  <EffectComposer>
    <Bloom luminanceThreshold={0.01} luminanceSmoothing={0.5} intensity={1} />
  </EffectComposer>
);

const Rain2 = () => {
  const rainCount = 5000;
  const rainCubeSize = 12; // X size of the rain box

  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * rainCubeSize; // X
      pos[i * 3 + 1] = Math.random() * rainCubeSize; // Y (above ground)
      pos[i * 3 + 2] = (Math.random() - 0.5) * rainCubeSize; // Z
    }
    return pos;
  }, [rainCount]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();

    for (let i = 0; i < rainCount; i++) {
      position.set(
        positions[i * 3],
        positions[i * 3 + 1] - 0.1, // Falling down
        positions[i * 3 + 2]
      );

      if (position.y < 0) {
        // Reset to top
        position.y = rainCubeSize;
      }

      // Optional: Add wind tilt (drift X over time)
      position.x += 0.01 * Math.sin(Date.now() * 0.001 + i);

      matrix.compose(
        position,
        new THREE.Quaternion().setFromEuler(rotation),
        new THREE.Vector3(1, 1, 1)
      );
      mesh.setMatrixAt(i, matrix);

      positions[i * 3 + 1] = position.y; // Update Y position for next frame
      positions[i * 3] = position.x; // Update X position for wind drift
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, rainCount]}>
      <cylinderGeometry args={[0.001, 0.003, 0.15, 3]} />
      <meshLambertMaterial
        color="white"
        emissive="lightblue"
        emissiveIntensity={0.95}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
};

export default Rain2;
