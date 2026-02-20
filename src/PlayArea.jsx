import { RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";

export default function PlayArea({size}) {
    return (
        <RigidBody
            type="fixed"
        >
            <mesh>
                <boxGeometry args={[size.x, size.y, size.z]} />
                <meshStandardMaterial color="purple" side={DoubleSide} />
            </mesh>

        </RigidBody>
    )
}