import { Canvas } from "@react-three/fiber";

export default function Experience() {
    return (
        <Canvas>
            <mesh onClick={e =>{
                console.log(e)
                e.object.rotation.y += 0.2}}>
                <torusKnotGeometry />
                <meshNormalMaterial />
            </mesh>
        </Canvas>
    )
}