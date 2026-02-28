export default function Explosion() {
    return (
        <mesh>
            <boxGeometry args={[4, 4, 4]} />
            <meshBasicMaterial color="green" />
        </mesh>
    )
}