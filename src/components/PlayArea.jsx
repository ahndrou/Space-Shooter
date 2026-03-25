import { DoubleSide } from "three";
import vertexShader from "../shaders/boundary/vertex.glsl"
import fragmentShader from "../shaders/boundary/fragment.glsl"
import { useThree } from "@react-three/fiber";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { COLLISION_GROUPS } from "../constants";

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
    const camera = useThree((three) => three.camera)

    let dimensions, position

    if (orientation === WALL_ORIENTATIONS.get('TOP')) {
        dimensions = [size, THICKNESS, size]
        position = [0, size / 2, 0]
    } else if (orientation === WALL_ORIENTATIONS.get('BOTTOM')) {
        dimensions = [size, THICKNESS, size]
        position = [0, - size / 2, 0]
    } else if (orientation === WALL_ORIENTATIONS.get('RIGHT')) {
        dimensions = [THICKNESS, size, size]
        position = [size / 2, 0, 0]
    } else if (orientation === WALL_ORIENTATIONS.get('LEFT')) {
        dimensions = [THICKNESS, size, size]
        position = [- size / 2, 0, 0]
    } else if (orientation === WALL_ORIENTATIONS.get('FRONT')) {
        dimensions = [size, size, THICKNESS]
        position = [0, 0, size / 2]
    } else if (orientation === WALL_ORIENTATIONS.get('BACK')) {
        dimensions = [size, size, THICKNESS]
        position = [0, 0, - size / 2]
    } else {
        throw new Error(`Invalid wall orientation given: ${orientation}.`)
    }

    return (
        <RigidBody 
            position={position}
            type="fixed"
            collisionGroups={interactionGroups(COLLISION_GROUPS.BOUNDARY, COLLISION_GROUPS.INNER_OBJECTS)}
            userData={{type: "wall"}}
        >
            <mesh renderOrder={-1}>
                <boxGeometry args={dimensions} />
                <meshBasicMaterial transparent opacity={0.2}/>
                {/* <rawShaderMaterial
                    vertexShader={vertexShader} 
                    fragmentShader={fragmentShader} 
                    transparent
                    side={DoubleSide}
                    uniforms={{
                        cameraPos: {value: camera.position}
                    }}
                /> */}
            </mesh>
        </RigidBody>
    )
}

/* Transparent pass uses distance between camera & object origin
                for render order sorting. The bounding box walls are far from its origin
                which was causing artifacts. Rendering first fixes it. */
        // <RigidBody 
        //     type="fixed" 
        //     colliders="trimesh"
        //     collisionGroups={interactionGroups(COLLISION_GROUPS.BOUNDARY, COLLISION_GROUPS.INNER_OBJECTS)}
        // >
        //     <mesh renderOrder={1} userData={ {type: 'boundary' }}>
        //         <boxGeometry args={[size.x, size.y, size.z]} />

        //     </mesh>
        // </RigidBody>