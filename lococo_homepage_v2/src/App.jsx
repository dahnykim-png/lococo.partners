import React from 'react';
import Header from './components/Header';
import SoundController from './components/SoundController';
import OrgChart from './components/OrgChart';
import PortfolioGallery from './components/PortfolioGallery';
import BusinessCard from './components/BusinessCard';
import Logo from './components/Logo';
import VendorVisual from './components/VendorVisual';

export default function App() {
  const [showToast, setShowToast] = React.useState(false);

  const handleEmailClick = (e) => {
    e.preventDefault();
    window.location.href = "mailto:lococo.partners@gmail.com?subject=%5B%ED%98%91%EC%97%85%EC%A0%9C%EC%95%88%5D%20LOCOCO%20Partners%20%EB%B9%84%EC%A7%80%EB%8B%88%EC%8A%A4%20%EC%A0%9C%EC%95%88";
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText("lococo.partners@gmail.com")
        .then(() => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        })
        .catch(() => {});
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-pitch-black)', color: '#ffffff', minHeight: '100vh' }}>
      {/* Sticky Global Components */}
      <Header />
      <SoundController />

      {/* ========================================================================= */}
      {/* SECTION 1. About US */}
      {/* ========================================================================= */}
      <section 
        id="about" 
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '80px', // Header offset
          paddingBottom: '80px',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 80% 20%, rgba(238, 212, 190, 0.1) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(164, 133, 114, 0.06) 0%, transparent 50%)'
        }}
      >
        {/* Background Image Overlay Loop */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(to right, rgba(12, 13, 16, 0.92) 40%, rgba(12, 13, 16, 0.4) 100%), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
            opacity: 0.4
          }}
        />

        <div 
          className="container about-grid" 
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Main Copywriting Area */}
          <div>
            <span 
              className="label-caps" 
              style={{ 
                color: 'var(--color-secondary-container)', 
                display: 'inline-block',
                marginBottom: '16px',
                borderBottom: '1px solid var(--color-secondary-container)',
                paddingBottom: '4px'
              }}
            >
              PREMIUM JOINT PURCHASE PARTNER
            </span>
            
            <h1 
              style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.85rem, 4.2vw, 3.25rem)',
                fontWeight: '700',
                lineHeight: '1.3',
                letterSpacing: '-0.02em',
                marginBottom: '20px',
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0,0,0,0.6)'
              }}
            >
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>브랜드 x 크리에이터를</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>아름답게 잇는</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap', color: 'var(--color-primary)' }}>LOCOCO Partners</span>
            </h1>

            <h3 
              className="headline-accent" 
              style={{ 
                fontSize: '1.5rem', 
                color: 'var(--color-primary)',
                marginBottom: '32px',
                fontWeight: '300'
              }}
            >
              "Connect Brands, Inspire Creators."
            </h3>

            <p 
              className="body-lg" 
              style={{ 
                marginBottom: '24px', 
                lineHeight: '1.8', 
                color: 'var(--color-silver-mist)',
                fontWeight: '300',
                wordBreak: 'keep-all',
                fontSize: 'clamp(1.05rem, 1.45vw, 1.22rem)'
              }}
            >
              로코코 변주곡 뒤의 조력자 피츠하겐처럼,<br />
              브랜드의 셀렉션이 크리에이터와 함께 빛나도록 돕는 페이스메이커.<br />
              계약을 넘어 진정성 있는 만남을 지향합니다.
            </p>

            <div 
              style={{
                backgroundColor: 'var(--color-surface)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-default)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <h4 style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: '700', letterSpacing: '0.05em' }}>LOCOCO VISION</h4>
              <p className="body-sm" style={{ color: 'var(--color-silver-mist)', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                브랜드에게는 확실한 매출 우상향을,<br />
                크리에이터에게는 신뢰할 수 있는 셀렉션을 매칭해<br />
                건강하고 투명한 공동구매 생태계를 선도합니다.
              </p>
            </div>
          </div>

          {/* Decorative Logo / Visual Container */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div 
              className="logo-card-frame"
              style={{
                width: '100%',
                maxWidth: '440px',
                aspectRatio: '1/1',
                backgroundColor: 'var(--color-surface)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                position: 'relative',
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              <VendorVisual width={360} height={360} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2. Service / Business */}
      {/* ========================================================================= */}
      <section 
        id="service" 
        style={{
          padding: '100px 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="label-caps" style={{ color: 'var(--color-primary-container)' }}>
              SYSTEMATIC PROCESS
            </span>
            <h2 className="display-lg" style={{ marginTop: '8px', marginBottom: '16px' }}>
              유통 파이프라인
            </h2>
            <p className="body-lg" style={{ maxWidth: '950px', margin: '0 auto', wordBreak: 'keep-all', fontSize: 'clamp(1rem, 1.3vw, 1.25rem)' }}>
              셀렉션 발굴 → 크리에이터 매칭 → 성과 분석, 하나의 흐름으로 이어지는 체계적인 유통 프로세스
            </p>
          </div>

          {/* Org Chart Component */}
          <OrgChart />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3. Portfolio / History */}
      {/* ========================================================================= */}
      <section 
        id="portfolio" 
        style={{
          padding: '100px 0',
          backgroundColor: 'var(--color-pitch-black)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="label-caps" style={{ color: 'var(--color-secondary-container)' }}>
              PORTFOLIO & PARTNERS
            </span>
            <h2 className="display-lg" style={{ marginTop: '8px', marginBottom: '16px' }}>
              성공 사례 <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75em', color: 'var(--color-primary)', verticalAlign: '1px' }}>&</span> 히스토리
            </h2>
            <p className="body-lg" style={{ maxWidth: '950px', margin: '0 auto', wordBreak: 'keep-all', fontSize: 'clamp(1rem, 1.3vw, 1.25rem)' }}>
              브랜드의 규모와 니즈에 맞춘 파트너십으로, 검증된 성과를 함께 만들어왔습니다.
            </p>
          </div>

          {/* Portfolio Gallery Component */}
          <PortfolioGallery />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4. Contact */}
      {/* ========================================================================= */}
      <section 
        id="contact" 
        style={{
          padding: '100px 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(to bottom, var(--color-surface) 0%, var(--color-pitch-black) 100%)',
          position: 'relative'
        }}
      >
        <div 
          className="container" 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 48px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}
        >
          {/* Contact Left - Action Prompts */}
          <div>
            <span className="label-caps" style={{ color: 'var(--color-primary-container)', marginBottom: '8px', display: 'block' }}>
              GET IN TOUCH
            </span>
            
            <h2 className="display-lg" style={{ marginBottom: '24px' }}>
              비즈니스의 시작
            </h2>
            
            <p className="body-lg" style={{ marginBottom: '40px', lineHeight: '1.7', wordBreak: 'keep-all' }}>
              LOCOCO Partners와 확실한 매출 우상향을 시작하세요.<br />
              대표님의 제안이 실질적인 비즈니스 결과로 연결됩니다.
            </p>

            {/* Direct Connect Buttons Group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* KakaoTalk Open Chat */}
              <a
                href="https://open.kakao.com/o/s9Gqk6Bi"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn kakao-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: '#fee500',
                  color: '#191919',
                  textDecoration: 'none',
                  padding: '16px 28px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(254, 229, 0, 0.25)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Speech Bubble Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-5.52 0-10 3.58-10 8c0 2.87 1.83 5.37 4.58 6.81l-1.08 3.96c-.08.31.18.59.48.51l4.72-3.13c.43.08.87.12 1.3.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                카카오톡 오픈채팅 상담하기
              </a>

              {/* Telephone */}
              <a
                href="tel:010-4468-8999"
                className="contact-btn phone-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  textDecoration: 'none',
                  padding: '16px 28px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                전화 바로 연결하기 (모바일 전용)
              </a>

              {/* Email */}
              <a
                href="mailto:lococo.partners@gmail.com"
                onClick={handleEmailClick}
                className="contact-btn email-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  textDecoration: 'none',
                  padding: '16px 28px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                이메일 협업 제안서 보내기
              </a>
            </div>
          </div>

          {/* Contact Right - Interactive Flippable Business Card */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BusinessCard />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5. Footer */}
      {/* ========================================================================= */}
      <footer 
        style={{
          padding: '48px 0',
          backgroundColor: '#07080a',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.8125rem',
          color: 'rgba(255, 255, 255, 0.45)',
          lineHeight: '1.8'
        }}
      >
        <div 
          className="container" 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Top segment */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#ffffff', letterSpacing: '0.05em' }}>
              LOCOCO <span style={{ color: 'var(--color-primary-container)' }}>PARTNERS</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-secondary-container)', fontWeight: 'bold' }}>Connect Brands, Inspire Creators.</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.05)', width: '100%' }} />

          {/* Company Details (Legal) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <p>상호: 로코코 ㅣ 대표: KIM DAHN l 사업자등록번호: 335-30-01862</p>
              <p>이메일: lococo.partners@gmail.com l 연락처: 010-4468-8999</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p>Copyright © 로코코파트너스 (LOCOCO Partners). All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Premium Clipboard Toast Notification */}
      {showToast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            backgroundColor: 'var(--color-surface)',
            backdropFilter: 'blur(20px) saturate(120%)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-default)',
            padding: '16px 24px',
            color: '#ffffff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            zIndex: 9999,
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div>
            <div style={{ fontWeight: '700', color: 'var(--color-primary)', marginBottom: '2px' }}>클립보드 복사 완료</div>
            <div style={{ color: 'var(--color-silver-mist)', fontSize: '0.8125rem' }}>lococo.partners@gmail.com 주소가 복사되었습니다.</div>
          </div>
        </div>
      )}

      {/* Floating Animations CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .contact-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }
        .kakao-btn:hover {
          box-shadow: 0 8px 25px rgba(254, 229, 0, 0.45) !important;
        }
        .phone-btn:hover, .email-btn:hover {
          border-color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}} />
    </div>
  );
}
