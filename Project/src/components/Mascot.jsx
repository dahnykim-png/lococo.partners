import React from 'react';

/**
 * 🍅 마스코트 컴포넌트 (Mascot Component)
 * 타이머 상태(집중, 휴식, 일시정지)에 맞춰 귀여운 토마토 '마토'의 일러스트를 동적으로 보여줍니다.
 * 
 * @param {Object} props
 * @param {'focus' | 'break' | 'paused'} props.status - 현재 타이머 상태
 */
export default function Mascot({ status }) {
  // 상태별 귀여운 토마토 이미지 매핑
  const mascotImages = {
    focus: '/mascot_focus.jpg',
    break: '/mascot_break.jpg',
    paused: '/mascot_pause.jpg',
  };

  const statusText = {
    focus: '마토는 지금 엄청 몰입해서 코딩 중! 💻🔥',
    break: '마토는 따뜻한 차 한 잔 마시며 힐링 중... ☕✨',
    paused: '대표님, 다음 집중 준비되셨나요? 👀💖',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 몽글몽글 둥근 외곽선과 그림자가 있는 마스코트 액자 */}
      <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-300/30 shadow-lg shadow-indigo-500/10 bg-slate-900 transition-all duration-500 transform hover:scale-105">
        <img
          src={mascotImages[status] || mascotImages.paused}
          alt="Tomato Mascot"
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        
        {/* 집중 중일 때 반짝반짝 효과 */}
        {status === 'focus' && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-red-400 rounded-full animate-ping" />
        )}
      </div>

      {/* 상태 설명 말풍선 */}
      <p className="mt-4 text-sm md:text-base font-medium text-indigo-200/80 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 shadow-inner animate-float text-center max-w-xs">
        {statusText[status] || statusText.paused}
      </p>
    </div>
  );
}
