import React, { useState } from 'react';

const pipelineSteps = [
  {
    id: 1,
    title: 'Brand Sourcing',
    koreanTitle: '브랜드 소싱 & 셀렉션 검증',
    desc: '브랜드의 진정성 있는 스토리와 엄격히 검증된 프리미엄 셀렉션을 소싱합니다.',
    details: ['브랜드 역량 분석', '셀렉션 정밀 검증', '독점 계약 및 단가조율']
  },
  {
    id: 2,
    title: 'Data Matchmaking',
    koreanTitle: '데이터 기반 크리에이터 매칭',
    desc: '크리에이터 셀러의 팔로워 성향과 판매 이력을 빅데이터로 정밀 분석하여 브랜드에 가장 완벽한 파트너를 매칭합니다.',
    details: ['팔로워 성향 분석', '카테고리 매칭', '판매 성과 예측']
  },
  {
    id: 3,
    title: 'Campaign Design',
    koreanTitle: '독점 패키지 & 캠페인 기획',
    desc: '시장 트렌드와 셀러의 개성을 융합하여 독보적인 가치를 가진 단독 판매 전략과 스토리텔링형 구성을 기획합니다.',
    details: ['단독 패키지 구성', '캠페인 일정 설계', '브랜드 가이드 수립']
  },
  {
    id: 4,
    title: 'Content Strategy',
    koreanTitle: '콘텐츠 전략 & 숏폼 설계',
    desc: '소비자의 구매 전환을 직관적으로 유도하고 신뢰도를 높여주는 크리에이터 맞춤 피드 및 바이럴 숏폼 제작을 가이드합니다.',
    details: ['피드 콘텐츠 구성', '숏폼 연출 가이드', '셀링 포인트 최적화']
  },
  {
    id: 5,
    title: 'Logistics & Settlement',
    koreanTitle: '유통 물류 & 정교한 정산',
    desc: '대규모 공구 주문에도 끄떡없는 견고한 풀필먼트 연동과 실시간 판매 데이터를 투명하게 증명하는 스마트 정산 시스템을 제공합니다.',
    details: ['풀필먼트 물류 연동', '자동 배송 처리', '실시간 정산 정비']
  },
  {
    id: 6,
    title: 'Performance Analysis',
    koreanTitle: '성과 분석 & 2차 앵콜 기획',
    desc: '공동구매 판매 결과를 세밀하게 추적하고 피드백을 수집하여, 확실한 매출 우상향 곡선을 그리는 재앵콜 캠페인을 기획합니다.',
    details: ['재구매 지표 분석', 'CS 피드백 반영', '2차 앵콜 기획']
  }
];

export default function OrgChart() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="org-chart-wrapper" style={{ width: '100%' }}>
      {/* Interactive Visual Pipeline Map */}
      <div 
        className="pipeline-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
          position: 'relative'
        }}
      >
        {pipelineSteps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`pipeline-node-card ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: isActive ? 'var(--color-surface-container)' : 'rgba(18, 19, 22, 0.4)',
                border: isActive ? '2px solid var(--color-secondary-container)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '24px 16px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top accent glow line */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, var(--color-primary-container), var(--color-secondary-container))'
                }} />
              )}

              {/* Number indicator */}
              <div 
                className="step-number"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '2.25rem',
                  fontWeight: '300',
                  lineHeight: '1',
                  color: isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)',
                  marginBottom: '10px',
                  transition: 'color 0.3s ease'
                }}
              >
                0{step.id}
              </div>

              {/* Title */}
              <h4 
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? '#ffffff' : 'var(--color-silver-mist)',
                  marginBottom: '6px'
                }}
              >
                {step.title}
              </h4>

              {/* Mini description */}
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                {step.koreanTitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Connected Line/Bar showing progression (Desktop only animation helper) */}
      <div 
        className="pipeline-progress-bar" 
        style={{ 
          height: '2px', 
          backgroundColor: 'rgba(255, 255, 255, 0.08)', 
          width: '100%', 
          marginBottom: '32px',
          position: 'relative',
          borderRadius: '2px'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: 'var(--color-secondary-container)',
            boxShadow: '0 0 10px var(--color-secondary-container)',
            width: `${(activeStep / pipelineSteps.length) * 100}%`,
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* Detailed Content Panel for Selected Step */}
      <div 
        className="pipeline-detail-panel"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.5s ease-out'
        }}
      >
        <div>
          {/* Tag */}
          <span 
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(227, 38, 82, 0.1)',
              color: 'var(--color-primary-container)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              padding: '4px 12px',
              borderRadius: '99px',
              marginBottom: '16px',
              border: '1px solid rgba(227, 38, 82, 0.2)'
            }}
          >
            PIPELINE STEP 0{activeStep}
          </span>

          <h3 
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.15rem, 5.2vw, 2rem)', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#ffffff'
            }}
          >
            {pipelineSteps[activeStep-1].koreanTitle}
          </h3>

          <p className="body-md" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', wordBreak: 'keep-all' }}>
            {pipelineSteps[activeStep-1].desc}
          </p>
        </div>

        {/* Deliverables / Checklist */}
        <div 
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.04)'
          }}
        >
          <h4 
            style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '0.875rem', 
              fontWeight: '700', 
              letterSpacing: '0.05em', 
              textTransform: 'uppercase',
              color: 'var(--color-secondary-container)',
              marginBottom: '16px'
            }}
          >
            핵심 태스크 및 유통 실천 가이드
          </h4>
          
          <div className="pipeline-details-list">
            {pipelineSteps[activeStep-1].details.map((detail, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <div className="pipeline-details-separator" />}
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    fontSize: 'clamp(0.75rem, 1.2vw, 0.8125rem)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {/* Custom check marker */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-container)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>{detail}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pipeline-node-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .pipeline-node-card.active:hover {
          border-color: var(--color-secondary-container) !important;
        }
        .pipeline-details-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 8px;
        }
        .pipeline-details-separator {
          display: none;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 768px) {
          .pipeline-details-list {
            grid-template-columns: 1fr auto 1fr auto 1fr;
            align-items: center;
          }
          .pipeline-details-separator {
            display: block;
            width: 1px;
            height: 20px;
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      `}} />
    </div>
  );
}
