
import React from 'react';

interface SolarLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

const SolarLogo: React.FC<SolarLogoProps> = ({ size = 48, className = "", animate = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-[0_0_8px_rgba(255,211,53,0.5)]`}
      >
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD335" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rays */}
        <g className={animate ? "animate-[spin_20s_linear_infinite]" : ""} style={{ transformOrigin: '50% 50%' }}>
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d="M50 5 L55 20 L45 20 Z"
              fill="url(#sunGradient)"
              transform={`rotate(${i * 22.5} 50 50)`}
              className="opacity-90"
            />
          ))}
        </g>

        {/* Core Sun */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="url(#sunGradient)"
          className="stroke-[3px] stroke-white/20"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};

export default SolarLogo;
