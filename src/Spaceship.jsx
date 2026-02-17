import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Quaternion, Vector3 } from "three";

export default function Spaceship() {
    const ANGULAR_SPEED_FACTOR = 1
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 0.6

    const rb = useRef()

    const [ , getKeys ] = useKeyboardControls()

    const smoothedCameraPosition = new Vector3(0, 0, 0)
    const smoothedCameraTarget = new Vector3(0, 0, 0)

    const yaw = useRef(0)
    const pitch = useRef(0)
    const roll = useRef(0)

    useFrame((state, delta) => {
        const keys = getKeys()

        // INPUT HANDLING
        yaw.current   += -state.pointer.x * ANGULAR_SPEED_FACTOR * delta
        pitch.current +=  state.pointer.y * ANGULAR_SPEED_FACTOR * delta
        roll.current  += ((keys.leftward ? 1 : 0) - (keys.rightward ? 1 : 0)) * ANGULAR_SPEED_FACTOR * delta

        // Build rotation quaternion
        const qYaw   = new Quaternion().setFromAxisAngle(new Vector3(0,1,0), yaw.current)
        const qPitch = new Quaternion().setFromAxisAngle(new Vector3(1,0,0), pitch.current)
        const qRoll  = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), roll.current)
        const finalRotation = new Quaternion()
            .multiply(qYaw)
            .multiply(qPitch)
            .multiply(qRoll)

        rb.current.setNextKinematicRotation(finalRotation)

        // CAMERA HANDLING
        const cameraPosition = new Vector3()
        const cameraTarget = new Vector3()

        cameraPosition.copy(rb.current.translation())
        cameraTarget.copy(rb.current.translation())
 
        let positionTransform = new Vector3(0, 2, 6)
        let targetTransform = new Vector3(0, 0, -6)
        
        // Transform to ship's local space
        positionTransform.applyQuaternion(rb.current.rotation())
        targetTransform.applyQuaternion(rb.current.rotation())

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
            type="kinematicPosition"
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