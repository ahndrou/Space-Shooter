import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const MAXIMUM_FORCE = 0.75
const MAXIMUM_TORQUE = 0.5

export default function useCentralSteering(rigidBodyRef, playAreaSize, thresholdFactor, maxForce=MAXIMUM_FORCE, maxTorque=MAXIMUM_TORQUE) {
    const steeringForceRef = useRef(new Vector3())
    const steeringTorqueRef = useRef(new Vector3())
    const position = useRef(new Vector3())
    const motionDirection = useRef(new Vector3())
    const originDirection = useRef(new Vector3())

    useFrame(() => {
        position.current.set(
            rigidBodyRef.current.translation().x,
            rigidBodyRef.current.translation().y,
            rigidBodyRef.current.translation().z
        )

        if (Math.abs(position.current.x) > thresholdFactor * playAreaSize / 2 ||
            Math.abs(position.current.y) > thresholdFactor * playAreaSize / 2 ||
            Math.abs(position.current.z) > thresholdFactor * playAreaSize / 2
         ) {
            originDirection.current
            .copy(position.current)
            .normalize()
            .multiplyScalar(-1)

            steeringForceRef.current
            .copy(originDirection.current)
            .multiplyScalar(maxForce)

            motionDirection.current.set(
                rigidBodyRef.current.linvel().x,
                rigidBodyRef.current.linvel().y,
                rigidBodyRef.current.linvel().z
            ).normalize()

            steeringTorqueRef.current
            .copy(motionDirection.current)
            .cross(originDirection.current)
            .multiplyScalar(maxTorque)

         } else {
            steeringForceRef.current.set(0, 0, 0)
            steeringTorqueRef.current.set(0, 0, 0)
         }
    })

    return {steeringForceRef, steeringTorqueRef}
}