export default function Lights() {
    return <>
        <directionalLight 
            castShadow
            position={[4, 4, 4]}
            intensity={5}
        />
        <ambientLight intensity={0.25}/>
    </>
}