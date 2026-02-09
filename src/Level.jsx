import { RigidBody } from "@react-three/rapier";

export default function Level() {
    return (
        <RigidBody type="fixed" position={[0, 0, 0]} rotation={[- Math.PI / 2, 0, 0]}>
            <mesh receiveShadow>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color={"green"} />
            </mesh>
        </RigidBody>
    )
}