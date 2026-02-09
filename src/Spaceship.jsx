import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";

export default function Spaceship() {
    const rb = useRef()

    useEffect(() => {
        rb.current.setLinvel({x: 0, y: 0, z: -1}, true)
    }, [])

    return (
        <RigidBody ref={rb} position={[0, 4, 0]}>
            <mesh castShadow>
                <boxGeometry args={[2,2,2]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </RigidBody>
        
    )
}