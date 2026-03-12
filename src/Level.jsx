import { useCallback, useState } from "react";
import EnemyBasic from "./EnemyBasic";
import { Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";

const ENEMY_COUNT = 600
const ENEMY_SIZE = 6

function createEnemyPosition(boundingDimensions, enemySize, positionJitterFactor) {
    const cellSize = enemySize * positionJitterFactor + 1

    let x = (Math.random() - 0.5) * (boundingDimensions.x - cellSize)
    x = Math.round(x / cellSize) * cellSize
    
    let y = (Math.random() - 0.5) * (boundingDimensions.y - cellSize)
    y = Math.round(y / cellSize) * cellSize

    let z = (Math.random() - 0.5) * (boundingDimensions.z - cellSize)
    z = Math.round(z / cellSize) * cellSize

    return [x, y, z]
}

function includesChildArray(array, child) {
    return array.some((element => 
        element.length === child.length &&
        element[0] === child[0] &&
        element[1] === child[1] &&
        element[2] === child[2] 
    ))
}

// Creates a set of initial positions which do not cause intersection of enemies.
function createInitialPositions(boundingDimensions, enemySize, positionJitterFactor) {
    const enemyPositions = []
    for (let i = 0; i < ENEMY_COUNT; i++) {
        let position = createEnemyPosition(boundingDimensions, enemySize, positionJitterFactor)

        let timeoutCounter = 0
        while (timeoutCounter < 500 && includesChildArray(enemyPositions, position)) {
            position = createEnemyPosition(boundingDimensions, enemySize, positionJitterFactor)
            timeoutCounter++
        }

        if (timeoutCounter === 500) {
            throw new Error(`Could not find empty cell for enemy. Play area is likely too small for given combination of enemy size, count and jitter factor.`)
        }

        enemyPositions.push(position)
    }

    return enemyPositions
}

function createInitialEnemyData(boundingDimensions, enemySize, positionJitterFactor) {
    const positions = createInitialPositions(boundingDimensions, enemySize, positionJitterFactor)

    const maxOffset = enemySize * positionJitterFactor - enemySize
    const jitteredPositions = positions.map(([x, y, z]) => 
        [
            x + (Math.random() - 0.5) * maxOffset,
            y + (Math.random() - 0.5) * maxOffset,
            z + (Math.random() - 0.5) * maxOffset
        ])
    
    return jitteredPositions.map(([x, y, z]) => {return {id: generateUUID(), position: new Vector3(x, y, z)}})
}

export default function Level({playAreaBounds}) {
    
    const [enemies, setEnemies] = useState(() => {
        return createInitialEnemyData(playAreaBounds, ENEMY_SIZE, 1.5)
    })

    const removeEnemy = useCallback((enemyId) => {
        setEnemies((enemies) => enemies.filter((enemy) => enemy.id !== enemyId))
    }, [setEnemies])

    return (
        enemies.map((enemyData) => {
            return (
            <EnemyBasic 
                key={enemyData.id}
                id={enemyData.id} 
                position={enemyData.position} 
                removeEnemy={removeEnemy}
                size={ENEMY_SIZE}
            />
            )
        }
    ))
}