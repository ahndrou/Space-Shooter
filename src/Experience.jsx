import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";

export default function Experience() {
    return (
        <>
            <Canvas shadows>
                <OrbitControls />

                <Lights />
                <Physics debug>
                    <Spaceship />
                    <Level />
                </Physics>
            </Canvas>
        </>
        
    )
}