import {
  OrbitControls,
  PerspectiveCamera,
  Plane,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, type FC } from "react";
import Rain2, { Effects } from "./Rain2";
import Clouds from "./Clouds";
import { Perf } from "r3f-perf";

const RainAndCloudsScene: FC = () => {
  const [rainCount, setRainCount] = useState(4000);

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
      <Rain2 rainCount={rainCount} />
      <Effects />
      <PerformanceMonitor
        onDecline={() => setRainCount(2000)}
        onIncline={() => setRainCount(4000)}
      />
      <Perf position="top-left" />
    </Canvas>
  );
};

export default RainAndCloudsScene;
