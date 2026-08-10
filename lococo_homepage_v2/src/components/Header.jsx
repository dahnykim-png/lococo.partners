import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { language, toggleLanguage, t } = useLanguage();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      // Trigger navigation sound transition event
      const event = new CustomEvent('nav-change');
      window.dispatchEvent(event);

      // Smooth scroll
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 999,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Brand Logo */}
      <a 
        href="#" 
        onClick={(e) => handleNavClick(e, 'about')}
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}
      >
        <span 
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.25rem',
            fontWeight: '600',
            letterSpacing: '0.08em',
            color: '#ffffff',
            textTransform: 'uppercase'
          }}
        >
          LOCOCO <span style={{ color: 'var(--color-primary)' }}>PARTNERS</span>
        </span>
      </a>

        {/* Navigation Links and Language Toggle Wrapper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {[
              { id: 'about', label: t('nav_about') },
              { id: 'service', label: t('nav_service') },
              { id: 'portfolio', label: t('nav_portfolio') },
              { id: 'contact', label: t('nav_contact') }
            ].map((item) => (
              <a
                key={item.id}
                href={window.location.pathname === '/' ? `#${item.id}` : `/#${item.id}`}
                onClick={(e) => {
                  if (window.location.pathname !== '/') {
                    window.location.href = `/#${item.id}`;
                  } else {
                    handleNavClick(e, item.id);
                  }
                }}
                className="nav-link"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--color-silver-mist)',
                  transition: 'color 0.2s ease',
                  letterSpacing: '0.02em'
                }}
              >
                {item.label}
              </a>
            ))}

            <a
              href="/#/diagnosis"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '/diagnosis';
              }}
              style={{
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #833ab4, #fd1d1d)',
                padding: '6px 14px',
                borderRadius: '8px',
                transition: 'opacity 0.2s ease'
              }}
            >
              채널 진단받기
            </a>
          </nav>

          {/* Language Toggle Capsule Button */}
          <button
            onClick={toggleLanguage}
            className="lang-toggle-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '99px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <span style={{ color: language === 'ko' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)' }}>KO</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>/</span>
            <span style={{ color: language === 'en' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)' }}>EN</span>
          </button>
        </div>


      <style dangerouslySetInnerHTML={{__html: `
        .nav-link:hover {
          color: #ffffff !important;
        }
        .lang-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          header {
            padding: 0 24px !important;
          }
          nav {
            display: none !important; /* Hide on mobile for simplicity, keeping full UI clean */
          }
        }
      `}} />
    </header>
  );
}
