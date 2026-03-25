import { useGLTF } from "@react-three/drei"

import { COLLISION_STATES } from "./constants"
import ScaleAnimatedMaterial from "./ScaleAnimatedMaterial"
import Explosion from "./Explosion"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

// See about combining setExplosionPos and rbRef into a premade function.
// Limits what this component can do, making things clearer and less error prone.
export default function ExplodingBallMesh({isHit, setExplosionPos, size, color="purple", rbRef}) {
    const gltf = useGLTF("./space_shooter_enemy_basic.glb")

    return <>
        <group scale={size}>
            <mesh 
                geometry={gltf.meshes.Icosphere_1.geometry}
            >
                <ScaleAnimatedMaterial 
                    color={color}
                    transparent={true} 
                    opacity={0.7} 
                    animationActive={isHit} 
                    setExplosionPos={setExplosionPos}
                    rbRef={rbRef}
                />
            </mesh>
            <mesh 
                geometry={gltf.meshes.Icosphere_2.geometry}
            >
                <ScaleAnimatedMaterial 
                    color={[0.4, 0.4, 0.4]} 
                    animationActive={isHit}
                    setExplosionPos={setExplosionPos} 
                    rbRef={rbRef}
                />
            </mesh>
        </group>
        </>
}