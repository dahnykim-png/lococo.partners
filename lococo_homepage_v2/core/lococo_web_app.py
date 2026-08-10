import streamlit as st

# ----------------- 1. 페이지 설정 (반드시 모든 Streamlit 명령 중 제일 상단 배치) -----------------
st.set_page_config(
    page_title="LOCOCO Studio - AI 셀러 분석 대시보드",
    page_icon="🔮",
    layout="wide"
)

import pandas as pd
import os
import sys
from lococo_db_handler import LococoDBHandler
from lococo_ml_predictor import LococoMLPredictor
from lococo_d1_sync import sync_d1_to_core

# 앱 시작 시 Cloudflare D1 미동기화 셀러 진단 데이터 자동 동기화 실행
try:
    sync_res = sync_d1_to_core()
    if sync_res and sync_res.get("synced_count", 0) > 0:
        print(f"[LOCOCO App Startup] Cloudflare D1에서 {sync_res['synced_count']}건의 셀러 데이터 자동 동기화 완료")
except Exception as sync_err:
    print(f"[LOCOCO App Startup] D1 Auto Sync Warning: {sync_err}")


# ----------------- 2. LOCOCO 대시보드 테마 및 CSS 스타일 -----------------
def apply_lococo_theme():
    st.markdown(
        """
        <style>
        .stApp {
            background-color: #F5F7FA !important;
            color: #333333 !important;
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
        h1, h2, h3, h4 {
            color: #1E3D59 !important;
            font-weight: 700 !important;
        }
        .header-line {
            height: 4px;
            width: 90px;
            background: linear-gradient(90deg, #1E3D59 0%, #17B890 100%);
            border-radius: 2px;
            margin-bottom: 25px;
        }
        .test-badge {
            background-color: #FFF3CD;
            color: #856404;
            border: 1px solid #FFEEBA;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 15px;
        }
        .prod-badge {
            background-color: #D4EDDA;
            color: #155724;
            border: 1px solid #C3E6CB;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 15px;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

apply_lococo_theme()

# ----------------- 3. 데이터베이스 및 ML 예측기 연결 -----------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_FILE = os.path.join(BASE_DIR, "data", "lococo_database.db")

def get_handlers():
    db = LococoDBHandler(DB_FILE)
    predictor = LococoMLPredictor(DB_FILE)
    return db, predictor

db, predictor = get_handlers()

st.title("🔮 LOCOCO Studio: AI 셀러 분석 및 브랜드 매칭 계산기")
st.markdown('<div class="header-line"></div>', unsafe_allow_html=True)

# ----------------- 4. 탭 구성 -----------------
tab1, tab2, tab3 = st.tabs([
    "📋 탭 1: 셀러 리스트 & 등급 뷰", 
    "📊 탭 2: 개별 셀러 상세 분석", 
    "✍️ 탭 3: 신규 셀러 수동 입력 (프로덕션)"
])

# ----------------- [탭 1] 셀러 리스트 & 등급 뷰 -----------------
with tab1:
    st.subheader("📋 전체 셀러 목록 및 Match Score 등급 현황")

    # DB 데이터 조회 및 조인
    db.cursor.execute("""
        SELECT 
            s.seller_id,
            s.name,
            s.instagram_handle,
            s.category,
            s.data_source,
            s.is_test,
            COALESCE(i.followers_count, 0) as followers_count,
            COALESCE(m.match_score, 0.0) as match_score,
            COALESCE(m.grade, 'N/A') as grade,
            COALESCE(m.confidence_level, 0.0) as confidence_level
        FROM Sellers s
        LEFT JOIN (
            SELECT i1.*
            FROM Seller_Insights i1
            JOIN (
                SELECT seller_id, MAX(insight_id) as max_insight_id
                FROM Seller_Insights
                GROUP BY seller_id
            ) i2 ON i1.insight_id = i2.max_insight_id
        ) i ON s.seller_id = i.seller_id
        LEFT JOIN (
            SELECT m1.*
            FROM Matching_Recommendations m1
            JOIN (
                SELECT seller_id, MAX(match_id) as max_match_id
                FROM Matching_Recommendations
                GROUP BY seller_id
            ) m2 ON m1.match_id = m2.max_match_id
        ) m ON s.seller_id = m.seller_id
        ORDER BY s.seller_id DESC
    """)
    rows = [dict(r) for r in db.cursor.fetchall()]
    df_sellers = pd.DataFrame(rows)

    if not df_sellers.empty:
        # 상단 필터 및 배지 영역 (키 값 할당)
        col_f1, col_f2 = st.columns([1, 2])
        with col_f1:
            grade_filter = st.selectbox("등급 필터", ["전체", "S", "A", "B", "C"], key="tab1_grade_filter")
        with col_f2:
            data_type_filter = st.radio("데이터 종류 필터", ["전체 보기", "테스트 데이터만 (is_test = 1)", "프로덕션 실데이터만 (is_test = 0)"], horizontal=True, key="tab1_data_type_filter")

        # 필터링 적용
        df_filtered = df_sellers.copy()
        if grade_filter != "전체":
            df_filtered = df_filtered[df_filtered['grade'] == grade_filter]
        
        if data_type_filter == "테스트 데이터만 (is_test = 1)":
            df_filtered = df_filtered[df_filtered['is_test'] == 1]
        elif data_type_filter == "프로덕션 실데이터만 (is_test = 0)":
            df_filtered = df_filtered[df_filtered['is_test'] == 0]

        # 상단 알림 배지
        has_test_rows = (df_filtered['is_test'] == 1).any() if not df_filtered.empty else False
        if has_test_rows:
            st.markdown('<div class="test-badge">⚠️ 테스트 데이터 포함됨 (is_test = True: 실제 추천/발송에서 자동 제외)</div>', unsafe_allow_html=True)

        # 테이블 표시용 데이터프레임 가공
        df_display = pd.DataFrame({
            "셀러 ID": df_filtered['seller_id'],
            "이름": df_filtered['name'],
            "인스타그램 핸들": df_filtered['instagram_handle'].apply(lambda x: f"@{x}"),
            "카테고리": df_filtered['category'],
            "팔로워 수": df_filtered['followers_count'].apply(lambda x: f"{x:,} 명"),
            "Match Score": df_filtered['match_score'].apply(lambda x: f"{x:.1f} 점"),
            "등급": df_filtered['grade'],
            "Confidence": df_filtered['confidence_level'].apply(lambda x: f"{x:.1f}%"),
            "데이터 소스": df_filtered['data_source'].str.upper(),
            "격리 구분": df_filtered['is_test'].apply(lambda x: "⚠️ 테스트용" if x == 1 else "✅ 실사용(프로덕션)")
        })

        st.dataframe(df_display, width=1200, hide_index=True)
        st.caption(f"총 {len(df_display)}명의 셀러가 조회되었습니다.")
    else:
        st.info("등록된 셀러 데이터가 없습니다.")

# ----------------- [탭 2] 개별 셀러 상세 분석 -----------------
with tab2:
    st.subheader("📊 셀러별 4대 지표 정밀 분석 & Confidence 내역")

    all_sellers = db.get_all_sellers(include_test=True)
    if all_sellers:
        seller_dict_map = {f"@{s['instagram_handle']} ({s['name']}) [{'TEST' if s.get('is_test') else 'PROD'}]": s['seller_id'] for s in all_sellers}
        selected_label = st.selectbox("분석할 셀러 선택 (검색 가능)", list(seller_dict_map.keys()), key="tab2_seller_select")
        selected_sid = seller_dict_map[selected_label]

        # 계산 실행 및 상세 가져오기 (영구 예외 처리 및 st.error 노출)
        try:
            res = predictor.calculate_match_score(seller_id=selected_sid, product_id=1)
            b = res['breakdown']

            # 경고 배지 및 플래그 표시
            if res['is_test']:
                st.markdown('<div class="test-badge">⚠️ 테스트 전용 데이터 셀러입니다 (is_test = True)</div>', unsafe_allow_html=True)
            else:
                st.markdown('<div class="prod-badge">✅ 실사용 프로덕션 셀러입니다 (is_test = False)</div>', unsafe_allow_html=True)

            if b.get('engagement_rate_is_estimated'):
                st.warning("⚠️ 참여율(engagement_rate)은 실측값이 아닌 근사치(평균 릴스 조회수 / 팔로워 비율)입니다.")

            # KPI 카운터
            col_m1, col_m2, col_m3, col_m4 = st.columns(4)
            with col_m1:
                st.metric("🎯 Match Score", f"{res['score']} 점")
            with col_m2:
                st.metric("🏆 등급 (Grade)", f"{res['grade']} 등급")
            with col_m3:
                st.metric("🔒 Confidence Level", f"{res['confidence_level']}%")
            with col_m4:
                st.metric("📁 데이터 출처", b['data_source'].upper())

            st.markdown("---")
            st.markdown("### 📈 4대 정규화 지표 Breakdown (0~100점 척도)")

            # 4개 지표 막대그래프 렌더링
            df_breakdown = pd.DataFrame({
                "지표": ["셀러 스케일 (20%)", "소통 결속도 (30%)", "AI 검증 판매력 (35%)", "유입 전환력 (15%)"],
                "점수": [b['scale_score'], b['engagement_score'], b['nlp_score'], b['click_score']]
            }).set_index("지표")

            st.bar_chart(df_breakdown)

            st.markdown("---")
            st.markdown("### 📋 Confidence Level 산출 패널티 세부 사유")
            
            penalties = []
            base_conf = {'oauth': 90.0, 'manual': 75.0, 'synthetic': 50.0}.get(b['data_source'], 75.0)
            penalties.append(f"• 기본 신뢰도 (data_source = '{b['data_source']}'): **+{base_conf}%**")

            if not b['nlp_present']:
                penalties.append("• LM Studio NLP 미연동 (avg_nlp_score 50점 중립값 대체): **-15%p**")
            if not b['click_present']:
                penalties.append("• click_rate 원본 데이터 미존재 (50점 중립값 대체): **-10%p**")
            if b.get('engagement_rate_is_estimated'):
                penalties.append("• engagement_rate 근사치 대체 (평균 릴스 조회수 기반): **-10%p**")

            for p in penalties:
                st.markdown(p)
            st.info(f"👉 **최종 계산식**: {base_conf}% - 패널티 합계 = **{res['confidence_level']}%**")

        except Exception as e:
            st.error(f"❌ 셀러 ID {selected_sid}에 대한 Match Score 계산 중 오류 발생: {e}")
            import traceback
            st.code(traceback.format_exc())

    else:
        st.info("등록된 셀러가 없습니다.")

# ----------------- [탭 3] 신규 셀러 수동 입력 (프로덕션) -----------------
with tab3:
    st.subheader("✍️ 신규 셀러 실사용 데이터 입력 (프로덕션)")
    st.caption("이 폼으로 입력된 셀러는 **`data_source = 'manual'`, `is_test = False`**로 저장되어 실제 매칭 추천 및 제안서 발송 시스템에 활용됩니다.")

    with st.form("manual_seller_form"):
        col_in1, col_in2 = st.columns(2)
        with col_in1:
            in_name = st.text_input("인플루언서 성명/채널명", placeholder="예: 김로코 (뷰티공구)", key="tab3_in_name")
            in_handle = st.text_input("인스타그램 핸들 (아이디만)", placeholder="예: lococo_beauty", key="tab3_in_handle")
            in_category = st.selectbox("카테고리", ["뷰티", "건기식", "리빙", "패션", "육아", "식품/요리", "기타"], key="tab3_in_category")
        with col_in2:
            in_followers = st.number_input("팔로워 수", min_value=0, value=15000, step=1000, key="tab3_in_followers")
            in_engagement = st.number_input("참여율 (%) (예: 5.5% ➔ 5.5)", min_value=0.0, max_value=100.0, value=5.5, step=0.1, key="tab3_in_engagement")
            in_click_rate = st.number_input("프로필 클릭률 (%) (모르면 0)", min_value=0.0, max_value=100.0, value=0.0, step=0.1, key="tab3_in_click_rate")

        in_comments = st.text_area("피드 댓글 붙여넣기 (선택사항, 줄바꿈으로 구분)", placeholder="가격이 얼마인가요?\n오픈 일정 알려주세요!\n이뻐요!", key="tab3_in_comments")
        
        submit_btn = st.form_submit_button("🚀 프로덕션 셀러 저장 및 즉시 매칭 계산")

    if submit_btn:
        if not in_handle:
            st.error("인스타그램 핸들을 입력해 주세요.")
        else:
            clean_handle = in_handle.replace('@', '').strip()
            
            # 1. Sellers 테이블 저장 (is_test = False)
            sid = db.insert_seller(
                name=in_name if in_name else clean_handle,
                instagram_handle=clean_handle,
                category=in_category,
                data_source='manual',
                is_test=False # 프로덕션 실사용 데이터
            )

            # 2. Seller_Insights 저장 (engagement_rate_is_estimated = False)
            eng_val = in_engagement / 100.0
            click_val = (in_click_rate / 100.0) if in_click_rate > 0 else None

            db.insert_seller_insight(
                seller_id=sid,
                followers_count=in_followers,
                reach=int(in_followers * 0.3),
                engagement_rate=eng_val,
                click_rate=click_val,
                engagement_rate_is_estimated=False
            )

            # 3. 댓글 원본 저장 및 실시간 NLP 분석 (있을 경우)
            comment_lines = [c.strip() for c in in_comments.split('\n') if c.strip()]
            if comment_lines:
                post_id = db.insert_post(
                    seller_id=sid,
                    caption="수동 입력 피드 샘플",
                    comment_text="\n".join(comment_lines),
                    likes_count=int(in_followers * eng_val)
                )

                # 3-1. LM Studio 실시간 댓글 구매의도 분석 수행
                try:
                    from lococo_ai_pipeline import analyze_comment_purchase_intent
                    nlp_res = analyze_comment_purchase_intent(in_comments)
                    if nlp_res.get("label") != "파싱실패":
                        score_val = float(nlp_res.get("score", 50.0))
                        norm_score_for_db = score_val / 100.0 if score_val > 1.0 else score_val
                        db.insert_nlp_analysis(
                            post_id=post_id,
                            nlp_conversion_score=norm_score_for_db,
                            sentiment_label=nlp_res.get("label", "기타")
                        )
                except Exception as e:
                    st.warning(f"⚠️ LM Studio 분석 연결 에러 (50점 폴백유지): {e}")

            # 4. 즉시 Match Score 계산
            res_new = predictor.calculate_match_score(seller_id=sid, product_id=1)


            st.success(f"✅ 셀러 @{clean_handle}님이 **프로덕션 데이터(is_test = False)**로 성공적으로 저장 및 계산되었습니다!")

            # 결과 렌더링
            res_c1, res_c2, res_c3 = st.columns(3)
            with res_c1:
                st.metric("🎯 Match Score", f"{res_new['score']} 점")
            with res_c2:
                st.metric("🏆 등급", f"{res_new['grade']} 등급")
            with res_c3:
                st.metric("🔒 Confidence Level", f"{res_new['confidence_level']}%")

            st.json(res_new['breakdown'])
