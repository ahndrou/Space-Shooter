import { useCubeTexture } from "@react-three/drei"

export default function Skybox() {
    const texture = useCubeTexture([
        "right.png",
        "left.png",
        "top.png",
        "bottom.png",
        "front.png",
        "back.png",
    ], { path: "skybox/"})

    return <primitive object={texture} attach="background" />
}