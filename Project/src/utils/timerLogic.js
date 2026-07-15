/**
 * 🍅 포모도로 타이머 상태 전이 및 로직 함수
 * UI와 비즈니스 로직을 분리하여 손쉽게 테스트할 수 있도록 설계했습니다.
 */

/**
 * 타이머가 종료되었을 때 다음 세션의 상태를 계산합니다.
 * 
 * @param {string} currentSession - 현재 세션 ('Focus' 또는 'Break')
 * @param {number} customFocus - 집중 시간 설정 (분)
 * @param {number} customBreak - 휴식 시간 설정 (분)
 * @returns {Object} 다음 세션 정보
 */
export function getNextSession(currentSession, customFocus, customBreak) {
  if (currentSession === 'Focus') {
    return {
      sessionType: 'Break',
      timeLeft: customBreak * 60,
      duration: customBreak * 60,
      incrementCompleted: true,
    };
  } else {
    return {
      sessionType: 'Focus',
      timeLeft: customFocus * 60,
      duration: customFocus * 60,
      incrementCompleted: false,
    };
  }
}

/**
 * 남은 시간(초)을 "MM:SS" 형식의 문자열로 변환합니다.
 * 
 * @param {number} seconds - 남은 시간 (초)
 * @returns {string} MM:SS 포맷 시간
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
