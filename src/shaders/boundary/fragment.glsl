precision mediump float;

uniform vec3 cameraPos;

varying vec2 vUv;
varying vec3 vPos;

// This hexagonal grid shader is adapted from the following:
// "ShaderToy Tutorial - Hexagonal Tiling" 
// by Martijn Steinrucken aka BigWings/CountFrolic - 2019
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
//
// This shader is part of a tutorial on YouTube
// https://youtu.be/VmrIDyYiJBA

float HexDist(vec2 p) {
	p = abs(p);
    
    float c = dot(p, normalize(vec2(1,1.73)));
    c = max(c, p.x);
    
    return c;
}

// x is a polar coordinate of the given point within a hexagon, 
// y is distance to the hexagon boundary,
// z and w are cell ID coordinates.
vec4 HexCoords(vec2 uv) {
	vec2 r = vec2(1, 1.73);
    vec2 h = r*.5;
    
    vec2 a = mod(uv, r)-h;
    vec2 b = mod(uv-h, r)-h;
    
    vec2 gv = dot(a, a) < dot(b,b) ? a : b;
    
    float x = atan(gv.x, gv.y);
    float y = .5-HexDist(gv);
    vec2 id = uv-gv;
    return vec4(x, y, id.x,id.y);
}

void main() {
    vec3 col = vec3(0.);

    // Factor here controls the scale of the grid.
    vec2 uv = 2.0 * (vUv - 0.5) * 20.0;

    vec4 hc = HexCoords(uv);

    // r controls the thickness of the hexagon borders.
    float r = 0.11;
    float c = smoothstep(r, r + 0.01, hc.y);
    
    col += c;

    // b controls the fade-out distance at the edge of the grid.
    float b = 0.15;
    vec2 strengthV = abs(2.0 * (vUv - 0.5));
    strengthV = smoothstep(0.99, 0.99 - b, strengthV);

    float strength = 0.1 * min(strengthV.x, strengthV.y);

    gl_FragColor = vec4(col, strength);
}