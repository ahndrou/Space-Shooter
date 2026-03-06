import { BallCollider, RigidBody } from "@react-three/rapier";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import ExplodingBallMesh from "./ExplodingBallMesh.jsx";

import { COLLISION_STATES } from "./constants.js";

const MIN_TORQUE = 7
const MAX_TORQUE = 12

export default React.memo(EnemyBasic)

export function EnemyBasic({position, id, removeEnemy}) {
    const rb = useRef()
    const [collisionState, setCollisionState] = useState(COLLISION_STATES.NO_COLLISION)

    const removeSelf = () => removeEnemy(id)

    useEffect(() => {
        rb.current.addTorque(new Vector3(
            Math.max(MIN_TORQUE, Math.random() * MAX_TORQUE),
            Math.max(MIN_TORQUE, Math.random() * MAX_TORQUE),
            Math.max(MIN_TORQUE, Math.random() * MAX_TORQUE)
        ))
    }, [])

    return (
        <RigidBody
            type="dynamic"
            position={position}
            ref={rb}
            colliders={false}
            canSleep={false}
            angularDamping={0.4}
            >
                <BallCollider
                    args={[3]}
                    sensor
                    onIntersectionEnter={() => {
                        if (collisionState === COLLISION_STATES.NO_COLLISION) {
                            setCollisionState(COLLISION_STATES.SCALING)
                        }
                    }} 
                />

                <ExplodingBallMesh 
                    collisionState={collisionState} 
                    setCollisionState={setCollisionState} 
                    removeParent={removeSelf}
                />
        </RigidBody>
    )
}