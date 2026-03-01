// This shader is used with a ShaderMaterial rather than a RawShaderMaterial as an exercise for me.
// ShaderMaterial injects some code for us which declares a lot of standard uniform and attribute variables.
// The injected variables aren't documented, which I think makes things less clear. I suppose which attributes
// and uniforms are injected depends on enabled/disabled features such as lighting, as well as the geometry used.
// Different built in geometries have specific sets of attributes attached.

#include "config.glsl"

uniform float uSize;
uniform vec2 uResolution;
uniform float uTime;

attribute float aSize;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

float clampedRemap(float value, float originMin, float originMax, float destinationMin, float destinationMax) 
{
    float remapped = remap(value, originMin, originMax, destinationMin, destinationMax);
    return clamp(remapped, 0.0, 1.0);
}

void main() {
    // Not sure this is necessary here, really. Check how I have got the animation progress in the frag shader.
    float animationProgress = clampedRemap(uTime, 0.0, ANIMATION_LENGTH, 0.0, 1.0);

    vec3 transformedPosition = position;
    // I feel like I could just transform this expression, rather than remapping first.
    // Easier to think about it this way currently though.
    transformedPosition *= (1.0 - pow(1.0 - animationProgress, 6.0)) * EXPLOSION_SCALE;

    vec4 modelPosition = modelMatrix * vec4(transformedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    
    // Things in the scene should become smaller when the window height is reduced.
    gl_PointSize = uSize * uResolution.y;

    gl_PointSize *= aSize;

    // Projection matrix handles the point positions with distance. This handles the
    // size of the individual points with perspective.
    gl_PointSize *= 1.0 / - viewPosition.z;
}