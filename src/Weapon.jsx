import { useKeyboardControls } from "@react-three/drei"
import { useEffect, useState } from "react"
import { Euler, Quaternion, Vector3 } from "three"
import { generateUUID } from "three/src/math/MathUtils.js"
import Bullet from "./Bullet"

const BULLET_LIFETIME = 6000

export default function Weapon({ship}) {
    const [bullets, setBullets] = useState([])

    const [subscribe] = useKeyboardControls()

    useEffect(() => {
        function updateBullets() {
            const filteredBullets = bullets.filter((bulletData) => {
                if (Date.now() - bulletData.creationTime < BULLET_LIFETIME) {
                    return true
                } else {
                    return false
                }
            })
            setBullets(filteredBullets)
        }

        const interval = setInterval(updateBullets, BULLET_LIFETIME)

        return () => clearInterval(interval)
    }, [bullets])

    useEffect(() => {
        return subscribe(
            (keysState) => keysState.space,
            (spacePressed) => 
            {
                if (spacePressed && ship.current) {
                    const position = new Vector3(
                        ship.current.translation().x,
                        ship.current.translation().y,
                        ship.current.translation().z
                    )

                    const q = new Quaternion(
                        ship.current.rotation().x,
                        ship.current.rotation().y,
                        ship.current.rotation().z,
                        ship.current.rotation().w
                    )

                    const offset = new Vector3(0, 0, -2)
                    offset.applyQuaternion(q)
                    position.add(offset)

                    const rotation = new Euler().setFromQuaternion(q)

                    const newBullet = 
                        {
                            id: generateUUID(),
                            creationTime: Date.now(),
                            initialPosition: position,
                            rotation: rotation

                        }
                    setBullets([...bullets, newBullet])
                }
            })
    }, [subscribe, bullets, ship])

    return bullets.map(bulletData => (
        <Bullet 
            key={bulletData.id}
            position={bulletData.initialPosition}
            rotation={bulletData.rotation}    
        />
    ))
}