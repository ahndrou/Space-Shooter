import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const CAMERA_DELAY = 19;

export default function useFollowCamera(targetRotationRef, targetPositionRef) {
  const cameraPositionTarget = useRef(new Vector3());

  useFrame((state, delta) => {
    if (!targetPositionRef.current || !targetRotationRef.current) return;

    cameraPositionTarget.current.set(0, 3, 7);
    // Quaternion transforms from local space to world space.
    cameraPositionTarget.current.applyQuaternion(targetRotationRef.current);
    cameraPositionTarget.current.add(targetPositionRef.current);

    // The slight lag from LERP gives the user a nice indication that they are turning.
    state.camera.position.lerp(
      cameraPositionTarget.current,
      CAMERA_DELAY * delta,
    );
    state.camera.rotation.setFromQuaternion(targetRotationRef.current);
  });

  return null;
}
