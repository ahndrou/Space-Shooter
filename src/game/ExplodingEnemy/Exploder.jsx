import { createContext, useContext, useRef, useState } from "react";
import { Vector3 } from "three";
import Explosion from "./Explosion";

// Replaces any rigid body with an explosion effect. The rigid body component
// has access to a trigger provided by the useExploder hook. The rigid body must also
// link up the rigidBodyRef from the hook to work.

export function Exploder({ color = "pink", onExplosionCompletion, children }) {
  const [explosionPos, setExplosionPos] = useState(null);
  const explosionActive = explosionPos !== null;

  const rigidBodyRef = useRef();

  const triggerExplosion = () => {
    const rigidBody = rigidBodyRef.current;

    if (!rigidBody) {
      throw new Error(
        "Cannot trigger explosion: rigidBodyRef returned by the useExploder hook is not attached to a RigidBody.",
      );
    }

    const { x, y, z } = rigidBodyRef.current.translation();

    setExplosionPos(new Vector3(x, y, z));
  };

  return (
    <>
      <ExploderContext.Provider
        value={{
          rigidBodyRef,
          triggerExplosion,
        }}
      >
        {!explosionActive && children}
      </ExploderContext.Provider>

      {explosionActive && (
        <Explosion
          position={explosionPos}
          color={color}
          onExplosionCompletion={() => onExplosionCompletion()}
        />
      )}
    </>
  );
}

const ExploderContext = createContext(null);

export function useExploder() {
  const context = useContext(ExploderContext);

  if (!context) {
    throw new Error("useExploder must be used inside an <Exploder>");
  }

  return context;
}
