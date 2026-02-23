precision mediump float;

varying vec2 vUv;

void main() {
    float strength = 1.0 - step(0.495, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    vec4 colour = vec4(1.0, 0, 0, 0.99);
    vec4 baseColour = vec4(0.5, 0.5, 1.0, 0.9);
    
    gl_FragColor = mix(colour, baseColour, strength);
}