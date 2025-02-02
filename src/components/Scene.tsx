import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Lightformer,
  Text,
  Html,
  ContactShadows,
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Icosahedron,
  Shape,
  Octahedron,
  Tetrahedron,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  FXAA,
  N8AO,
  Noise,
  TiltShift2,
} from "@react-three/postprocessing";

import { useEffect, useRef, type FC } from "react";
import { Mesh, Vector3 } from "three";

const Scene = () => (
  <Canvas dpr={3} gl={{ antialias: true }}>
    <OrbitControls />
    <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />

    <color attach="background" args={["#000000"]} />
    <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />

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
      <Bloom mipmapBlur luminanceThreshold={10} intensity={4} levels={8} />
      <TiltShift2 blur={0.12} />
      {/* <Noise opacity={0.05} /> */}
      <FXAA />
    </EffectComposer>
  </Canvas>
);

export default Scene;

const Torus: FC = () => {
  const ref1 = useRef<Mesh>(null);
  const ref2 = useRef<Mesh>(null);
  const ref3 = useRef<Mesh>(null);
  const radius = 4; // Circular path radius

  useFrame(({ clock }) => {
    if (ref1.current) {
      const t = clock.getElapsedTime(); // Get time
      ref1.current.position.x = Math.cos(t) * radius;
      ref1.current.position.y = Math.sin(t) * radius;
    }
    if (ref2.current) {
      const t = clock.getElapsedTime() * 0.7; // Get time
      ref2.current.position.x = Math.cos(t) * radius;
      ref2.current.position.y = Math.sin(t) * radius; // Same position as ref
    }
    if (ref3.current) {
      const t = clock.getElapsedTime() * 0.5; // Get time
      ref3.current.position.x = Math.cos(t) * radius;
      ref3.current.position.y = Math.sin(t) * radius; // Same position as ref
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow castShadow>
        <torusGeometry args={[4, 1.2, 64, 128]} />
        <MeshTransmissionMaterial thickness={0.2} resolution={1024 * 3} />
      </mesh>
      <mesh>
        <torusGeometry args={[4, 0.015, 64, 128]} />
        <MeshTransmissionMaterial
          thickness={0.01}
          color="#ffcd38"
          resolution={1024 * 2}
        />
      </mesh>
      <Sphere position={[4, 0, 0]} args={[0.1]} scale={[1, 1, 1]} ref={ref1}>
        <MeshTransmissionMaterial
          thickness={1}
          emissive="hotpink"
          emissiveIntensity={48}
        />
      </Sphere>
      <Sphere position={[4, 0, 0]} args={[0.05]} scale={[1, 1, 1]} ref={ref2}>
        <MeshTransmissionMaterial
          thickness={1}
          emissive="pink"
          emissiveIntensity={38}
        />
      </Sphere>
      <Sphere position={[4, 0, 0]} args={[0.025]} scale={[1, 1, 1]} ref={ref3}>
        <MeshTransmissionMaterial
          thickness={1}
          emissive="#cd7dff"
          emissiveIntensity={33}
        />
      </Sphere>
    </group>
  );
};

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
