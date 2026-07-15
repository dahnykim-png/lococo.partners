import React, { useEffect, useRef, useState } from 'react';

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Initialize Audio
  useEffect(() => {
    // Exact BGM: Tchaikovsky - Variations on a Rococo Theme, Op. 33 (Meneses, Talmi-RTVE 2008) MP3 (Local Asset)
    const audio = new Audio('/bgm_rococo.mp3');
    audio.loop = true;
    audio.volume = 0; // Start at 0 volume for fade-in
    audio.preload = 'auto';
    audioRef.current = audio;

    // Listen for custom event to fade on navigation change
    const handleNavChange = () => {
      if (audioRef.current && isPlaying) {
        fadeVolumeTransition(0.02, 0.12, 600);
      }
    };

    window.addEventListener('nav-change', handleNavChange);

    return () => {
      audio.pause();
      window.removeEventListener('nav-change', handleNavChange);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // Sync isPlaying state to Play/Pause with Fades
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Play audio and fade in
      audioRef.current.play().catch((err) => {
        console.log('Audio autoplay prevented, user interaction required.', err);
        setIsPlaying(false);
      });
      fadeVolumeTo(0.12, 1000); // fade to 12% over 1 second
    } else {
      // Fade out and then pause
      fadeVolumeTo(0, 800, () => {
        audioRef.current.pause();
      });
    }
  }, [isPlaying]);

  // General helper to fade volume to a target level
  const fadeVolumeTo = (targetVolume, duration, callback) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    if (!audioRef.current) return;

    const startVolume = audioRef.current.volume;
    const difference = targetVolume - startVolume;
    const stepTime = 50; // 50ms steps
    const steps = duration / stepTime;
    const volumeStep = difference / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current);
        return;
      }
      
      currentStep++;
      const newVolume = startVolume + (volumeStep * currentStep);
      
      // Clamp volume between 0 and 1
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));

      if (currentStep >= steps) {
        audioRef.current.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
        if (callback) callback();
      }
    }, stepTime);
  };

  // Nav transition volume dip and rise back
  const fadeVolumeTransition = (dipVolume, returnVolume, duration) => {
    fadeVolumeTo(dipVolume, duration / 2, () => {
      setTimeout(() => {
        fadeVolumeTo(returnVolume, duration / 2);
      }, 100);
    });
  };

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className="sound-controller-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        pointerEvents: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '99px',
        padding: '4px 14px 4px 6px',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* BGM Toggle Button (vinyl style rotation) */}
      <button
        onClick={toggleSound}
        className="sound-toggle-btn"
        aria-label="Toggle Background Music"
        style={{
          backgroundColor: isPlaying ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: isPlaying ? '0 0 12px rgba(238, 212, 190, 0.3)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: isPlaying ? 'spinVinyl 6s linear infinite' : 'none',
        }}
      >
        <svg 
          width="15" 
          height="15" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={isPlaying ? '#0c0d10' : 'var(--color-silver-mist)'} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      </button>

      {/* BGM Status & Waves */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span 
          style={{
            fontSize: '0.6875rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            color: isPlaying ? '#ffffff' : 'var(--color-silver-mist)',
            userSelect: 'none',
            transition: 'color 0.3s ease'
          }}
        >
          {isPlaying ? 'BGM ON' : 'BGM OFF'}
        </span>
        
        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '10px' }}>
            {[1, 2, 3].map((bar) => (
              <div
                key={bar}
                style={{
                  width: '2px',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '99px',
                  animation: `soundWave ${0.4 + bar * 0.12}s ease-in-out infinite alternate`,
                  animationDelay: `${bar * 0.08}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundWave {
          0% { height: 3px; }
          100% { height: 10px; }
        }
        @keyframes spinVinyl {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .sound-toggle-btn:hover {
          transform: scale(1.08);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .sound-controller-container:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background-color: rgba(18, 19, 22, 0.85);
        }
      `}} />
    </div>
  );
}
