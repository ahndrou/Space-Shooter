import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import Weapon from "./Weapon";

export default function Spaceship({ rigidBodyRef }) {
    const ANGULAR_SPEED_FACTOR = 2
    const LINEAR_SPEED_FACTOR = 20
    const POINTER_LOWER_BOUND = 0.3
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 0.6
    const ANGULAR_ACCELERATION = 2
    const LINEAR_ACCELERATION = 2
    
    const pointerActive = useRef(true)

    const gltf = useGLTF("./space_shooter_player.glb")

    const [ , getKeys ] = useKeyboardControls()

    useEffect(() => {
        const setPointerActive = () => pointerActive.current = true
        const setPointerInactive = () => pointerActive.current = false
        
        document.addEventListener("pointerleave", setPointerInactive)
        document.addEventListener("pointerenter", setPointerActive)

        return () => {
            document.removeEventListener("pointerleave", setPointerInactive)
            document.removeEventListener("pointerenter", setPointerActive)
        }
    }, [])
    
    // Creation of new objects each frame might cause slowdown due to GC.
    // The same objects are re-used for eacwh frame.
    const cameraOffset = useRef(new Vector3())
    const worldSpaceRotation = useRef(new Quaternion())
    const angularVelocityTarget = useRef(new Vector3(0, 0, 0))
    const linearVelocityTarget = useRef(new Vector3(0, 0, 0))

    // LERP is used. Thus we need a reference to the previous frame's velocity
    const smoothedLinearVelocity = useRef(new Vector3(0, 0, 0))
    const smoothedAngularVelocity = useRef(new Vector3(0, 0, 0))

    useFrame((state, delta) => {
        // rigidBodyRef.current.rotation() returns a plain object, not an instance
        // of the quaternion class.
        worldSpaceRotation.current.set(
            rigidBodyRef.current.rotation().x,
            rigidBodyRef.current.rotation().y,
            rigidBodyRef.current.rotation().z,
            rigidBodyRef.current.rotation().w,
        )

        // CAMERA SETUP
        cameraOffset.current.set(0, 3, 7)
        // Quaternion transforms from local space to world space.
        cameraOffset.current.applyQuaternion(worldSpaceRotation.current)
        cameraOffset.current.add(rigidBodyRef.current.translation())
        
        // The slight lag from LERP gives the user a nice indication that they are turning.
        state.camera.position.lerp(cameraOffset.current, 5 * delta)

        state.camera.rotation.setFromQuaternion(worldSpaceRotation.current)

        // INPUT HANDLING
        const keys = getKeys()

        let yawSpeed = 0
        if (pointerActive.current && Math.abs(state.pointer.x) > POINTER_LOWER_BOUND) {
            yawSpeed = -state.pointer.x * ANGULAR_SPEED_FACTOR
        }
        let pitchSpeed = 0
        if (pointerActive.current && Math.abs(state.pointer.y) > POINTER_LOWER_BOUND) {
            pitchSpeed = state.pointer.y * ANGULAR_SPEED_FACTOR
        }
        const rollSpeed = ((keys.leftward ? 1 : 0) + (keys.rightward ? -1 : 0)) * ANGULAR_SPEED_FACTOR

        angularVelocityTarget.current.set(pitchSpeed, yawSpeed, rollSpeed)
        angularVelocityTarget.current.applyQuaternion(worldSpaceRotation.current)

        linearVelocityTarget.current.set(0, 0, keys.forward ? -LINEAR_SPEED_FACTOR : 0)
        linearVelocityTarget.current.applyQuaternion(worldSpaceRotation.current)

        smoothedAngularVelocity.current.lerp(angularVelocityTarget.current, ANGULAR_ACCELERATION * delta)
        smoothedLinearVelocity.current.lerp(linearVelocityTarget.current, LINEAR_ACCELERATION * delta)

        rigidBodyRef.current.setAngvel(smoothedAngularVelocity.current, true)
        rigidBodyRef.current.setLinvel(smoothedLinearVelocity.current, true)

    })

    return <>
        <Weapon ship={rigidBodyRef} />
        <RigidBody 
            ref={rigidBodyRef} 
            position={[0, 0, 0]}
            type="kinematicVelocity"
            linearDamping={LINEAR_DAMPING} 
            angularDamping={ANGULAR_DAMPING}
        >
            <group 
                rotation={[0, Math.PI / 2, 0]}
                scale={0.5}
            >
                <mesh 
                    geometry={gltf.meshes["Cube001"].geometry}
                >
                    <meshBasicMaterial 
                        color={"olive"} 
                        transparent 
                        opacity={0.6} 
                    />
                </mesh>
                <mesh 
                    geometry={gltf.meshes["Cube001_1"].geometry}
                >
                    <meshBasicMaterial 
                        color={"green"} 
                    />
                </mesh>
            </group>
        </RigidBody>
    </>
}