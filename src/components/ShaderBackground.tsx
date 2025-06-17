import React, { useRef, useMemo } from 'react';
import { useFrame, extend, useThree, MaterialNode } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { useTheme } from '@/contexts/ThemeContext'; // Added

// Define an interface for our shader material's uniforms
interface BackgroundShaderUniforms {
  // This interface describes the structure of material.uniforms AFTER shaderMaterial processes initial values
  // No index signature here if all uniforms are explicitly defined.
  // If one were needed for dynamic uniforms, it would be like: [key: string]: { value: any };
  u_time: { value: number };
  u_resolution: { value: THREE.Vector2 };
  u_mouse: { value: THREE.Vector2 };
  u_scroll: { value: number };
  u_primaryColor: { value: THREE.Color }; // Added
  u_secondaryColor: { value: THREE.Color }; // Added
  u_backgroundColor: { value: THREE.Color }; // Added
}

// Define raw uniform type with index signature
interface RawUniforms {
  [name: string]:
    | number
    | boolean
    | unknown[]
    | THREE.Color
    | THREE.Vector3
    | THREE.Quaternion
    | THREE.Matrix4
    | THREE.Vector2
    | THREE.Texture
    | THREE.Vector4
    | THREE.CubeTexture
    | THREE.Matrix3;
  u_time: number;
  u_resolution: THREE.Vector2;
  u_mouse: THREE.Vector2;
  u_scroll: number;
  u_primaryColor: THREE.Color;
  u_secondaryColor: THREE.Color;
  u_backgroundColor: THREE.Color;
}

// Define the shader material using drei's shaderMaterial helper
const BackgroundShaderMaterial = shaderMaterial(
  // Uniforms: Provide RAW initial values. shaderMaterial will wrap them in { value: ... }
  {
    u_time: 0, // Raw value
    u_resolution: new THREE.Vector2(1, 1), // Use simple initialization
    u_mouse: new THREE.Vector2(0, 0), // Use simple initialization
    u_scroll: 0, // Raw value
    u_primaryColor: new THREE.Color(0x4a90e2), // Added default
    u_secondaryColor: new THREE.Color(0x50e3c2), // Added default
    u_backgroundColor: new THREE.Color(0xf0f4f8), // Added default
  } as RawUniforms,
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform float u_scroll;
    uniform vec3 u_primaryColor; // Added
    uniform vec3 u_secondaryColor; // Added
    uniform vec3 u_backgroundColor; // Added

    // Basic pseudo-random number generator
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Simple noise function (value noise)
    float valueNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth interpolation (smoothstep)
        vec2 u = f * f * (3.0 - 2.0 * f);
        // vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // Perlin's improved smoothstep

        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
    }

    void main() {
      vec2 uv = vUv;
      // Make it move and scale
      // Adjust time based on scroll, and mouse X position for flow speed
      float timeAdjust = u_scroll * 0.001; // Scroll affects time progression
      float flowSpeed = 0.05 + u_mouse.x * 0.02; // Mouse X affects base flow speed
      float t = (u_time + timeAdjust) * flowSpeed;

      // Create a more dynamic pattern by layering noise or transforming UVs
      float noiseVal = 0.0;
      float scale = 3.0 + u_mouse.y * 1.5; // Mouse Y affects noise scale
      float persistence = 0.5;
      float lacunarity = 2.0;
      float amplitude = 0.5;

      for (int i = 0; i < 4; i++) { // 4 octaves of noise
          noiseVal += amplitude * valueNoise(uv * scale + vec2(t * 0.2, t * 0.1));
          amplitude *= persistence;
          scale *= lacunarity;
          t *= 1.1;
      }

      // Use theme colors
      // vec3 baseColorShift = vec3(0.01, 0.005, 0.02) * u_scroll * 0.1; // Keep scroll effect?
      // vec3 color1 = vec3(0.05, 0.02, 0.15) + baseColorShift; // Deep indigo
      // vec3 color2 = vec3(0.1, 0.05, 0.3) + baseColorShift;  // Dark purple
      // vec3 color3 = vec3(0.2, 0.1, 0.4) + baseColorShift;   // Muted violet

      // Mix colors based on noise - mouse Y can influence color transition sharpness
      float mixFactor1 = smoothstep(0.2, 0.5 + u_mouse.y * 0.1, noiseVal);
      float mixFactor2 = smoothstep(0.5, 0.8 + u_mouse.y * 0.05, noiseVal * 0.8);

      // Mix primary and secondary colors based on noise, over the background color
      vec3 blendedFgColor = mix(u_primaryColor, u_secondaryColor, mixFactor1);
      vec3 finalColor = mix(u_backgroundColor, blendedFgColor, mixFactor2);


      // Add some subtle "stars" or bright spots - mouse X can influence star density/brightness
      float starNoiseInputTime = u_time * (0.02 + u_mouse.x * 0.01);
      float starPower = 20.0 + u_mouse.y * 5.0; // Mouse Y affects star sharpness
      float starIntensity = pow(valueNoise(uv * (30.0 + u_mouse.x * 10.0) + starNoiseInputTime), starPower);
      finalColor += vec3(starIntensity * (0.8 + u_mouse.x * 0.2));

      // Global brightness influenced by scroll
      finalColor *= (1.0 - u_scroll * 0.0003);


      gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
    }
  `
);

extend({ BackgroundShaderMaterial });

// Extend THREE namespace to include our custom shader material for JSX
// This helps TypeScript recognize <backgroundShaderMaterial />
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // Correctly type the custom material using MaterialNode
      backgroundShaderMaterial: MaterialNode<
        THREE.ShaderMaterial & { uniforms: BackgroundShaderUniforms } & {
          depthWrite?: boolean;
          attach?: string;
          allowOverride?: boolean; // Added required properties
          onBeforeRender?: () => void; // Added required properties
        }, // Props type
        typeof THREE.ShaderMaterial // Constructor type
      >;
    }
  }
}

const ShaderBackground: React.FC = () => {
  const { theme, isLoading } = useTheme(); // Added
  const materialRef = useRef<THREE.ShaderMaterial & { uniforms: BackgroundShaderUniforms }>(null!);
  const { viewport, size } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      if (materialRef.current.uniforms.u_time) {
        materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
      }
      if (materialRef.current.uniforms.u_mouse) {
        materialRef.current.uniforms.u_mouse.value.x = mousePos.current.x;
        materialRef.current.uniforms.u_mouse.value.y = mousePos.current.y;
      }
      if (materialRef.current.uniforms.u_scroll) {
        materialRef.current.uniforms.u_scroll.value = scrollY.current;
      }
      if (materialRef.current.uniforms.u_resolution) {
        materialRef.current.uniforms.u_resolution.value.x = size.width * viewport.factor;
        materialRef.current.uniforms.u_resolution.value.y = size.height * viewport.factor;
      }
    }
  });

  // Update resolution uniform when viewport size changes
  React.useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms.u_resolution) {
      materialRef.current.uniforms.u_resolution.value.x = size.width * viewport.factor;
      materialRef.current.uniforms.u_resolution.value.y = size.height * viewport.factor;
    }
  }, [size, viewport, materialRef]);

  // Update shader colors when theme changes
  React.useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms && !isLoading) {
      if (materialRef.current.uniforms.u_primaryColor) {
        materialRef.current.uniforms.u_primaryColor.value.set(theme.shader.primaryColor);
      }
      if (materialRef.current.uniforms.u_secondaryColor) {
        materialRef.current.uniforms.u_secondaryColor.value.set(theme.shader.secondaryColor);
      }
      if (materialRef.current.uniforms.u_backgroundColor) {
        materialRef.current.uniforms.u_backgroundColor.value.set(theme.shader.backgroundColor);
      }
    }
  }, [theme, isLoading, materialRef]);

  if (isLoading) {
    return null; // Or a loading placeholder for the background
  }

  return (
    <mesh position={[0, 0, -10]} renderOrder={-1}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <backgroundShaderMaterial ref={materialRef} depthWrite={false} attach="material" />
    </mesh>
  );
};

export default ShaderBackground;
