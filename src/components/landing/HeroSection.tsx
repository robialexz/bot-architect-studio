import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Layers,
  Camera,
  ChevronDown,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumLogo from '@/components/ui/PremiumLogo';
import SocialIcons from '@/components/ui/SocialIcons';

// Simplified particles background without tsParticles
function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/10" />
      {/* Simple animated dots */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`hero-floating-dot hero-floating-dot-${i + 1}`} />
      ))}
    </div>
  );
}

const HeroSection: React.FC = () => {
  // Simplified for debugging - remove all complex state and effects
  console.log('🎯 HeroSection rendering...');

  // Simplified - no complex effects for debugging

  return (
    <section
      id="hero"
      className="min-h-screen w-full flex flex-col justify-center items-center bg-gray-900"
      style={{
        backgroundColor: '#1a1a1a',
        border: '3px solid lime',
        padding: '2rem'
      }}
    >
      {/* ULTRA SIMPLE DEBUG */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'lime',
        color: 'black',
        padding: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 9999
      }}>
        ✅ HEROSECTION LOADED
      </div>

      {/* ULTRA SIMPLE CONTENT */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '2rem',
          color: 'white'
        }}>
          FlowsyAI Platform
        </h1>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <a
            href="/waitlist"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#0066cc',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              minWidth: '250px',
              textAlign: 'center'
            }}
          >
            📧 Join Waitlist
          </a>

          <a
            href="/roadmap"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#ffcc00',
              color: 'black',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              minWidth: '250px',
              textAlign: 'center'
            }}
          >
            🗺️ View Roadmap
          </a>
        </div>

        <p style={{ color: 'lime', fontSize: '1.2rem' }}>
          ⬆️ BUTTONS SHOULD BE CENTERED ABOVE ⬆️
        </p>
      </div>

    </section>
  );
};

export default HeroSection;
