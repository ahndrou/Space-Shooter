import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, useSphericalJoint } from "@react-three/rapier";
import React, { useRef } from "react";
import { Quaternion, Vector3 } from "three";

const SEGMENT_DISTANCE = 1.5
const WANDER_RADIUS = 6
const WANDER_OFFSET = 6
const WANDER_RANGE_MAGNITUDE = 0.2
const MAX_FORCE = 1

export default React.memo(SnakeEnemy)

export function SnakeEnemy({ position, segments }) {
    const head = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    const wanderTargetCenter = useRef(new Vector3())
    const wanderTargetOuter = useRef(new Vector3())
    const wanderDisplacement = useRef(new Vector3())
    const headQuaternion = useRef(new Quaternion())
    const wanderTheta = useRef(0)
    const wanderPhi = useRef(0)
    const currentPosition = useRef(new Vector3())
    const steeringForce = useRef(new Vector3())

    useFrame((state) => {
        headQuaternion.current.set(
            head.current.rotation().x,
            head.current.rotation().y,
            head.current.rotation().z,
            head.current.rotation().w,
        )

        wanderDisplacement.current.set(0, 0, -WANDER_OFFSET).applyQuaternion(headQuaternion.current)

        currentPosition.current.set(
            head.current.translation().x,
            head.current.translation().y, 
            head.current.translation().z
        )

        wanderTargetCenter.current.copy(currentPosition.current).add(wanderDisplacement.current)

        // Using spherical coordinates to get a point on a sphere's surface.
        wanderTargetOuter.current.set(
            wanderTargetCenter.current.x + WANDER_RADIUS * Math.cos(wanderTheta.current) * Math.sin(wanderPhi.current),
            wanderTargetCenter.current.y + WANDER_RADIUS * Math.sin(wanderTheta.current) * Math.sin(wanderPhi.current),
            wanderTargetCenter.current.z + WANDER_RADIUS * Math.cos(wanderPhi.current)
        )

        wanderTheta.current += (Math.random() - 0.5) * 2 * WANDER_RANGE_MAGNITUDE
        wanderPhi.current += (Math.random() - 0.5) * 2 * WANDER_RANGE_MAGNITUDE

        steeringForce.current.copy(wanderTargetOuter.current).sub(currentPosition.current).normalize().multiplyScalar(MAX_FORCE)

        head.current.applyImpulse({
            x: steeringForce.current.x,
            y: steeringForce.current.y,
            z: steeringForce.current.z
        }, true)
    })

    return <>
        <SnakeHead ref={head} position={position} />
        <BodySegment parentRef={head} index={0} max={segments} position={nextSegmentPosition} />
{/* 
        <DebugSphere posRef={wanderTargetCenter} r={0.2}/>
        <DebugSphere posRef={wanderTargetCenter} r={WANDER_RADIUS}/>
        <DebugSphere posRef={wanderTargetOuter} r={0.3} color="green"/> */}
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