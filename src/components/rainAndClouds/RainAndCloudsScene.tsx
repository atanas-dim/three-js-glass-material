import { OrbitControls, PerspectiveCamera, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { type FC } from "react";
import Rain2, { Effects } from "./Rain2";
import Clouds from "./Clouds";

const RainAndCloudsScene: FC = () => {
  return (
    <Canvas dpr={[2, 3]} gl={{}} shadows={false}>
      <OrbitControls target={[0, 8, 0]} enableZoom={true} />
      <ambientLight intensity={0.5} />
      <PerspectiveCamera makeDefault position={[0, 2, 18]} fov={65} />
      <color attach="background" args={["#252e3c"]} />
      <pointLight position={[20, 25, 25]} intensity={2000} castShadow />
      <Plane args={[15, 15]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="lightgrey" roughness={1} />
      </Plane>
      <Clouds />
      <Rain2 />
      <Effects />
    </Canvas>
  );
};

export default RainAndCloudsScene;
