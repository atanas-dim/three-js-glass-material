import { Canvas } from "@react-three/fiber";
import {
  Lightformer,
  Text,
  Html,
  ContactShadows,
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  N8AO,
  TiltShift2,
} from "@react-three/postprocessing";

import { type FC } from "react";

const Scene = () => (
  <Canvas shadows>
    <OrbitControls />
    <PerspectiveCamera makeDefault position={[0, 0, 60]} fov={50} />

    <color attach="background" args={["#e0e0e0"]} />
    <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />

    <Box />
    <Knot />
    <Torus />

    <ContactShadows
      scale={100}
      position={[0, -7.5, 0]}
      blur={1}
      far={100}
      opacity={0.85}
    />
    <Environment preset="city">
      <Lightformer
        intensity={8}
        position={[10, 5, 0]}
        scale={[10, 50, 1]}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
    </Environment>

    <Label />

    <EffectComposer enableNormalPass={true} stencilBuffer>
      <N8AO aoRadius={0.05} intensity={0.5} />
      <Bloom mipmapBlur luminanceThreshold={10} intensity={10} levels={5} />
      <TiltShift2 blur={0.12} />
    </EffectComposer>
  </Canvas>
);

export default Scene;

const Box: FC = () => (
  <mesh receiveShadow castShadow position={[-14, 0, 0]}>
    <boxGeometry args={[4, 4, 4]} />
    <MeshTransmissionMaterial thickness={1} />
  </mesh>
);

const Torus: FC = () => (
  <mesh receiveShadow castShadow position={[-6, 0, 0]}>
    <torusGeometry args={[4, 1.2, 128, 64]} />
    <MeshTransmissionMaterial thickness={1} />
  </mesh>
);

const Knot: FC = () => (
  <mesh receiveShadow castShadow position={[6, 0, 0]}>
    <torusKnotGeometry args={[3, 1, 256, 32]} />
    <MeshTransmissionMaterial thickness={2} />
  </mesh>
);

const Label: FC = (props) => {
  const text = "crystal clear";
  return (
    <Text fontSize={9} letterSpacing={-0.025} color="black" {...props}>
      {text}
      <Html
        style={{ color: "transparent", fontSize: "33.5em", userSelect: "none" }}
        transform
      >
        {text}
      </Html>
    </Text>
  );
};
