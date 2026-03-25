import { BallCollider, RigidBody } from "@react-three/rapier";
import ExplodingBallMesh from "./ExplodingBallMesh";
import React, { useEffect, useRef, useState } from "react";
import { COLLISION_STATES } from "./constants";
import useRandomTorque from "./hooks/useRandomTorque";
import Explosion from "./Explosion";
import { Vector3 } from "three";
import { useGLTF } from "@react-three/drei";

const MIN_TORQUE = 20
const MAX_TORQUE = 35

const FIRST_ANIMATION_TIME = 2000

export default React.memo(ExplodingEnemy)

export function ExplodingEnemy( {position, removeEnemy, id, size} ) {
    const [explosionPos, setExplosionPos] = useState(null)
    const explosionActive = explosionPos !== null
    
    const removeSelf = () => removeEnemy(id)

    return <>
        { !explosionActive && 
            <ExplodingEnemyRigidBody position={position} size={size} setExplosionPos={setExplosionPos}/>
        }

        { explosionActive && (
            <Explosion position={explosionPos} />
        )}
    </> 
}

function ExplodingEnemyRigidBody ({ position, size, setExplosionPos }) {
    const rbRef = useRef()
    useRandomTorque(MIN_TORQUE, MAX_TORQUE, rbRef)
    const [isHit, setIsHit] = useState(false)

    return (
        <RigidBody 
                colliders={false} 
                position={position}
                canSleep={false}
                ref={rbRef}
                angularDamping={0.4}
                userData={{type: 'exploding enemy'}}
            >
                <BallCollider
                    args={[size * 0.97]}
                    onCollisionEnter={() => setIsHit(true)} 
                />
                <ExplodingBallMesh isHit={isHit} setExplosionPos={setExplosionPos} size={size} rbRef={rbRef} />
            </RigidBody>
    )
}