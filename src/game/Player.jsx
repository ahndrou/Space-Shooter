import { useRef } from "react";
import { useHealthStore } from "../stores/useHealthStore";
import Spaceship from "./Spaceship";

export default function Player({ playAreaSize }) {
  const playerHealth = useHealthStore((state) => state.health);
  const spaceshipRb = useRef();

  return (
    playerHealth > 0 && (
      <Spaceship rigidBodyRef={spaceshipRb} playAreaSize={playAreaSize} />
    )
  );
}
