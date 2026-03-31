import { useScoreStore } from "../stores/useScoreStore"
import Crosshair from "./Crosshair"

export default function Interface() {
    return (
        <div className='interface'>
            <Crosshair />
            <ScoreCounter />
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