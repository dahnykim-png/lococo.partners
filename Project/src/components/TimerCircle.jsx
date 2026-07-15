import React from 'react';

/**
 * ⏰ 원형 프로그레스 타이머 컴포넌트 (TimerCircle Component)
 * SVG를 활용하여 남은 시간을 시각적으로 채워지는 원형 게이지로 표시하고,
 * 중앙에 큼직하고 귀여운 디지털 시계를 렌더링합니다.
 * 
 * @param {Object} props
 * @param {number} props.timeLeft - 남은 시간 (초)
 * @param {number} props.duration - 현재 세션의 총 시간 (초)
 * @param {string} props.sessionType - 'Focus' | 'Break'
 */
export default function TimerCircle({ timeLeft, duration, sessionType }) {
  // 디지털 시간 포맷 (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG 원 설정
  const radius = 130;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // 2 * 3.14159 * 130 = 약 816.8
  
  // 남은 시간에 따른 퍼센티지 및 오프셋 계산
  const percentage = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // 세션 타입에 따른 테마 색상 설정
  const isFocus = sessionType === 'Focus';
  const strokeColor = isFocus ? 'url(#focusGradient)' : 'url(#breakGradient)';
  const glowColor = isFocus ? 'shadow-rose-500/20' : 'shadow-teal-500/20';

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 둥근 테두리와 은은한 글로우 효과 */}
      <div className={`relative w-80 h-80 rounded-full flex items-center justify-center bg-slate-900/40 border border-slate-800/50 shadow-2xl ${glowColor} backdrop-blur-md transition-all duration-500`}>
        
        {/* 원형 SVG 프로그레스 */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 300 300">
          <defs>
            {/* 집중 상태 그라디언트 */}
            <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            {/* 휴식 상태 그라디언트 */}
            <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>

          {/* 배경 원 (비활성화 트랙) */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* 전경 원 (진행률을 채우는 바) */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="progress-ring__circle"
          />
        </svg>

        {/* 중앙 정보 텍스트 */}
        <div className="z-10 flex flex-col items-center select-none">
          {/* 세션 타입 배지 */}
          <span className={`px-4 py-1 text-xs md:text-sm font-bold tracking-wider rounded-full shadow-inner ${
            isFocus 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
              : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
          }`}>
            {isFocus ? '집중 세션 🍅' : '휴식 타임 ☕'}
          </span>

          {/* 대형 디지털 타이머 */}
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mt-3 font-display drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
            {formatTime(timeLeft)}
          </h2>

          {/* 응원 메시지 */}
          <span className="text-xs md:text-sm text-slate-400 mt-2 font-medium">
            {isFocus ? '집중할 시간이에요!' : '잠깐 멈추고 숨을 쉬어요'}
          </span>
        </div>
      </div>
    </div>
  );
}
