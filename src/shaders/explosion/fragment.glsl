void main() {
    float strength = step(0.5, 1.0 - distance(gl_PointCoord, vec2(0.5)));

    gl_FragColor = vec4(0, 1.0, 0, strength);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}