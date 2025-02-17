import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
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
  Cone,
  useTexture,
} from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  FXAA,
  TiltShift2,
} from "@react-three/postprocessing";
import { RGBELoader } from "three-stdlib";

import { useEffect, useRef, type FC } from "react";
import {
  EquirectangularReflectionMapping,
  Euler,
  Mesh,
  TextureLoader,
  Vector3,
} from "three";

const Scene = () => (
  <Canvas dpr={[2, 3]} gl={{}} shadows={false}>
    <OrbitControls />
    <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />

    <color attach="background" args={["#252e3c"]} />
    <spotLight position={[20, 20, 10]} penumbra={1} castShadow angle={0.2} />

    <Torus />
    {/* <Bubble /> */}
    {/* <Pyramid /> */}

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
      <Environment
        environmentIntensity={2.75}
        preset="studio"
        // background
      >
        <Lightformer intensity={8} position={[7, 5, 2]} scale={[4, 7, 1]} />
      </Environment>
    </>
  );
};

const Bubble = () => {
  return (
    <Sphere args={[1, 32, 32]} position={new Vector3(0, 0, 0)}>
      <MeshTransmissionMaterial
        thickness={0}
        resolution={window.innerWidth * 2}
        color={"#ffffff"}
      />
    </Sphere>
  );
};

const Torus: FC = () => {
  const ref1 = useRef<Mesh>(null);
  const ref2 = useRef<Mesh>(null);
  const ref3 = useRef<Mesh>(null);
  const radius = 4; // Circular path radius

  const envMap = useLoader(TextureLoader, "/gradients-seamless-1.jpg");

  // Ensure correct environment map encoding
  useEffect(() => {
    if (envMap) {
      envMap.mapping = EquirectangularReflectionMapping; // Important for reflections
    }
  }, [envMap]);

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
          // color="#ffa7d3"
          resolution={window.innerWidth * 2}
        />
      </mesh>
      <Sphere position={[4, 0, 0]} args={[0.1]} scale={[1, 1, 1]} ref={ref1}>
        <meshStandardMaterial emissive="#ff82d1" emissiveIntensity={48} />
      </Sphere>
      <Sphere position={[4, 0, 0]} args={[0.05]} scale={[1, 1, 1]} ref={ref2}>
        <meshStandardMaterial emissive="pink" emissiveIntensity={38} />
      </Sphere>
      <Sphere position={[4, 0, 0]} args={[0.025]} scale={[1, 1, 1]} ref={ref3}>
        <meshStandardMaterial emissive="#cd7dff" emissiveIntensity={33} />
      </Sphere>
    </group>
  );
};

const Pyramid: FC = () => {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();

      //rotate 360 degrees every 2 seconds
      ref.current.rotation.y += 0.015;
    }
  });

  return (
    <>
      <Cone ref={ref} args={[1.5, 2, 4]} position={[0, 0, 0]}>
        <MeshTransmissionMaterial
          thickness={1}
          resolution={window.innerWidth * 2}
          color={"#d7f0f9"}
          // backside
          backsideThickness={0.01}
          // transmission={0.98}
          // metalness={0.11}
          // roughness={0.12}
          chromaticAberration={0.25}
        />
      </Cone>
    </>
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
