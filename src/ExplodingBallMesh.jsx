import { useGLTF } from "@react-three/drei"

import { COLLISION_STATES } from "./constants"
import ScaleAnimatedMaterial from "./ScaleAnimatedMaterial"
import Explosion from "./Explosion"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

// 'Scaling' part of the collision animation.
const SCALING_TIME = 2
// 'Exploding' part of the collision animation. Currently need to make sure
// this matches up to the animation length defined in /shaders/explosion/config.glsl.
const EXPLODING_TIME = 3

export default function ExplodingBallMesh({collisionState, setCollisionState, disposeParent}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")

    const animationTimer = useRef(0)

    useFrame((state, delta) => {
        if (collisionState !== COLLISION_STATES.NO_COLLISION) {
            animationTimer.current += delta
        }

        if (collisionState === COLLISION_STATES.SCALING && animationTimer.current >= SCALING_TIME) {
            setCollisionState(COLLISION_STATES.EXPLODING)
            animationTimer.current = 0
        } else if (collisionState === COLLISION_STATES.EXPLODING && animationTimer.current >= EXPLODING_TIME) {
            disposeParent()
        }
    })

    return <>
        <group scale={3}>
            <mesh 
                geometry={gltf.meshes.Icosphere_1.geometry}
            >
                <ScaleAnimatedMaterial 
                    color="green" 
                    transparent={true} 
                    opacity={0.7} 
                    animationActive={collisionState === COLLISION_STATES.SCALING} 
                />
            </mesh>
            <mesh 
                geometry={gltf.meshes.Icosphere_2.geometry}
            >
                <ScaleAnimatedMaterial 
                    color={[0.4, 0.4, 0.4]} 
                    animationActive={collisionState === COLLISION_STATES.SCALING}/>
            </mesh>
        </group>

        {collisionState === COLLISION_STATES.EXPLODING && <Explosion />}
        </>
}