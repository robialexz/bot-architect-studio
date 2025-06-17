import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber'; // Import ThreeEvent
import { Text } from '@react-three/drei'; // Import Text for tooltips
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext'; // Added
import { useAssistant } from '@/contexts/AssistantContext'; // Added for assistant interaction

// --- Haptic Feedback Helper ---
const triggerHapticPulse = (duration: number = 50) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    // Check if running on a mobile device
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobileDevice) {
      navigator.vibrate(duration);
    }
  }
};

// --- Audio Context (Simplified for potential reuse, but AR viewer might not use it) ---
// This is a simplified version. The main EnergyNetworkCanvas has a more complex setup.
// For AR, we might not initialize or use this audio context.
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioContext && typeof window !== 'undefined') {
    // Define a type for window that includes webkitAudioContext
    type WindowWithWebKitAudioContext = Window &
      typeof globalThis & { webkitAudioContext?: typeof AudioContext };
    try {
      audioContext = new (window.AudioContext ||
        (window as WindowWithWebKitAudioContext).webkitAudioContext)();
    } catch (e) {
      console.warn(
        'Could not create AudioContext for NexusCrystal (this might be fine in AR without audio features).',
        e
      );
    }
  }
  return audioContext;
};

// Interface for PointerEvent with the non-standard 'force' property
interface PointerEventWithForce extends PointerEvent {
  force?: number;
}

// --- NexusCrystal Component ---
export interface NexusCrystalProps {
  position?: THREE.Vector3 | [number, number, number]; // Made position optional for AR placement
  rotation?: THREE.Euler | [number, number, number]; // Added rotation prop
  id?: string; // Optional for a single AR crystal
  // size?: number; // Will come from theme
  // color?: THREE.ColorRepresentation; // Will come from theme
  audioInitialized?: boolean; // To ensure audioContext is ready, less relevant for AR
  isAR?: boolean; // Flag to indicate AR context for conditional logic
  dataType?: string; // Added for assistant interaction
  isSimulatedPlayerInteracting?: boolean; // For shared interaction simulation
}

export const NexusCrystal = React.forwardRef<THREE.Mesh, NexusCrystalProps>(
  (
    {
      position = [0, 0, -0.5], // Default position for AR if not placed
      rotation = [0, 0, 0], // Default rotation
      id = 'ar-crystal',
      // size = 0.5, // Adjusted default size for AR - now from theme
      // color = 'cyan', // Default color for AR - now from theme
      audioInitialized = false, // Default to false for AR
      isAR = false,
      dataType, // Added for assistant interaction
      isSimulatedPlayerInteracting = false,
    },
    forwardedRef
  ) => {
    const { theme, isLoading: isThemeLoading } = useTheme();
    const { highlightedDataType } = useAssistant();
    const localMeshRef = useRef<THREE.Mesh | null>(null); // Internal ref, initialized to null
    // initialScale will now be derived from theme.nexusCrystal.scale
    const [isHovered, setIsHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); // State for tooltip visibility
    const beatDetectionRef = useRef({ hasPeakedThisCycle: false }); // For haptic feedback
    const [isPressing, setIsPressing] = useState(false);
    const [isDeepPressActive, setIsDeepPressActive] = useState(false);
    const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const deepPressAnimationStartTimeRef = useRef<number | null>(null);

    const audioNodesRef = useRef<{
      oscillator?: OscillatorNode;
      gain?: GainNode;
      panner?: PannerNode;
    }>({});

    // Simplified audio effect for AR, or disable if not needed
    useEffect(() => {
      if (!isAR || !audioInitialized) return; // Only run audio for non-AR or if explicitly initialized

      const localAudioContext = getAudioContext();
      if (!localAudioContext) return;

      const oscillator = localAudioContext.createOscillator();
      const gain = localAudioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(330, localAudioContext.currentTime); // A simple tone
      gain.gain.setValueAtTime(0.01, localAudioContext.currentTime); // Very low volume

      oscillator.connect(gain);
      gain.connect(localAudioContext.destination);
      oscillator.start();

      audioNodesRef.current = { oscillator, gain };

      return () => {
        oscillator.stop();
        oscillator.disconnect();
        gain.disconnect();
        audioNodesRef.current = {};
      };
    }, [id, audioInitialized, isAR]);

    // Hover effect (sound change) - might be adapted for tap in AR
    useEffect(() => {
      if (!isAR || !audioInitialized || !audioNodesRef.current.gain) return;

      const localAudioContext = getAudioContext();
      if (!localAudioContext) return;

      const { gain } = audioNodesRef.current;
      const targetGain = isHovered ? 0.1 : 0.01;
      gain.gain.setTargetAtTime(targetGain, localAudioContext.currentTime, 0.05);
    }, [isHovered, audioInitialized, isAR]);

    // Config for deep press
    const LONG_PRESS_DURATION = 500; // ms
    const FORCE_PRESS_THRESHOLD = 0.7; // Value between 0 and 1 for event.force
    const DEEP_PRESS_ANIMATION_DURATION = 1000; // ms for the intense animation

    useFrame(({ clock }) => {
      if (localMeshRef.current && !isThemeLoading) {
        // Use localMeshRef here
        localMeshRef.current.rotation.x += 0.002;
        localMeshRef.current.rotation.y += 0.003;

        let baseScale = theme.nexusCrystal.scale;
        const isHighlightedByAssistant = dataType && dataType === highlightedDataType;

        // Haptic feedback logic for crystal beats (only for non-AR pulsing crystals)
        if (!isAR) {
          const elapsedTime = clock.getElapsedTime();
          const pulseSpeed = isHighlightedByAssistant ? 3 : 1.5;
          const sinValue = Math.sin(elapsedTime * pulseSpeed);

          if (sinValue > 0.95 && !beatDetectionRef.current.hasPeakedThisCycle) {
            triggerHapticPulse(50); // Trigger 50ms pulse
            beatDetectionRef.current.hasPeakedThisCycle = true;
          } else if (sinValue < -0.95) {
            // Reset when it passes the trough
            beatDetectionRef.current.hasPeakedThisCycle = false;
          }
        }

        // Visual feedback for simulated interaction
        if (isSimulatedPlayerInteracting && !isAR) {
          const interactionPulseFactor = 1 + Math.abs(Math.sin(clock.getElapsedTime() * 5)) * 0.2; // Quick, noticeable pulse
          baseScale *= interactionPulseFactor;
        } else if (isHighlightedByAssistant && !isAR) {
          // Original scaling logic for assistant highlight
          // Enhanced pulse for highlighted crystal
          const highlightPulseFactor = Math.sin(clock.getElapsedTime() * 3) * 0.15 + 1; // Bigger, faster pulse
          baseScale *= highlightPulseFactor;
        } else if (!isAR) {
          // Default pulse if not highlighted by assistant or simulated interaction
          const pulseFactor = Math.sin(clock.getElapsedTime() * 1.5) * 0.05 + 1; // Small pulse
          baseScale *= pulseFactor;
        }

        // Apply deep press animation if active
        if (isDeepPressActive) {
          const now = clock.getElapsedTime() * 1000; // current time in ms
          if (!deepPressAnimationStartTimeRef.current) {
            deepPressAnimationStartTimeRef.current = now;
          }
          const timeSinceDeepPressStart = now - deepPressAnimationStartTimeRef.current;

          if (timeSinceDeepPressStart < DEEP_PRESS_ANIMATION_DURATION) {
            const progress = timeSinceDeepPressStart / DEEP_PRESS_ANIMATION_DURATION;
            const pulse = Math.sin(progress * Math.PI * 4) * 0.3 + 1;
            if (localMeshRef.current) {
              // Check localMeshRef.current
              localMeshRef.current.scale.set(
                baseScale * pulse * 1.2,
                baseScale * pulse * 1.2,
                baseScale * pulse * 1.2
              );
              if (localMeshRef.current.material instanceof THREE.MeshStandardMaterial) {
                localMeshRef.current.material.emissiveIntensity =
                  (isAR ? 0.8 : theme.nexusCrystal.emissiveIntensity * 3) *
                  (Math.sin(progress * Math.PI * 2) * 0.5 + 1);
              }
            }
          } else {
            setIsDeepPressActive(false);
            deepPressAnimationStartTimeRef.current = null;
            if (
              localMeshRef.current &&
              localMeshRef.current.material instanceof THREE.MeshStandardMaterial
            ) {
              // Check localMeshRef.current
              localMeshRef.current.material.emissiveIntensity = currentEmissiveIntensity;
            }
          }
        } else {
          if (localMeshRef.current) {
            // Check localMeshRef.current
            localMeshRef.current.scale.set(baseScale, baseScale, baseScale);
            if (
              localMeshRef.current.material instanceof THREE.MeshStandardMaterial &&
              !isHighlightedByAssistant &&
              !isSimulatedPlayerInteracting
            ) {
              localMeshRef.current.material.emissiveIntensity = currentEmissiveIntensity;
            }
          }
        }
      }
    });

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
      if (isAR) return; // Deep press not for AR variant for now, as per current scope
      event.stopPropagation();
      setIsPressing(true);

      // Check for force property
      const nativeEventWithForce = event.nativeEvent as PointerEventWithForce;
      const force = nativeEventWithForce.force;
      // console.log('PointerDown force:', force); // For debugging

      if (force !== undefined && force >= FORCE_PRESS_THRESHOLD) {
        // console.log('Force press detected!');
        setIsDeepPressActive(true);
        deepPressAnimationStartTimeRef.current = null; // Reset animation timer
        triggerHapticPulse(100); // Stronger haptic for deep press
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
        return;
      }

      // Fallback to long press
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      longPressTimeoutRef.current = setTimeout(() => {
        if (isPressing) {
          // Check if still pressing
          // console.log('Long press detected!');
          setIsDeepPressActive(true);
          deepPressAnimationStartTimeRef.current = null; // Reset animation timer
          triggerHapticPulse(75); // Haptic for long press
        }
      }, LONG_PRESS_DURATION);
    };

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
      if (isAR) return;
      event.stopPropagation();
      setIsPressing(false);
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
      // Do not immediately turn off isDeepPressActive here, let the animation complete or timeout
    };

    const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
      if (isAR) return;
      // event.stopPropagation(); // Not needed for leave as it's about the pointer leaving the object area
      if (isPressing) {
        setIsPressing(false);
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
      }
      // Do not immediately turn off isDeepPressActive here
    };

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
      if (isAR || !isPressing || isDeepPressActive) return; // Only check force if pressing and deep press not yet active

      // Check for force property
      const nativeEventWithForce = event.nativeEvent as PointerEventWithForce;
      const force = nativeEventWithForce.force;
      if (force !== undefined && force >= FORCE_PRESS_THRESHOLD) {
        // console.log('Force press detected during move!');
        setIsDeepPressActive(true);
        deepPressAnimationStartTimeRef.current = null;
        triggerHapticPulse(100);
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
      }
    };

    if (isThemeLoading && !isAR) {
      // For non-AR, wait for theme. For AR, can show default if needed.
      return null; // Or a placeholder
    }

    // Determine crystal properties based on theme or defaults for AR
    const crystalSize = isAR ? 0.5 : theme.nexusCrystal.scale;
    const crystalColor = isAR ? 'cyan' : theme.nexusCrystal.baseColor;
    const crystalEmissive = isAR ? 'cyan' : theme.nexusCrystal.emissiveColor;

    let currentEmissiveIntensity = isAR ? 0.4 : theme.nexusCrystal.emissiveIntensity;
    const isHighlightedByAssistant = dataType && dataType === highlightedDataType;

    if (isSimulatedPlayerInteracting && !isAR) {
      currentEmissiveIntensity = theme.nexusCrystal.emissiveIntensity * 2.0; // Bright pulse for simulated interaction
    } else if (isHighlightedByAssistant && !isAR) {
      currentEmissiveIntensity = theme.nexusCrystal.emissiveIntensity * 2.5; // Brighter for assistant highlight
    }

    // Ensure we have proper Vector3 and Euler objects by converting arrays if needed
    const positionVector = Array.isArray(position)
      ? new THREE.Vector3(position[0], position[1], position[2])
      : position;

    const rotationEuler = Array.isArray(rotation)
      ? new THREE.Euler(rotation[0], rotation[1], rotation[2])
      : rotation;

    return (
      <group position={positionVector} rotation={rotationEuler}>
        <mesh
          ref={instance => {
            if (instance) {
              // Assign to both local and forwarded ref
              if (localMeshRef) localMeshRef.current = instance;

              // Handle forwarded ref
              if (typeof forwardedRef === 'function') {
                forwardedRef(instance);
              } else if (forwardedRef) {
                forwardedRef.current = instance;
              }
            }
          }}
          castShadow
          receiveShadow
          onClick={e => {
            if (isAR) {
              e.stopPropagation();
              // console.log(`AR Crystal (${id}) tapped!`);
              setShowTooltip(!showTooltip); // Toggle tooltip visibility
              // setIsHovered(!isHovered); // Keep sound toggle if desired, or separate
            }
            // For non-AR, click can also trigger a ripple if we implement local user interaction broadcasting
            if (!isAR) {
              e.stopPropagation();
              console.log(`NexusCrystal ${id} clicked by local user.`);
              // Here you would typically call a function to "broadcast" this interaction
              // For simulation, this might trigger an effect on other ghost cursors or crystals
            }
          }}
          onPointerOver={e => {
            if (!isAR) {
              e.stopPropagation();
              setIsHovered(true);
            }
          }}
          onPointerOut={e => {
            // Pass event to handlePointerLeave
            if (!isAR) {
              setIsHovered(false);
              handlePointerLeave(e); // Also treat as a pointer leave for press state
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          // onPointerLeave={handlePointerLeave} // R3F onPointerOut is often sufficient for this
          onPointerMove={handlePointerMove} // For continuous force check
        >
          <icosahedronGeometry args={[crystalSize, 0]} />
          <meshStandardMaterial
            color={
              isSimulatedPlayerInteracting && !isAR
                ? '#80FFAA'
                : isHighlightedByAssistant && !isAR
                  ? '#FFD700'
                  : crystalColor
            } // Greenish pulse for simulated, Gold for assistant
            roughness={0.1}
            metalness={0.6}
            emissive={
              isSimulatedPlayerInteracting && !isAR
                ? '#40FF80'
                : isHighlightedByAssistant && !isAR
                  ? '#FFA500'
                  : crystalEmissive
            } // Emissive for simulated, Orange for assistant
            emissiveIntensity={
              isDeepPressActive
                ? isAR
                  ? 1.5
                  : theme.nexusCrystal.emissiveIntensity * 4
                : currentEmissiveIntensity
            }
            transparent
            opacity={isAR ? 0.95 : 0.85}
          />
        </mesh>
        {isAR && showTooltip && (
          <Text
            position={[0, crystalSize * 1.5, 0]} // Position tooltip above the crystal
            fontSize={crystalSize * 0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={crystalSize * 0.01}
            outlineColor="black"
          >
            Nexus Crystal Data
          </Text>
        )}
      </group>
    );
  }
); // This closes the function component passed to forwardRef

// Set display name for better debugging
NexusCrystal.displayName = 'NexusCrystal';

export default NexusCrystal;
