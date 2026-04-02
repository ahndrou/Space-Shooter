import { useGameStateStore } from "../stores/useGameStateStore"
import { useHealthStore } from "../stores/useHealthStore"
import { useScoreStore } from "../stores/useScoreStore"

export default function GameOverDisplay() {
    return (
        <div className="gameOverSection">
            <div className="gameOverText">
                Game Over!
            </div>

            <RestartButton />
        </div>
    )
}

function RestartButton() {
    const resetGame = useGameStateStore(state => state.newGame)
    const resetHealth = useHealthStore(state => state.reset)
    const resetScore = useScoreStore(state => state.reset)
    
    return (
        <button
            onClick={() => {
                resetGame()
                resetHealth()
                resetScore()
            }}
        >
            Restart
        </button>
    )
}