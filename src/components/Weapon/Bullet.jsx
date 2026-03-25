import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Vector2, Vector3 } from "three";

import vertexShader from "../../shaders/bullet/vertex.glsl"
import fragmentShader from "../../shaders/bullet/fragment.glsl"
import { useGLTF } from "@react-three/drei";


useGLTF.preload("/bullet.glb")

export default function Bullet({position, rotation}) {
    const SPEED = 140
    const rb = useRef();

    const {meshes : { Cylinder : { geometry } }} = useGLTF("/bullet.glb")

    useEffect(() => {
        const velocity = new Vector3(0, 0, -SPEED)
        const q = new Quaternion().setFromEuler(rotation)
        velocity.applyQuaternion(q)
        rb.current.setLinvel(velocity)

    }, [rotation])

    geometry.computeBoundingBox()
    const zBounds = new Vector2(geometry.boundingBox.min.z, geometry.boundingBox.max.z)

    return (
        <RigidBody 
            ref={rb}
            type="kinematicVelocity"
            position={position}
            rotation={rotation}
        >
            <mesh geometry={geometry} scale={4.5}>
                <rawShaderMaterial
                    vertexShader={vertexShader} 
                    fragmentShader={fragmentShader} 
                    transparent
                    uniforms={{
                        uTipColour : { value : new Vector3(1, 0.84, 0.2) },
                        uTailColour : { value : new Vector3(0.91, 0.37, 0.29) },
                        uZBounds : { value : zBounds }
                    }}
                />
            </mesh>
        </RigidBody>
    )
}