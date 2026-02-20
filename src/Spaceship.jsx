import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Quaternion, Vector3 } from "three";

export default function Spaceship({pointerActive}) {
    const ANGULAR_SPEED_FACTOR = 0.9
    const LINEAR_SPEED_FACTOR = 6
    const POINTER_LOWER_BOUND = 0.3
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 0.6
    const ANGULAR_ACCELERATION = 2
    const LINEAR_ACCELERATION = 2

    const rb = useRef()

    const [ , getKeys ] = useKeyboardControls()
    
    // Calculated from scratch each frame, but this avoids creating a new object
    // every frame.
    const cameraOffset = useRef(new Vector3())
    const worldSpaceRotation = useRef(new Quaternion())
    const angularVelocityTarget = useRef(new Vector3(0, 0, 0))
    const linearVelocityTarget = useRef(new Vector3(0, 0, 0))

    // This needs to be maintained across renders.
    const smoothedLinearVelocity = useRef(new Vector3(0, 0, 0))
    const smoothedAngularVelocity = useRef(new Vector3(0, 0, 0))

    useFrame((state, delta) => {
        const keys = getKeys()

        // rb.current.rotation() returns a plain object, not an instance
        // of the quaternion class.
        worldSpaceRotation.current.set(
            rb.current.rotation().x,
            rb.current.rotation().y,
            rb.current.rotation().z,
            rb.current.rotation().w,
        )

        // CAMERA SETUP
        cameraOffset.current.set(0, 1, 7)
        // Quaternion transforms from local space to world space.
        cameraOffset.current.applyQuaternion(worldSpaceRotation.current)
        
        state.camera.position.copy(rb.current.translation())
        state.camera.position.add(cameraOffset.current)

        state.camera.rotation.setFromQuaternion(worldSpaceRotation.current)

        // INPUT HANDLING
        let yawSpeed = 0
        if (pointerActive && Math.abs(state.pointer.x) > POINTER_LOWER_BOUND) {
            yawSpeed = -state.pointer.x * ANGULAR_SPEED_FACTOR
        }
        let pitchSpeed = 0
        if (pointerActive && Math.abs(state.pointer.y) > POINTER_LOWER_BOUND) {
            pitchSpeed = state.pointer.y * ANGULAR_SPEED_FACTOR
        }
        const rollSpeed = ((keys.leftward ? 1 : 0) + (keys.rightward ? -1 : 0)) * ANGULAR_SPEED_FACTOR

        angularVelocityTarget.current.set(pitchSpeed, yawSpeed, rollSpeed)
        angularVelocityTarget.current.applyQuaternion(worldSpaceRotation.current)

        linearVelocityTarget.current.set(0, 0, keys.forward ? -LINEAR_SPEED_FACTOR : 0)
        linearVelocityTarget.current.applyQuaternion(worldSpaceRotation.current)

        smoothedAngularVelocity.current.lerp(angularVelocityTarget.current, ANGULAR_ACCELERATION * delta)
        smoothedLinearVelocity.current.lerp(linearVelocityTarget.current, LINEAR_ACCELERATION * delta)

        rb.current.setAngvel(smoothedAngularVelocity.current, true)
        rb.current.setLinvel(smoothedLinearVelocity.current, true)

    })

    return (
        <RigidBody 
            ref={rb} 
            position={[0, 0, 0]}
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