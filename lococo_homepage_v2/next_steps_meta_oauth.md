# Meta OAuth 연동 - 해결 완료 (2026-08-10)

## 완료된 것
- Meta 개발자 앱 "lococo.partners" 생성 및 기본 설정 완료
- Instagram, Facebook 로그인(비즈니스용) 제품 추가 완료
- OAuth 리디렉션 URI 등록 완료 (localhost + 실제 도메인 둘 다)
- 로그인 버튼(/diagnosis), 콜백 페이지(/success/), Cloudflare Pages Function(save-token-core.js 및 /api/save-token) 코드 구현 완료
- 2단계 Token Exchange 프로세스 구현 완료:
  1. User Access Token ➔ `/me` 및 `/me/accounts` 호출하여 관리 대상 Facebook 페이지와 Page Access Token 획득
  2. Page Access Token ➔ `/{page_id}?fields=instagram_business_account{id,username,name}` 호출하여 연결된 Instagram Business Account ID 및 계정 정보 추출 성공
- Cloudflare Pages / Workers 프로덕션 배포 설정 완료 (`wrangler.json`, `functions/save-token-core.js`)

## 해결 상태
- `save-token-core.js`를 통해 Page Access Token 기반 2단계 조회가 정상적으로 실행되며, 연동 성공 및 RAW 데이터 반환이 완료되었습니다.

