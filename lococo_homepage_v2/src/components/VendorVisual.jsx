import React from 'react';

export default function VendorVisual({ width = 240, height = 240 }) {
  return (
    <div 
      style={{ 
        width: '100%', 
        maxWidth: `${width}px`, 
        aspectRatio: '1/1',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* SVG Style sheet for flow animation */}
      <style>
        {`
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -40;
            }
          }
          .flowing-path {
            stroke-dasharray: 8, 12;
            animation: dash-flow 2.5s linear infinite;
          }
          .node-pulse {
            animation: node-glow 4s ease-in-out infinite alternate;
          }
          @keyframes node-glow {
            0% {
              filter: drop-shadow(0 0 4px rgba(238, 212, 190, 0.2));
            }
            100% {
              filter: drop-shadow(0 0 16px rgba(238, 212, 190, 0.6));
            }
          }
        `}
      </style>

      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 240 240" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Champagne Gold Gradient */}
          <linearGradient id="visualGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5e6d8" />
            <stop offset="50%" stopColor="#eed4be" />
            <stop offset="100%" stopColor="#a48572" />
          </linearGradient>

          {/* Soft Glow Radial Gradient for Center Hub */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(238, 212, 190, 0.25)" />
            <stop offset="100%" stopColor="rgba(238, 212, 190, 0)" />
          </radialGradient>
        </defs>

        {/* 1. Connecting Flow Lines (Representing Pipeline) */}
        {/* Underlay solid line */}
        <path 
          d="M 60,75 C 90,65 100,120 120,120" 
          stroke="rgba(255, 255, 255, 0.08)" 
          strokeWidth="2" 
          fill="none" 
        />
        <path 
          d="M 120,120 C 135,120 150,175 180,165" 
          stroke="rgba(255, 255, 255, 0.08)" 
          strokeWidth="2" 
          fill="none" 
        />

        {/* Animated Light Flow (Product/Value flow) */}
        <path 
          d="M 60,75 C 90,65 100,120 120,120" 
          stroke="url(#visualGold)" 
          strokeWidth="2" 
          strokeLinecap="round"
          fill="none" 
          className="flowing-path"
        />
        <path 
          d="M 120,120 C 135,120 150,175 180,165" 
          stroke="url(#visualGold)" 
          strokeWidth="2" 
          strokeLinecap="round"
          fill="none" 
          className="flowing-path"
        />

        {/* 2. Nodes */}
        
        {/* Node A: BRAND (Manufacturer) */}
        <g transform="translate(60, 75)">
          <circle cx="0" cy="0" r="28" fill="rgba(20, 21, 26, 0.6)" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
          <circle cx="0" cy="0" r="24" fill="rgba(255, 255, 255, 0.02)" stroke="url(#visualGold)" strokeWidth="1" />
          
          {/* Geometric Factory/Product Icon */}
          <path d="M -8,6 H 8 V -2 L 2,-6 V -2 L -3,-6 V -2 L -8,-2 Z" stroke="url(#visualGold)" strokeWidth="1.2" strokeLinejoin="round" />
          
          <text 
            x="0" 
            y="-38" 
            textAnchor="middle" 
            fill="rgba(255, 255, 255, 0.4)" 
            fontSize="9" 
            fontFamily="var(--font-body)" 
            letterSpacing="0.1em"
          >
            제조사
          </text>
          <text 
            x="0" 
            y="38" 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="10" 
            fontWeight="500"
            fontFamily="var(--font-body)" 
            letterSpacing="0.05em"
          >
            BRAND
          </text>
        </g>

        {/* Node C: CREATOR (Influencer/Stage) */}
        <g transform="translate(180, 165)">
          <circle cx="0" cy="0" r="28" fill="rgba(20, 21, 26, 0.6)" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" />
          <circle cx="0" cy="0" r="24" fill="rgba(255, 255, 255, 0.02)" stroke="url(#visualGold)" strokeWidth="1" />
          
          {/* Stage Beam / Creator Megaphone Icon */}
          <path d="M -6,4 L 4,-3 L 6,1 Z M -6,4 L -8,-2 L 4,-3 M 4,-3 L 8,-6" stroke="url(#visualGold)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="2" cy="0" r="1.5" fill="url(#visualGold)" />
          
          <text 
            x="0" 
            y="-38" 
            textAnchor="middle" 
            fill="rgba(255, 255, 255, 0.4)" 
            fontSize="9" 
            fontFamily="var(--font-body)" 
            letterSpacing="0.1em"
          >
            크리에이터
          </text>
          <text 
            x="0" 
            y="38" 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="10" 
            fontWeight="500"
            fontFamily="var(--font-body)" 
            letterSpacing="0.05em"
          >
            CREATOR
          </text>
        </g>

        {/* Node B: LOCOCO (The Pacemaker Vendor - Center Hub) */}
        <g transform="translate(120, 120)">
          {/* Outer glow aura */}
          <circle cx="0" cy="0" r="48" fill="url(#centerGlow)" />
          
          <circle cx="0" cy="0" r="38" fill="rgba(12, 13, 16, 0.9)" stroke="url(#visualGold)" strokeWidth="1.5" className="node-pulse" />
          
          {/* Mini Intertwined LC Monogram inside Center Hub */}
          {/* L */}
          <path d="M -6,-15 V 4 H 2" stroke="url(#visualGold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* C Upper */}
          <path d="M 2,-8 C -2,-8 -5,-5 -5,0" stroke="url(#visualGold)" strokeWidth="2.2" strokeLinecap="round" />
          {/* C Lower */}
          <path d="M -5,6 C -5,11 -2,14 2,14" stroke="url(#visualGold)" strokeWidth="2.2" strokeLinecap="round" />

          <text 
            x="0" 
            y="-46" 
            textAnchor="middle" 
            fill="url(#visualGold)" 
            fontSize="9" 
            fontWeight="600"
            fontFamily="var(--font-body)" 
            letterSpacing="0.12em"
          >
            공동구매 밴더
          </text>
          <text 
            x="0" 
            y="48" 
            textAnchor="middle" 
            fill="#ffffff" 
            fontSize="10" 
            fontWeight="700"
            fontFamily="var(--font-body)" 
            letterSpacing="0.08em"
          >
            LOCOCO
          </text>
        </g>
      </svg>
    </div>
  );
}
