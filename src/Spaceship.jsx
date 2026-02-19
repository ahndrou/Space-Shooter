import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Quaternion, Vector3 } from "three";

export default function Spaceship() {
    const ANGULAR_SPEED_FACTOR = 0.9
    const LINEAR_SPEED_FACTOR = 6
    const POINTER_LOWER_BOUND = 0.3
    const POINTER_UPPER_BOUND = 0.99
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 0.6
    const ANGULAR_ACCELERATION = 2
    const LINEAR_ACCELERATION = 2

    const rb = useRef()

    const [ , getKeys ] = useKeyboardControls()
    
    const cameraOffset = new Vector3()
    const worldSpaceRotation = new Quaternion()
    const angularVelocityTarget = new Vector3(0, 0, 0)
    const linearVelocityTarget = new Vector3(0, 0, 0)

    const smoothedLinearVelocity = new Vector3(0, 0, 0)
    const smoothedAngularVelocity = new Vector3(0, 0, 0)

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
        cameraOffset.set(0, 1, 7)
        // Quaternion transforms from local space to world space.
        cameraOffset.applyQuaternion(worldSpaceRotation)
        
        state.camera.position.copy(rb.current.translation())
        state.camera.position.add(cameraOffset)

        state.camera.rotation.setFromQuaternion(worldSpaceRotation)

        // INPUT HANDLING
        let yawSpeed = 0
        // Upper bound is to prevent endless spinning if user moves pointer outside of the window.
        if (Math.abs(state.pointer.x) > POINTER_LOWER_BOUND && Math.abs(state.pointer.x) < POINTER_UPPER_BOUND) {
            yawSpeed = -state.pointer.x * ANGULAR_SPEED_FACTOR
        }
        let pitchSpeed = 0
        if (Math.abs(state.pointer.y) > POINTER_LOWER_BOUND && Math.abs(state.pointer.y) < POINTER_UPPER_BOUND) {
            pitchSpeed = state.pointer.y * ANGULAR_SPEED_FACTOR
        }
        const rollSpeed = ((keys.leftward ? 1 : 0) + (keys.rightward ? -1 : 0)) * ANGULAR_SPEED_FACTOR

        angularVelocityTarget.set(pitchSpeed, yawSpeed, rollSpeed)
        angularVelocityTarget.applyQuaternion(worldSpaceRotation)

        linearVelocityTarget.set(0, 0, keys.forward ? -LINEAR_SPEED_FACTOR : 0)
        linearVelocityTarget.applyQuaternion(worldSpaceRotation)

        smoothedAngularVelocity.lerp(angularVelocityTarget, ANGULAR_ACCELERATION * delta)
        smoothedLinearVelocity.lerp(linearVelocityTarget, LINEAR_ACCELERATION * delta)

        rb.current.setAngvel(smoothedAngularVelocity, true)
        rb.current.setLinvel(smoothedLinearVelocity, true)

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