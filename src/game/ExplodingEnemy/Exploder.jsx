import { createContext, useContext, useRef, useState } from "react";
import { Vector3 } from "three";
import Explosion from "./Explosion";

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
      {children}

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
