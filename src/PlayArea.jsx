import { RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";

export default function PlayArea({size}) {
    return (
        <RigidBody
            type="fixed"
        >
            <mesh>
                <boxGeometry args={[size.x, size.y, size.z]} />
                <meshBasicMaterial color="purple" side={DoubleSide} transparent opacity={0.5} />
            </mesh>

        </RigidBody>
    )
}