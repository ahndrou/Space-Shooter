import { useHealthStore } from "../stores/useHealthStore"

const MAX_HEALTH = 5

export default function HealthIndicator() {
    const health = useHealthStore(state => state.health)

    return (
        <div className="healthIndicator">
            {Array.from({length: MAX_HEALTH}, (_, i) => <HealthIncrement key={i} empty={i >= health} />)}
        </div>   
    )
}

function HealthIncrement({empty}) {
    return (
        <svg className={`increment ${empty && 'increment__empty'}`} viewBox="0 0 53 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.00726 0.5H30.8539C33.4831 0.5 35.8538 2.08366 36.8598 4.5127L51.562 40.0127C53.3344 44.2925 50.1883 49 45.5561 49H21.7094C19.0803 49 16.7096 47.4163 15.7036 44.9873L1.0014 9.4873C-0.771021 5.20755 2.37501 0.5 7.00726 0.5Z"/>
        </svg>
    )
}