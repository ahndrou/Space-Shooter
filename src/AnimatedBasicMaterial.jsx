/*
To know what to replace, I looked inside the shader code files ThreeJS uses - found in node_modules. The
result of the linked shader can be found in the argument passed to the onBeforeCompile call-back, which we can
modify before compilation.

The first argument to 'replace' can be used as a way to target a specific spot in the shader where we want to
inject our own code. Notice though that we replace part of the shader with itself, plus some more, so the 
existing functionality doesn't break.

The existing shader files should be read to determine what variables are available to us at the point we are
injecting to. i.e. from reading the files, I can see that the 'begin_vertex' shader introduces a vec3 called
'transformed' which we can use to apply transformations to the original vertex position (we can't directly
modify attributes, so the position value is copied to a new variable called 'transformed').
*/

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

const TOTAL_ANIMATION_TIME = 2
const SCALE_UP_TIME = 0.2
const SCALE_DOWN_TIME = 0.3
const OSCILLATION_TIME = TOTAL_ANIMATION_TIME - SCALE_UP_TIME - SCALE_DOWN_TIME


export default function AnimatedBasicMaterial({color, transparent, opacity, animationActive=false}) {
    const customUniforms = useRef({
        uTime: {value: 0}
    })
    
    useFrame((state, delta) => {
        if (animationActive && customUniforms.current.uTime.value < TOTAL_ANIMATION_TIME) {
            customUniforms.current.uTime.value += delta
        }
    })

    const modifyShader = (shader) => {
         // Injecting in global scope. This is where we add uniforms and such.
         shader.vertexShader = shader.vertexShader.replace("#include <common>", 
            `
            #include <common>
            uniform float uTime; 

            float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
            {
                return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
            }

            `
        )

        // Set up uniforms
        // Notice we send the object rather than the value, so the uniform stores a reference
        // rather than a value. Even if we update value, the object reference remains the same.
        // We can update value from outside and the object allows us to keep a persistent reference to it.
        shader.uniforms.uTime = customUniforms.current.uTime

        // Injecting inside the 'main' function.
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", 
            `
            #include <begin_vertex>

            float openingProgress = remap(
                uTime, 
                0.0, 
                ${SCALE_UP_TIME.toFixed(1)}, 
                0.0, 
                1.0
            );

            // remap does not clamp the values at the 'edge' values - it extrapolates.
            openingProgress = clamp(openingProgress, 0.0, 1.0);

            // Here for example, closingProgress would be < 1.0 before the starting point given.
            float closingProgress = remap(
                uTime, 
                ${(SCALE_UP_TIME + OSCILLATION_TIME).toFixed(1)}, 
                ${TOTAL_ANIMATION_TIME.toFixed(1)}, 
                0.0, 
                1.0
            );

            closingProgress = clamp(closingProgress, 0.0, 1.0);

            // This gives us a nice increasing, constant then decreasing function for progress.
            // Between values 0 and 1.
            float progress = min(openingProgress, 1.0 - closingProgress);

            // Maps us to [1.0, 2.0], following our progress curve.
            float scale = mix(1.0, 2.0, progress);

            // When the closing animation starts, this extra factor will send the scale to zero.
            scale *= (1.0 - closingProgress);

            transformed *= scale;

            `
        )
    }

    return (
        <meshBasicMaterial
            color={color} 
            transparent={transparent} 
            opacity={opacity} 
            onBeforeCompile={modifyShader}
        />
    )
}