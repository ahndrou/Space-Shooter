import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const MAXIMUM_FORCE = 0.75

export default function useCentralSteering(headRef, playAreaSize, thresholdFactor) {
    const steeringForceRef = useRef(new Vector3())
    const headPosition = useRef(new Vector3())

    useFrame(() => {
        headPosition.current.set(
            headRef.current.translation().x,
            headRef.current.translation().y,
            headRef.current.translation().z
        )

        if (Math.abs(headPosition.current.x) > thresholdFactor * playAreaSize / 2 ||
            Math.abs(headPosition.current.y) > thresholdFactor * playAreaSize / 2 ||
            Math.abs(headPosition.current.z) > thresholdFactor * playAreaSize / 2
         ) {
            steeringForceRef.current.copy(headPosition.current).normalize().multiplyScalar(-1 * MAXIMUM_FORCE)
         }
    })

    return {steeringForceRef}
}