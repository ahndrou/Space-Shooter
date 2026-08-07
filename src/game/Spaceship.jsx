import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import Weapon from "./Weapon/Weapon";
import useCentralSteering from "./hooks/useCentralSteering";
import { useHealthStore } from "../stores/useHealthStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import useWorldSpaceRotation from "./hooks/useWorldSpaceRotation";

export default function Spaceship({ rigidBodyRef, playAreaSize }) {
  const worldSpaceRotationRef = useWorldSpaceRotation(rigidBodyRef);
  const userInputForces = useShipControls(worldSpaceRotationRef);
  const centralSteering = useCentralSteering(
    rigidBodyRef,
    playAreaSize,
    0.86,
    2,
  );

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    // Need to add all forces together
    rigidBodyRef.current.applyTorqueImpulse(
      userInputForces.angularForceRef.current.add(
        centralSteering.steeringTorqueRef.current,
      ),
      true,
    );
    rigidBodyRef.current.applyImpulse(
      userInputForces.linearForceRef.current.add(
        centralSteering.steeringForceRef.current,
      ),
      true,
    );
  });

  return (
    <>
      <Weapon ship={rigidBodyRef} />
      <SpaceshipRigidBody rigidBodyRef={rigidBodyRef} />
    </>
  );
}

function SpaceshipRigidBody({ rigidBodyRef }) {
  const LINEAR_DAMPING = 0.5;
  const ANGULAR_DAMPING = 2;

  const decrementHealth = useHealthStore((state) => state.decrement);

  return (
    <>
      <RigidBody
        ref={rigidBodyRef}
        colliders={false}
        type="dynamic"
        linearDamping={LINEAR_DAMPING}
        angularDamping={ANGULAR_DAMPING}
        canSleep={false}
        userData={{ type: "player" }}
        onCollisionEnter={decrementHealth}
      >
        <CuboidCollider args={[1.9, 0.3, 1.5]} />
        <SpaceshipMesh />
      </RigidBody>
    </>
  );
}

function SpaceshipMesh() {
  const gltf = useGLTF("./player_spaceship.glb");

  return (
    <group rotation={[0, Math.PI / 2, 0]} scale={0.4}>
      <mesh geometry={gltf.meshes["Base"].geometry}>
        <meshBasicMaterial color={"green"} transparent opacity={0.6} />
      </mesh>

      <mesh geometry={gltf.meshes["Wireframe"].geometry}>
        <meshBasicMaterial color={"white"} />
      </mesh>

      <mesh geometry={gltf.meshes["Thruster_L"].geometry}>
        <meshBasicMaterial color={"orange"} />
      </mesh>

      <mesh geometry={gltf.meshes["Thruster_R"].geometry}>
        <meshBasicMaterial color={"orange"} />
      </mesh>
    </group>
  );
}

function useShipControls(worldSpaceRotation) {
  const MAX_ANGULAR_FORCE = 0.05;
  const MAX_LINEAR_FORCE = 0.2;
  const POINTER_LOWER_BOUND = 0.1;

  const [, getKeys] = useKeyboardControls();
  const pointerActive = usePointerActiveListener();

  // Creation of new objects each frame might cause slowdown due to GC.
  // The same objects are re-used for each frame.

  const angularForce = useRef(new Vector3(0, 0, 0));
  const linearForce = useRef(new Vector3(0, 0, 0));

  useFrame((state) => {
    const keys = getKeys();

    let yaw = 0;
    if (
      pointerActive.current &&
      Math.abs(state.pointer.x) > POINTER_LOWER_BOUND
    ) {
      yaw = -state.pointer.x;
    }
    let pitch = 0;
    if (
      pointerActive.current &&
      Math.abs(state.pointer.y) > POINTER_LOWER_BOUND
    ) {
      pitch = state.pointer.y;
    }
    const roll = (keys.leftward ? 1 : 0) + (keys.rightward ? -1 : 0);

    angularForce.current
      .set(pitch, yaw, roll)
      .multiplyScalar(MAX_ANGULAR_FORCE);

    angularForce.current.applyQuaternion(worldSpaceRotation.current);

    linearForce.current.set(0, 0, keys.forward ? -MAX_LINEAR_FORCE : 0);
    linearForce.current.applyQuaternion(worldSpaceRotation.current);
  });

  return { linearForceRef: linearForce, angularForceRef: angularForce };
}

function usePointerActiveListener() {
  const pointerActive = useRef(true);

  useEffect(() => {
    const setPointerActive = () => (pointerActive.current = true);
    const setPointerInactive = () => (pointerActive.current = false);

    document.addEventListener("pointerleave", setPointerInactive);
    document.addEventListener("pointerenter", setPointerActive);

    return () => {
      document.removeEventListener("pointerleave", setPointerInactive);
      document.removeEventListener("pointerenter", setPointerActive);
    };
  }, []);

  return pointerActive;
}
