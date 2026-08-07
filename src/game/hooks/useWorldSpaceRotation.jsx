import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Quaternion } from "three";

export default function useWorldSpaceRotation(rigidBodyRef) {
  // For re-use in useFrame.
  const worldSpaceRotation = useRef(new Quaternion());

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    // rigidBodyRef.current.rotation() returns a plain object, not an instance
    // of the quaternion class.
    worldSpaceRotation.current.set(
      rigidBodyRef.current.rotation().x,
      rigidBodyRef.current.rotation().y,
      rigidBodyRef.current.rotation().z,
      rigidBodyRef.current.rotation().w,
    );
  });

  return worldSpaceRotation;
}
