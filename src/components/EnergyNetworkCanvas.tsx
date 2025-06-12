import React from 'react';

const EnergyNetworkCanvas = () => {
  // Simplified version for debugging - temporarily disable complex 3D rendering
  return (
    <div className="energy-canvas-container">
      {/* Simple animated background */}
      <div className="energy-canvas-pulse" />
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
          }
        `}
      </style>
    </div>
  );
};

export default EnergyNetworkCanvas;
