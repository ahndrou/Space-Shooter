import { createContext, useContext, useRef, useState } from "react";
import { Vector3 } from "three";
import Explosion from "./Explosion";

/** 
Create an explosion in place of the given child components. Trigger provided
by the useExploder context.
*/
export function Exploder({ color = "pink", onExplosionCompletion, children }) {
  const [explosionPos, setExplosionPos] = useState(null);
  const explosionActive = explosionPos !== null;

  const triggerExplosion = (position) => {
    setExplosionPos(position);
  };

  return (
    <>
      <ExploderContext.Provider value={triggerExplosion}>
        {!explosionActive && children}
      </ExploderContext.Provider>

      {explosionActive && (
        <Explosion
          position={explosionPos}
          color={color}
          onExplosionCompletion={onExplosionCompletion}
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
