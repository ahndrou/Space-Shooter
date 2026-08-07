import { useRef } from "react";
import { useHealthStore } from "../stores/useHealthStore";
import Spaceship from "./Spaceship";
import { Exploder } from "./Exploder/Exploder";
import useFollowCamera from "./hooks/useFollowCamera";
import useWorldSpacePosition from "./hooks/useWorldSpacePosition";
import useWorldSpaceRotation from "./hooks/useWorldSpaceRotation";

export default function Player({ playAreaSize }) {
  return (
    <Exploder>
      <CameraTrackedVehicle playAreaSize={playAreaSize} />
    </Exploder>
  );
}

// Separated like this because the RB ref is here. Conditionally rendering just
// Spaceship with Exploder leads to using a reference to a destroyed Rapier RB,
// causing a Rapier null access error.
function CameraTrackedVehicle({ playAreaSize }) {
  const vehicle = useRef();
  const worldSpacePositionRef = useWorldSpacePosition(vehicle);
  const worldSpaceRotationRef = useWorldSpaceRotation(vehicle);
  useFollowCamera(worldSpaceRotationRef, worldSpacePositionRef);

  return <Spaceship rigidBodyRef={vehicle} playAreaSize={playAreaSize} />;
}
