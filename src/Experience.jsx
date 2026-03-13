import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls } from "@react-three/drei";
import PlayArea from "./PlayArea";
import Skybox from "./Skybox";
import { Perf } from "r3f-perf";
import { Vector3 } from "three";

const PLAY_AREA_SIZE = new Vector3(60, 60, 40)

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
                <Canvas> 
                    <Perf />
                    <Physics gravity={[0, 0, 0]} timeStep={"vary"}>
                        <Spaceship />
                        <Level playAreaBounds={PLAY_AREA_SIZE} />
                        <PlayArea size={PLAY_AREA_SIZE} />
                    </Physics>
                    <Skybox />
                </Canvas>
            </KeyboardControls>
        </>
        
    )
}