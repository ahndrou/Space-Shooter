import { createContext, useCallback } from "react";

const MAX_RETRY_ATTEMPTS = 100;

const SpawnContext = createContext(null);

// Creates a record of occupied spawn positions and the size of the entity occupying them.
// Exposes a function for generating an unoccupied spawn position given an enemy size.
export function SpawnProvider({ playAreaSize, children }) {
  const occupiedPositionsRef = useRef([]);

  const findInitialSpawnPosition = useCallback(
    (enemySize) => {
      for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
        const position = createEnemyPosition(playAreaSize, enemySize);

        const overlaps = occupiedPositionsRef.current.some(
          ({ position: existingPosition, size: existingSize }) =>
            position.distanceTo(existingPosition) <=
            enemySize / 2 + existingSize / 2 + 0.05,
        );

        if (!overlaps) {
          occupiedPositionsRef.current.push({
            position,
            size: enemySize,
          });

          return position;
        }
      }

      throw new Error(
        "Couldn't find an onoccupied within maximum number of retries.",
      );
    },
    [playAreaSize],
  );

  return (
    <SpawnContext.Provider value={findInitialSpawnPosition}>
      {children}
    </SpawnContext.Provider>
  );
}

function createEnemyPosition(playAreaSize, enemySize) {
  let x = (Math.random() - 0.5) * (playAreaSize - enemySize / 2);
  let y = (Math.random() - 0.5) * (playAreaSize - enemySize / 2);
  let z = (Math.random() - 0.5) * (playAreaSize - enemySize / 2);

  return new Vector3(x, y, z);
}
