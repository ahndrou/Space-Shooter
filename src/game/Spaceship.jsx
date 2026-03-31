import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import Weapon from "./Weapon/Weapon";
import useCentralSteering from "./hooks/useCentralSteering";

export default function Spaceship({ rigidBodyRef, playAreaSize}) {
    const MAX_ANGULAR_FORCE = 0.25
    const MAX_LINEAR_FORCE = 0.5
    const POINTER_LOWER_BOUND = 0.3
    const LINEAR_DAMPING = 0.4
    const ANGULAR_DAMPING = 6
    const CAMERA_DELAY = 19
    
    const pointerActive = useRef(true)

    const gltf = useGLTF("./player_spaceship.glb")

    const centralSteering = useCentralSteering(rigidBodyRef, playAreaSize, 0.86, 2)

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
    const angularForce = useRef(new Vector3(0, 0, 0))
    const linearForce = useRef(new Vector3(0, 0, 0))

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
        state.camera.position.lerp(cameraOffset.current, CAMERA_DELAY * delta)
        state.camera.rotation.setFromQuaternion(worldSpaceRotation.current)

        // INPUT HANDLING
        const keys = getKeys()

        let yawForce = 0
        if (pointerActive.current && Math.abs(state.pointer.x) > POINTER_LOWER_BOUND) {
            yawForce = -state.pointer.x 
        }
        let pitchForce = 0
        if (pointerActive.current && Math.abs(state.pointer.y) > POINTER_LOWER_BOUND) {
            pitchForce = state.pointer.y
        }
        const rollForce = ((keys.leftward ? 1 : 0) + (keys.rightward ? -1 : 0))

        angularForce.current.set(pitchForce, yawForce, rollForce).normalize().multiplyScalar(MAX_ANGULAR_FORCE)
        angularForce.current.applyQuaternion(worldSpaceRotation.current)

        linearForce.current.set(0, 0, keys.forward ? -MAX_LINEAR_FORCE : 0)
        linearForce.current.applyQuaternion(worldSpaceRotation.current)

        rigidBodyRef.current.applyTorqueImpulse(angularForce.current.add(centralSteering.steeringTorqueRef.current), true)
        rigidBodyRef.current.applyImpulse(linearForce.current.add(centralSteering.steeringForceRef.current), true)

    })

    return <>
        <Weapon ship={rigidBodyRef} />
        <RigidBody 
            ref={rigidBodyRef} 
            colliders={false}
            type="dynamic"
            linearDamping={LINEAR_DAMPING} 
            angularDamping={ANGULAR_DAMPING}
            canSleep={false}
            userData={{type: 'player'}}
        >
            <CuboidCollider args={[1.9, 0.3, 1.5]} />
            <group 
                rotation={[0, Math.PI / 2, 0]}
                scale={0.4}
            >
                <mesh 
                    geometry={gltf.meshes["Base"].geometry}
                >
                    <meshBasicMaterial 
                        color={"green"} 
                        transparent 
                        opacity={0.6} 
                    />
                </mesh>

                <mesh 
                    geometry={gltf.meshes["Wireframe"].geometry}
                >
                    <meshBasicMaterial 
                        color={"white"} 
                    />
                </mesh>

                <mesh 
                    geometry={gltf.meshes["Thruster_L"].geometry}
                >
                    <meshBasicMaterial 
                        color={"orange"} 
                    />
                </mesh>

                <mesh 
                    geometry={gltf.meshes["Thruster_R"].geometry}
                >
                    <meshBasicMaterial 
                        color={"orange"} 
                    />
                </mesh>
            </group>

        </RigidBody>
    </>
}