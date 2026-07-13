import React from 'react';

export default function Logo({ 
  width = 120, 
  height = 120, 
  showText = false, 
  variant = 'primary' // 'primary' | 'white' | 'black' | 'cmyk'
}) {
  const copperColor = '#eed4be';
  const richBlack = '#0c0d10';
  const pureWhite = '#f5f5f7';

  // Determine stroke and fill colors based on the requested variant
  let strokeColor;
  let textColor;
  let partnersColor;
  let circleStroke;
  let showGlow = false;

  switch (variant) {
    case 'white':
      strokeColor = pureWhite;
      textColor = pureWhite;
      partnersColor = pureWhite;
      circleStroke = pureWhite;
      showGlow = false;
      break;
    case 'black':
      strokeColor = richBlack;
      textColor = richBlack;
      partnersColor = richBlack;
      circleStroke = richBlack;
      showGlow = false;
      break;
    case 'cmyk':
      // CMYK print-safe version (solid colors, no gradients, no glows)
      strokeColor = copperColor;
      textColor = richBlack; // Dark text for light print mediums
      partnersColor = copperColor;
      circleStroke = copperColor;
      showGlow = false;
      break;
    case 'primary':
    default:
      // Premium RGB web version (uses metallic gradient and soft glow)
      strokeColor = 'url(#refinedCopper)';
      textColor = pureWhite;
      partnersColor = 'url(#refinedCopper)';
      circleStroke = 'url(#refinedCopper)';
      showGlow = true;
      break;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div 
        className={`lococo-refined-logo logo-${variant}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Soft Copper Radial Glow behind the Logo (Web Primary variant only) */}
        {showGlow && (
          <div 
            style={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(238, 212, 190, 0.12) 0%, transparent 70%)',
              zIndex: 0,
              pointerEvents: 'none'
            }} 
          />
        )}

        {/* Vector Recreated SVG Logo */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 240 240" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 1, position: 'relative' }}
        >
          <defs>
            {/* Elegant Metallic Champagne Gold Gradient */}
            <linearGradient id="refinedCopper" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5e6d8" />
              <stop offset="50%" stopColor="#eed4be" />
              <stop offset="100%" stopColor="#a48572" />
            </linearGradient>
          </defs>

          {/* Outer circle border matching the original guide */}
          <circle 
            cx="120" 
            cy="120" 
            r="108" 
            stroke={circleStroke} 
            strokeWidth="2.5" 
          />

          {/* C Upper segment (curves left and down, terminating above L base) */}
          <path 
            d="M133 76 C123 76 117 82 117 94" 
            stroke={strokeColor} 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* C Lower segment (starts vertically aligned below L base, curves down and right) */}
          <path 
            d="M117 106 C117 118 123 124 133 124" 
            stroke={strokeColor} 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* L Vertical Stem & Horizontal Base (drawn on top of C, passing through C's gap) */}
          <path 
            d="M107 54 V100 H133" 
            stroke={strokeColor} 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* If showText is true, render the brand text inside the SVG for perfect scaling */}
          {showText && (
            <>
              {/* LOCOCO Text */}
              <text 
                x="120" 
                y="170" 
                textAnchor="middle" 
                fill={textColor}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '30px',
                  fontWeight: '400',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}
              >
                LOCOCO
              </text>

              {/* Decorative side lines for PARTNERS */}
              <path 
                d="M 50 196 H 76" 
                stroke={partnersColor} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
              <path 
                d="M 164 196 H 190" 
                stroke={partnersColor} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />

              {/* PARTNERS Text */}
              <text 
                x="120" 
                y="200" 
                textAnchor="middle" 
                fill={partnersColor}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase'
                }}
              >
                PARTNERS
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
