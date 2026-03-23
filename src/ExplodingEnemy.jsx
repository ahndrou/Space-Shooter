import { BallCollider, RigidBody } from "@react-three/rapier";
import ExplodingBallMesh from "./ExplodingBallMesh";
import { useRef, useState } from "react";
import { COLLISION_STATES } from "./constants";
import useRandomTorque from "./hooks/useRandomTorque";

const MIN_TORQUE = 20
const MAX_TORQUE = 35

export default function ExplodingEnemy( {position, removeEnemy, id, size} ) {
    const [collisionState, setCollisionState] = useState(COLLISION_STATES.NO_COLLISION)
    
    const removeSelf = () => removeEnemy(id)

    const rbRef = useRef()

    useRandomTorque(MIN_TORQUE, MAX_TORQUE, rbRef)

    return (
        <RigidBody 
            colliders={false} 
            position={position}
            canSleep={false}
            ref={rbRef}
            angularDamping={0.4}
        >
            <BallCollider
                args={[size * 0.97]}
                onCollisionEnter={() => {
                    if (collisionState === COLLISION_STATES.NO_COLLISION) {
                        setCollisionState(COLLISION_STATES.SCALING)
                    }
                }} 
            />
            <ExplodingBallMesh 
                collisionState={collisionState} 
                setCollisionState={setCollisionState} 
                removeParent={removeSelf} 
                size={size}
                color="purple"
            />
        </RigidBody>
    )
}