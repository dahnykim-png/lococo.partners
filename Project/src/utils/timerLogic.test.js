import { test } from 'node:test';
import assert from 'node:assert';
import { getNextSession, formatTime } from './timerLogic.js';

// 1. 시간 포맷 기능 테스트 (formatTime test)
test('formatTime() - 초 단위를 MM:SS 포맷 문자열로 변환해야 함', () => {
  // 25분 (1500초) -> "25:00"
  assert.strictEqual(formatTime(1500), '25:00');
  
  // 5분 (300초) -> "05:00"
  assert.strictEqual(formatTime(300), '05:00');
  
  // 45초 -> "00:45"
  assert.strictEqual(formatTime(45), '00:45');
  
  // 0초 -> "00:00"
  assert.strictEqual(formatTime(0), '00:00');
});

// 2. 세션 전환 상태 머신 테스트 (getNextSession test)
test('getNextSession() - Focus(집중) 세션 종료 시 Break(휴식)로 전환되어야 함', () => {
  const result = getNextSession('Focus', 25, 5);
  
  assert.strictEqual(result.sessionType, 'Break');
  assert.strictEqual(result.timeLeft, 300); // 5분 * 60초 = 300초
  assert.strictEqual(result.duration, 300);
  assert.strictEqual(result.incrementCompleted, true); // 집중 세션 완료 카운트 업!
});

test('getNextSession() - Break(휴식) 세션 종료 시 Focus(집중)로 전환되어야 함', () => {
  const result = getNextSession('Break', 25, 5);
  
  assert.strictEqual(result.sessionType, 'Focus');
  assert.strictEqual(result.timeLeft, 1500); // 25분 * 60초 = 1500초
  assert.strictEqual(result.duration, 1500);
  assert.strictEqual(result.incrementCompleted, false); // 휴식이 끝났을 때는 카운트 업 하지 않음
});
