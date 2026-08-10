import os
import sys
import json
import re
import requests
from datetime import datetime

# Windows 콘솔 인코딩 방어 코드
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

LM_STUDIO_URL = "http://127.0.0.1:1234/v1"
DEFAULT_MODEL = "llama-3.1-korean-8b-instruct"

def _extract_json(text: str) -> dict:
    """텍스트 내에서 JSON 객체를 추출하여 파싱합니다."""
    text = text.strip()
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        json_str = match.group(0)
        return json.loads(json_str)
    return json.loads(text)

def analyze_comment_purchase_intent(comment_text: str, base_url: str = LM_STUDIO_URL, model: str = DEFAULT_MODEL) -> dict:
    """
    댓글 텍스트를 받아 LM Studio에 요청, 구매의도 점수와 라벨을 반환합니다.
    단일 댓글 또는 줄바꿈으로 구분된 다중 댓글을 모두 처리합니다.
    
    반환 형식:
    {
        "score": 0~100,
        "label": "구매문의" | "스팸" | "친목" | "기타",
        "avg_nlp_score": 0~100,
        "details": [...]
    }
    JSON 파싱 실패 또는 로컬 LLM 서버 응답 문제 시 score=50.0, label="파싱실패"로 안전하게 폴백합니다.
    """
    if not comment_text or not comment_text.strip():
        return {
            "score": 50.0,
            "label": "기타",
            "avg_nlp_score": 50.0,
            "details": []
        }

    lines = [line.strip() for line in comment_text.strip().split('\n') if line.strip()]
    if not lines:
        return {
            "score": 50.0,
            "label": "기타",
            "avg_nlp_score": 50.0,
            "details": []
        }

    system_prompt = (
        "당신은 인스타그램 댓글 구매의도 분석기입니다. "
        "반드시 다른 설명 텍스트 없이 오직 JSON만 출력하세요."
    )

    results = []
    
    for single_comment in lines:
        user_prompt = f"""다음 댓글의 구매 의도와 성격을 분석하여 JSON으로 반환하세요.

[분석 기준]
- 구매문의: 가격, 공구 일정, 구매 링크, 배송, 재질 등 문의 (score: 70 ~ 100)
- 친목: 단순 감상, 예뻐요, 응원, 칭찬 (score: 30 ~ 50)
- 스팸: 홍보, 광고, 맞팔/소통 유도, 체험단 모집 (score: 0 ~ 20)
- 기타: 의미를 알 수 없거나 분류가 모호함 (score: 40 ~ 60)

댓글: "{single_comment}"

[필수 출력 형식]
반드시 부연 설명 없이 오직 아래 형태의 JSON 객체만 출력하세요.
{{"score": 85, "label": "구매문의"}}"""

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.1
        }

        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(
                f"{base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=10
            )

            if response.status_code == 200:
                raw_content = response.json()['choices'][0]['message']['content'].strip()
                parsed = _extract_json(raw_content)

                score = float(parsed.get("score", 50.0))
                label = str(parsed.get("label", "기타")).strip()

                # 점수 범위 클램핑 (0~100)
                score = max(0.0, min(100.0, score))

                # 라벨 보정
                valid_labels = ["구매문의", "스팸", "친목", "기타"]
                if label not in valid_labels:
                    if "구매" in label or "문의" in label:
                        label = "구매문의"
                    elif "스팸" in label or "광고" in label or "체험단" in label:
                        label = "스팸"
                    elif "친목" in label or "감상" in label or "응원" in label or "칭찬" in label:
                        label = "친목"
                    else:
                        label = "기타"

                results.append({"comment": single_comment, "score": score, "label": label})
            else:
                results.append({"comment": single_comment, "score": 50.0, "label": "파싱실패"})

        except Exception as e:
            results.append({"comment": single_comment, "score": 50.0, "label": "파싱실패"})

    # 평균 점수 계산 및 대표 라벨 선정
    if results:
        valid_results = [r for r in results if r["label"] != "파싱실패"]
        if valid_results:
            avg_score = sum(r["score"] for r in valid_results) / len(valid_results)
            avg_score = round(avg_score, 2)
            primary_label = valid_results[0]["label"]
        else:
            avg_score = 50.0
            primary_label = "파싱실패"
    else:
        avg_score = 50.0
        primary_label = "파싱실패"

    return {
        "score": avg_score,
        "label": primary_label,
        "avg_nlp_score": avg_score,
        "details": results
    }

def generate_outreach_dm(seller_profile: dict, product_info: dict, base_url: str = LM_STUDIO_URL, model: str = DEFAULT_MODEL) -> str:
    """
    셀러 프로필과 상품 정보를 받아 감성적이고 유려한 톤으로 초개인화 DM 제안서 텍스트(200~300자)를 반환합니다.
    """
    seller_name = seller_profile.get("name") or seller_profile.get("username") or "크리에이터"
    seller_bio = seller_profile.get("biography") or seller_profile.get("notes") or "세련된 감성의 콘텐츠"
    brand_name = product_info.get("brand_name", "로코코 파트너스")
    product_name = product_info.get("product_name", "프리미엄 기획 상품")
    price = product_info.get("price", "특별 공구가")

    system_prompt = (
        "당신은 1인 기업 '로코코 파트너스'의 대표 KIM DAHN을 보좌하는 감성 마케팅 전문가입니다. "
        "인플루언서 크리에이터에게 보낼 브랜드 협업 제안 DM을 정중하고 유려하며 감성적인 톤으로 작성하세요."
    )

    user_prompt = f"""다음 셀러 정보와 상품 정보를 바탕으로 초개인화 DM 제안서를 작성하세요.

[셀러 프로필]
- 셀러 성함/채널명: {seller_name}
- 셀러 특징/소개: {seller_bio}

[상품 정보]
- 브랜드: {brand_name}
- 제안 상품: {product_name} ({price})

[작성 지침 및 조건]
1. 셀러의 세련된 톤앤매너와 정체성을 진정성 있게 칭찬하며 시작하세요.
2. KB국민은행 에스크로(구매안전서비스) 기반의 투명하고 안전한 공구 정산 시스템임을 은은하게 어필하세요.
3. 텍스트 분량은 공백 포함 반드시 **200자~300자 내외**로 작성하세요.
4. 군더더기 없는 완성된 DM 메시지만 출력하세요.
"""

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=15
        )

        if response.status_code == 200:
            dm_text = response.json()['choices'][0]['message']['content'].strip()
            return dm_text
    except Exception as e:
        pass

    # 폴백 기본 DM 템플릿
    return (
        f"안녕하세요, {seller_name}님! 로코코 파트너스 대표 KIM DAHN입니다. "
        f"평소 피드에서 보여주시는 세련되고 독보적인 감성을 깊은 팬심으로 늘 응원하며 지켜보고 있습니다. "
        f"이번에 {brand_name}의 [{product_name}] 단독 공구 파트너십을 제안드리고자 연락드렸습니다. "
        f"저희는 KB국민은행 구매안전(에스크로) 인프라 기반으로 안전하고 투명한 정산을 약속드립니다. "
        f"편하게 검토해 보실 수 있도록 협찬 샘플을 먼저 보내드리고자 하니, 편하신 시간에 DM 주시면 감사하겠습니다!"
    )

if __name__ == "__main__":
    print("--- 댓글 분석 테스트 ---")
    test_text = "가격이 얼마죠? 오픈일정 알려주세요!"
    res = analyze_comment_purchase_intent(test_text)
    print(json.dumps(res, ensure_ascii=False, indent=2))
