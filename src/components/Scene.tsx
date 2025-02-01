import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  Lightformer,
  Text,
  Html,
  ContactShadows,
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  PerspectiveCamera,
  Line,
  Sphere,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  N8AO,
  TiltShift2,
} from "@react-three/postprocessing";

import { useMemo, useRef, type FC } from "react";
import { Color, Mesh, Vector3 } from "three";

const Scene = () => (
  <Canvas shadows>
    <OrbitControls />
    <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />

    <color attach="background" args={["#000000"]} />
    <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />

    {/* <Box /> */}
    {/* <Knot /> */}
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

const Torus: FC = () => {
  const ref = useRef<Mesh>(null);
  const ref2 = useRef<Mesh>(null);
  const radius = 4; // Circular path radius

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime(); // Get time
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t) * radius;

      if (ref2.current) {
        const t = clock.getElapsedTime() * 0.7; // Get time
        ref2.current.position.x = Math.cos(t) * radius;
        ref2.current.position.y = Math.sin(t) * radius; // Same position as ref
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow castShadow>
        <torusGeometry args={[4, 1.2, 128, 64]} />
        <MeshTransmissionMaterial thickness={1} />
      </mesh>
      <mesh>
        <torusGeometry args={[4, 0.012, 128, 64]} />
        <MeshTransmissionMaterial
          thickness={0.5}
          emissive="#ffe5b5"
          emissiveIntensity={6}
        />
      </mesh>
      <Sphere position={[4, 0, 0]} args={[0.12]} scale={[1, 1, 1]} ref={ref}>
        <MeshTransmissionMaterial
          thickness={0.01}
          emissive="hotpink"
          emissiveIntensity={22}
        />
      </Sphere>
      <Sphere position={[4, 0, 0]} args={[0.05]} scale={[1, 1, 1]} ref={ref2}>
        <MeshTransmissionMaterial
          thickness={0.01}
          emissive="pink"
          emissiveIntensity={8}
        />
      </Sphere>
    </group>
  );
};

const Knot: FC = () => (
  <mesh receiveShadow castShadow position={[6, 0, 0]}>
    <torusKnotGeometry args={[3, 1, 256, 32]} />
    <MeshTransmissionMaterial thickness={2} />
  </mesh>
);

const Label: FC = (props) => {
  const text = "crystal";
  return (
    <Text
      position={new Vector3(0, 0, -26)}
      fontSize={9}
      letterSpacing={-0.025}
      color="white"
      {...props}
    >
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
