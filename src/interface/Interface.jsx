import { useScoreStore } from "../stores/useScoreStore"
import Crosshair from "./Crosshair"
import HealthIndicator from "./HealthIndicator"
import Title from "./Title"

export default function Interface() {
    return (
        <div className="interface">
            <Crosshair />
            <div className='infoBar'>
                <ScoreCounter />
                <Title />
                <HealthIndicator />
            </div>
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