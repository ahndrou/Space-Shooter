import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls} from "@react-three/drei";
import Lights from "./Lights";
import { useState } from "react";
import PlayArea from "./PlayArea";
import Skybox from "./Skybox";
import { Perf } from "r3f-perf";

const PLAY_AREA_SIZE = {x:50, y: 150, z: 150}

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
                    <Lights />
                    <Perf />
                    <Physics gravity={[0, 0, 0]} timeStep={"vary"}>
                        <Spaceship pointerActive={pointerActive} />
                        <Level playAreaBounds={PLAY_AREA_SIZE} />
                        <PlayArea size={PLAY_AREA_SIZE} />
                    </Physics>
                    <Skybox />
                </Canvas>
            </KeyboardControls>
        </>
        
    )
}