import { useState } from "react";
import { Spherical, Vector3 } from "three";

const PARTICLE_COUNT = 1000;

export default function Thruster({ position }) {
  const [particlePositions] = useState(() => createParticlePositions(0.5));

  return (
    <points position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach={"attributes-position"}
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial />
    </points>
  );
}

function createParticlePositions(sphereRadius) {
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    const spherical = new Spherical(
      sphereRadius * (0.75 + Math.random() * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );

    const position = new Vector3().setFromSpherical(spherical);

    positions[i3] = position.x;
    positions[i3 + 1] = position.y;
    positions[i3 + 2] = position.z;
  }

  return positions;
}
