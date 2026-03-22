import { BallCollider, CuboidCollider, interactionGroups, RigidBody, useSphericalJoint } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import { Vector3 } from "three";
import useWanderSteering from "./hooks/useWanderSteering";
import { useFrame } from "@react-three/fiber";
import useCentralSteering from "./hooks/useCentralSteering";
import { COLLISION_GROUPS } from "./constants";

const SEGMENT_DISTANCE = 1.5
const WANDER_RADIUS = 5
const WANDER_OFFSET = 6

export default React.memo(SnakeEnemy)

export function SnakeEnemy({ position, segments, playAreaSize}) {
    const head = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    return <>
        <SnakeHead ref={head} position={position} playAreaSize={playAreaSize} />
        <BodySegment parentRef={head} index={0} max={segments} position={nextSegmentPosition} />
    </>
}


function SnakeHead( {ref, position, playAreaSize, debug} ) {
    const wanderSteering = useWanderSteering(ref, WANDER_RADIUS, WANDER_OFFSET)
    const centralSteering = useCentralSteering(ref, playAreaSize, 0.9)

    useFrame(() => {
        ref.current.applyImpulse(wanderSteering.steeringForceRef.current.add(centralSteering.steeringForceRef.current))
    })

    return <>
        <RigidBody 
            ref={ref} 
            colliders={false} 
            type="dynamic" 
            position={position} 
            linearDamping={1} 
            angularDamping={1}
            collisionGroups={interactionGroups(COLLISION_GROUPS.INNER_OBJECTS)} 
        >
            <BallCollider args={[1.2]} />
            <mesh>
                <boxGeometry args={[2, 2, 2]}/>
                <meshBasicMaterial color="red" />
            </mesh>
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
            <mesh ref={mesh}>
                <boxGeometry args={[1, 1, 1]}/>
                <meshBasicMaterial color="blue" />
            </mesh>
            <BallCollider args={[0.6]}/>
        </RigidBody>

        {(index + 1) < max && (
            <BodySegment parentRef={segment} index={index + 1} max={max} position={nextSegmentPosition} />
        )}
    </>
}