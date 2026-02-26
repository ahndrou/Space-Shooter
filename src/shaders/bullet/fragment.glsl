precision mediump float;

varying vec2 vUv;

void main() {
    float strength = pow(0.016, (distance(vUv, vec2(0.5))));

    vec3 highlightColour = vec3(0.9, 0.99, 0.9);

    if (strength < 0.2) discard;

    gl_FragColor = vec4(highlightColour, strength);
}