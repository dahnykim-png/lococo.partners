import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const featuredBrands = [
  {
    id: 1,
    leftCase: {
      brandName: 'MARSHALL',
      productName: '액톤 3 홈 블루투스 스피커',
      enProductName: 'Acton III Home Bluetooth Speaker',
      achievement: '단독 공구 완판 (매출 1.8억 돌파)',
      enAchievement: 'Solo Group Buy Sold Out (Sales Over 180M KRW)',
      desc: '독보적인 레트로 디자인 and 사운드 스토리로 인테리어 크리에이터 1인을 단독 매칭했습니다. 감성 데스크테리어 홈스타일링 숏폼이 150만 뷰를 달성하며 3일 만에 수입 수량을 완판했습니다.',
      enDesc: 'Successfully matched a single interior creator with Marshall\'s unique retro design and sound story. A viral deskterior short-form video reached 1.5M views, selling out the entire imported volume in just 3 days.',
      point: '정품 워런티 보증 및 데스크테리어 감성 바이럴 숏폼 기획.',
      enPoint: 'Genuine warranty guarantee and planning of emotional viral deskterior short-form content.',
      logo: '📻 MARSHALL'
    },
    rightCase: {
      brandName: 'OATLY',
      productName: '바리스타 에디션 귀리 음료',
      enProductName: 'Barista Edition Oat Drink',
      achievement: '오픈 20분 만에 초도 수입 물량 완판',
      enAchievement: 'First Batch Sold Out in 20 Minutes',
      desc: '스웨덴 친환경 비건 음료의 독창적 브랜드 가치에 공감하는 웰니스 크리에이터 1인을 매칭했습니다. 홈카페 라이브 방송 진행 및 단독 구성 세트로 2040 고객들의 폭발적인 반응을 이끌었습니다.',
      enDesc: 'Matched a wellness creator sharing Sweden\'s eco-friendly vegan beverage brand values. The live commerce show and exclusive packages sparked an explosive response from health-conscious consumers.',
      point: '가치 소비를 자극하는 단독 홈카페 패키징 및 라이브 커머스 기획.',
      enPoint: 'Planning exclusive home cafe packaging and live commerce that triggers value consumption.',
      logo: '✨ OATLY'
    }
  },
  {
    id: 2,
    leftCase: {
      brandName: 'STANLEY',
      productName: '어드벤처 퀜처 트래블 텀블러',
      enProductName: 'Adventure Quencher Travel Tumbler',
      achievement: '2차 앵콜 공구 리턴즈 (재구매율 48% 돌파)',
      enAchievement: '2nd Group Buy Encore (Repurchase Rate Over 48%)',
      desc: '오피스 및 헬시 라이프스타일을 대변하는 메가 크리에이터 1인을 단독 매칭했습니다. 일상 속 텀블러 사용을 자연스럽게 노출한 데일리 브이로그를 통해 높은 구매 전환율과 매출을 견인했습니다.',
      enDesc: 'Matched a mega creator representing office and healthy lifestyles. Driving high conversion rates and sales via daily vlogs naturally exposing tumbler usage in routine life.',
      point: '오피스 루틴 단독 컬러 기획 및 2차 앵콜 전략 수립.',
      enPoint: 'Planning exclusive office routine colors and establishing 2nd encore strategies.',
      logo: '🥤 STANLEY'
    },
    rightCase: {
      brandName: 'DYSON',
      productName: '에어랩 멀티 스타일러',
      enProductName: 'Airwrap Multi-Styler',
      achievement: '단독 앵콜 완판 (매출 2.2억 달성)',
      enAchievement: 'Solo Encore Sold Out (Sales Reached 220M KRW)',
      desc: '다이슨 고유의 헤어케어 기술 과학을 트렌디하게 소개할 뷰티 전문 크리에이터 1인을 단독 매칭했습니다. 스타일링 튜토리얼 숏폼 콘텐츠가 확산되며 단시간 내 준비 물량을 소진했습니다.',
      enDesc: 'Matched a beauty creator who trendily introduced Dyson\'s signature hair care technology. Preparing and exhausting limited stocks in record time as styling tutorial short-forms went viral.',
      point: '시즌별 기프트 세트 한정 수량 구성 및 크리에이터 비포애프터 숏폼 설계.',
      enPoint: 'Designing seasonal gift set quantities and creator before/after short-form content layouts.',
      logo: '🌬️ DYSON'
    }
  }
];

const partnerLogos = [
  { name: 'Naturals', text: 'NATURALS' },
  { name: 'Glow Lab', text: 'GLOW LAB' },
  { name: 'EcoWare', text: 'ECOWARE' },
  { name: 'Urban Fit', text: 'URBAN FIT' },
  { name: 'Pure Food', text: 'PURE FOOD' },
  { name: 'Scent Co', text: 'SCENT CO' },
  { name: 'Daily Brew', text: 'DAILY BREW' },
  { name: 'Vibe Wear', text: 'VIBE WEAR' },
  { name: 'Active Life', text: 'ACTIVE LIFE' },
  { name: 'Slow Green', text: 'SLOW GREEN' },
  { name: 'Core Organics', text: 'CORE ORGANICS' },
  { name: 'Studio One', text: 'STUDIO ONE' }
];

export default function PortfolioGallery() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' or 'grid'
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredBrands.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredBrands.length) % featuredBrands.length);
  };

  const renderCase = (c, isRight = false) => {
    const pName = language === 'ko' ? c.productName : c.enProductName;
    const ach = language === 'ko' ? c.achievement : c.enAchievement;
    const descriptionText = language === 'ko' ? c.desc : c.enDesc;
    const strategyPoint = language === 'ko' ? c.point : c.enPoint;

    return (
      <div 
        className={isRight ? "case-panel-right" : "case-panel-left"}
        style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface)',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="label-caps" style={{ color: 'var(--color-primary-container)', fontSize: '0.6875rem' }}>
            {t('portfolio_source_success')}
          </span>
          <span 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '99px',
              padding: '4px 12px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--color-primary)'
            }}
          >
            {c.logo}
          </span>
        </div>
        
        <h3 
          style={{ 
            fontFamily: 'var(--font-body)',
            fontSize: '1.5rem', 
            fontWeight: '700',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            color: '#ffffff'
          }}
        >
          {pName}
        </h3>
        
        <p 
          style={{ 
            fontSize: '0.875rem',
            color: 'var(--color-primary-container)',
            fontWeight: '700',
            marginBottom: '16px'
          }}
        >
          {ach}
        </p>

        <div 
          style={{ 
            height: '1px', 
            backgroundColor: 'rgba(255,255,255,0.06)', 
            width: '100%', 
            marginBottom: '16px' 
          }} 
        />

        <p className="body-md" style={{ color: 'var(--color-silver-mist)', marginBottom: '20px', lineHeight: '1.7', wordBreak: 'keep-all' }}>
          {descriptionText}
        </p>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-default)', borderLeft: '3px solid var(--color-primary)' }}>
          <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#ffffff', marginBottom: '6px', fontWeight: '700', letterSpacing: '0.05em' }}>
            {language === 'ko' ? '소싱 핵심 기획 포인트' : 'Key Sourcing Strategy Point'}
          </h5>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', wordBreak: 'keep-all' }}>
            {strategyPoint}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="portfolio-gallery-container" style={{ width: '100%' }}>
      {/* Portfolio Tab Headers */}
      <div 
        className="portfolio-tabs"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '16px'
        }}
      >
        <button
          onClick={() => setActiveTab('featured')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'featured' ? '#ffffff' : 'var(--color-silver-mist)',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            padding: '8px 24px',
            position: 'relative',
            transition: 'color 0.3s ease',
            fontFamily: 'var(--font-body)'
          }}
        >
          {t('portfolio_tab_featured')}
          {activeTab === 'featured' && (
            <div 
              style={{
                position: 'absolute',
                bottom: '-17px',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--color-primary-container)',
                boxShadow: '0 0 8px var(--color-primary-container)'
              }}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('grid')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'grid' ? '#ffffff' : 'var(--color-silver-mist)',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            padding: '8px 24px',
            position: 'relative',
            transition: 'color 0.3s ease',
            fontFamily: 'var(--font-body)'
          }}
        >
          {t('portfolio_tab_partners')}
          {activeTab === 'grid' && (
            <div 
              style={{
                position: 'absolute',
                bottom: '-17px',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--color-primary-container)',
                boxShadow: '0 0 8px var(--color-primary-container)'
              }}
            />
          )}
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'featured' ? (
        /* FEATURED ROLLING SLIDER (기능 1) - 이미지 삭제 및 좌우 2대 성공사례 배치 */
        <div 
          className="slider-section"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="arrow-btn prev-arrow-btn"
            style={{
              background: 'rgba(18, 19, 22, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Slide Content Card (2 Columns side-by-side text) */}
          <div 
            className="featured-slide-card"
            style={{
              flex: 1,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              minHeight: '440px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
            }}
          >
            {renderCase(featuredBrands[currentSlide].leftCase)}
            {renderCase(featuredBrands[currentSlide].rightCase, true)}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="arrow-btn next-arrow-btn"
            style={{
              background: 'rgba(18, 19, 22, 0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      ) : (
        /* INFINITE GRID LOGO WALL (기능 2) */
        <div 
          className="logo-grid-section"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          {partnerLogos.map((logo, idx) => (
            <div
              key={idx}
              className="logo-wall-item"
              style={{
                height: '110px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'grayscale(100%)',
                opacity: 0.4
              }}
            >
              <div 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  letterSpacing: '0.1em',
                  color: '#ffffff'
                }}
              >
                {logo.text}
              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .arrow-btn:hover {
          background-color: var(--color-primary-container) !important;
          border-color: var(--color-primary-container) !important;
          transform: scale(1.08);
        }
        .logo-wall-item:hover {
          filter: grayscale(0%) !important;
          opacity: 1 !important;
          background-color: var(--color-surface-container) !important;
          border-color: var(--color-secondary-container) !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(238, 212, 190, 0.15);
        }
        .case-panel-right {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-left: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (min-width: 768px) {
          .case-panel-right {
            border-top: none;
            border-left: 1px solid rgba(255, 255, 255, 0.06) !important;
          }
        }
        @media (max-width: 768px) {
          .slider-section {
            gap: 0px !important;
          }
          .arrow-btn {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 10 !important;
            background-color: rgba(12, 13, 16, 0.85) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            width: 40px !important;
            height: 40px !important;
          }
          .prev-arrow-btn {
            left: 10px !important;
          }
          .next-arrow-btn {
            right: 10px !important;
          }
          /* Compact padding inside mobile text cards */
          .case-panel-left, .case-panel-right {
            padding: 24px 20px !important;
          }
        }
      `}} />
    </div>
  );
}
