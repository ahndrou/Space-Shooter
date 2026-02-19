import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";



export default function Spaceship() {
    const ANGULAR_SPEED_FACTOR = 1
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 0.6

    const rb = useRef()

    const [ , getKeys ] = useKeyboardControls()
    
    const cameraOffset = new Vector3()
    const worldSpaceRotation = new Quaternion()
    const angularVelocity = new Vector3(0, 0, 0)

    useFrame((state, delta) => {
        const keys = getKeys()

        // rb.current.rotation() returns a plain object, not an instance
        // of the quaternion class.
        worldSpaceRotation.set(
            rb.current.rotation().x,
            rb.current.rotation().y,
            rb.current.rotation().z,
            rb.current.rotation().w,
        )

        // CAMERA SETUP
        cameraOffset.set(0, 3, 6)
        cameraOffset.applyQuaternion(worldSpaceRotation)
        
        state.camera.position.copy(rb.current.translation())
        state.camera.position.add(cameraOffset)

        state.camera.rotation.setFromQuaternion(worldSpaceRotation)

        // INPUT HANDLING
        const yawSpeed = ((keys.leftward ? 1 : 0) + (keys.rightward ? -1 : 0)) * 2
        const pitchSpeed = ((keys.forward ? 1 : 0) + (keys.backward ? -1 : 0)) * 2
        const rollSpeed = (keys.space ? 1 : 0) * 2

        angularVelocity.set(pitchSpeed, yawSpeed, rollSpeed)
        angularVelocity.applyQuaternion(worldSpaceRotation)

        rb.current.setAngvel(angularVelocity, true)
    })

    return (
        <RigidBody 
            ref={rb} 
            position={[0, 4, 0]}
            type="kinematicVelocity"
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