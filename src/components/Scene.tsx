import { Canvas } from "@react-three/fiber";
import {
  Box,
  OrbitControls,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import { type FC } from "react";

const Scene: FC = () => {
  return (
    <>
      <div className="size-full">
        <Canvas shadows gl={{ antialias: true }}>
          <axesHelper />
          <OrbitControls />
          <ambientLight intensity={2.2} />
          <directionalLight position={[3, 3, 8]} intensity={5.75} castShadow />
          <Plane
            position={[0, 0, 0]}
            args={[64, 64, 1, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <meshStandardMaterial color="beige" side={2} />
          </Plane>

          <Box position={[0, 1, 0]} receiveShadow castShadow>
            <meshStandardMaterial color="beige" side={2} />
          </Box>

          <PerspectiveCamera makeDefault position={[3, 3, 8]} />
        </Canvas>
      </div>
    </>
  );
};

export default Scene;
