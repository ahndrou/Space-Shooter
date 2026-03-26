import { Vector2, Vector3 } from "three";
import vertexShader from "../shaders/boundary/vertex.glsl"
import fragmentShader from "../shaders/boundary/fragment.glsl"
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { COLLISION_GROUPS } from "../constants";
import { useRef } from "react";

const WALL_ORIENTATIONS = new Map(Object.entries({
    TOP: 1,
    BOTTOM: 2,
    RIGHT: 3,
    LEFT: 4,
    FRONT: 5,
    BACK: 6
}))

const THICKNESS = 2

export default function PlayArea({size}) {

    return [...WALL_ORIENTATIONS].map(([, orientation]) => (
        <BoundaryWall
            key={orientation}
            orientation={orientation}
            size={size}
        />
    ))
}

function BoundaryWall({orientation, size}) {
    const meshRef = useRef()
    const customUniformsRef = useRef({
        uCollisionPoints: {value: new Vector2()}
    })

    let dimensions, position, rotation
    dimensions = [size - THICKNESS, size - THICKNESS, THICKNESS]

    if (orientation === WALL_ORIENTATIONS.get('FRONT')) {
        position = [0, 0, size / 2]
        rotation = [0, Math.PI, 0]
    }

    else if (orientation === WALL_ORIENTATIONS.get('BACK')) {
        position = [0, 0, -size / 2]
        rotation = [0, 0, 0]
    }

    else if (orientation === WALL_ORIENTATIONS.get('RIGHT')) {
        position = [size / 2, 0, 0]
        rotation = [0, -Math.PI / 2, 0]
    }

    else if (orientation === WALL_ORIENTATIONS.get('LEFT')) {
        position = [-size / 2, 0, 0]
        rotation = [0, Math.PI / 2, 0]
    }

    else if (orientation === WALL_ORIENTATIONS.get('TOP')) {
        position = [0, size / 2, 0]
        rotation = [Math.PI / 2, 0, 0]
    }

    else if (orientation === WALL_ORIENTATIONS.get('BOTTOM')) {
        position = [0, -size / 2, 0]
        rotation = [-Math.PI / 2, 0, 0]
    }

    function handleCollision(collision) {
        let collisionPoint = collision.manifold.solverContactPoint(0) // World space
        let collosionPointVec = new Vector3(collisionPoint.x, collisionPoint.y, collisionPoint.z)
        collisionPoint = meshRef.current.worldToLocal(collosionPointVec) // Local space
        collisionPoint.divideScalar(size/2).addScalar(1).divideScalar(2) // Range 0 <> 1.

        customUniformsRef.current.uCollisionPoints.value.set(collisionPoint.x, collisionPoint.y)
    }

    return (
        <RigidBody 
            position={position}
            rotation={rotation}
            type="fixed"
            collisionGroups={interactionGroups(COLLISION_GROUPS.BOUNDARY, COLLISION_GROUPS.INNER_OBJECTS)}
            userData={{type: "wall"}}
            onCollisionEnter={handleCollision}
        >
            <mesh ref={meshRef} renderOrder={-1}>
                <boxGeometry args={dimensions} />
                <rawShaderMaterial
                    vertexShader={vertexShader} 
                    fragmentShader={fragmentShader} 
                    transparent
                    uniforms={customUniformsRef.current}
                />
            </mesh>
        </RigidBody>
    )
}