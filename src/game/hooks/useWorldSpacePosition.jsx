import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function useWorldSpacePosition(rigidBodyRef) {
  const position = useRef();

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    position.current = rigidBodyRef.current.translation();
  });

  return position;
}
