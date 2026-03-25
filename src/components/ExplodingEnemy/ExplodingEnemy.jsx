import { BallCollider, RigidBody } from "@react-three/rapier";
import AnimatedMesh from "./AnimatedMesh";
import React, { useRef, useState } from "react";
import useRandomTorque from "../../hooks/useRandomTorque";
import Explosion from "./Explosion";
import { Vector3 } from "three";

const MIN_TORQUE = 20
const MAX_TORQUE = 35

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
            <Explosion position={explosionPos} color={'purple'} removeParentEnemy={removeSelf} />
        )}
    </> 
}

function ExplodingEnemyRigidBody ({ position, size, setExplosionPos }) {
    const rbRef = useRef()
    const [isHit, setIsHit] = useState(false)

    const triggerExplosion = () => {
        setExplosionPos(new Vector3(
            rbRef.current.translation().x,
            rbRef.current.translation().y,
            rbRef.current.translation().z
        ))
    }

    useRandomTorque(MIN_TORQUE, MAX_TORQUE, rbRef)

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
                <AnimatedMesh isHit={isHit} size={size} triggerExplosion={triggerExplosion}/>
            </RigidBody>
    )
}