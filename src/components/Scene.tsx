import { Canvas, useFrame } from "@react-three/fiber";
import {
  Box,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import { useRef, type FC } from "react";
import { Color, MeshLambertMaterial, ShaderMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

// @ts-expect-error
import fragmentShader from "./glass.frag"; // @ts-expect-error
import vertexShader from "./glass.vert";

type UniformValues = {
  update: () => void;
  uTime: {
    value: number;
  };
  uRotateAngle: {
    value: number;
  };
  uColour: {
    value: Color;
  };
  uActiveColour: {
    value: Color;
  };
  uActiveProgress: {
    value: number;
  };
  uRadius: {
    value: number;
  };
  uTube: {
    value: number;
  };
};

const Scene: FC = () => {
  return (
    <>
      <div className="size-full">
        <Canvas
          shadows
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000");
          }}
        >
          <axesHelper />
          <OrbitControls />
          <PerspectiveCamera makeDefault position={[3, 3, 8]} />

          <ambientLight intensity={2.2} />
          <directionalLight position={[3, 3, 8]} intensity={5.75} castShadow />

          <Plane
            position={[0, -5, 0]}
            args={[64, 64, 1, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <meshStandardMaterial color="beige" side={2} />
          </Plane>

          <GlassBox />

          <Box position={[3, 1, 0]} castShadow>
            <meshPhysicalMaterial
              color="lightblue"
              side={2}
              thickness={0.1}
              metalness={0}
              roughness={0.15}
              transmission={0.95}
            />
          </Box>

          <Environment files="/environment.jpg" background={false} />
        </Canvas>
      </div>
    </>
  );
};

export default Scene;

const GlassBox: FC = () => {
  const shaderMaterial = useRef<ShaderMaterial & UniformValues>(null);

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return;
    shaderMaterial.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <Box position={[0, 1, 0]} castShadow>
      <meshPhysicalMaterial
        transmission={1} // Full glass effect
        thickness={0.5} // Control light attenuation
        roughness={0.1} // Slight blur for frosted look
        ior={1.52} // Index of Refraction for glass
        attenuationColor={"#e4fbfa"} // Light tint
        attenuationDistance={0.15} // How far light travels in glass
        metalness={0} // No metallic effect
        clearcoat={1} // High polish
        clearcoatRoughness={0} // No roughness
      />
    </Box>
  );
};
