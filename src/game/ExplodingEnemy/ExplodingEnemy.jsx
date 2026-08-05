import { BallCollider, RigidBody } from "@react-three/rapier";
import AnimatedScaleMesh from "./AnimatedScaleMesh";
import React, { createContext, useContext, useRef, useState } from "react";
import useRandomTorque from "../hooks/useRandomTorque";
import Explosion from "./Explosion";
import { Vector3 } from "three";
import { Exploder, useExploder } from "./Exploder";

const MIN_TORQUE = 20;
const MAX_TORQUE = 35;
const COLOR = "yellow";

export default React.memo(ExplodingEnemy);

// Stores the rbRef to get the mutated position to give the explosion.
// All this needs is to somehow get a rbRef for a position.
// Should be able to explode any child as long as it has its rbRef.

// Think of a better name for this - it is not just defined by it exploding.
export function ExplodingEnemy({ id, onDeath, position, rotation, size }) {
  return (
    <Exploder color={COLOR} onExplosionCompletion={() => onDeath(id)}>
      <EnemyRigidBody position={position} rotation={rotation} size={size} />
    </Exploder>
  );
}

function EnemyRigidBody({ position, rotation, size }) {
  const [isHit, setIsHit] = useState(false);

  const { rigidBodyRef, triggerExplosion } = useExploder();

  useRandomTorque(MIN_TORQUE, MAX_TORQUE, rigidBodyRef);

  return (
    <RigidBody
      colliders={false}
      position={position}
      rotation={rotation}
      canSleep={false}
      ref={rigidBodyRef}
      angularDamping={0.4}
      userData={{ type: "exploding enemy" }}
    >
      <BallCollider
        args={[size * 1.1]}
        onCollisionEnter={() => {
          setIsHit(true);
        }}
      />
      <AnimatedScaleMesh
        size={size}
        color={COLOR}
        animationActive={isHit}
        onAnimationCompletion={triggerExplosion}
      />
    </RigidBody>
  );
}
