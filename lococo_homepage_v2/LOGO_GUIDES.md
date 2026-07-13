# LOCOCO PARTNERS Brand Logo System & Guidelines

본 가이드는 **LOCOCO PARTNERS**의 브랜드 정체성과 핵심 자산인 로고 시스템의 일관성을 유지하고, 웹/인쇄/간판 등 다양한 매체에 올바르게 적용하기 위한 규격 지침서입니다.

---

## 1. 브랜드 컬러 규격 (Brand Color Specs)

LOCOCO PARTNERS의 메인 컬러는 차이콥스키의 '로코코 주제에 의한 변주곡'에서 받은 클래식하고 우아한 영감을 재해석한 **노블 샴페인 골드(Noble Champagne Gold)** 계열입니다.

| 구분 | 브랜드 메인 컬러 (Champagne Gold) | 서포트 블랙 (Midnight Slate) | 서포트 화이트 (Warm Alabaster) |
| :--- | :--- | :--- | :--- |
| **HEX** | `#eed4be` | `#0c0d10` | `#f5f5f7` |
| **RGB** | `rgb(238, 212, 190)` | `rgb(12, 13, 16)` | `rgb(245, 245, 247)` |
| **CMYK** | `C 6%, M 16%, Y 24%, K 0%` | `C 76%, M 69%, Y 64%, K 80%` | `C 1%, M 1%, Y 1%, K 2%` |
| **용도** | 로고 엠블럼, 패키지, 하이엔드 포인트 | 웹사이트 메인 배경, 프리미엄 딥 텍스처 | 카드 배경, 흰색 투명 로고, 밝은 레이아웃 |

---

## 2. 로고 변형 & 다운로드용 Raw SVG 소스

각 매체 및 제작 공정에 맞게 즉시 복사하여 사용할 수 있는 벡터(SVG) 코드입니다. 이 코드를 복사하여 `.svg` 파일로 저장하거나 **Figma**, **Adobe Illustrator**에 붙여넣기(`Ctrl+V`)하면 벡터 패스로 즉시 불러올 수 있습니다.

### ① Primary Web (RGB 웹 전용 메탈릭 버전)
* 어두운 배경의 반응형 웹사이트 메인 화면용 로고입니다.
```xml
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="refinedCopper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f5e6d8" />
      <stop offset="50%" stopColor="#eed4be" />
      <stop offset="100%" stopColor="#a48572" />
    </linearGradient>
  </defs>
  <circle cx="120" cy="120" r="108" stroke="url(#refinedCopper)" strokeWidth="2.5" />
  <path d="M133 76 C123 76 117 82 117 94" stroke="url(#refinedCopper)" strokeWidth="4" strokeLinecap="round" />
  <path d="M117 106 C117 118 123 124 133 124" stroke="url(#refinedCopper)" strokeWidth="4" strokeLinecap="round" />
  <path d="M107 54 V100 H133" stroke="url(#refinedCopper)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  <text x="120" y="170" text-anchor="middle" fill="#f5f5f7" font-family="system-ui, sans-serif" font-size="30" letter-spacing="0.15em">LOCOCO</text>
  <path d="M 50 196 H 76" stroke="url(#refinedCopper)" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M 164 196 H 190" stroke="url(#refinedCopper)" strokeWidth="1.5" strokeLinecap="round" />
  <text x="120" y="200" text-anchor="middle" fill="url(#refinedCopper)" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="0.25em">PARTNERS</text>
</svg>
```

### ② White & Transparent (흰색 단색 / 투명 배경용)
* 인스타그램 프로필, 네온 백라이트 간판, 어두운 패키지 인쇄용 단색 화이트 버전입니다.
```xml
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="120" cy="120" r="108" stroke="#f5f5f7" strokeWidth="2.5" />
  <path d="M133 76 C123 76 117 82 117 94" stroke="#f5f5f7" strokeWidth="4" strokeLinecap="round" />
  <path d="M117 106 C117 118 123 124 133 124" stroke="#f5f5f7" strokeWidth="4" strokeLinecap="round" />
  <path d="M107 54 V100 H133" stroke="#f5f5f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  <text x="120" y="170" text-anchor="middle" fill="#f5f5f7" font-family="system-ui, sans-serif" font-size="30" letter-spacing="0.15em">LOCOCO</text>
  <path d="M 50 196 H 76" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M 164 196 H 190" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round" />
  <text x="120" y="200" text-anchor="middle" fill="#f5f5f7" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="0.25em">PARTNERS</text>
</svg>
```

### ③ Black Mono (단색 블랙 / 밝은 문서 및 레이아웃용)
* 흰색/밝은 배경의 공문서, 영수증, 보증서, 먹박/레터프레스 프레스 인쇄용 규격입니다.
```xml
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="120" cy="120" r="108" stroke="#0c0d10" strokeWidth="2.5" />
  <path d="M133 76 C123 76 117 82 117 94" stroke="#0c0d10" strokeWidth="4" strokeLinecap="round" />
  <path d="M117 106 C117 118 123 124 133 124" stroke="#0c0d10" strokeWidth="4" strokeLinecap="round" />
  <path d="M107 54 V100 H133" stroke="#0c0d10" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  <text x="120" y="170" text-anchor="middle" fill="#0c0d10" font-family="system-ui, sans-serif" font-size="30" letter-spacing="0.15em">LOCOCO</text>
  <path d="M 50 196 H 76" stroke="#0c0d10" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M 164 196 H 190" stroke="#0c0d10" strokeWidth="1.5" strokeLinecap="round" />
  <text x="120" y="200" text-anchor="middle" fill="#0c0d10" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="0.25em">PARTNERS</text>
</svg>
```

### ④ CMYK Print-Ready (인쇄소용 단색 샴페인 골드)
* 명함, 브로셔, 리플렛 등 종이 인쇄 시 잉크 번짐 및 그라데이션 필터 왜곡을 예방하는 인쇄소 규격입니다.
```xml
<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="120" cy="120" r="108" stroke="#eed4be" strokeWidth="2.5" />
  <path d="M133 76 C123 76 117 82 117 94" stroke="#eed4be" strokeWidth="4" strokeLinecap="round" />
  <path d="M117 106 C117 118 123 124 133 124" stroke="#eed4be" strokeWidth="4" strokeLinecap="round" />
  <path d="M107 54 V100 H133" stroke="#eed4be" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  <text x="120" y="170" text-anchor="middle" fill="#0c0d10" font-family="system-ui, sans-serif" font-size="30" letter-spacing="0.15em">LOCOCO</text>
  <path d="M 50 196 H 76" stroke="#eed4be" strokeWidth="1.5" strokeLinecap="round" />
  <path d="M 164 196 H 190" stroke="#eed4be" strokeWidth="1.5" strokeLinecap="round" />
  <text x="120" y="200" text-anchor="middle" fill="#eed4be" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="0.25em">PARTNERS</text>
</svg>
```

---

## 3. 매체별 로고 시스템 적용 가이드 (Application)

### ① 명함 (Business Cards)
*   **추천 버전:** `CMYK Print-Ready` (인쇄용 단색 샴페인 골드) 또는 `Black Mono`
*   **사이즈 가이드:** 종이 위 가로 90mm 세로 50mm 기준, 원형 심볼 로고는 **지름 12mm~15mm** 사이로 배치 시 최상의 황금비율을 제공합니다.
*   **가공 추천:** 고급 샌드 그레이 색지(예: 칼라플랜 샌드 270g 이상)에 원형 로고 심볼 부분만 **무광 금박(Muted Gold Foil)** 혹은 **적동박(Copper Foil) 박가공** 처리하면 지적이고 프리미엄한 감각이 한층 더 돋보입니다.

### ② SNS 프로필 (Instagram, Kakao)
*   **추천 버전:** `White & Transparent` 또는 `Primary Web`
*   **사이즈 가이드:** 512px × 512px 원형 자르기 템플릿 사용.
*   **정렬 조건:** 원형 프로필 내에서 안전 영역(Safe Area)인 중앙 80% 반경 내에 심볼이 위치하도록 여백을 최소 10% 이상 남기고 크롭해야 외곽선이 잘리지 않고 깔끔하게 드러납니다.

### ③ 웹사이트 (Responsive Web)
*   **추천 버전:** `Primary Web` (그라데이션 및 뒷배경의 Radial Glow 광원 활용)
*   **적용 예시:**
    *   헤더 바: 로고 마크만 `38px`로 컴팩트하게 축소 노출하고 텍스트는 옆에 가로형으로 배열.
    *   어바웃 섹션/푸터: 카드 프레임 안에서 `240px`로 텍스트를 함께 노출시켜 브랜드 신뢰감 강조.

### ④ 오프라인 간판 (Signage)
*   **추천 버전:** `White & Transparent` 또는 `Black Mono` (인쇄소 및 레이저 커팅용 단색)
*   **간판 가공 방식:**
    *   **갈바 레이저 타공 간판:** 블랙 무광 갈바 스틸 판에 로고 라인 형태대로 레이저 타공 후 안쪽에 **웜화이트(3000K~3500K) LED 백라이트**를 은은하게 비추어 샴페인 골드 톤의 감성을 빛으로 재현합니다.
    *   **헤어라인 구리/동판 부식 간판:** 헤어라인 표면 가공된 동판(Copper plate)에 `Black Mono` 로고를 부식/음각 조각 처리하여 오프라인 매장 입구에 거치하면 클래식한 명품 무드를 줍니다.

---

## 4. 로고 여백 규격 (Clear Space & Proportions)

로고의 시각적 명확성과 주목성을 지키기 위해 로고 외곽 테두리 원으로부터 최소한의 보호 여백을 유지해 주세요.

*   **최소 보호 여백:** 원형 로고 반지름의 `15%` 공간에는 다른 글씨, 테두리선, 혹은 기타 그래픽 요소가 침범할 수 없습니다. (Clear Space = 반지름 $R \times 0.15$)
*   **최소 적용 사이즈:** 
    *   **인쇄물(CMYK):** 최소 지름 `10mm` (이하 크기에서는 LC 교차 틈새 뭉개짐 우려)
    *   **화면(RGB):** 최소 지름 `24px`
