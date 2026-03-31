import { useGLTF } from "@react-three/drei"
import AnimatedMaterial from "./AnimatedMaterial"

export default function AnimatedMesh({isHit, size, color="purple", triggerExplosion}) {
    const gltf = useGLTF("./space_shooter_enemy_explosive.glb")

    return <>
        <group scale={size}>
            <mesh 
                geometry={gltf.meshes.Base.geometry}
            >
                <AnimatedMaterial 
                    color={color}
                    transparent={true} 
                    opacity={0.6} 
                    animationActive={isHit} 
                    triggerExplosion={triggerExplosion}
                />
            </mesh>
            <mesh 
                geometry={gltf.meshes.Wireframe.geometry}
            >
                <AnimatedMaterial 
                    color={[1, 1, 1]} 
                    animationActive={isHit}
                    triggerExplosion={triggerExplosion}
                />
            </mesh>
        </group>
        </>
}