import { useCallback, useRef, useState } from "react";
import { Quaternion, Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";
import { useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useScoreStore } from "../../stores/useScoreStore";
import BasicEnemy from "../Enemies/BasicEnemy";
import SnakeEnemy from "../Enemies/SnakeEnemy";
import ExplodingEnemy from "../Enemies/ExplodingEnemy/ExplodingEnemy";
import Collectable from "../Enemies/Collectable";
import {
  BasicEnemySet,
  CollectableEnemySet,
  ExplodingEnemySet,
  SnakeEnemySet,
} from "./EnemySets";
import { SpawnProvider } from "./SpawnProvider";

export default function Level({ playAreaSize, spaceshipRb }) {
  return (
    <SpawnProvider playAreaSize={playAreaSize}>
      <BasicEnemySet />
      <SnakeEnemySet playAreaSize={playAreaSize} />
      <ExplodingEnemySet />
      <CollectableEnemySet playAreaSize={playAreaSize} />
    </SpawnProvider>
  );
}
