import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Quaternion, Vector3 } from "three"

const WANDER_RANGE_MAGNITUDE = 0.19
const MAX_FORCE = 1

export default function useWanderSteering( headRef, wanderRadius, wanderOffset ) {
    const targetCenterRef = useRef(new Vector3())
    const targetOuterRef = useRef(new Vector3())
    const wanderDisplacement = useRef(new Vector3())
    const headQuaternion = useRef(new Quaternion())
    const thetaAngleRef = useRef(0)
    const phiAngleRef = useRef(0)
    const currentPosition = useRef(new Vector3())
    const steeringForceRef = useRef(new Vector3())

    useFrame(() => {
        headQuaternion.current.set(
            headRef.current.rotation().x,
            headRef.current.rotation().y,
            headRef.current.rotation().z,
            headRef.current.rotation().w,
        )

        wanderDisplacement.current.set(0, 0, -wanderOffset).applyQuaternion(headQuaternion.current)

        currentPosition.current.set(
            headRef.current.translation().x,
            headRef.current.translation().y, 
            headRef.current.translation().z
        )

        targetCenterRef.current.copy(currentPosition.current).add(wanderDisplacement.current)

        // Using spherical coordinates to get a point on a sphere's surface.
        targetOuterRef.current.set(
            targetCenterRef.current.x + wanderRadius * Math.cos(thetaAngleRef.current) * Math.sin(phiAngleRef.current),
            targetCenterRef.current.y + wanderRadius * Math.sin(thetaAngleRef.current) * Math.sin(phiAngleRef.current),
            targetCenterRef.current.z + wanderRadius * Math.cos(phiAngleRef.current)
        )

        thetaAngleRef.current += (Math.random() - 0.5) * 2 * WANDER_RANGE_MAGNITUDE
        phiAngleRef.current += (Math.random() - 0.5) * 2 * WANDER_RANGE_MAGNITUDE

        steeringForceRef.current.copy(targetOuterRef.current).sub(currentPosition.current).normalize().multiplyScalar(MAX_FORCE)
    })

    return {
        steeringForceRef,
        targetCenterRef,
        targetOuterRef,
        thetaAngleRef,
        phiAngleRef
    }
}