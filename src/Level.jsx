import { useCallback, useState } from "react";
import EnemyBasic from "./EnemyBasic";
import { Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";

const ENEMY_COUNT = 200
const ENEMY_SIZE = 6

function createEnemyPosition(boundingDimensions, enemySize) {
    let x = (Math.random() - 0.5) * (boundingDimensions.x - enemySize / 2)
    let y = (Math.random() - 0.5) * (boundingDimensions.y - enemySize / 2)
    let z = (Math.random() - 0.5) * (boundingDimensions.z - enemySize / 2)

    return new Vector3(x, y, z)
}

// Creates a set of initial positions which do not cause intersection of enemies.
function createInitialPositions(boundingDimensions, enemySize) {
    const enemyPositions = []

    // O(n^2). Okay here considering it is a one off and number of enemies should be relatively low.
    for (let i = 0; i < ENEMY_COUNT; i++) {
        let attempts = 0
        while (attempts < 100) {
            let newPosition = createEnemyPosition(boundingDimensions, enemySize)
            let intersectionFound = false

            for (let existingPosition of enemyPositions) {
                if (newPosition.distanceTo(existingPosition) <= (enemySize + 0.05)) {
                    intersectionFound = true
                    break
                }
            }

            if (!intersectionFound) {
                enemyPositions.push(newPosition)
                break
            } else {
                attempts++
            }
        }

        if (attempts === 100) {
            throw new Error(`Could not find empty cell for enemy. Play area is likely too small for given combination of enemy size and count.`)
        }
    }

    return enemyPositions
}

function createInitialEnemyState(boundingDimensions, enemySize) {
    const positions = createInitialPositions(boundingDimensions, enemySize)
    return positions.map((position) => {return {id: generateUUID(), position}})
}

export default function Level({playAreaBounds}) {
    
    const [enemies, setEnemies] = useState(() => {
        return createInitialEnemyState(playAreaBounds, ENEMY_SIZE)
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