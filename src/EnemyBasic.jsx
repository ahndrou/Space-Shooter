import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";

export default function EnemyBasic({position}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")
    const rb = useRef()

    const MAX_SPEED = 0.4

    useEffect(() => {
        console.log(rb.current)
        rb.current.setAngvel(new Vector3(
            Math.min(Math.random(), MAX_SPEED),
            Math.min(Math.random(), MAX_SPEED),
            Math.min(Math.random(), MAX_SPEED)
        ))
    }, [])

    return (
        <RigidBody
            type="kinematicVelocity"
            position={position}
            ref={rb}
            >
                <group scale={3}>
                    <mesh 
                    geometry={gltf.meshes.Icosphere_1.geometry}
                    material={gltf.materials["Material.001"]}
                    />
                    <mesh 
                        geometry={gltf.meshes.Icosphere_2.geometry}
                        material={gltf.materials["Material.003"]}
                    />
                </group>
                
            
        </RigidBody>
    )
}