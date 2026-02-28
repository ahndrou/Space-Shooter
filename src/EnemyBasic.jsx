import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import AnimatedBasicMaterial from "./AnimatedBasicMaterial";
import Explosion from "./Explosion";
import { useFrame } from "@react-three/fiber";

const MIN_TORQUE = 7
const MAX_TORQUE = 12

const SCALING_TIME = 2
const EXPLODING_TIME = 2

export default function EnemyBasic({position, disposeSelf}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")
    const rb = useRef()
    const [collisionProgress, setCollisionProgress] = useState("NO_COLLISION")

    const animationTimer = useRef(0)

    useFrame((state, delta) => {
        if (collisionProgress !== "NO_COLLISION") {
            animationTimer.current += delta
        }

        if (collisionProgress === "SCALING" && animationTimer.current >= SCALING_TIME) {
            setCollisionProgress("EXPLODING")
            animationTimer.current = 0
        } else if (collisionProgress === "EXPLODING" && animationTimer.current >= EXPLODING_TIME) {
            disposeSelf()
        }
    })

    useEffect(() => {
        rb.current.addTorque(new Vector3(
            Math.max(MIN_TORQUE, Math.random() * MAX_TORQUE),
            Math.max(MIN_TORQUE, Math.random() * MAX_TORQUE),
            Math.max(MIN_TORQUE, Math.random() * MAX_TORQUE)
        ))
    }, [])

    return (
        <RigidBody
            type="dynamic"
            position={position}
            ref={rb}
            colliders={false}
            canSleep={false}
            angularDamping={0.4}
            >
                <BallCollider
                    args={[3]}
                    sensor
                    onIntersectionEnter={() => {
                        if (collisionProgress === "NO_COLLISION") {
                            setCollisionProgress("SCALING")
                        }
                    }} 
                />

                <group scale={3}>
                    <mesh 
                        geometry={gltf.meshes.Icosphere_1.geometry}
                    >
                        <AnimatedBasicMaterial color="green" transparent={true} opacity={0.7} animationActive={collisionProgress === "SCALING"} />
                    </mesh>
                    <mesh 
                        geometry={gltf.meshes.Icosphere_2.geometry}
                    >
                        <AnimatedBasicMaterial color={[0.4, 0.4, 0.4]} animationActive={collisionProgress === "SCALING"}/>
                    </mesh>
                </group>

                {collisionProgress === "EXPLODING" && <Explosion />}
        </RigidBody>
    )
}