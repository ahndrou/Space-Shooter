import { RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import { Trail } from "@react-three/drei";

export default React.memo(Bullet)

export function Bullet({position, rotation}) {
    const INITIAL_SPEED = 120
    const rb = useRef();

    useEffect(() => {
        const velocity = new Vector3(0, 0, -INITIAL_SPEED)
        const q = new Quaternion().setFromEuler(rotation)
        velocity.applyQuaternion(q)
        rb.current.setLinvel(velocity)

    }, [rotation])


    return (
        // Trail ends seem to flicker a lot when used with Rapier Rigid Bodies.
        // I tried everything I could think of, but the only solution that seems to work is to
        // hide the flickering by hiding the ends of the trail with attenuation.
        <Trail
            color='orange'
            width={3}
            length={8}
            attenuation={t => t < 0.02 || t > 0.98 ? 0 : t}
        >    
            <RigidBody 
                ref={rb}
                type="dynamic"
                position={position}
                rotation={rotation}
                userData={{type: 'bullet'}}
            >
                <mesh>
                    <sphereGeometry args={[0.15]} />
                    <meshBasicMaterial color='orange' />
                </mesh>
            </RigidBody>
        </Trail>
    )
}