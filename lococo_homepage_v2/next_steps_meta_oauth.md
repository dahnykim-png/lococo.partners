# Meta OAuth 연동 - 미해결 이슈 (2026-08-09)

## 완료된 것
- Meta 개발자 앱 "lococo.partners" 생성 및 기본 설정 완료
- Instagram, Facebook 로그인(비즈니스용) 제품 추가 완료
- OAuth 리디렉션 URI 등록 완료 (localhost + 실제 도메인 둘 다)
- 로그인 버튼(/diagnosis), 콜백 페이지(/success/), Cloudflare Pages Function(save-token.js) 코드 구현 완료
- access_token 발급까지는 정상 작동 확인 (rawMeData에 id/name 정상 조회됨)

## 미해결 문제
me/accounts API 호출 시 계속 {"data": []} 빈 배열만 반환됨.
Graph API Explorer로 직접 테스트해도 동일한 결과.

## 확인 완료한 것 (원인 아님으로 배제됨)
- 페이지 선택 화면에서 페이지 체크 여부 - 확인함, 문제 아님
- 페이지-인스타그램 연결 상태 - 정상 연결 확인됨
- 앱 관리자 권한 - 정상 등록 확인됨
- 페이지 관리자 모드 전환 - 완료함
- 권한 승인 상태(granted) - 4개 권한 모두 granted 확인됨

## 다음에 확인할 것
- 앱 설정 → 권한 및 기능에서 pages_show_list, instagram_basic 등이 "표준 액세스(Standard)"인지 "고급 액세스(Advanced)"인지 확인
- 표준 액세스 상태라면 "Get Advanced Access" 진행 필요할 수 있음 (App Review 전에도 가능한 범위인지 확인 필요)
- Meta 공식 문서(Instagram API with Facebook Login - Get Started) 재검토하여 me/accounts 외 다른 접근 방법이 있는지 확인
- 최후 수단: 앱을 완전히 새로 만들어서 처음부터 재시도
