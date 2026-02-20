import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function EnemyBasic({position}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")
    

    console.log(gltf.materials["Material.003"])

    return (
        <RigidBody
            type="kinematicPosition"
            position={position}
            >
                <group scale={3}>
                    <mesh 
                    geometry={gltf.meshes.Icosphere_1.geometry}
                    material={gltf.materials["Material.001"]}
                    />
                    <mesh 
                        geometry={gltf.meshes.Icosphere_2.geometry}
                        material={gltf.materials["Material.003"]}
                    />
                </group>
                
            
        </RigidBody>
    )
}