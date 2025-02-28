import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { type FC } from "react";
import Rain2, { Effects } from "./Rain2";
import Clouds from "./Clouds";

const RainAndCloudsScene: FC = () => {
  return (
    <Canvas dpr={[2, 3]} gl={{}} shadows={false}>
      <OrbitControls />
      <ambientLight intensity={4.5} />
      <PerspectiveCamera makeDefault position={[0, 10, 30]} fov={50} />
      <color attach="background" args={["#252e3c"]} />
      <pointLight position={[20, 20, 10]} intensity={3000} castShadow />

      <Plane args={[15, 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="grey" />
      </Plane>

      <Clouds />
      <Rain2 />

      <Effects />
    </Canvas>
  );
};

export default RainAndCloudsScene;
