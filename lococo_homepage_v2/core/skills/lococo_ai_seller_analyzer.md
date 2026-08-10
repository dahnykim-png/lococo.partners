# LOCOCO AI Seller Analyzer Skill & Pipeline Guide

## Overview
AI 셀러 분석 및 공동구매 파트너십 매칭 알고리즘 스펙 문서입니다.

---

## 2026-08-10 작업 로그

### 1. 📊 62명 인스타그램 셀러 실데이터 DB 임포트
- 기존 Mock synthetic 데이터 체계에서 벗어나, 62명의 실제 셀러 프로필, 카테고리, 수집 지표 데이터를 `Sellers` 및 `Seller_Insights` 테이블로 완전히 임포트 완료.
- `is_test = 0` 실사용 데이터 기준 통계 체계 확립.

### 2. 🧮 Match Score 산식 & 회귀테스트 검증 고정
- 셀러 스케일(20%), 소통 결속도(30%), AI 검증 판매력(35%), 유입 전환력(15%) 4대 핵심 지표 정규화 및 가중치 합산 알고리즘 고정.
- `calculate_confidence` 신뢰도 산출 공식 정립 (`oauth`: 90%, `manual`: 75%, `synthetic`: 50% 기본값 + NLP/클릭률/추정치 미존재 시 패널티 산출).

### 3. 🖥️ LOCOCO Studio 웹 대시보드 (`lococo_web_app.py`) 고도화
- 탭 1 (전체 셀러 현황), 탭 2 (상품 매칭 추천 및 Match Score 계산기), 탭 3 (실시간 NLP 댓글 의도 분석) UI 구성 완료 및 한글 인코딩/경로 버그 해결.

### 4. ⚡ Cloudflare D1 자동 동기화 파이프라인 연동 (`lococo_d1_sync.py`)
- 웹 대시보드 구동 시 Cloudflare D1 클라우드 DB에 새로 제출된 인스타그램 OAuth 진단 데이터(`diagnosis_submissions`)를 자동으로 감지 및 `lococo_database.db`로 Upsert 동기화.
- 동기화 직후 Match Score 및 등급(Grade) 산출 자동 트리거 연동 완료.
