import { useRef } from "react"
import Spaceship from "./Spaceship"
import Level from "./Level"
import PlayArea from "./PlayArea"
import { useGameStateStore } from "../stores/useGameStateStore"
import { Physics } from "@react-three/rapier"

const PLAY_AREA_SIZE = 175

export default function Game() {
    const spaceshipRb = useRef()
    const gameID = useGameStateStore(state => state.gameID)

    return (
        <Physics key={gameID} gravity={[0, 0, 0]} timeStep={1/200}>
            <Spaceship rigidBodyRef={spaceshipRb} playAreaSize={PLAY_AREA_SIZE}/>
            <Level playAreaSize={PLAY_AREA_SIZE} spaceshipRb={spaceshipRb} />
            <PlayArea size={PLAY_AREA_SIZE} />
        </Physics>
    )
}
