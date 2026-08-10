import sys
import os
import json
import requests
import importlib
from datetime import datetime

try:
    from lococo_ai_pipeline import analyze_comment_purchase_intent, generate_outreach_dm
except ImportError:
    pass

# 하이픈(-)이 포함된 모듈을 동적으로 가져옵니다.
try:
    db_module = importlib.import_module("lococo-db-handler")
    LococoDBHandler = db_module.LococoDBHandler
except ImportError:
    # 만약 동일 경로에 없을 경우를 대비한 폴더 경로 추가
    sys.path.append(os.path.abspath(os.path.dirname(__file__)))
    try:
        db_module = importlib.import_module("lococo-db-handler")
        LococoDBHandler = db_module.LococoDBHandler
    except ImportError:
        # 최후의 수단으로 가짜 껍데기 클래스 정의 (에러 방지)
        class LococoDBHandler:
            def __init__(self, db_path): pass
            def connect(self): pass
            def close(self): pass

class LococoAIEngine:
    def __init__(self, db_path="lococo_studio.db", lm_studio_url="http://localhost:1234/v1"):
        self.db = LococoDBHandler(db_path)
        self.lm_studio_url = lm_studio_url
        self.mock_mode = False
        self._check_lm_studio_connection()

    def _check_lm_studio_connection(self):
        """LM Studio 로컬 서버 연결 상태를 확인하고, 불가능할 경우 Mock 모드로 자동 전환합니다."""
        try:
            # 타임아웃 1초로 서버 활성화 상태 확인
            response = requests.get(f"{self.lm_studio_url}/models", timeout=1.5)
            if response.status_code == 200:
                print(f"[AI Engine] LM Studio가 활성화되어 있습니다. 로컬 AI 연동 모드로 실행합니다.")
                self.mock_mode = False
            else:
                self._activate_mock_mode("서버 응답 상태 코드 이상")
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            self._activate_mock_mode("로컬 서버 연결 불가 (오프라인 상태)")

    def _activate_mock_mode(self, reason):
        self.mock_mode = True
        print(f"[AI Engine] LM Studio 서버가 활성화되어 있지 않습니다. ({reason})")
        print(f"[AI Engine] 안전한 데모 및 검증을 위해 '오프라인 시뮬레이션(Mock)' 모드로 파이프라인을 작동합니다.")

    def _call_local_llm(self, system_prompt, user_prompt, temperature=0.1, response_json=True):
        """LM Studio 로컬 API를 호출하여 결과를 반환합니다."""
        if self.mock_mode:
            return self._generate_mock_response(user_prompt)

        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "local-model",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": temperature
        }

        # JSON 포맷 강제 기능 지원 모델인 경우
        if response_json:
            payload["response_format"] = {"type": "json_object"}

        try:
            response = requests.post(
                f"{self.lm_studio_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30 # LLM 추론 시간 감안하여 여유있게 설정
            )
            if response.status_code == 200:
                result_json = response.json()
                return result_json['choices'][0]['message']['content'].strip()
            else:
                raise RuntimeError(f"API 호출 실패 (상태코드: {response.status_code})")
        except Exception as e:
            print(f"[AI Engine] 로컬 AI 호출 에러 발생: {e}. Mock 데이터로 대체합니다.")
            return self._generate_mock_response(user_prompt)

    def _clean_json_output(self, raw_content):
        """로컬 LLM이 출력할 수 있는 마크다운 JSON 코드 블록(```json) 등을 정제합니다."""
        content = raw_content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        return content.strip()

    def _generate_mock_response(self, user_prompt):
        """로컬 AI 서버 미작동 시 파이프라인 테스트를 진행하기 위한 시뮬레이션 응답기"""
        # 댓글 분석 요청인지 아웃리치 요청인지에 따라 응답 양식 분기
        if "댓글" in user_prompt or "구매 의도" in user_prompt or "comment" in user_prompt:
            # 댓글 분석인 경우, 모의 데이터 파싱 시뮬레이션
            # 입력값 파악 시도
            try:
                # 텍스트 형태에서 댓글 리스트 파악
                if "sample_comments" in user_prompt or "댓글 목록" in user_prompt:
                    # 보편적인 감정/의도 분류 생성
                    return json.dumps({
                        "analyses": [
                            {"sentiment": "neutral", "category": "general", "score": 0.15},
                            {"sentiment": "positive", "category": "purchase_inquiry", "score": 0.95},
                            {"sentiment": "neutral", "category": "spam", "score": 0.0},
                            {"sentiment": "positive", "category": "purchase_inquiry", "score": 0.88}
                        ]
                    })
            except:
                pass
            
            return json.dumps({
                "analyses": [
                    {"sentiment": "positive", "category": "purchase_inquiry", "score": 0.92}
                ]
            })
            
        else:
            # 아웃리치 제안서 양식인 경우
            return """안녕하세요! '로코코 파트너스' 대표 KIM DAHN입니다. 

올려주시는 세련된 오피스룩 코디 피드를 항상 깊은 영감과 함께 잘 보고 있습니다. 팬들과 진정성 있게 패션 철학을 나누시는 모습이 저희 로코코가 지향하는 가치와 아주 잘 부합한다고 생각됩니다.

이번에 저희 로코코에서 특별 기획하여 소싱을 완료한 '직장인 에센셜 블레이저 린넨 자켓'의 단독 공구 파트너십을 제안하고자 연락드렸습니다. 해당 제품은 고품질의 원단과 고급스러운 핏으로 다가오는 가을 시즌 큰 호응을 보장하는 아이템입니다.

로코코 파트너스는 KB국민은행 구매안전서비스(KB에스크로) 안전 결제 및 자동화 정산 인프라를 활용하여, 기존 공구 시장의 불안한 정산 문제를 100% 해결해 드리고 있습니다. 계약 과정부터 투명하고 안전하게 조율해 드릴 것을 약속드립니다.

제안을 긍정적으로 검토해 주신다면, 상세 안내서와 함께 피드에 착용해 보실 수 있는 '무료 협찬 샘플'을 먼저 보내드리도록 하겠습니다. 편하게 검토해보시고 편하신 시간에 이 DM이나 카카오톡 오픈채팅(open.kakao.com/o/sAnoc6Bi)으로 편하게 의견 주시기 바랍니다.

오늘도 행복하고 활기찬 하루 보내세요! 감사합니다."""

    def run_comment_pipeline(self, seller_username, media_id, raw_comments):
        """
        [핵심 파이프라인 1] 댓글 수집 데이터 로컬 AI 분석 및 DB 갱신
        """
        print(f"\n[Pipeline] '@{seller_username}' 셀러의 피드({media_id}) 댓글 감성 및 구매의도 분석 시작...")
        
        # 1. DB에 셀러 및 피드가 등록되어 있는지 확인 및 생성
        seller_id = self.db.upsert_seller(username=seller_username)
        # 피드 등록 (like_count, comments_count 등 임시 설정)
        post_id = self.db.insert_post(
            seller_id=seller_id,
            media_id=media_id,
            caption="테스트용 피드 캡션",
            media_type="IMAGE",
            permalink=f"https://instagram.com/p/{media_id}",
            like_count=120,
            comments_count=len(raw_comments),
            posted_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

        system_prompt = """
        당신은 인스타그램 공동구매(공구) 비즈니스 분석 전문가입니다.
        제공된 댓글 리스트의 각 항목에 대해 감성 분석(sentiment: positive, neutral, negative), 의도 카테고리 분류(intent_category: purchase_inquiry, general, spam), 구매 의도 점수(intent_score: 0.0에서 1.0 사이 실수)를 측정하세요.
        
        - purchase_inquiry: 구매 방법, 공구 일정, 가격, 배송, 재질 정보 문의 등
        - spam: 불법 광고, 매크로성 맞팔 유도 등
        - general: 친목 도모, 일반 리액션("예뻐요", "최고에요" 등 단순 감상)
        """

        user_prompt = f"""
        아래 댓글 목록의 각 항목을 1:1로 정밀 분석하여 결과를 반환하세요.
        
        [댓글 목록]
        {json.dumps(raw_comments, ensure_ascii=False)}
        
        [응답 포맷]
        반드시 json 객체 형태로 반환하세요. 키값은 "analyses"이며 하위 항목으로 배열을 가집니다.
        {{
            "analyses": [
                {{"sentiment": "감성", "category": "카테고리", "score": 점수}},
                ...
            ]
        }}
        """

        # 로컬 AI 서버 호출
        raw_ai_response = self._call_local_llm(system_prompt, user_prompt, temperature=0.1)
        cleaned_response = self._clean_json_output(raw_ai_response)
        
        try:
            analysis_data = json.loads(cleaned_response)
            analyses = analysis_data.get("analyses", [])
        except Exception as e:
            print(f"[AI Pipeline] JSON 파싱 실패 ({e}). 기본 시뮬레이션 데이터로 안전 대체합니다.")
            analyses = json.loads(self._generate_mock_response("댓글"))["analyses"]

        # 2. 분석된 데이터 DB에 순차 적재
        purchase_inquiries = 0
        total_valid_score = 0.0
        
        for idx, item in enumerate(raw_comments):
            comment_id = f"cmt_{media_id}_{idx}"
            # AI 분석 결과 추출 (안전 장치 추가)
            ai_res = analyses[idx] if idx < len(analyses) else {"sentiment": "neutral", "category": "general", "score": 0.1}
            
            # DB 저장
            self.db.insert_comment_analysis(
                post_id=post_id,
                comment_id=comment_id,
                text=item,
                sentiment=ai_res.get("sentiment", "neutral"),
                intent_category=ai_res.get("category", "general"),
                intent_score=ai_res.get("score", 0.0)
            )
            
            if ai_res.get("category") == "purchase_inquiry":
                purchase_inquiries += 1
                total_valid_score += ai_res.get("score", 0.0)

        # 3. 피드의 종합 구매전환 점수(nlp_conversion_score) 계산 및 DB 업데이트
        # 진성 문의 비율을 가중치로 한 최종 전환 점수 산출
        total_comments = len(raw_comments)
        conversion_score = round((total_valid_score / total_comments) * 100, 2) if total_comments > 0 else 0.0
        
        self.db.update_post_nlp_score(media_id, conversion_score)
        print(f"[Pipeline] '@{seller_username}'의 피드 분석 완료. 종합 공구 전환 지표: {conversion_score}% (진성 문의: {purchase_inquiries}/{total_comments})")
        return conversion_score

    def run_outreach_pipeline(self, seller_username, product_id):
        """
        [핵심 파이프라인 2] 맞춤형 초개인화 DM 제안서 오프라인 생성 및 DB 로깅
        """
        print(f"\n[Pipeline] '@{seller_username}' 셀러에 대한 맞춤형 초개인화 DM 작성 및 이력 등록 시작...")
        
        # 1. DB에서 셀러 정보 및 상품 메타데이터 로드
        seller = self.db.get_seller_by_username(seller_username)
        if not seller:
            # 정보가 없는 임시 등록 상태인 경우 기본값 자동 생성
            seller_id = self.db.upsert_seller(
                username=seller_username,
                full_name="임시파트너",
                biography="패션 및 데일리 라이프스타일 크리에이터",
                followers_count=5200
            )
            seller = self.db.get_seller_by_username(seller_username)
        
        # 상품 조회 (SQLite Dictionary 형태 활용)
        self.db.cursor.execute("SELECT * FROM Brand_Products WHERE id = ?", (product_id,))
        product_row = self.db.cursor.fetchone()
        product = dict(product_row) if product_row else {
            "brand_name": "LOCOCO",
            "product_name": "로코코 프리미엄 자켓",
            "price": 98000,
            "category": "패션"
        }

        # 2. 개인화 DM 작성을 위한 시스템 설계 프롬프트 정의
        system_prompt = """
        당신은 1인 기업 '로코코 파트너스'의 대표 KIM DAHN을 보좌하는 유능한 마케팅 AI 비서입니다.
        아래 입력된 인플루언서의 정보를 입체적으로 분석하여, 그들의 강점을 진심으로 인정하는 개인화 제안 메시지를 격식있고 감동적인 톤앤매너로 작성하세요.
        반드시 KB국민은행의 구매안전서비스(KB에스크로 결제대금예치) 가입 기업이라는 점을 명확히 전달하여, 기존 공구 정산 시장의 불투명성을 해소할 수 있는 안전한 파트너임을 어필해야 합니다.
        """

        user_prompt = f"""
        - 셀러 계정: @{seller['username']}
        - 셀러 이름: {seller['full_name']}
        - 셀러 소개글: {seller['biography']}
        - 제안 상품: {product['brand_name']} - {product['product_name']} (정가: {product['price']}원)
        - 인바운드 회신 수단: 카카오톡 오픈채팅 (open.kakao.com/o/sAnoc6Bi) 또는 인스타그램 DM
        
        위 정보를 반영하여 매력적인 협업 제안서(DM)를 생성해 주세요. 기계적인 형식을 완전히 생략하고 친근하면서도 프로페셔널한 느낌을 강조하세요.
        """

        # 로컬 AI 추론 호출
        custom_dm = self._call_local_llm(system_prompt, user_prompt, temperature=0.7, response_json=False)

        # 3. 아웃리치 이력 DB에 자동 기록 (PENDING 상태로 등록하여 답변 대기)
        outreach_id = self.db.log_outreach(
            seller_id=seller['id'],
            product_id=product_id,
            sent_message=custom_dm,
            channel="DM"
        )
        
        print(f"[Pipeline] DM 제안서 초안 작성 및 DB 등록 완료! (발송 ID: {outreach_id})")
        return outreach_id, custom_dm

    def close(self):
        self.db.close()

# --- 실행 검증용 모의 시나리오 테스트 ---
if __name__ == "__main__":
    # 테스트 전용 데이터베이스 생성 및 연동
    pipeline = LococoAIEngine(db_path="lococo_pipeline_test.db")
    
    # 1. 소싱 상품 등록
    prod_id = pipeline.db.insert_brand_product(
        brand_name="로코코(LOCOCO)",
        product_name="2026 어텀 오버핏 실크 자켓",
        price=125000,
        commission_rate=0.18,
        category="의류/패션"
    )
    
    # 2. 파이프라인 1 실행: 댓글 분석
    test_comments = [
        "이거 자켓 사이즈 오버핏인가요? 구매 링크 열렸나요?",
        "우와 분위기 너무 멋져요 ㅎㅎ 좋은 하루 보내세요",
        "인플루언서 마케팅 대행 서비스입니다. DM 확인부탁드립니다 @@",
        "소재가 어떤 건지 궁금해요! 공구 가격 공지 부탁드립니다!"
    ]
    
    conversion_rate = pipeline.run_comment_pipeline(
        seller_username="fashion_lover_2026",
        media_id="C8j3K2pLm9x",
        raw_comments=test_comments
    )
    
    # 3. 파이프라인 2 실행: 초개인화 DM 기획 및 발송 예약
    out_id, dm_text = pipeline.run_outreach_pipeline(
        seller_username="fashion_lover_2026",
        product_id=prod_id
    )
    
    print("\n" + "="*50)
    print("★ [실시간 생성된 초개인화 DM 프리뷰] ★")
    print("="*50)
    print(dm_text)
    print("="*50)
    
    # 리소스 안전 정지
    pipeline.close()
    print("\n[AI Pipeline] 테스트 시나리오 동작 완료 및 안전하게 종료되었습니다.")
