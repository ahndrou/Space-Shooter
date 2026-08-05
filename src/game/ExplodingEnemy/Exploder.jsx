import { createContext, useContext, useRef, useState } from "react";
import { Vector3 } from "three";
import Explosion from "./Explosion";

// Replaces any rigid body with an explosion effect. The rigid body component
// has access to a trigger provided by the useExploder hook. The rigid body must also
// link up the rigidBodyRef from the hook to work.

export function Exploder({ onExplosionCompletion, children }) {
  const [explosionPos, setExplosionPos] = useState(null);
  const explosionActive = explosionPos !== null;

  const rigidBodyRef = useRef();

  const triggerExplosion = () => {
    setExplosionPos(
      new Vector3(
        rigidBodyRef.current.translation().x,
        rigidBodyRef.current.translation().y,
        rigidBodyRef.current.translation().z,
      ),
    );
  };

  return (
    <ExploderContext.Provider
      value={{
        rigidBodyRef,
        triggerExplosion,
      }}
    >
      {!explosionActive && children}

      {explosionActive && (
        <Explosion
          position={explosionPos}
          color={"purple"}
          onExplosionCompletion={() => onExplosionCompletion()}
        />
      )}
    </ExploderContext.Provider>
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
