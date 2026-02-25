import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useState } from "react"
import { Euler, Quaternion } from "three"
import Bullet from "./Bullet"

export default function Weapon({ship}) {
    const [bullets, setBullets] = useState([])

    const [subscribe] = useKeyboardControls()

    useEffect(() => {
        return subscribe(
            (keysState) => keysState.space,
            (spacePressed) => 
            {
                if (spacePressed && ship.current) {
                    const position = [
                        ship.current.translation().x,
                        ship.current.translation().y,
                        ship.current.translation().z
                    ]

                    const rotation = new Euler().setFromQuaternion(new Quaternion(
                        ship.current.rotation().x,
                        ship.current.rotation().y,
                        ship.current.rotation().z,
                        ship.current.rotation().w
                    ))

                    const newBullet = 
                        <Bullet 
                            position={position}
                            orientation={rotation}

                        />
                    setBullets([...bullets, newBullet])
                }
            })
    }, [subscribe, bullets, ship])

    return bullets
}