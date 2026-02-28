import { useState } from "react";
import EnemyBasic from "./EnemyBasic";
import { Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";

const ENEMY_COUNT = 80

function createEnemyData(playAreaBounds) {
    return {
        id: generateUUID(),
        position: new Vector3(
            Math.round((Math.random() - 0.5) * playAreaBounds.x * 0.9),
            Math.round((Math.random() - 0.5) * playAreaBounds.y * 0.9),
            Math.round((Math.random() - 0.5) * playAreaBounds.z * 0.9)
        )
    }
}

export default function Level({playAreaBounds}) {
    
    const [enemies, setEnemies] = useState(() => {
        const enemies = []
        for (let i=0; i < ENEMY_COUNT; i++) {
            enemies.push(createEnemyData(playAreaBounds))
        }
        return enemies
    })

    function removeEnemy(enemyToRemove) {
        setEnemies((enemies) => enemies.filter((enemy) => enemy.id !== enemyToRemove.id))
    }

    return (
        enemies.map((enemyData) => {
            return <EnemyBasic key={enemyData.id} position={enemyData.position} disposeSelf={() => {
                removeEnemy(enemyData)}} />
        }
    ))
}