import { useKeyboardControls } from "@react-three/drei"
import { useCallback, useEffect, useRef, useState } from "react"
import { Quaternion, Vector3 } from "three"
import { generateUUID } from "three/src/math/MathUtils.js"
import Bullet from "./Bullet"
import * as THREE from 'three'
import { useThree } from "@react-three/fiber"

const BULLET_LIFETIME = 5000

export default function Weapon({ship}) {
    const [bullets, setBullets] = useState([])
    const [subscribe] = useKeyboardControls()
    const getCrosshairIntersection = useCrosshairIntersection()

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

        const interval = setInterval(updateBullets, 1000)

        return () => clearInterval(interval)
    }, [bullets])

    useEffect(() => {
        return subscribe(
            (keysState) => keysState.space,
            (spacePressed) => 
            {
                if (spacePressed && ship.current) {
                    const initialPosition = new Vector3(
                        ship.current.translation().x,
                        ship.current.translation().y,
                        ship.current.translation().z
                    )

                    const shipOrientation = new Quaternion(
                        ship.current.rotation().x,
                        ship.current.rotation().y,
                        ship.current.rotation().z,
                        ship.current.rotation().w
                    )

                    const offset = new Vector3(0, 0, -2)
                    offset.applyQuaternion(shipOrientation)

                    initialPosition.add(offset)

                    const crosshairPosition = getCrosshairIntersection()

                    const direction = crosshairPosition.sub(initialPosition)
                    direction.normalize()

                    const newBullet = 
                        {
                            id: generateUUID(),
                            creationTime: Date.now(),
                            initialPosition: initialPosition,
                            direction: direction

                        }
                    setBullets([...bullets, newBullet])
                }
            })
    }, [subscribe, bullets, ship, getCrosshairIntersection])

    return bullets.map(bulletData => (
        <Bullet 
            key={bulletData.id}
            position={bulletData.initialPosition}
            rotation={bulletData.rotation}
            direction={bulletData.direction}    
        />
    ))
}

function useCrosshairIntersection() {
    const {scene, camera} = useThree()

    const raycasterRef = useRef(new THREE.Raycaster())

    const getCrosshairIntersection = useCallback(() => {
        raycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), camera)
        const intersections = raycasterRef.current.intersectObjects(scene.children)

        if (intersections.length > 0) {
            return intersections[0].point
        } else {
            console.log(raycasterRef.current.ray)
            return raycasterRef.current.ray.direction.clone().normalize().multiplyScalar(100000)
        }
    }, [scene, camera])

    return getCrosshairIntersection
}