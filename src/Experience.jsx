import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import { useState } from "react";

export default function Experience() {
    const [pointerActive, setPointerActive] = useState(true)

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
                <Canvas 
                    shadows
                    onMouseLeave={() => setPointerActive(false)}
                    onMouseEnter={() => setPointerActive(true)}>
                    <OrbitControls />
                    <Lights />
                    <Physics gravity={[0, 0, 0]}>
                        <Spaceship pointerActive={pointerActive} />
                        <Level />
                    </Physics>
                </Canvas>
            </KeyboardControls>
        </>
        
    )
}