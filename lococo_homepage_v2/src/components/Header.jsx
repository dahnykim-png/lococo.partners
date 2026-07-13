import React from 'react';

export default function Header() {
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

      {/* Navigation Links */}
      <nav style={{ display: 'flex', gap: '32px', marginRight: '64px' }}>
        {[
          { id: 'about', label: '소개 (About)' },
          { id: 'service', label: '서비스 (Service)' },
          { id: 'portfolio', label: '포트폴리오 (History)' },
          { id: 'contact', label: '문의하기 (Contact)' }
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
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
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-link:hover {
          color: #ffffff !important;
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
