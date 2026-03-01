#include "config.glsl"

uniform float uTime;

void main() {
    // Base shape
    float strength = step(0.5, 1.0 - distance(gl_PointCoord, vec2(0.5)));

    // Fade out
    float animationProgress = clamp(uTime / ANIMATION_LENGTH, 0.0, 1.0);

    strength *= clamp(1.0 - 2.0 * pow(animationProgress, 3.0), 0.0, 1.0);

    gl_FragColor = vec4(0, 1.0, 0, strength);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}