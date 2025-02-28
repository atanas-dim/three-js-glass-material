import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { Cloud } from "@react-three/drei";

const Clouds = () => {
  const flashLightRef = useRef<THREE.PointLight>(null);
  const flashIntensity = useRef(0);

  const minFlashIntensity = 4000;
  const maxFlashIntensity = 6000;

  useFrame(() => {
    if (Math.random() > 0.9875) {
      flashIntensity.current = THREE.MathUtils.randFloat(
        minFlashIntensity,
        maxFlashIntensity
      );
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
        color="white"
        intensity={0}
        distance={50}
      />

      <Cloud position={[0, 17, 0]} scale={[2.5, 2, 2.8]} />
    </>
  );
};

export default Clouds;
