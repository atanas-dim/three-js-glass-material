import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Clouds: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);
  const { scene } = useThree();

  const [flashIntensity, setFlashIntensity] = useState(0);

  // Cloud positions - can add more for larger coverage
  const cloudPositions = [
    [0, 8, -5],
    [-4, 9, -4],
    [3, 8.5, -3],
    [-3, 9, 2],
    [2, 9, 3],
    [5, 8.2, -6],
  ];

  useFrame(() => {
    if (Math.random() > 0.995) {
      setFlashIntensity(THREE.MathUtils.randFloat(2, 6)); // Strong random flash
    } else {
      setFlashIntensity((prev) => Math.max(0, prev * 0.9)); // Gradual fade
    }

    // // Apply global scene background flash
    // if (flashIntensity > 0.5) {
    //   scene.background = new THREE.Color(
    //     `rgb(${20 + flashIntensity * 100},${20 + flashIntensity * 100},${
    //       30 + flashIntensity * 100
    //     })`
    //   );
    // } else {
    //   scene.background = new THREE.Color("#252e3c"); // Reset to original dark sky
    // }

    // Light flash (global flash light)
    if (flashLightRef.current) {
      flashLightRef.current.intensity = flashIntensity * 10;
    }

    // Emissive flash per cloud
    if (groupRef.current) {
      groupRef.current.children.forEach((cloud) => {
        if (
          cloud instanceof THREE.Mesh &&
          cloud.material instanceof THREE.MeshStandardMaterial
        ) {
          const flashColor = `rgb(${flashIntensity * 255}, ${
            flashIntensity * 255
          }, ${flashIntensity * 255})`;
          console.log({ flashColor });
          cloud.material.emissive.set(flashColor);
          cloud.material.emissiveIntensity = flashIntensity;
        }
      });
    }
  });

  return (
    <>
      {/* Central lightning light */}
      <pointLight
        ref={flashLightRef}
        position={[0, 15, 0]}
        color="white"
        intensity={0}
        distance={50}
      />

      <group ref={groupRef}>
        {cloudPositions.map((pos, idx) => (
          <mesh
            key={idx}
            position={pos}
            scale={[3, 2, 3]}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="darkgrey" // Darker to make emissive stand out
              roughness={1}
              transparent
              opacity={0.95}
              emissive="white"
              emissiveIntensity={0.75}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

export default Clouds;
