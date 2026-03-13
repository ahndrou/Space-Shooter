import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { Vector3 } from "three";

const SPEED = 9
const SEGMENT_DISTANCE = 1.5

export default React.memo(SnakeEnemy)

export function SnakeEnemy({ position, spaceshipRb, segments }) {
    const head = useRef()
    const mesh = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    // To avoid creating new instances every frame.
    const headPosition = useRef(new Vector3())
    const spaceshipPosition = useRef(new Vector3())
    const direction = useRef(new Vector3())

    useFrame(() => {
        // Conversion to ThreeJS vector is done so I can use its methods.
        // Rapier seems to use a POJO for its vectors.
        headPosition.current.x = head.current.translation().x
        headPosition.current.y = head.current.translation().y
        headPosition.current.z = head.current.translation().z

        spaceshipPosition.current.x = spaceshipRb.current.translation().x
        spaceshipPosition.current.y = spaceshipRb.current.translation().y
        spaceshipPosition.current.z = spaceshipRb.current.translation().z

        direction.current.subVectors(spaceshipPosition.current, headPosition.current).normalize()

        head.current.setLinvel(direction.current.multiplyScalar(SPEED))
        mesh.current.lookAt(spaceshipPosition.current)
    })

    return <>
        {/* Head */}
        <RigidBody ref={head} type="kinematicVelocity" position={position}>
            <mesh ref={mesh}>
                <boxGeometry args={[2, 2, 2]}/>
                <meshBasicMaterial color="red" />
            </mesh>
        </RigidBody>

        {/* Body */}
        <BodySegment parentRef={head} index={0} max={segments} position={nextSegmentPosition} />
    </>
}

function BodySegment({ parentRef, index, max, position }) {
    const segment = useRef()
    const mesh = useRef()

    const nextSegmentPosition = new Vector3().copy(position)
    nextSegmentPosition.z += SEGMENT_DISTANCE

    const parentPosition = useRef(new Vector3())
    const segmentPosition = useRef(new Vector3())
    const direction = useRef(new Vector3())
    const updatedPosition = useRef(new Vector3())

    useFrame(() => {
        parentPosition.current.x = parentRef.current.translation().x
        parentPosition.current.y = parentRef.current.translation().y
        parentPosition.current.z = parentRef.current.translation().z

        segmentPosition.current.x = segment.current.translation().x
        segmentPosition.current.y = segment.current.translation().y
        segmentPosition.current.z = segment.current.translation().z

        direction.current.subVectors(segmentPosition.current, parentPosition.current).normalize()

        updatedPosition.current.copy(direction.current).multiplyScalar(SEGMENT_DISTANCE).add(parentPosition.current)

        segment.current.setNextKinematicTranslation(updatedPosition.current)
        mesh.current.lookAt(parentPosition.current)

    })

    return <>
        <RigidBody ref={segment} type="kinematicPosition" position={position}>
            <mesh ref={mesh}>
                <boxGeometry args={[1, 1, 1]}/>
                <meshBasicMaterial color="blue" />
            </mesh>
        </RigidBody>

        {(index + 1) < max && (
            <BodySegment parentRef={segment} index={index + 1} max={max} position={nextSegmentPosition} />
        )}
    </>
}