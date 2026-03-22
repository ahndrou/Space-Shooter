import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls } from "@react-three/drei";
import PlayArea from "./PlayArea";
import Skybox from "./Skybox";
import { Perf } from "r3f-perf";
import { Vector3 } from "three";
import { useRef } from "react";

const PLAY_AREA_SIZE = 100

export default function Experience() {
    const spaceshipRb = useRef()

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
                <Canvas> 
                    <Perf />
                    <Physics gravity={[0, 0, 0]} timeStep={"vary"}>
                        <Spaceship rigidBodyRef={spaceshipRb}/>
                        <Level playAreaSize={PLAY_AREA_SIZE} spaceshipRb={spaceshipRb} />
                        <PlayArea size={PLAY_AREA_SIZE} />
                    </Physics>
                    <Skybox />
                </Canvas>
            </KeyboardControls>
        </>
        
    )
}