import { useRef } from "react";
import { useHealthStore } from "../stores/useHealthStore";
import Spaceship from "./Spaceship";
import { Exploder } from "./Exploder/Exploder";
import useFollowCamera from "./hooks/useFollowCamera";
import useWorldSpacePosition from "./hooks/useWorldSpacePosition";
import useWorldSpaceRotation from "./hooks/useWorldSpaceRotation";

export default function Player({ playAreaSize }) {
  const playerHealth = useHealthStore((state) => state.health);
  const spaceshipRb = useRef();

  const worldSpacePositionRef = useWorldSpacePosition(spaceshipRb);
  const worldSpaceRotationRef = useWorldSpaceRotation(spaceshipRb);
  useFollowCamera(worldSpaceRotationRef, worldSpacePositionRef);

  return (
    playerHealth > 0 && (
      <Spaceship rigidBodyRef={spaceshipRb} playAreaSize={playAreaSize} />
    )
  );
}
