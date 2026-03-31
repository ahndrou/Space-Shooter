import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import useCentralSteering from "./hooks/useCentralSteering";
import { useRef, useState } from "react";
import useRandomTorque from "./hooks/useRandomTorque";
import Explosion from "./ExplodingEnemy/Explosion";
import { Vector3 } from "three";
import { useScoreStore } from "../stores/useScoreStore";

export default function Collectable({position, rotation, removeCollectable, id, size, playAreaSize}) {
    const [explosionPos, setExplosionPos] = useState(null)
    const explosionActive = explosionPos !== null
    
    const removeSelf = () => removeCollectable(id)

    return <>
        { !explosionActive && 
            <CollectableRigidBody 
                position={position}
                rotation={rotation} 
                size={size} 
                playAreaSize={playAreaSize}
                setExplosionPos={setExplosionPos}
            />
        }

        { explosionActive && (
            <Explosion position={explosionPos} color={'red'} removeParentEnemy={removeSelf} />
        )}
    </>
}

function CollectableRigidBody({position, rotation, size, setExplosionPos, playAreaSize}) {
    const gltf = useGLTF("./space_shooter_collectable.glb")
    const rbRef = useRef()

    // Don't want to get the collectables stuck where the player can't reach.
    useCentralSteering(rbRef, playAreaSize, 0.9, 20)
    useRandomTorque(10, 20, rbRef)

    const incrementScore = useScoreStore(state => state.increment)

    const triggerExplosion = () => {
        setExplosionPos(new Vector3(
            rbRef.current.translation().x,
            rbRef.current.translation().y,
            rbRef.current.translation().z
        ))
    }

    const handleCollision = (collisionPayload) => {
        if (collisionPayload.other.rigidBody?.userData?.type === 'player'
            || collisionPayload.other.rigidBody?.userData?.type === 'bullet'
        ) {
            console.log("trigger")
            incrementScore(2)
            triggerExplosion()
        }
    }

    return (
        <RigidBody 
            ref={rbRef} 
            position={position} 
            rotation={rotation} 
            scale={size}
            onCollisionEnter={handleCollision}
        >
            <mesh geometry={gltf.meshes['Base'].geometry}>
                <meshBasicMaterial transparent opacity={0.5} color='red' />
            </mesh>
            <mesh geometry={gltf.meshes['Wireframe'].geometry}>
                <meshBasicMaterial color='white' />
            </mesh>
        </RigidBody>
    )
}