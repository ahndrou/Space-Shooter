import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import useCentralSteering from "../hooks/useCentralSteering";
import { useRef } from "react";
import useRandomTorque from "../hooks/useRandomTorque";

export default function Collectable({position, rotation, size, playAreaSize}) {
    const gltf = useGLTF("./space_shooter_collectable.glb")
    const rbRef = useRef()

    // Don't want to get the collectables stuck where the player can't reach.
    useCentralSteering(rbRef, playAreaSize, 0.9, 20)
    useRandomTorque(10, 20, rbRef)

    return (
        <RigidBody ref={rbRef} position={position} rotation={rotation} scale={size}>
            <mesh geometry={gltf.meshes['Base'].geometry}>
                <meshBasicMaterial transparent opacity={0.5} color='red' />
            </mesh>
            <mesh geometry={gltf.meshes['Wireframe'].geometry}>
                <meshBasicMaterial color='white' />
            </mesh>
        </RigidBody>
    )
}