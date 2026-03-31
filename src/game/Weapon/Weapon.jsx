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

    useWeaponControls(ship, setBullets)

    useEffect(() => {
        function updateBullets() {
            setBullets(bullets => bullets.filter(bulletData => (Date.now() - bulletData.creationTime) < BULLET_LIFETIME))
        }

        const interval = setInterval(updateBullets, 1000)

        return () => clearInterval(interval)
    }, [])

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


function useWeaponControls(shipRef, setBullets) {
    const [subscribe] = useKeyboardControls()
    const getCrosshairIntersection = useCrosshairIntersection()

    useEffect(() => {
        return subscribe(
            (keysState) => keysState.space,
            (spacePressed) => 
            {
                if (spacePressed && shipRef.current) {
                    const initialPosition = new Vector3(
                        shipRef.current.translation().x,
                        shipRef.current.translation().y,
                        shipRef.current.translation().z
                    )

                    const shipOrientation = new Quaternion(
                        shipRef.current.rotation().x,
                        shipRef.current.rotation().y,
                        shipRef.current.rotation().z,
                        shipRef.current.rotation().w
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
                    setBullets(bullets => [...bullets, newBullet])
                }
            })
    }, [subscribe, shipRef, getCrosshairIntersection, setBullets])
}