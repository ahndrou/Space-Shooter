import { Canvas } from "@react-three/fiber";
import Spaceship from "./Spaceship";
import { Physics } from "@react-three/rapier";
import Level from "./Level";
import { KeyboardControls } from "@react-three/drei";
import PlayArea from "./PlayArea";
import Skybox from "./Skybox";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import Interface from "../interface/Interface";
import { Bloom, EffectComposer, Scanline } from "@react-three/postprocessing";

const PLAY_AREA_SIZE = 175

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
                    <Perf position='bottom-right' />
                    <Physics gravity={[0, 0, 0]} timeStep={1/200}>
                        <Spaceship rigidBodyRef={spaceshipRb} playAreaSize={PLAY_AREA_SIZE}/>
                        <Level playAreaSize={PLAY_AREA_SIZE} spaceshipRb={spaceshipRb} />
                        <PlayArea size={PLAY_AREA_SIZE} />
                    </Physics>
                    <Skybox />
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.8} intensity={0.4} luminanceSmoothing={0.4} />
                        <Scanline density={1.2} />
                    </EffectComposer>
                </Canvas>
            </KeyboardControls>
            <Interface />
        </>  
    )
}