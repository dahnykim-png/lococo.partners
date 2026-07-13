import React, { useEffect, useRef, useState } from 'react';

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Initialize Audio
  useEffect(() => {
    // Exact BGM: Tchaikovsky - Variations on a Rococo Theme, Op. 33 (Meneses, Talmi-RTVE 2008) MP3
    const audio = new Audio('https://archive.org/download/rococo-vars-meneses-talvi-rtve-sp-2008/rococo%20vars%20%28meneses%2C%20talvi-rtve%20sp%202008%29.mp3');
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
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto'
      }}
    >
      {/* Sound wave visual feedback when playing */}
      {isPlaying && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '16px' }}>
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              style={{
                width: '3px',
                backgroundColor: 'var(--color-primary-container)',
                borderRadius: '99px',
                animation: `soundWave ${0.5 + bar * 0.15}s ease-in-out infinite alternate`,
                animationDelay: `${bar * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleSound}
        className="sound-toggle-btn"
        aria-label="Toggle Background Music"
        style={{
          backgroundColor: isPlaying ? 'var(--color-primary-container)' : 'rgba(18, 19, 22, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: isPlaying ? '0 0 15px rgba(227, 38, 82, 0.4)' : '0 4px 12px rgba(0,0,0,0.5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {isPlaying ? (
          // Speaker icon with sound waves
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        ) : (
          // Speaker mute icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ea0a9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="22" y1="9" x2="16" y2="15"></line>
            <line x1="16" y1="9" x2="22" y2="15"></line>
          </svg>
        )}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes soundWave {
          0% { height: 4px; }
          100% { height: 16px; }
        }
        .sound-toggle-btn:hover {
          transform: scale(1.08);
          border-color: rgba(255, 255, 255, 0.4);
        }
      `}} />
    </div>
  );
}
