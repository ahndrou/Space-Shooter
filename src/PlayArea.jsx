import { DoubleSide } from "three";
import vertexShader from "./shaders/boundary/vertex.glsl"
import fragmentShader from "./shaders/boundary/fragment.glsl"
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export default function PlayArea({size}) {
    const camera = useThree((three) => three.camera)

    return (
        /* Transparent pass uses distance between camera & object origin
                for render order sorting. The bounding box walls are far from its origin
                which was causing artifacts. Rendering first fixes it. */
        <RigidBody type="fixed" colliders="trimesh">
            <mesh renderOrder={1}>
                <boxGeometry args={[size.x, size.y, size.z]} />
                <rawShaderMaterial
                    vertexShader={vertexShader} 
                    fragmentShader={fragmentShader} 
                    transparent
                    side={DoubleSide}
                    uniforms={{
                        cameraPos: {value: camera.position}
                    }}
                    />
            </mesh>
        </RigidBody>
    )
}