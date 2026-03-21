import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Quaternion, Vector3 } from "three"

const WANDER_OFFSET = 10
const WANDER_RADIUS = 6
const WANDER_RANGE_MAGNITUDE = 0.2
const MAX_FORCE = 1

export default function useWanderTarget( headRef ) {
    const wanderTargetCenter = useRef(new Vector3())
    const wanderTargetOuter = useRef(new Vector3())
    const wanderDisplacement = useRef(new Vector3())
    const headQuaternion = useRef(new Quaternion())
    const wanderTheta = useRef(0)
    const wanderPhi = useRef(0)
    const currentPosition = useRef(new Vector3())
    const steeringForce = useRef(new Vector3())

    useFrame(() => {
        headQuaternion.current.set(
            headRef.current.rotation().x,
            headRef.current.rotation().y,
            headRef.current.rotation().z,
            headRef.current.rotation().w,
        )

        wanderDisplacement.current.set(0, 0, -WANDER_OFFSET).applyQuaternion(headQuaternion.current)

        currentPosition.current.set(
            headRef.current.translation().x,
            headRef.current.translation().y, 
            headRef.current.translation().z
        )

        wanderTargetCenter.current.copy(currentPosition.current).add(wanderDisplacement.current)

        // Using spherical coordinates to get a point on a sphere's surface.
        wanderTargetOuter.current.set(
            wanderTargetCenter.current.x + WANDER_RADIUS * Math.cos(wanderTheta.current) * Math.sin(wanderPhi.current),
            wanderTargetCenter.current.y + WANDER_RADIUS * Math.sin(wanderTheta.current) * Math.sin(wanderPhi.current),
            wanderTargetCenter.current.z + WANDER_RADIUS * Math.cos(wanderPhi.current)
        )

        wanderTheta.current += (Math.random() - 0.5) * 2 * WANDER_RANGE_MAGNITUDE
        wanderPhi.current += (Math.random() - 0.5) * 2 * WANDER_RANGE_MAGNITUDE

        steeringForce.current.copy(wanderTargetOuter.current).sub(currentPosition.current).normalize().multiplyScalar(MAX_FORCE)
    })

    return {
        steeringForce,
        wanderTargetCenter,
        wanderTargetOuter
    }
}