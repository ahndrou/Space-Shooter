import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Quaternion, Vector3 } from "three";

export default function Spaceship() {
    const rb = useRef()

    const [ subToKeys, getKeys ] = useKeyboardControls()

    useFrame(() => {
        const keysState = getKeys()

        if (keysState.forward) {
            const localSpaceImpulse = new Vector3(0, 0, -0.75)

            const worldSpaceOrientation = new Quaternion(
                rb.current.rotation().x,
                rb.current.rotation().y,
                rb.current.rotation().z,
                rb.current.rotation().w,
            ) 
            const worldSpaceImpulse = localSpaceImpulse.applyQuaternion(worldSpaceOrientation)
            rb.current.applyImpulse(worldSpaceImpulse, true)
        }

        if (keysState.leftward) {
            rb.current.applyTorqueImpulse({ x: 0, y: 0.4, z: 0})
        }
        
        if (keysState.rightward) {
            rb.current.applyTorqueImpulse({ x: 0, y: -0.4, z: 0})
        }
    })

    return (
        <RigidBody ref={rb} position={[0, 4, 0]}>
            <mesh castShadow>
                <boxGeometry args={[2,2,2]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
        
    )
}