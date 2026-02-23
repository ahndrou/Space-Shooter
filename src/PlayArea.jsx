import { RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";

import vertexShader from "./shaders/boundary/vertex.glsl"
import fragmentShader from "./shaders/boundary/fragment.glsl"

export default function PlayArea({size}) {
    return (
        <RigidBody
            type="fixed"
        >
            {/* Transparent pass uses distance between camera & object origin
                for render order sorting. The bounding box walls are far from its origin
                which was causing artifacts. */}
            <mesh renderOrder={1}>
                <boxGeometry args={[size.x, size.y, size.z]} />
                <rawShaderMaterial
                    vertexShader={vertexShader} 
                    fragmentShader={fragmentShader} 
                    transparent
                    side={DoubleSide}
                    />
            </mesh>

        </RigidBody>
    )
}