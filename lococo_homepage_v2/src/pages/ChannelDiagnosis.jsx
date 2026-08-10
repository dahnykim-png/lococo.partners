import React from 'react';

export default function ChannelDiagnosis() {
  const metaAppId = (import.meta.env.VITE_META_APP_ID || import.meta.env.META_APP_ID || '').trim();
  const redirectUri = import.meta.env.DEV 
    ? 'http://localhost:5173/success/' 
    : 'https://lococopartners.kr/success/';



  const handleInstagramLogin = () => {
    if (!metaAppId) {
      alert('META_APP_ID가 설정되지 않았습니다. .env 파일에 META_APP_ID를 입력해 주세요.');
      return;
    }

    const extrasParam = JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } });
    const scopeParam = 'business_management,instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list';

    const oauthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${encodeURIComponent(metaAppId)}&display=page&extras=${encodeURIComponent(extrasParam)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scopeParam)}`;

    window.location.href = oauthUrl;
  };

  return (
    <div 
      style={{
        backgroundColor: 'var(--color-pitch-black, #0c0d10)',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Background Effects */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(225, 48, 108, 0.15) 0%, rgba(131, 58, 180, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div 
        style={{
          maxWidth: '720px',
          width: '100%',
          zIndex: 1,
          textAlign: 'center'
        }}
      >
        {/* Badge */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            marginBottom: '28px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e1306c', boxShadow: '0 0 10px #e1306c' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-silver-mist, #a0a5b5)', letterSpacing: '0.05em' }}>
            LOCOCO AI SELLER ANALYSIS
          </span>
        </div>

        {/* Title */}
        <h1 
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: '1.25',
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #d1d5db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          무료 인스타그램 채널 진단받기
        </h1>

        {/* Subtitle */}
        <p 
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-silver-mist, #a0a5b5)',
            lineHeight: '1.7',
            marginBottom: '44px',
            fontWeight: '300',
            wordBreak: 'keep-all'
          }}
        >
          AI가 셀러님의 인스타그램 채널 도달률, 참여도, 핵심 타겟층을 다각도로 분석하여<br />
          최적의 브랜딩 및 매출 성장 전략을 제안해 드립니다.
        </p>

        {/* Feature Highlights Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
            textAlign: 'left'
          }}
        >
          <div style={cardStyle}>
            <div style={iconBoxStyle}>📊</div>
            <h4 style={cardTitleStyle}>인사이트 정밀 분석</h4>
            <p style={cardDescStyle}>팔로워 성향 및 도달율 추이 분석</p>
          </div>
          <div style={cardStyle}>
            <div style={iconBoxStyle}>🎯</div>
            <h4 style={cardTitleStyle}>타겟 맞춤 역제안</h4>
            <p style={cardDescStyle}>브랜드 제휴 및 콜라보 기회 제공</p>
          </div>
          <div style={cardStyle}>
            <div style={iconBoxStyle}>⚡</div>
            <h4 style={cardTitleStyle}>3초 간편 진단</h4>
            <p style={cardDescStyle}>Meta 공식 API로 안전한 연동</p>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleInstagramLogin}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '18px 42px',
              fontSize: '1.15rem',
              fontWeight: '700',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(225, 48, 108, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              width: '100%',
              maxWidth: '380px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(225, 48, 108, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(225, 48, 108, 0.35)';
            }}
          >
            {/* Instagram Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            인스타그램으로 시작하기
          </button>

          {!metaAppId && (
            <p style={{ fontSize: '0.85rem', color: '#ff9800', margin: 0 }}>
              ⚠️ [안내] 개발 환경: .env 파일에 META_APP_ID 설정이 필요합니다.
            </p>
          )}

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
            🔒 LOCOCO는 Meta 공식 Graph API 표준 가이드라인을 준수합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '16px',
  padding: '20px',
  backdropFilter: 'blur(10px)'
};

const iconBoxStyle = {
  fontSize: '1.5rem',
  marginBottom: '12px'
};

const cardTitleStyle = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: '6px'
};

const cardDescStyle = {
  fontSize: '0.85rem',
  color: 'rgba(255, 255, 255, 0.6)',
  lineHeight: '1.4',
  margin: 0
};
