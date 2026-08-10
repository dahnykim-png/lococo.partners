import os
import sys
from lococo_db_handler import LococoDBHandler

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

class LococoMLPredictor:
    def __init__(self, db_path=None):
        self.db = LococoDBHandler(db_path)
        self.db_path = self.db.db_path

    def normalize_metrics(self, followers_count, engagement_rate, click_rate, raw_nlp_score):
        """
        4개 핵심 지표 0~100점 정규화 산식
        
        1. 셀러 스케일 (20% 가중치):
           - 산식: min(100.0, max(0.0, (followers_count / 200,000) * 100.0))
           - 회귀테스트 1 (셀러 A, 150,000명): 75.0점
           - 회귀테스트 2 (신규, 3,000명): 1.5점

        2. 소통 결속도 (30% 가중치):
           - 산식: min(100.0, max(0.0, (engagement_rate / 0.10) * 100.0))
           - 회귀테스트 1 (참여율 8.5% = 0.085): 85.0점
           - 회귀테스트 2 (참여율 3.2% = 0.032): 32.0점

        3. AI 검증 판매력 (35% 가중치):
           - 산식: raw_nlp_score가 존재할 경우 raw_nlp_score * 100.0, 없을 경우 50.0점(중립값)
           - 회귀테스트 1 & 2 (미연동): 50.0점 (NLP 미연동 패널티 -15%p 적용)

        4. 유입 전환력 (15% 가중치):
           - 산식: min(100.0, max(0.0, (click_rate / 0.07) * 100.0)) (미존재 시 50.0점 중립값)
           - 회귀테스트 1 (클릭률 4.2% = 0.042): 60.0점
           - 회귀테스트 2 (클릭률 미존재/NULL): 50.0점 (클릭률 미존재 패널티 -10%p 적용)
        """
        scale_score = min(100.0, max(0.0, (followers_count / 200000.0) * 100.0))
        engagement_score = min(100.0, max(0.0, (engagement_rate / 0.10) * 100.0))
        
        nlp_present = raw_nlp_score is not None
        if nlp_present:
            nlp_score = (raw_nlp_score * 100.0) if raw_nlp_score <= 1.0 else raw_nlp_score
        else:
            nlp_score = 50.0
        
        click_present = (click_rate is not None and click_rate > 0.0)
        click_score = min(100.0, max(0.0, (click_rate / 0.07) * 100.0)) if click_present else 50.0

        return {
            "scale_score": round(scale_score, 2),
            "engagement_score": round(engagement_score, 2),
            "nlp_score": round(nlp_score, 2),
            "click_score": round(click_score, 2),
            "nlp_present": nlp_present,
            "click_present": click_present
        }

    def determine_grade(self, score):
        """
        고정 등급 판정 기준:
        - S등급: 80점 이상
        - A등급: 60점 이상 80점 미만
        - B등급: 40점 이상 60점 미만
        - C등급: 40점 미만
        """
        if score >= 80.0:
            return "S"
        elif score >= 60.0:
            return "A"
        elif score >= 40.0:
            return "B"
        else:
            return "C"

    def calculate_confidence(self, data_source, nlp_present, click_present=True, engagement_is_estimated=False):
        """
        Confidence Level 산출 공식 (확장 기준)
        1단계: data_source별 기본값
               - oauth: 90%
               - manual: 75%
               - synthetic: 50%
        2단계: 패널티 적용
               - NLP 미연동(avg_nlp_score 50점 중립값 대체): -15%p
               - click_rate 미존재(NULL): -10%p
               - engagement_rate 근사치 대체(평균릴스조회수/팔로워 비율): -10%p
        3단계: 0% 최소값 클램핑 (clamp)
        """
        base_table = {
            'oauth': 90.0,
            'manual': 75.0,
            'synthetic': 50.0
        }
        base_confidence = base_table.get(data_source, 75.0)

        penalty = 0.0
        if not nlp_present:
            penalty += 15.0
        if not click_present:
            penalty += 10.0
        if engagement_is_estimated:
            penalty += 10.0

        final_confidence = base_confidence - penalty
        return max(0.0, final_confidence)

    def calculate_match_score(self, seller_id, product_id=1):
        """
        특정 셀러와 상품 간의 Match Score 및 등급을 계산하고 Matching_Recommendations 테이블에 저장합니다.
        """
        # 1. 셀러 정보 및 성과 지표 조회
        self.db.cursor.execute("SELECT * FROM Sellers WHERE seller_id = ?", (seller_id,))
        seller_row = self.db.cursor.fetchone()
        if not seller_row:
            raise ValueError(f"seller_id {seller_id}에 해당하는 셀러를 찾을 수 없습니다.")
        seller = dict(seller_row)

        insight = self.db.get_latest_insight(seller_id)
        followers_count = insight['followers_count'] if insight else seller.get('followers_count', 0)
        engagement_rate = insight['engagement_rate'] if insight else 0.0
        click_rate = insight['click_rate'] if insight else None
        engagement_is_estimated = bool(insight.get('engagement_rate_is_estimated', 0)) if insight else False

        # 2. NLP 댓글 분석 점수 평균 조회
        self.db.cursor.execute("""
            SELECT AVG(a.nlp_conversion_score) as avg_score, COUNT(a.analysis_id) as cnt
            FROM NLP_Comment_Analysis a
            JOIN Seller_Posts p ON a.post_id = p.post_id
            WHERE p.seller_id = ?
        """, (seller_id,))
        nlp_row = self.db.cursor.fetchone()
        
        raw_nlp_score = None
        if nlp_row and nlp_row['cnt'] > 0 and nlp_row['avg_score'] is not None:
            raw_nlp_score = float(nlp_row['avg_score'])
        else:
            # NLP 분석 내역이 없는 경우, Seller_Posts에 저장된 피드 댓글이 있는지 확인 후 실시간 분석 시도
            self.db.cursor.execute("""
                SELECT post_id, comment_text FROM Seller_Posts 
                WHERE seller_id = ? AND comment_text IS NOT NULL AND TRIM(comment_text) != ''
                ORDER BY post_id DESC LIMIT 1
            """, (seller_id,))
            post_row = self.db.cursor.fetchone()
            if post_row and post_row['comment_text']:
                try:
                    from lococo_ai_pipeline import analyze_comment_purchase_intent
                    res = analyze_comment_purchase_intent(post_row['comment_text'])
                    if res.get("label") != "파싱실패":
                        score_val = float(res.get("score", 50.0))
                        norm_score_for_db = score_val / 100.0 if score_val > 1.0 else score_val
                        self.db.insert_nlp_analysis(
                            post_id=post_row['post_id'],
                            nlp_conversion_score=norm_score_for_db,
                            sentiment_label=res.get("label", "기타")
                        )
                        raw_nlp_score = norm_score_for_db
                except Exception as e:
                    # LM Studio 오프라인 또는 오류 발생 시 50점 폴백유지
                    raw_nlp_score = None


        # 3. 4개 지표 정규화 및 가중합 계산
        norm = self.normalize_metrics(followers_count, engagement_rate, click_rate, raw_nlp_score)
        
        total_score = (
            (norm['scale_score'] * 0.20) +
            (norm['engagement_score'] * 0.30) +
            (norm['nlp_score'] * 0.35) +
            (norm['click_score'] * 0.15)
        )
        total_score = round(total_score, 2)

        # 4. 등급 및 신뢰도 판단
        grade = self.determine_grade(total_score)
        confidence_level = self.calculate_confidence(
            data_source=seller.get('data_source', 'manual'),
            nlp_present=norm['nlp_present'],
            click_present=norm['click_present'],
            engagement_is_estimated=engagement_is_estimated
        )

        # 5. Matching_Recommendations 테이블 저장 (is_test 보존)
        is_test_flag = bool(seller.get('is_test', 1))
        self.db.insert_matching_recommendation(
            seller_id=seller_id,
            product_id=product_id,
            match_score=total_score,
            grade=grade,
            confidence_level=confidence_level,
            is_test=is_test_flag
        )

        return {
            "score": total_score,
            "grade": grade,
            "confidence_level": confidence_level,
            "is_test": is_test_flag,
            "breakdown": {
                "scale_score": norm['scale_score'],
                "engagement_score": norm['engagement_score'],
                "nlp_score": norm['nlp_score'],
                "click_score": norm['click_score'],
                "data_source": seller.get('data_source', 'manual'),
                "nlp_present": norm['nlp_present'],
                "click_present": norm['click_present'],
                "engagement_rate_is_estimated": engagement_is_estimated
            }
        }

    def close(self):
        self.db.close()

if __name__ == "__main__":
    predictor = LococoMLPredictor("lococo_database.db")

    print("\n--- 1. 회귀테스트 픽스처 검증 (셀러 A) ---")
    norm_test = predictor.normalize_metrics(
        followers_count=150000,
        engagement_rate=0.085,
        click_rate=0.042,
        raw_nlp_score=None
    )
    
    test_score = round(
        (norm_test['scale_score'] * 0.20) +
        (norm_test['engagement_score'] * 0.30) +
        (norm_test['nlp_score'] * 0.35) +
        (norm_test['click_score'] * 0.15), 2
    )
    test_grade = predictor.determine_grade(test_score)
    test_conf = predictor.calculate_confidence(data_source='manual', nlp_present=norm_test['nlp_present'])

    print(f"▶ [회귀테스트 셀러 A]")
    print(f"   - 정규화 개별 점수: 스케일 {norm_test['scale_score']}점 | 참여도 {norm_test['engagement_score']}점 | AI판매력 {norm_test['nlp_score']}점 | 클릭전환 {norm_test['click_score']}점")
    print(f"   - 최종 계산 점수: {test_score} 점")
    print(f"   - 최종 산출 등급: {test_grade} 등급")
    print(f"   - 신뢰도 (Confidence): {test_conf}% (Manual 기본 75% - NLP 미연동 패널티 15%)")

    print("\n--- 2. DB 내 Mock 데이터 10명 셀러 전체 계산 및 등급 분포 ---")
    all_sellers = predictor.db.get_all_sellers()
    
    grade_counts = {"S": 0, "A": 0, "B": 0, "C": 0}
    
    for s in all_sellers:
        res = predictor.calculate_match_score(seller_id=s['seller_id'], product_id=1)
        grade_counts[res['grade']] += 1
        print(f"   ➔ 셀러 @{s['instagram_handle']} ({s['name']}): 점수 {res['score']}점 | 등급 {res['grade']} | 신뢰도 {res['confidence_level']}%")

    print(f"\n▶ [전체 Mock 데이터 등급 분포 요약]: S등급 {grade_counts['S']}명, A등급 {grade_counts['A']}명, B등급 {grade_counts['B']}명, C등급 {grade_counts['C']}명")
    
    predictor.close()
