// This shader is used with a ShaderMaterial rather than a RawShaderMaterial as an exercise for me.
// ShaderMaterial injects some code for us which declares a lot of standard uniform and attribute variables.
// The injected variables aren't documented, which I think makes things less clear. I suppose which attributes
// and uniforms are injected depends on enabled/disabled features such as lighting, as well as the geometry used.
// Different built in geometries have specific sets of attributes attached.

uniform float uSize;
uniform vec2 uResolution;

attribute float aSize;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    

    // Things in the scene should become smaller when the window height is reduced.
    gl_PointSize = uSize * uResolution.y;

    gl_PointSize *= aSize;

    // Projection matrix handles the point positions with distance. This handles the
    // size of the individual points with perspective.
    gl_PointSize *= 1.0 / - viewPosition.z;
}