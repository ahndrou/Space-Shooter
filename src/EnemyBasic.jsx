import { RigidBody } from "@react-three/rapier";

export default function EnemyBasic({position}) {
    return (
        <RigidBody
            type="kinematicPosition"
            position={position}
            >
            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshBasicMaterial color={"orange"} />
            </mesh>
        </RigidBody>
    )
}