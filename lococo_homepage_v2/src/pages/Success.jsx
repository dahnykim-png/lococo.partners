import React, { useEffect, useState } from 'react';

export default function Success() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'completed' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const processToken = async () => {
      try {
        const hash = window.location.hash ? window.location.hash.substring(1) : '';
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          // If no access token in hash, check search params just in case
          const searchParams = new URLSearchParams(window.location.search);
          const searchToken = searchParams.get('access_token');
          
          if (!searchToken) {
            setStatus('error');
            setErrorMessage('URL에서 access_token을 찾을 수 없습니다.');
            return;
          }
        }

        const tokenToSave = accessToken || new URLSearchParams(window.location.search).get('access_token');

        // Endpoint retry candidates for maximum Cloudflare Pages compatibility
        const endpoints = ['/api/save-token', '/save-token', '/functions/save-token'];
        let response = null;
        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ access_token: tokenToSave })
            });

            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.includes('application/json')) {
              response = res;
              break;
            } else if (contentType.includes('application/json')) {
              response = res;
              break;
            }
          } catch (e) {
            lastError = e;
          }
        }

        if (!response) {
          throw new Error(lastError ? lastError.message : 'API 엔드포인트 응답 없음');
        }

        const rawText = await response.text();
        let data;
        try {
          data = JSON.parse(rawText);
        } catch (jsonErr) {
          console.error('Non-JSON response received:', rawText);
          throw new Error('서버에서 올바른 JSON 응답을 받지 못했습니다. (Cloudflare Pages Functions 경로 점검 필요)');
        }

        if (response.ok && data.success) {
          setResultData(data);
          setStatus('completed');
        } else {
          setStatus('error');
          setErrorMessage(data.error || '토큰 저장 중 오류가 발생했습니다.');
        }

      } catch (err) {
        console.error('Save token request failed:', err);
        setStatus('error');
        setErrorMessage(err.message || '서버와의 통신에 실패했습니다.');
      }
    };

    processToken();
  }, []);

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
      {/* Dynamic Ambient Blur */}
      <div 
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: status === 'completed' 
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
            : status === 'error'
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div 
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '48px 32px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      >
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div className="spinner" style={spinnerStyle} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              채널 정보를 분석하고 있습니다...
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-silver-mist, #a0a5b5)', margin: 0, lineHeight: '1.6' }}>
              Meta API와 통신하여 인스타그램 계정 및 페이지 연결 정보를 확인하는 중입니다. 잠시만 기다려 주세요.
            </p>
          </div>
        )}

        {status === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={successIconStyle}>✓</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10b981', margin: 0 }}>
              연동이 완료되었습니다
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-silver-mist, #a0a5b5)', margin: 0, lineHeight: '1.6' }}>
              인스타그램 계정이 성공적으로 승인되었으며, 진단 데이터 수집이 시작되었습니다.
            </p>

            {resultData && (
              <div 
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: '#10b981',
                  maxHeight: '340px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>[RAW Meta Graph API 진단 응답 데이터]</div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#e5e7eb' }}>
                  {JSON.stringify(resultData, null, 2)}
                </pre>
              </div>
            )}


            <button
              onClick={() => { window.location.href = '/'; }}
              style={{
                marginTop: '16px',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              메인으로 돌아가기
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={errorIconStyle}>!</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', margin: 0 }}>
              연동 처리 오류
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-silver-mist, #a0a5b5)', margin: 0, lineHeight: '1.6' }}>
              {errorMessage}
            </p>

            <button
              onClick={() => { window.location.href = '/diagnosis'; }}
              style={{
                marginTop: '16px',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              다시 시도하기
            </button>
          </div>
        )}
      </div>

      {/* Inline Spinner CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

const spinnerStyle = {
  width: '48px',
  height: '48px',
  border: '4px solid rgba(255, 255, 255, 0.1)',
  borderTop: '4px solid #833ab4',
  borderRadius: '50%'
};

const successIconStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  color: '#10b981',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  border: '2px solid #10b981'
};

const errorIconStyle = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'rgba(239, 68, 68, 0.15)',
  color: '#ef4444',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  border: '2px solid #ef4444'
};
