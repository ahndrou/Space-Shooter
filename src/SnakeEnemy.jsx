import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, useSphericalJoint } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import { Vector3 } from "three";

const SEGMENT_DISTANCE = 1.5

export default React.memo(SnakeEnemy)

export function SnakeEnemy({ position, segments }) {
    const head = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    useFrame((state) => {
        head.current.applyImpulse({x: 0, y: Math.sin(state.clock.elapsedTime * 3) * 3, z: -1}, true)
    })

    return <>
        <SnakeHead ref={head} position={position} />
        <BodySegment parentRef={head} index={0} max={segments} position={nextSegmentPosition} />
    </>
}


function SnakeHead( {ref, position} ) {
    return (
        <RigidBody ref={ref} type="dynamic" position={position} linearDamping={3} angularDamping={4} >
            <mesh>
                <boxGeometry args={[2, 2, 2]}/>
                <meshBasicMaterial color="red" />
            </mesh>
        </RigidBody>
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