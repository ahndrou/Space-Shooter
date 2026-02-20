import { useState } from "react";
import EnemyBasic from "./EnemyBasic";

export default function Level({enemyBounds}) {
    const ENEMY_COUNT = 40

    const [enemies] = useState(() => {
                const initialEnemies = []
                for (let i=0; i < ENEMY_COUNT; i++) {
                    const pos = {}
                    pos.y = Math.round((Math.random() - 0.5) * enemyBounds.y)
                    pos.z = Math.round((Math.random() - 0.5) * enemyBounds.z)
                    pos.x = Math.round((Math.random() - 0.5) * enemyBounds.x)
                    initialEnemies.push(
                        <EnemyBasic 
                            position={[pos.x, pos.y, pos.z]}
                            key={`${pos.x},${pos.y},${pos.z}`}
                            />)
                }
                return initialEnemies
        })
    return (
        <>{enemies}</>
    )
}