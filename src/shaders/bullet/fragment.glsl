precision mediump float;

uniform vec3 uTipColour;
uniform vec3 uTailColour;
uniform vec2 uZBounds;

varying vec3 vPos;
varying vec2 vUv;

void main() {
    float zMin = uZBounds.x;
    float zMax = uZBounds.y;

    float strength = - vPos.z / (zMax - zMin);
    float alpha = strength;

    strength += 0.2;
    strength = clamp(strength, 0.0, 1.0);

    alpha += 0.5;   

    vec3 colour = mix(uTailColour, uTipColour, strength);

    gl_FragColor = vec4(vec3(colour), 1.0);
}