import { useRef } from "react"

import vertexShader from "./shaders/explosion/vertex.glsl"
import fragmentShader from "./shaders/explosion/fragment.glsl"
import { AdditiveBlending, Vector2 } from "three"

const PARTICLE_COUNT = 15

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


function createVertexArray() {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
        
    for(let i = 0; i < PARTICLE_COUNT * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 3
    }

    return positions
}


export default function Explosion({particleSize}) {

    // Notice the linter gives a warning for using positions.current
    // in a prop below. I have left some insights I had when reading about this 
    // at the bottom of the file.

    const positions = useRef(createVertexArray())

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute 
                    attach={"attributes-position"}
                    args={[positions.current, 3]}
                /> 
            </bufferGeometry>
            <shaderMaterial
                key={Math.random()} 
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
                uniforms={{
                    uSize: {value: particleSize},
                    uResolution: {value: sizes.resolution}
                }}    
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
        array={positionsArray}
        itemSize={3}
        count={PARTICLE_COUNT} />  
    */


// INSIGHT -- Math.random inside useMemo function --
    // Linter complains about using Math.random here. Reading around, it 
    // seems that the cache can be cleared internally for certain reasons.
    // This would mean 'positions' would be recalculated between renders
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