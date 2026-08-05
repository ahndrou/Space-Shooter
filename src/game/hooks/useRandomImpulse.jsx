import { useEffect } from "react";
import { Vector3 } from "three";

export default function useRandomImpulse(rigidBodyRef, min, max) {
  useEffect(() => {
    const magnitude = Math.max(Math.random() * max, min);
    const force = new Vector3().randomDirection().multiplyScalar(magnitude);

    rigidBodyRef.current.applyImpulse(force);
  }, []);
}
