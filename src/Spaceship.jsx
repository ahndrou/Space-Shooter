import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { Quaternion, Vector3 } from "three";

export default function Spaceship() {
    const LINEAR_IMPULSE_STR = 0.4
    const ANGULAR_IMPULSE_STR = 0.2
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 0.6

    const rb = useRef()

    const [ subToKeys, getKeys ] = useKeyboardControls()

    const [smoothedCameraPosition] = useState(() => new Vector3(0, 0, 0))
    const [smoothedCameraTarget] = useState(() => new Vector3(0, 0, 0))

    useFrame(() => {
        const keysState = getKeys()

        if (keysState.forward) {
            const localSpaceImpulse = new Vector3(0, 0, -LINEAR_IMPULSE_STR)

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
            rb.current.applyTorqueImpulse({ x: 0, y: ANGULAR_IMPULSE_STR, z: 0})
        }
        
        if (keysState.rightward) {
            rb.current.applyTorqueImpulse({ x: 0, y: -ANGULAR_IMPULSE_STR, z: 0})
        }
    })

    // CAMERA HANDLING
    useFrame((state, delta) => {
        const cameraPosition = new Vector3()
        const cameraTarget = new Vector3()

        cameraPosition.copy(rb.current.translation())
        cameraTarget.copy(rb.current.translation())
 
        let positionTransform = new Vector3(0, 2, 6)
        let targetTransform = new Vector3(0, 0, -6)
        
        // Transforming from local to world space.
        const shipOrientation = new Quaternion(
            rb.current.rotation().x,
            rb.current.rotation().y,
            rb.current.rotation().z,
            rb.current.rotation().w,
        )
        positionTransform.applyQuaternion(shipOrientation)
        targetTransform.applyQuaternion(shipOrientation)

        cameraPosition.add(positionTransform)
        cameraTarget.add(targetTransform)

        smoothedCameraPosition.lerp(cameraPosition, 8 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 8 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)
    })

    return (
        <RigidBody 
            ref={rb} 
            position={[0, 4, 0]} 
            linearDamping={LINEAR_DAMPING} 
            angularDamping={ANGULAR_DAMPING}
        >
            <mesh castShadow>
                <boxGeometry args={[1, 1, 4]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
        
    )
}