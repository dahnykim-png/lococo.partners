# LOCOCO PARTNERS Brand Design System (Quiet Luxury & Modern Classic)

본 문서는 30대~40대 오피니언 리더 및 1인 기업가들의 감각적인 취향을 저격하기 위해 영자가 정립한 **LOCOCO PARTNERS 공식 디자인 시스템 가이드**입니다. 

기존의 화려하거나 인위적인 색상 배합을 걷어내고, 최고급 프라이빗 라운지와 고급 호텔 스파에서 경험할 수 있는 **차분하고 고급스러운 미드나잇 슬레이트(Midnight Slate) 배경**과 **노블 샴페인 골드(Noble Champagne Gold) 포인트**를 기반으로 한 **"Quiet Luxury(조용한 럭셔리) & Modern Classic"** 미학을 지향합니다.

---

## 1. 디자인 원칙 (Design Principles)

1.  **시각적 절제 (Understated Elegance):** 과도하게 튀는 원색을 배제하고, 채도가 낮고 부드럽게 정제된 톤인톤(Tone-in-Tone) 배합을 유지하여 신뢰감을 극대화합니다.
2.  **빛과 유리의 깊이감 (Depth & Light):** 촘촘한 글래스모피즘(Glassmorphism)과 은은하게 움직이는 메쉬 그라데이션 광원을 통해 3차원의 공간적인 깊이감을 창출합니다.
3.  **지적인 서체 조화 (Intellectual Typography):** 이탈릭 기법이 가미된 클래식 세리프 폰트와 절제된 지오메트릭 산세리프 폰트를 결합하여 깊이 있는 지적 분위기를 자아냅니다.

---

## 2. 디자인 토큰 규격 (Design Tokens)

### 🎨 색상 팔레트 (Color Palette Variables)

| CSS 변수명 | 실제 색상 코드 | 색상명 | 비주얼 역할 |
| :--- | :--- | :--- | :--- |
| `--color-pitch-black` | `#0c0d10` | **Midnight Slate** | 전체 웹사이트 메인 배경색 (깊고 차분함) |
| `--color-primary` | `#eed4be` | **Noble Champagne Gold** | 로고 엠블럼, 핵심 강조 요소, 마일드 골드 |
| `--color-primary-container`| `#d9bda5` | **Warm Sand** | 가로 분할선, 서포트 골드 텍스트 |
| `--color-secondary-container`| `#a48572` | **Warm Bronze** | 어두운 그라데이션 섀도우, 마일드 테라코타 |
| `--color-tertiary` | `#b4c3b1` | **Sage Mint** | 조직도 활성화 테두리, 포인트 민트 그레이 |
| `--color-silver-mist` | `#8e94a0` | **Slate Gray** | 바디 본문 서체 및 설명문 보조 색상 |
| `--color-ghostly-gray` | `#f5f5f7` | **Warm Alabaster** | 대형 헤드라인 타이틀 및 메인 서체 색상 |
| `--color-surface` | `rgba(20, 21, 26, 0.4)` | **Transparent Glass** | 글래스모피즘 컴포넌트 카드 기본 배경색 |

---

## 3. 컴포넌트 스타일링 스펙 (Component Spec)

### ① 카드 레이아웃 (Glass Card)
*   **배경:** `background: var(--color-surface);` (투명도 40%)
*   **필터:** `backdrop-filter: blur(20px) saturate(120%);`
*   **테두리:** `border: 1px solid rgba(255, 255, 255, 0.04);`
*   **그림자:** `box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);`
*   **모서리 반경 (Border Radius):** 
    *   대형 프레임: `var(--radius-xl)` (32px)
    *   보통 카드: `var(--radius-lg)` (24px)
    *   소형 입력창: `var(--radius-default)` (12px)

### ② 백그라운드 메쉬 그라데이션 (Background Glow)
*   화면 전체에 부드러운 샴페인 골드빛 구체 광원을 띄워 3040의 지적인 분위기를 극대화합니다.
*   `radial-gradient(circle at 10% 20%, rgba(238, 212, 190, 0.02) 0%, transparent 60%)`

---

## 4. 타이포그래피 표준 (Typography Stack)

*   **Display Font (영문 타이틀):** `Anton`, `Noto Sans KR`, 'Malgun Gothic', sans-serif (대담하고 기하학적인 디자인 서체)
*   **Body Font (일반 본문):** `Inter`, `Noto Sans KR`, 'Malgun Gothic', sans-serif (가독성이 뛰어난 현대적인 산세리프)
*   **Accent Font (감성 헤드라인):** `Playfair Display`, `Noto Serif KR`, 'Batang', serif (우아하고 지적이고 고전적인 세리프)
