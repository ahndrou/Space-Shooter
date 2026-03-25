import { useGLTF } from "@react-three/drei"
import AnimatedMaterial from "./AnimatedMaterial"

export default function AnimatedMesh({isHit, size, color="purple", triggerExplosion}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")

    return <>
        <group scale={size}>
            <mesh 
                geometry={gltf.meshes.Icosphere_1.geometry}
            >
                <AnimatedMaterial 
                    color={color}
                    transparent={true} 
                    opacity={0.7} 
                    animationActive={isHit} 
                    triggerExplosion={triggerExplosion}
                />
            </mesh>
            <mesh 
                geometry={gltf.meshes.Icosphere_2.geometry}
            >
                <AnimatedMaterial 
                    color={[0.4, 0.4, 0.4]} 
                    animationActive={isHit}
                    triggerExplosion={triggerExplosion}
                />
            </mesh>
        </group>
        </>
}