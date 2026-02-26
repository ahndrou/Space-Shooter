import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls} from "@react-three/drei";
import Lights from "./Lights";
import { useState } from "react";
import PlayArea from "./PlayArea";
import Skybox from "./Skybox";

export default function Experience() {
    const PLAY_AREA_SIZE = {x: 150, y: 150, z: 150}

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
                    <Lights />
                    <Physics debug gravity={[0, 0, 0]}>
                        <Spaceship pointerActive={pointerActive} />
                        <Level enemyBounds={PLAY_AREA_SIZE} />
                        <PlayArea size={PLAY_AREA_SIZE} />
                    </Physics>
                    <Skybox />
                </Canvas>
            </KeyboardControls>
        </>
        
    )
}