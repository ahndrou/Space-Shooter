import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Lights from "./Lights";

export default function Experience() {
    return (
        <>
            
            <KeyboardControls
                map={[
                    {name: 'forward', keys: ['ArrowUp', 'KeyW']},
                    {name: 'leftward', keys: ['ArrowLeft', 'KeyA']},
                    {name: 'rightward', keys: ['ArrowRight', 'KeyD']},
                    {name: 'backward', keys: ['ArrowDown', 'KeyS']},
                    {name: 'space', keys: ['Space']},
                ]}>
                <Canvas shadows>
                    <OrbitControls />
                    <Lights />
                    <Physics gravity={[0, 0, 0]}>
                        <Spaceship />
                        <Level />
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </>
        
    )
}