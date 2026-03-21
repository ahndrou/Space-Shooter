import { BallCollider, CuboidCollider, RigidBody, useSphericalJoint } from "@react-three/rapier";
import React, { useRef } from "react";
import { Vector3 } from "three";
import useWanderTarget from "./hooks/useWanderTarget";
import { useFrame } from "@react-three/fiber";

const SEGMENT_DISTANCE = 1.5


export default React.memo(SnakeEnemy)

export function SnakeEnemy({ position, segments }) {
    const head = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    return <>
        <SnakeHead ref={head} position={position} />
        <BodySegment parentRef={head} index={0} max={segments} position={nextSegmentPosition} />
        
    </>
}


function SnakeHead( {ref, position} ) {
    const {steeringForce, wanderTargetCenter, wanderTargetOuter} = useWanderTarget(ref)

    useFrame(() => {
        ref.current.applyImpulse(steeringForce.current)
    })

    return <>
        <RigidBody ref={ref} colliders={false} type="dynamic" position={position} linearDamping={3} angularDamping={4} >
            <CuboidCollider args={[1, 1, 1]} />
            <mesh>
                <boxGeometry args={[2, 2, 2]}/>
                <meshBasicMaterial color="red" />
            </mesh>
        </RigidBody>
        
        <DebugSphere posRef={wanderTargetCenter} r={0.2} />
        <DebugSphere posRef={wanderTargetCenter} r={6} />
        <DebugSphere posRef={wanderTargetOuter} r={0.4} color="green" />
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
        <RigidBody ref={segment} type="dynamic" position={position} mass={90} linearDamping={3} angularDamping={4} colliders={false}>
            <mesh ref={mesh}>
                <boxGeometry args={[1, 1, 1]}/>
                <meshBasicMaterial color="blue" />
            </mesh>
            <BallCollider args={[0.6]} />
        </RigidBody>

        {(index + 1) < max && (
            <BodySegment parentRef={segment} index={index + 1} max={max} position={nextSegmentPosition} />
        )}
    </>
}