import { useScoreStore } from "../stores/useScoreStore"

export default function Interface() {
    return (
        <ScoreCounter />
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