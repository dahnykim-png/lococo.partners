import React, { useState } from 'react';

export default function BusinessCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="business-card-wrapper" 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
        perspective: '1000px' // Required for 3D flip effect
      }}
    >
      {/* Card Flip Control Button Toggle */}
      <div 
        className="card-toggle-group"
        style={{
          display: 'flex',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '99px',
          padding: '4px'
        }}
      >
        <button
          onClick={() => setIsFlipped(false)}
          style={{
            background: !isFlipped ? 'var(--color-primary)' : 'none',
            border: 'none',
            color: !isFlipped ? '#0c0d10' : 'var(--color-silver-mist)',
            fontSize: '0.8125rem',
            fontWeight: '700',
            padding: '8px 20px',
            borderRadius: '99px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          명함 앞면 (Front)
        </button>
        <button
          onClick={() => setIsFlipped(true)}
          style={{
            background: isFlipped ? 'var(--color-primary)' : 'none',
            border: 'none',
            color: isFlipped ? '#0c0d10' : 'var(--color-silver-mist)',
            fontSize: '0.8125rem',
            fontWeight: '700',
            padding: '8px 20px',
            borderRadius: '99px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          명함 뒷면 (Back)
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={`business-card-inner ${isFlipped ? 'flipped' : ''}`}
        style={{
          width: '100%',
          height: '250px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer'
        }}
      >
        
        {/* CARD FRONT: TEXT-BASED LIGHT BUSINESS CARD FRONT */}
        <div 
          className="card-side card-front"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#f5efeb', // Warm ivory mockup paper background
            border: '1px solid rgba(140, 88, 58, 0.15)',
            borderRadius: '12px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.4)',
            overflow: 'hidden'
          }}
        >
          {/* Left Area: Text-based Brand Logo */}
          <div style={{ width: '38%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '22px', fontWeight: '800', letterSpacing: '0.12em', color: '#8c583a', lineHeight: '1.1' }}>
              LOCOCO
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '8.5px', fontWeight: '600', letterSpacing: '0.22em', color: '#8c583a', borderTop: '1px solid rgba(140, 88, 58, 0.3)', paddingTop: '4px', marginTop: '5px' }}>
              PARTNERS
            </span>
          </div>

          {/* Center vertical separator */}
          <div style={{ width: '1px', backgroundColor: 'rgba(140, 88, 58, 0.15)', height: '75%' }} />

          {/* Right Area: Contact Info */}
          <div style={{ width: '54%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: 'left' }}>
            {/* Name */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#222222', letterSpacing: '0.05em', fontFamily: 'var(--font-body)' }}>김 단</span>
              <span style={{ fontSize: '10px', color: '#777777', fontWeight: '500', fontFamily: 'var(--font-body)' }}>DAHN KIM</span>
            </div>
            
            {/* Title */}
            <div style={{ fontSize: '10px', color: '#555555', fontWeight: '600', letterSpacing: '0.02em', marginBottom: '8px' }}>
              매니저 Manager
            </div>

            {/* Divider line */}
            <div style={{ width: '24px', height: '1.5px', backgroundColor: '#8c583a', marginBottom: '12px' }} />

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#333333' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8c583a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>010-4468-8999</span>
              </div>
              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#333333' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8c583a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span style={{ wordBreak: 'break-all' }}>lococo.partners@gmail.com</span>
              </div>
              {/* Instagram */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#333333' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8c583a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@lococo.partners</span>
              </div>
              {/* Web */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: '#333333' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8c583a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>lococopartners.kr</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD BACK: TEXT-BASED LIGHT BUSINESS CARD BACK */}
        <div 
          className="card-side card-back"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: '#f5efeb', // Warm ivory mockup paper background
            border: '1px solid rgba(140, 88, 58, 0.15)',
            borderRadius: '12px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.4)',
            transform: 'rotateY(180deg)',
            overflow: 'hidden'
          }}
        >
          {/* Left Area: Slogan & Mission Statement */}
          <div style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: 'left' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: '800', letterSpacing: '0.05em', color: '#8c583a' }}>
              LOCOCO PARTNERS
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: '700', color: '#222222', marginTop: '2px', wordBreak: 'keep-all' }}>
              브랜드와 크리에이터를 잇는 공동구매 파트너
            </span>
            
            {/* Horizontal Line */}
            <div style={{ height: '1px', backgroundColor: 'rgba(140, 88, 58, 0.15)', width: '80%', margin: '14px 0' }} />
            
            <p style={{ fontSize: '9px', color: '#555555', lineHeight: '1.6', wordBreak: 'keep-all', margin: 0 }}>
              좋은 셀렉션이 좋은 크리에이터를 만나는 방식,<br />
              로코코 파트너스가 함께 만듭니다.
            </p>
          </div>

          {/* Right Area: Text-based Custom Monogram Symbol */}
          <div style={{ width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', userSelect: 'none' }}>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '76px', color: '#8c583a', position: 'relative', display: 'inline-block', lineHeight: 1 }}>
              L
              <span style={{ position: 'absolute', left: '16px', top: '16px', fontFamily: 'var(--font-accent)', fontSize: '60px', color: '#8c583a', opacity: 0.85 }}>
                C
              </span>
            </span>
          </div>
        </div>

      </div>

      {/* Touch to Flip Tip */}
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
        💡 명함 카드를 클릭하면 앞뒷면을 뒤집어 볼 수 있습니다
      </span>

      <style dangerouslySetInnerHTML={{__html: `
        .business-card-inner.flipped {
          transform: rotateY(180deg);
        }
      `}} />
    </div>
  );
}
