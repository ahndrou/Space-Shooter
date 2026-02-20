import { RigidBody } from "@react-three/rapier";
import { useState } from "react";
import EnemyBasic from "./EnemyBasic";

export default function Level() {
    const PLAY_AREA_SIZE = {x: 40, y: 40, z: 50}
    const ENEMY_COUNT = 40

    const [enemies] = useState(() => {
                const initialEnemies = []
                for (let i=0; i < ENEMY_COUNT; i++) {
                    const pos = {}
                    pos.x = Math.round((Math.random() - 0.5) * 2 * PLAY_AREA_SIZE.x)
                    pos.y = Math.round((Math.random() - 0.5) * 2 * PLAY_AREA_SIZE.y)
                    pos.z = Math.round((Math.random() - 0.5) * 2 * PLAY_AREA_SIZE.z)
                    initialEnemies.push(
                        <EnemyBasic 
                            position={[pos.x, pos.y, pos.z]}
                            key={`${pos.x},${pos.y},${pos.z}`}
                            />)
                }
                return initialEnemies
        })
    return (
        <RigidBody 
            type="fixed" 
            position={[0, 0, 0]} 
            rotation={[- Math.PI / 2, 0, 0]}
            >
            {<>{enemies}</>}
        </RigidBody>
    )
}