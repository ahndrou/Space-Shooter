import { BallCollider, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import useRandomTorque from "./hooks/useRandomTorque";

const MIN_TORQUE = 7
const MAX_TORQUE = 12

export default React.memo(BasicEnemy)

export function BasicEnemy({position, size}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")
    const rb = useRef()
    
    useRandomTorque(MIN_TORQUE, MAX_TORQUE, rb)

    return (
        <RigidBody
            type="dynamic"
            position={position}
            ref={rb}
            colliders={false}
            canSleep={false}
            angularDamping={0.4}
            userData={{type: "basic enemy"}}
            >
                <BallCollider args={[size * 0.97]}/>
                <group scale={size}>
                    <mesh 
                        geometry={gltf.meshes.Icosphere_1.geometry}
                    >
                        <meshBasicMaterial color="green" transparent opacity={0.6} />
                    </mesh>
                    
                    <mesh 
                        geometry={gltf.meshes.Icosphere_2.geometry}
                    >
                         <meshBasicMaterial color="white" />
                    </mesh>
                </group>
        </RigidBody>
    )
}