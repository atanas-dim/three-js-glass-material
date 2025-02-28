import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { Cloud } from "@react-three/drei";

const Clouds = () => {
  const flashLightRef = useRef<THREE.PointLight>(null);
  const flashIntensity = useRef(0);

  const minFlashIntensity = 1000;
  const maxFlashIntensity = 3000;

  // const flashTimeoutRef = useRef<number | null>(null);
  const isFlashing = useRef(false);

  useFrame(() => {
    if (isFlashing.current) return;

    if (Math.random() > 0.99) {
      isFlashing.current = true;
      flashIntensity.current = THREE.MathUtils.randFloat(
        minFlashIntensity,
        maxFlashIntensity
      );

      const timeout = THREE.MathUtils.randInt(200, 500);
      const flashTimeout = setTimeout(() => {
        isFlashing.current = false;
        clearTimeout(flashTimeout);
      }, timeout);
    } else {
      flashIntensity.current = 0;
    }

    if (flashLightRef.current) {
      flashLightRef.current.intensity = flashIntensity.current;
    }
  });

  return (
    <>
      <pointLight
        ref={flashLightRef}
        position={[0, 14, 0]}
        color="lightyellow"
        intensity={0}
        distance={50}
      />

      <Cloud position={[0, 17, 0]} scale={[2.5, 2, 2.8]} />
    </>
  );
};

export default Clouds;
