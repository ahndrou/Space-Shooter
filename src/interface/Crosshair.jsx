export default function Crosshair() {
    return (
        <svg className={'crosshair'} width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="cyan" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M58 34 L64 28 L70 34" />
                <path d="M58 94 L64 100 L70 94" />
                <path d="M34 58 L28 64 L34 70" />
                <path d="M94 58 L100 64 L94 70" />
                <path d="M60 64 L64 60 L68 64 L64 68 L60 64" />
            </g>
        </svg>
    )
}