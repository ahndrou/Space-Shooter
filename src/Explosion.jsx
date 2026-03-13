import { useRef, useState } from "react"

import vertexShader from "./shaders/explosion/vertex.glsl"
import fragmentShader from "./shaders/explosion/fragment.glsl"
import { AdditiveBlending, Spherical, Vector2, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"

const PARTICLE_COUNT = 2000

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}
// innerheight and innerwidth do not account for high density displays. In fact not just this,
// but the OS can apply display scaling, too. Browser zoom level also affects pixel ratio.
sizes.resolution = new Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

window.addEventListener('resize', () =>
{
    // Handles moving between displays. A resize will often happen. If the
    // displays have different pixel ratios, it is also handled here.
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
})


function createParticlePositionsArray(sphereRadius) {
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
        
    for(let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        const spherical = new Spherical(
            sphereRadius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
        )

        const position = new Vector3().setFromSpherical(spherical)

        particlePositions[i3    ] = position.x
        particlePositions[i3 + 1] = position.y
        particlePositions[i3 + 2] = position.z
    }

    return particlePositions
}


// Used to add some random size to the particles.
function createSizesArray() {
    const sizes = new Float32Array(PARTICLE_COUNT)
        
    for(let i = 0; i < PARTICLE_COUNT; i++) {
        sizes[i] = Math.random()
    }

    return sizes
}


// Used to add some random offset to the particle animations.
function createOffsetsArray() {
    const offsets = new Float32Array(PARTICLE_COUNT)
        
    for(let i = 0; i < PARTICLE_COUNT; i++) {
        offsets[i] = Math.random() + 1
    }

    return offsets
}


export default function Explosion({particleSize=1, sphereRadius=2.5}) {
    const [particlePositions] = useState(() => createParticlePositionsArray(sphereRadius))
    const [particleSizes] = useState(() => createSizesArray())
    const [particleOffsets] = useState(() => createOffsetsArray())

    // Linter complains about using ref value for rendering. This pattern is the advised one for 
    // R3F, though. This uniform is updated every frame. If state was updated every frame, the
    // React re-rendering would tank performance.
    const uniforms = useRef(
    {
        uSize: {value: particleSize},
        uResolution: {value: sizes.resolution},
        uTime: {value: 0}
    })

    useFrame((state, delta) => 
    {
        uniforms.current.uTime.value += delta
    })

    return (
        <points frustumCulled={false}>
            <bufferGeometry>
                <bufferAttribute 
                    attach={"attributes-position"}
                    args={[particlePositions, 3]}
                />
                <bufferAttribute 
                    attach={"attributes-aSize"}
                    args={[particleSizes, 1]}
                /> 
                <bufferAttribute 
                    attach={"attributes-aOffset"}
                    args={[particleOffsets, 1]}
                /> 
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
                uniforms={uniforms.current}
            />
        </points>
    )
}

// INSIGHTS -- 'args' vs separate props --
    // Interesting insight here in the props we give to bufferAttribute:
    // 'count' is not in the constructor signature of bufferAttribute. I wondered
    // then why we have to include it. It turns out that if we do not pass anything to the
    // prop 'args', the constructor is called with no args, and properties are set afterwards,
    // according to the given props.

    // The constructor calculates count given array and itemSize. If there are no args though,
    // the 'count' is set to zero. 

    // This occurs, and we must then update count manually to correspond to our array which we manually
    // set also.

    // A good rule of thumb then might be to give all non-optional constructor args with the args prop, 
    // rather than setting them via props. Props other than 'args' still have their use: there are plenty
    // of properties we might want to set which can not be set via the constructor.

    // Here was the original way I was doing it:
    /* <bufferAttribute 
        attach={"attributes-position"}
        array={particlePositionsArray}
        itemSize={3}
        count={PARTICLE_COUNT} />  
    */


// INSIGHT -- Math.random inside useMemo function --
    // Linter complains about using Math.random here. Reading around, it 
    // seems that the cache can be cleared internally for certain reasons.
    // This would mean 'particlePositions' would be recalculated between renders
    // when I might expect it not to according to the empty dep. array.

    // The alternative seems to be to use a seeded RNG.

    // What I actually ended up doing was using useRef. This has the guarantee
    // of a stable value across renders, unlike useMemo. It introduces a new 
    // linter warning about using ref values as a prop. The reason it does this is
    // that a ref can be mutated and the component will not re-render.
    
    // useRef can be used here with the assumption that we will not modify the 
    // value stored in the ref after creation.

    // I suppose the perfect solution would be to use a seeded RNG function inside
    // a useMemo.

    // FURTHER THOUGHTS
    // I ended up opting for useState, without destructuring a setter. I think this is the better
    // approach because child components should re-render when it is updated. This better signals that
    // it is reactive data. With a ref, in the future I might try to mutate the value, leaving child
    // components with stale state unintentionally.