# Meta OAuth 연동 & 데이터 파이프라인 - [해결 완료] (2026-08-10)

## ✅ 최종 해결 상태: 완료 (RESOLVED)

### 1. 🔑 Meta OAuth 5개 핵심 권한 및 2단계 Token Exchange 완비
- Meta 개발자 앱 `lococo.partners` 설정 및 OAuth 리디렉션 URI 등록 완료 (`localhost:5173/success/` & `https://lococopartners.kr/success/`).
- **필수 승인 권한 5종 연동**:
  1. `business_management`
  2. `instagram_basic`
  3. `instagram_manage_insights`
  4. `pages_read_engagement`
  5. `pages_show_list`
- **2단계 Token Exchange 파이프라인 구축 (`save-token-core.js`)**:
  - **1단계 (User Access Token)**: `/me` 및 `/me/accounts`를 호출하여 사용자가 소유한 Facebook 페이지 목록 및 **Page Access Token** 추출.
  - **2단계 (Page Access Token)**: Page Token을 사용하여 `/{page_id}?fields=instagram_business_account{id,username,name}`를 재조회함으로써 **인스타그램 비즈니스 계정 ID 및 프로필 정보 정밀 추출 성공**.

### 2. 🌐 Cloudflare Pages / Workers 배포 및 SPA 라우팅 최적화
- Root directory 및 static output directory (`./dist`) 정렬.
- SPA Hash/Static Fallback 라우팅을 구현하여 `/diagnosis` 및 `/success` 직접 접근 시 404 문제 전면 해결.
- `wrangler.json`에 Cloudflare D1 바인딩 (`lococo-diagnosis-db`) 추가 및 Worker / Pages 런타임 엔트리포인트 최종 배포 완료.

### 3. 🗄️ Cloudflare D1 영속 저장 & core DB 자동 동기화 파이프라인
- **Cloudflare D1 저장 (`diagnosis_submissions`)**:
  - OAuth 진단 완료 시 Meta Graph API 원본 응답(`raw_response_json`), 인스타그램 비즈니스 계정 ID, 계정명, 제출 시각을 클라우드 D1 DB에 영구 저장.
- **core DB 자동 동기화 (`lococo_d1_sync.py`)**:
  - D1의 미동기화 데이터(`synced_to_core = 0`)를 `core`의 `lococo_database.db` (`Sellers`, `Seller_Insights`)로 자동 Upsert.
  - 이관 완료 후 D1 `synced_to_core = 1` 업데이트 및 AI Match Score 계산기 자동 연동 완료.
