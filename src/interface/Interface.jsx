import { useHealthStore } from "../stores/useHealthStore"
import { useScoreStore } from "../stores/useScoreStore"
import Crosshair from "./Crosshair"
import GameOverDisplay from "./GameOverDisplay"
import HealthIndicator from "./HealthIndicator"
import Title from "./Title"

export default function Interface() {
    const health = useHealthStore(state => state.health)

    return (
        <div className="interface">
            <div className='infoBar'>
                <ScoreCounter />
                <Title />
                <HealthIndicator />
            </div>
            {health > 0 && <Crosshair />}
            {health === 0 && <GameOverDisplay />}
        </div>
    )
}

function ScoreCounter() {
    const score = useScoreStore(state => state.score)

    return (
        <p className={'scoreCounter'}>
            {`Score: ${score}`}
        </p>
    )
}