import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Rain: React.FC = () => {
  const count = 1000; // Number of raindrops
  const texture = useTexture("/rain-drop-3.png");

  const rainWidth = 25; // X size of the rain box
  const rainHeight = 25; // Maximum height of the rain box (Y)
  const rainDepth = 25; // Z size of the rain box

  // Create geometry and positions once
  const points = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3); // x, y, z for each point
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * rainWidth; // X
      positions[i * 3 + 1] = Math.random() * rainHeight; // Y (0 to rainHeight)
      positions[i * 3 + 2] = (Math.random() - 0.5) * rainDepth; // Z

      sizes[i] = Math.random() * 25 + 1; // Random size
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, [count, rainWidth, rainHeight, rainDepth]);

  // Animate rain falling
  useFrame(() => {
    const positions = points.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= 0.21; // Move Y down faster

      // If raindrop goes below Y = 0, reset it to the top (rainHeight)
      if (positions[i + 1] < 0) {
        positions[i + 1] = rainHeight;
      }
    }

    points.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={points} position={[0, 0, 0]} scale={0.7}>
      <pointsMaterial
        size={0.08}
        color="white"
        map={texture}
        depthWrite={false}
        transparent
        opacity={0.95}
      />
    </points>
  );
};

export default Rain;
