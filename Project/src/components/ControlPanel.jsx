import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * 🎮 컨트롤 패널 컴포넌트 (ControlPanel Component)
 * 시작/일시정지/초기화 기능 버튼을 제공하며,
 * 몽글몽글하고 터치하고 싶어지는 귀여운 3D 버튼 스타일을 적용했습니다.
 * 
 * @param {Object} props
 * @param {boolean} props.isActive - 타이머가 실행 중인지 여부
 * @param {Function} props.onToggle - 시작/일시정지 토글 함수
 * @param {Function} props.onReset - 초기화 함수
 */
export default function ControlPanel({ isActive, onToggle, onReset }) {
  return (
    <div className="flex items-center gap-6 justify-center mt-6">
      {/* 초기화(Reset) 버튼 */}
      <button
        onClick={onReset}
        title="초기화"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-slate-100 shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-slate-700/80 cursor-pointer"
      >
        <RotateCcw className="w-6 h-6" />
      </button>

      {/* 시작/일시정지(Start/Pause) 메인 토글 버튼 */}
      <button
        onClick={onToggle}
        className={`flex items-center justify-center px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer select-none ${
          isActive 
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-500/20' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/20'
        }`}
      >
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-white" />
              <span>일시 정지</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>타이머 시작</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
