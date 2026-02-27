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

const ANIMATION_TIME = 3

export default function AnimatedBasicMaterial({color, transparent, opacity, animationActive=false}) {
    const customUniforms = useRef({
        uTime: {value: 0}
    })
    
    useFrame((state, delta) => {
        if (animationActive && customUniforms.current.uTime.value < ANIMATION_TIME) {
            customUniforms.current.uTime.value += delta
        }
    })

    const modifyShader = (shader) => {
         // Inject uniform declaration
         shader.vertexShader = shader.vertexShader.replace("#include <common>", 
            `
            #include <common>
            uniform float uTime; 

            `
        )

        // Set up uniforms
        // Notice we send the object rather than the value, so the uniform stores a reference
        // rather than a value. Even if we update value, the object reference remains the same.
        // We can update value from outside and the object allows us to keep a persistent reference to it.
        shader.uniforms.uTime = customUniforms.current.uTime

        // Inject animation transforms
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", 
            `
            #include <begin_vertex>
            transformed *= (1.0 - uTime * 0.4);

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