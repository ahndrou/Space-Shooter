import { useEffect } from "react"
import { Vector3 } from "three"

export default function useRandomTorque(min, max, rbRef) {
    useEffect(() => {
            if (rbRef.current) {
                rbRef.current.addTorque(new Vector3(
                    Math.max(min, Math.random() * max),
                    Math.max(min, Math.random() * max),
                    Math.max(min, Math.random() * max)
                ))
            }
        }, [min, max, rbRef])
}