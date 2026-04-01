import { BallCollider, CapsuleCollider, interactionGroups, RigidBody, useSphericalJoint } from "@react-three/rapier";
import React, { useRef } from "react";
import { Vector3 } from "three";
import useWanderSteering from "./hooks/useWanderSteering";
import { useFrame } from "@react-three/fiber";
import useCentralSteering from "./hooks/useCentralSteering";
import { COLLISION_GROUPS } from "../constants";
import { useGLTF } from "@react-three/drei";

const SEGMENT_DISTANCE = 2
const WANDER_RADIUS = 5
const WANDER_OFFSET = 6

export default React.memo(SnakeEnemy)

export function SnakeEnemy({ position, segments, playAreaSize, id, removeSelf}) {
    const head = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    return <>
        <SnakeHead ref={head} position={position} playAreaSize={playAreaSize} removeParentSnake={() => removeSelf(id)}/>
        <BodySegment parentRef={head} index={0} max={segments} position={nextSegmentPosition} />
    </>
}


function SnakeHead( {ref, position, playAreaSize, debug, removeParentSnake} ) {
    const wanderSteering = useWanderSteering(ref, WANDER_RADIUS, WANDER_OFFSET)
    const centralSteering = useCentralSteering(ref, playAreaSize, 0.9)
    const gltf = useGLTF("./space_shooter_enemy_snake.glb")
    

    useFrame(() => {
        if (!ref.current) return

        ref.current.applyImpulse(wanderSteering.steeringForceRef.current.add(centralSteering.steeringForceRef.current))
    })

    const handleHit = (collider) => {
        if (collider.rigidBody?.userData?.type === 'bullet') {
            removeParentSnake()
        }
    }

    return <>
        <RigidBody 
            ref={ref} 
            colliders={false} 
            type="dynamic" 
            position={position} 
            linearDamping={1} 
            angularDamping={1}
            collisionGroups={interactionGroups(COLLISION_GROUPS.INNER_OBJECTS)}
            onCollisionEnter={handleHit}
        >
            <CapsuleCollider args={[0.5, 1.5]} rotation={[Math.PI / 2, 0, 0 ]} position={[0, 0, -1]}/>
            <group scale={1}>
                <mesh geometry={gltf.meshes["Head_Base"].geometry}>
                    <meshBasicMaterial transparent opacity={0.6} color="blue" />
                </mesh>
                <mesh geometry={gltf.meshes["Head_Wireframe"].geometry}>
                    <meshBasicMaterial color={[1.4, 1.4, 1.4]} />
                </mesh>
            </group>
        </RigidBody>
        
        {debug && <>
            <DebugSphere posRef={wanderSteering.targetCenterRef} r={0.2} />
            <DebugSphere posRef={wanderSteering.targetCenterRef} r={WANDER_RADIUS} />
            <DebugSphere posRef={wanderSteering.targetOuterRef} r={0.4} color="green" />
        </>}
        
    </>
}

function DebugSphere({posRef, r=1, color="grey"}) {
    const mesh = useRef()

    useFrame(() => {
        mesh.current.position.x = posRef.current.x
        mesh.current.position.y = posRef.current.y
        mesh.current.position.z = posRef.current.z
    })

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[r]}/>
            <meshBasicMaterial color={color} wireframe />
        </mesh>
    )
}


function BodySegment({ parentRef, index, max, position }) {
    const segment = useRef()
    const mesh = useRef()
    const gltf = useGLTF("./space_shooter_enemy_snake.glb")

    useSphericalJoint(parentRef, segment, [
        [0, 0, SEGMENT_DISTANCE],
        [0, 0, 0]
    ])

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    return <>
        <RigidBody 
            ref={segment} 
            type="dynamic" 
            position={position} 
            mass={90} 
            linearDamping={3} 
            angularDamping={4} 
            colliders={false}
            collisionGroups={interactionGroups(COLLISION_GROUPS.INNER_OBJECTS, COLLISION_GROUPS.INNER_OBJECTS)} 
        >
            <group rotation={[0, Math.PI / 2, 0]}>
                <mesh ref={mesh} geometry={gltf.meshes["Body_Base"].geometry}>
                    <meshBasicMaterial transparent opacity={0.6} color="blue" />
                </mesh>
                <mesh ref={mesh} geometry={gltf.meshes["Body_Wireframe"].geometry}>
                    <meshBasicMaterial color={[0.8, 0.8, 0.8]} />
                </mesh>
            </group>
            
            <BallCollider args={[0.9]}/>
        </RigidBody>

        {(index + 1) < max && (
            <BodySegment parentRef={segment} index={index + 1} max={max} position={nextSegmentPosition} />
        )}
    </>
}