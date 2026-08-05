import { BallCollider, RigidBody } from "@react-three/rapier";
import AnimatedScaleMesh from "./AnimatedScaleMesh";
import React, { useRef, useState } from "react";
import useRandomTorque from "../hooks/useRandomTorque";
import Explosion from "./Explosion";
import { Vector3 } from "three";

const MIN_TORQUE = 20;
const MAX_TORQUE = 35;

export default React.memo(ExplodingEnemy);

export function ExplodingEnemy({ position, rotation, size, id, onDeath }) {
  const [explosionPos, setExplosionPos] = useState(null);
  const explosionActive = explosionPos !== null;

  const rbRef = useRef();

  const triggerExplosion = () => {
    setExplosionPos(
      new Vector3(
        rbRef.current.translation().x,
        rbRef.current.translation().y,
        rbRef.current.translation().z,
      ),
    );
  };

  return (
    <>
      <ExplodingEnemyRigidBody
        position={position}
        rotation={rotation}
        rbRef={rbRef}
        size={size}
        onDestroyed={triggerExplosion}
      />

      {explosionActive && (
        <Explosion
          position={explosionPos}
          color={"purple"}
          onExplosionCompletion={() => onDeath(id)}
        />
      )}
    </>
  );
}

function ExplodingEnemyRigidBody({
  position,
  rotation,
  size,
  rbRef,
  onDestroyed,
}) {
  const [isHit, setIsHit] = useState(false);

  useRandomTorque(MIN_TORQUE, MAX_TORQUE, rbRef);

  return (
    <RigidBody
      colliders={false}
      position={position}
      rotation={rotation}
      canSleep={false}
      ref={rbRef}
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
        animationActive={isHit}
        onAnimationCompletion={onDestroyed}
      />
    </RigidBody>
  );
}
