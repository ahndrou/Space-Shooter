import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";

const SPEED = 4

export default function SnakeEnemy({ position, spaceshipRb }) {
    const head = useRef()

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
    })

    return <RigidBody ref={head} type="kinematicVelocity" position={position}>
        <mesh>
            <boxGeometry args={[2, 2, 2]}/>
            <meshBasicMaterial color="red" />
        </mesh>
    </RigidBody>
}