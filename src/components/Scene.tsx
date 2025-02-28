import { Canvas, useFrame, useLoader } from "@react-three/fiber";
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
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  FXAA,
  TiltShift2,
} from "@react-three/postprocessing";

import { useEffect, useRef, type FC } from "react";
import {
  EquirectangularReflectionMapping,
  Euler,
  Mesh,
  TextureLoader,
  Vector3,
} from "three";

const RADIUS = 4;

const Scene = () => (
  <Canvas dpr={[2, 3]} gl={{}} shadows={false}>
    <OrbitControls />
    <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />

    <color attach="background" args={["#252e3c"]} />
    <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />

    <Torus />

    <ContactShadows
      scale={100}
      position={[0, -7.5, 0]}
      blur={1}
      far={100}
      opacity={0.85}
    />

    <Label />

    <SceneEnvironment />

    <EffectComposer enableNormalPass={true} stencilBuffer>
      <Bloom mipmapBlur luminanceThreshold={10} intensity={4} levels={8} />
      <TiltShift2 blur={0.12} />
      <FXAA />
    </EffectComposer>
  </Canvas>
);

export default Scene;

const SceneEnvironment = () => {
  return (
    <>
      <Environment environmentIntensity={2.75} preset="studio">
        <Lightformer intensity={8} position={[7, 5, 2]} scale={[4, 7, 1]} />
      </Environment>
    </>
  );
};

const Torus: FC = () => {
  const star1Ref = useRef<Mesh>(null);
  const star2Ref = useRef<Mesh>(null);
  const star3Ref = useRef<Mesh>(null);

  const envMap = useLoader(TextureLoader, "/gradients-seamless-1.jpg");

  useEffect(() => {
    if (envMap) {
      envMap.mapping = EquirectangularReflectionMapping; // Important for reflections
    }
  }, [envMap]);

  useFrame(({ clock }) => {
    if (star1Ref.current) {
      const t = clock.getElapsedTime(); // Get time
      star1Ref.current.position.x = Math.cos(t) * RADIUS;
      star1Ref.current.position.y = Math.sin(t) * RADIUS;
    }
    if (star2Ref.current) {
      const t = clock.getElapsedTime() * 0.7; // Get time
      star2Ref.current.position.x = Math.cos(t) * RADIUS;
      star2Ref.current.position.y = Math.sin(t) * RADIUS;
    }
    if (star3Ref.current) {
      const t = clock.getElapsedTime() * 0.5; // Get time
      star3Ref.current.position.x = Math.cos(t) * RADIUS;
      star3Ref.current.position.y = Math.sin(t) * RADIUS;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh receiveShadow castShadow>
        <torusGeometry args={[4, 1.2, 32, 64]} />
        <MeshTransmissionMaterial
          thickness={1}
          resolution={window.innerWidth * 2}
          color={"#d7f0f9"}
          chromaticAberration={0.25}
          envMap={envMap}
          envMapIntensity={2}
          envMapRotation={new Euler(1, 0, 0)}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[4, 0.015, 32, 64]} />
        <MeshTransmissionMaterial
          thickness={0.01}
          color="#e9fcff"
          resolution={window.innerWidth * 2}
        />
      </mesh>
      <Sphere
        position={[4, 0, 0]}
        args={[0.1]}
        scale={[1, 1, 1]}
        ref={star1Ref}
      >
        <meshStandardMaterial emissive="#ff82d1" emissiveIntensity={48} />
      </Sphere>
      <Sphere
        position={[4, 0, 0]}
        args={[0.05]}
        scale={[1, 1, 1]}
        ref={star2Ref}
      >
        <meshStandardMaterial emissive="pink" emissiveIntensity={38} />
      </Sphere>
      <Sphere
        position={[4, 0, 0]}
        args={[0.025]}
        scale={[1, 1, 1]}
        ref={star3Ref}
      >
        <meshStandardMaterial emissive="#cd7dff" emissiveIntensity={33} />
      </Sphere>
    </group>
  );
};

const Label: FC = (props) => {
  const text = "transmission";
  return (
    <Text
      position={new Vector3(0, 0, -26)}
      fontSize={9}
      letterSpacing={-0.025}
      color="#e1f1fb"
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
