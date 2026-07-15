import React, { useState, useEffect, useRef } from 'react';
import Mascot from './components/Mascot';
import TimerCircle from './components/TimerCircle';
import ControlPanel from './components/ControlPanel';
import { getNextSession, formatTime } from './utils/timerLogic';
import { Settings, Sliders, Volume2, Award, RefreshCw, BarChart2 } from 'lucide-react';

export default function App() {
  // --- 1. 상태 정의 (States) ---
  const [sessionType, setSessionType] = useState('Focus'); // 'Focus' 또는 'Break'
  const [customFocus, setCustomFocus] = useState(25); // 집중 시간 설정 (분)
  const [customBreak, setCustomBreak] = useState(5); // 휴식 시간 설정 (분)
  
  const [duration, setDuration] = useState(25 * 60); // 현재 총 시간 (초)
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 남은 시간 (초)
  const [isActive, setIsActive] = useState(false); // 타이머 작동 상태
  const [completedCount, setCompletedCount] = useState(0); // 완료한 집중 세션 수
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0); // 오늘 집중한 누적 시간 (분)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 설정 창 열림 여부
  const [soundEnabled, setSoundEnabled] = useState(true); // 효과음 활성화 여부

  // 월화수목금토일 주간 집중 통계 상태 (로컬 스토리지 연동)
  // 키: 1(월), 2(화), 3(수), 4(목), 5(금), 6(토), 0(일)
  const [weeklyStats, setWeeklyStats] = useState(() => {
    const saved = localStorage.getItem('pomomato_weekly_stats');
    return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 };
  });

  const timerRef = useRef(null);

  // --- 2. Web Audio API를 활용한 귀여운 소리 재생 ---
  const playCuteChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // 귀여운 3단 실로폰 소리 (도-미-솔)
      const playTone = (freq, startTime, durationSec) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + durationSec);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 0.3);        // C5 (도)
      playTone(659.25, now + 0.15, 0.3);   // E5 (미)
      playTone(783.99, now + 0.3, 0.5);    // G5 (솔)
    } catch (error) {
      console.error('Audio play failed:', error);
    }
  };

  // --- 3. 타이머 로직 효과 (Timer Effects) ---
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // 타이머 완료 시점
            clearInterval(timerRef.current);
            setIsActive(false);
            playCuteChime();
            
            // 공통 로직 모듈(timerLogic.js) 호출
            const next = getNextSession(sessionType, customFocus, customBreak);
            
            if (next.incrementCompleted) {
              setCompletedCount((count) => count + 1);
              setTotalFocusMinutes((prev) => prev + customFocus);
              
              // 주간 집중 통계 데이터 업데이트 및 로컬스토리지 저장
              const currentDay = new Date().getDay();
              setWeeklyStats((prevStats) => {
                const updated = {
                  ...prevStats,
                  [currentDay]: (prevStats[currentDay] || 0) + customFocus,
                };
                localStorage.setItem('pomomato_weekly_stats', JSON.stringify(updated));
                return updated;
              });
            }
            setSessionType(next.sessionType);
            setTimeLeft(next.timeLeft);
            setDuration(next.duration);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, sessionType, customFocus, customBreak, soundEnabled]);

  // --- 4. 브라우저 탭 타이틀 업데이트 ---
  useEffect(() => {
    const timeStr = formatTime(timeLeft);
    const emoji = sessionType === 'Focus' ? '🍅' : '☕';
    document.title = `${timeStr} ${emoji} | 뽀모마토 타이머`;
  }, [timeLeft, sessionType]);

  // --- 5. 시간 포맷팅 헬퍼 ---
  const formatTotalTime = (mins) => {
    if (mins === 0) return '0분';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0) {
      return `${hours}시간 ${remainingMins > 0 ? `${remainingMins}분` : ''}`;
    }
    return `${mins}분`;
  };

  // --- 6. 유저 액션 핸들러 (User Action Handlers) ---
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    const minutes = sessionType === 'Focus' ? customFocus : customBreak;
    setTimeLeft(minutes * 60);
    setDuration(minutes * 60);
  };

  const changePreset = (focusMins, breakMins) => {
    setIsActive(false);
    setCustomFocus(focusMins);
    setCustomBreak(breakMins);
    const targetMins = sessionType === 'Focus' ? focusMins : breakMins;
    setTimeLeft(targetMins * 60);
    setDuration(targetMins * 60);
  };

  const handleApplyCustomTime = (e) => {
    e.preventDefault();
    setIsActive(false);
    const targetMins = sessionType === 'Focus' ? customFocus : customBreak;
    setTimeLeft(targetMins * 60);
    setDuration(targetMins * 60);
    setIsSettingsOpen(false);
  };

  // 주간 통계 전체 초기화
  const resetWeeklyStats = () => {
    if (window.confirm('이번 주 집중 통계를 모두 리셋하시겠습니까? 🥺')) {
      const resetData = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 0: 0 };
      setWeeklyStats(resetData);
      localStorage.setItem('pomomato_weekly_stats', JSON.stringify(resetData));
    }
  };

  // 마스코트에게 보낼 현재 상태 계산
  const getMascotStatus = () => {
    if (!isActive) return 'paused';
    return sessionType === 'Focus' ? 'focus' : 'break';
  };

  // 요일 렌더링 순서 (월화수목금토일)
  const displayDays = [1, 2, 3, 4, 5, 6, 0];
  const dayLabels = { 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 0: '일' };

  return (
    <div className="relative min-h-screen flex flex-col items-center text-slate-100 px-4 py-8 md:py-10 bg-[#090b11] overflow-y-auto select-none">
      
      {/* 🌌 우주적인 별빛 배경 애니메이션 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-soft-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full animate-soft-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-soft-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-rose-400 rounded-full animate-soft-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 🚀 헤더 영역 */}
      <header className="w-full max-w-4xl flex justify-between items-center z-10 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍅</span>
          <h1 className="text-xl md:text-2xl font-black font-display tracking-tight bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            POMOMATO
          </h1>
        </div>

        {/* 설정 및 기능 버튼들 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
              soundEnabled 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20' 
                : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:bg-slate-800'
            }`}
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
          >
            <Volume2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2.5 rounded-full bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/80 transition-all duration-300 text-slate-300 cursor-pointer"
            title="설정"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 📦 메인 콘텐츠 레이아웃 (대표님 커스텀 배치) */}
      <main className="w-full max-w-4xl flex flex-col gap-8 z-10 my-auto pb-6">
        
        {/* 행 1: 마스코트 (좌) & 오늘의 몰입 기록 (우) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
          {/* 마스코트 캐릭터 영역 */}
          <div className="flex-1 flex justify-center w-full max-w-sm">
            <Mascot status={getMascotStatus()} />
          </div>

          {/* 오늘의 몰입 기록 스티커 보드 */}
          <div className="flex-1 w-full max-w-sm">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-sm shadow-xl min-h-[180px]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400 font-semibold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>오늘의 몰입 기록</span>
                  </div>
                  {totalFocusMinutes > 0 && (
                    <span className="text-xs text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      ⏱️ 총 {formatTotalTime(totalFocusMinutes)} 집중함!
                    </span>
                  )}
                </div>
                {completedCount > 0 && (
                  <button
                    onClick={() => {
                      setCompletedCount(0);
                      setTotalFocusMinutes(0);
                    }}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer mt-0.5"
                    title="스티커 리셋"
                  >
                    <RefreshCw className="w-3 h-3" /> 리셋
                  </button>
                )}
              </div>

              {/* 스티커 판 */}
              <div className="flex flex-wrap gap-2 justify-start items-center w-full min-h-[64px] p-3 bg-slate-950/60 rounded-2xl border border-slate-900 shadow-inner">
                {completedCount === 0 ? (
                  <span className="text-xs text-slate-600 m-auto text-center">
                    아직 모은 스티커가 없어요.<br />첫 세션을 완료해 보세요! 💪
                  </span>
                ) : (
                  Array.from({ length: completedCount }).map((_, i) => (
                    <span 
                      key={i} 
                      className="text-2xl animate-float"
                      style={{ animationDelay: `${i * 0.2}s` }}
                      title={`${i + 1}번째 토마토`}
                    >
                      🍅
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 행 2: 타이머 & 조작판 (좌) & 주간 몰입 통계 (우) */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full">
          {/* 타이머 및 조작판 영역 */}
          <div className="flex-1 flex flex-col items-center w-full max-w-sm">
            <TimerCircle 
              timeLeft={timeLeft} 
              duration={duration} 
              sessionType={sessionType} 
            />
            <ControlPanel 
              isActive={isActive} 
              onToggle={toggleTimer} 
              onReset={resetTimer} 
            />
          </div>

          {/* 주간 집중 통계 보드 (월화수목금토일 차트) */}
          <div className="flex-1 w-full max-w-sm">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-sm shadow-xl min-h-[220px]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400 font-semibold">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span>이번 주 요일별 몰입 통계</span>
                </div>
                <button
                  onClick={resetWeeklyStats}
                  className="text-[10px] text-slate-500 hover:text-red-400 transition-colors flex items-center gap-0.5 cursor-pointer"
                  title="통계 초기화"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> 리셋
                </button>
              </div>

              {/* 귀여운 수직 막대 그래프 차트 */}
              <div className="flex items-end justify-between h-28 px-2 gap-2 mt-2">
                {displayDays.map((dayIdx) => {
                  const minutes = weeklyStats[dayIdx] || 0;
                  const isToday = new Date().getDay() === dayIdx;
                  
                  // 높이 계산 백분율
                  const maxTargetMinutes = 120;
                  const heightPercent = Math.min(100, (minutes / maxTargetMinutes) * 100);

                  return (
                    <div key={dayIdx} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                      <span className="text-[10px] text-slate-400 font-bold scale-90 mb-1">
                        {minutes > 0 ? `${minutes}m` : '-'}
                      </span>

                      <div className="w-full h-16 bg-slate-950/60 rounded-full flex items-end p-0.5 border border-slate-900 shadow-inner relative group cursor-help">
                        <div
                          style={{ height: `${minutes > 0 ? Math.max(12, heightPercent) : 0}%` }}
                          className={`w-full rounded-full transition-all duration-500 ${
                            minutes > 0
                              ? isToday
                                ? 'bg-gradient-to-t from-rose-600 to-pink-400 shadow-lg shadow-rose-500/20'
                                : 'bg-gradient-to-t from-slate-700 to-indigo-400'
                              : 'bg-transparent'
                          }`}
                          title={`${dayLabels[dayIdx]}요일: ${formatTotalTime(minutes)}`}
                        />
                      </div>

                      <span className={`text-[11px] font-bold mt-1.5 px-1.5 py-0.5 rounded-full ${
                        isToday
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-500'
                      }`}>
                        {dayLabels[dayIdx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* ⚙️ 설정 모달 슬라이드 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg font-display">
                <Sliders className="w-5 h-5" />
                <span>타이머 설정</span>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold cursor-pointer"
              >
                닫기
              </button>
            </div>

            {/* 1. 빠른 프리셋 */}
            <div className="mb-6">
              <span className="text-xs text-slate-400 font-bold block mb-2">간편 프리셋</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => changePreset(25, 5)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    customFocus === 25 && customBreak === 5
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  기본 뽀모도로 (25 / 5)
                </button>
                <button
                  onClick={() => changePreset(50, 10)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    customFocus === 50 && customBreak === 10
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  몰입 세션 (50 / 10)
                </button>
              </div>
            </div>

            {/* 2. 사용자 설정 폼 */}
            <form onSubmit={handleApplyCustomTime} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  집중 시간 (분)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">
                  휴식 시간 (분)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={(e) => setCustomBreak(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/10 cursor-pointer mt-4"
              >
                적용하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
