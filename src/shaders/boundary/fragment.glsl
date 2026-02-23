precision mediump float;

varying vec2 vUv;

void main() {
    float border = step(0.495, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

    float horizontalLines = step(0.3, mod(vUv.y * 260.0, 1.0));
    float verticalLines = step(0.3, mod(vUv.x * 260.0, 1.0));
    float dots = horizontalLines * verticalLines;

    float strength = border + dots;
    strength = clamp(strength, 0.0, 1.0);

    vec4 detailColour = vec4(0.9, 0.2, 0.8, 0.4);
    vec4 baseColour = vec4(0.2, 0.2, 0.2, 0.1);
    
    gl_FragColor = mix(baseColour, detailColour, strength);
}