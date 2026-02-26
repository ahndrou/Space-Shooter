import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";

export default function Bullet({position, rotation}) {
    const SPEED = 20
    const rb = useRef();

    useEffect(() => {
        const velocity = new Vector3(0, 0, -SPEED)
        const q = new Quaternion().setFromEuler(rotation)
        velocity.applyQuaternion(q)
        rb.current.setLinvel(velocity)

    }, [rotation])

    return (
        <RigidBody 
            ref={rb}
            type="kinematicVelocity"
            position={position}
            rotation={rotation}
        >
            <mesh>
                <boxGeometry args={[0.3, 0.3, 1.2]} />
                <meshBasicMaterial color="green" />
            </mesh>
        </RigidBody>
    )
}