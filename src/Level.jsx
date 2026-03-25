import { useCallback, useRef, useState } from "react";
import BasicEnemy from "./BasicEnemy";
import { Quaternion, Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import SnakeEnemy from "./SnakeEnemy";
import ExplodingEnemy from "./ExplodingEnemy";

const ENEMY_SIZE = 4
const SNAKE_COUNT = 3
const EXPLODING_ENEMY_COUNT = 10
const BASIC_ENEMY_COUNT = 30

function createEnemyPosition(playAreaSize, enemySize) {
    let x = (Math.random() - 0.5) * (playAreaSize - enemySize / 2)
    let y = (Math.random() - 0.5) * (playAreaSize - enemySize / 2)
    let z = (Math.random() - 0.5) * (playAreaSize - enemySize / 2)

    return new Vector3(x, y, z)
}

// Creates a set of initial positions which do not cause intersection of enemies.
function createInitialPositions(playAreaSize, enemySize, enemyCount) {
    const enemyPositions = []

    // O(n^2). Okay here considering it is a one off and number of enemies should be relatively low.
    for (let i = 0; i < enemyCount; i++) {
        let attempts = 0
        while (attempts < 100) {
            let newPosition = createEnemyPosition(playAreaSize, enemySize)
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

function createInitialEnemyState(playAreaSize, enemySize, enemyCount) {
    const positions = createInitialPositions(playAreaSize, enemySize, enemyCount)
    return positions.map((position) => {return {id: generateUUID(), position}})
}


function useSpawnEnemy(enemySize, playAreaSize) {
    const { world, rapier } = useRapier()

    function findSpawnPosition() {
        const radius = enemySize / 2
        const shape = new rapier.Ball(radius)

        let attempts = 0
        while (attempts < 100) {
            const shapePosition = {
                x: (Math.random() - 0.5) * (playAreaSize - enemySize / 2),
                y: (Math.random() - 0.5) * (playAreaSize - enemySize / 2),
                z: (Math.random() - 0.5) * (playAreaSize - enemySize / 2)
            }
            const shapeRotation = new Quaternion(0, 0, 0, 1)

            let hit = false

            world.intersectionsWithShape(
                shapePosition,
                shapeRotation,
                shape,
                () => {
                    hit = true
                    return false
                }
            )

            if (!hit) {
                return new Vector3(shapePosition.x, shapePosition.y, shapePosition.z)
            } else {
                attempts++
            }
        }

        throw new Error("Could not find a non-intersecting spawn position for new enemy.")
    }

    return findSpawnPosition
}


export default function Level({playAreaSize, spaceshipRb}) {
    
    const [enemies, setEnemies] = useState(() => createInitialEnemyState(playAreaSize, ENEMY_SIZE, BASIC_ENEMY_COUNT))
    const [snakes, setSnakes] = useState(() => createInitialEnemyState(playAreaSize, 0, SNAKE_COUNT))
    const [explodingEnemies, setExplodingEnemies] = useState(() => createInitialEnemyState(playAreaSize, 0, EXPLODING_ENEMY_COUNT))



    const findSpawnPosition = useSpawnEnemy(ENEMY_SIZE, playAreaSize)

    const removeExplodingEnemy = useCallback((enemyId) => {
        setExplodingEnemies((enemies) => enemies.filter((enemy) => enemy.id !== enemyId))
    }, [setExplodingEnemies])

    const addEnemy = () => {
        const position = findSpawnPosition()
        const newEnemy = {id: generateUUID(), position}
        setEnemies((enemies) => [...enemies, newEnemy])
    }

    // let lastEnemyTime = useRef(0)
    // useFrame((state) => {
    //     if (state.clock.elapsedTime - lastEnemyTime.current > 3) {
    //         addEnemy()
    //         lastEnemyTime.current = state.clock.elapsedTime
    //     }
    // })
    
    return <>
        {enemies.map((enemyData) => {
            return (
                <BasicEnemy 
                    key={enemyData.id}
                    position={enemyData.position} 
                    size={ENEMY_SIZE}
                />
            )})
        }

        {snakes.map((snakeData) => {
            return (
                <SnakeEnemy
                    key={snakeData.id}
                    position={snakeData.position}
                    spaceshipRb={spaceshipRb}
                    segments={15}
                    playAreaSize={playAreaSize}
                />
            )
        })}

        {explodingEnemies.map((enemyData) => {
            return (
                <ExplodingEnemy 
                    key={enemyData.id}
                    id={enemyData.id}
                    position={enemyData.position}
                    removeEnemy={removeExplodingEnemy}
                    size={ENEMY_SIZE}
                />
            )
        })}
    </>
}