import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import AnimatedBasicMaterial from "./AnimatedBasicMaterial";

const MIN_TORQUE = 7
const MAX_TORQUE = 12
const TIME_TO_REMOVE = 1000

export default function EnemyBasic({position, remove}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")
    const rb = useRef()
    const hit = useRef(false)

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
                        if (hit.current === false) setTimeout(remove, TIME_TO_REMOVE)
                    }} 
                />
                <group scale={3}>
                    <mesh 
                        geometry={gltf.meshes.Icosphere_1.geometry}
                    >
                        <AnimatedBasicMaterial color="green" transparent={true} opacity={0.7} />
                    </mesh>
                    <mesh 
                        geometry={gltf.meshes.Icosphere_2.geometry}
                    >
                        <AnimatedBasicMaterial color={[0.4, 0.4, 0.4]} />
                    </mesh>
                </group>
        </RigidBody>
    )
}