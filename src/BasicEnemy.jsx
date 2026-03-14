import { BallCollider, RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import ExplodingBallMesh from "./ExplodingBallMesh.jsx";

import { COLLISION_STATES } from "./constants.js";

const MIN_TORQUE = 7
const MAX_TORQUE = 12

export default React.memo(BasicEnemy)

export function BasicEnemy({position, id, removeEnemy, size}) {
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
                    args={[size / 2]}
                    // onIntersectionEnter={() => {
                    //     if (collisionState === COLLISION_STATES.NO_COLLISION) {
                    //         setCollisionState(COLLISION_STATES.SCALING)
                    //     }
                    // }} 
                />

                <ExplodingBallMesh 
                    collisionState={collisionState} 
                    setCollisionState={setCollisionState} 
                    removeParent={removeSelf}
                    size={size / 2}
                />
        </RigidBody>
    )
}